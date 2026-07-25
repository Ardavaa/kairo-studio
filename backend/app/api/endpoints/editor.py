from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.core.llm import llm_client
import re
import difflib

router = APIRouter()

class VibeRequest(BaseModel):
    current_code: str
    instruction: str
    model: str = "deepseek-v4-flash"

class VibeResponse(BaseModel):
    proposed_code: str

def robust_replace(source: str, search: str, replace: str) -> str:
    # Normalize whitespace for finding
    def normalize(text):
        return re.sub(r'\s+', ' ', text).strip()
    
    norm_search = normalize(search)
    if not norm_search: return source

    words = norm_search.split()
    escaped_words = [re.escape(w) for w in words]
    pattern_str = r'\s*'.join(escaped_words)
    
    try:
        match = re.search(pattern_str, source)
        if match:
            start, end = match.span()
            return source[:start] + replace + source[end:]
    except Exception:
        pass
    return source

def anchor_replace(source: str, search: str, replace: str) -> str:
    """Tier 3: Match using start and end anchor lines of SEARCH block."""
    # Remove lines that look like LLM truncation / skip markers
    clean_lines = [
        l for l in search.splitlines() 
        if l.strip() and not re.search(r'^\s*(//|#|<!--)?\s*(\.{3,}|…|\[?rest of|\[?skipped|\[?more)', l, re.I)
    ]
    if len(clean_lines) < 2:
        return source
    
    norm_source = source.replace('\r\n', '\n')
    
    # Try 3-line anchors first, fall back to 2-line, fall back to 1-line
    for n in [3, 2, 1]:
        if len(clean_lines) >= n * 2:
            start_anchor = "\n".join(clean_lines[:n]).replace('\r\n', '\n')
            end_anchor = "\n".join(clean_lines[-n:]).replace('\r\n', '\n')
            
            start_idx = norm_source.find(start_anchor)
            if start_idx != -1:
                end_idx = norm_source.find(end_anchor, start_idx + len(start_anchor))
                if end_idx != -1:
                    full_end_idx = end_idx + len(end_anchor)
                    return norm_source[:start_idx] + replace + norm_source[full_end_idx:]
                    
    return source

def fuzzy_replace(source: str, search: str, replace: str) -> str:
    """Tier 4: Fuzzy sequence matching using difflib for slightly altered blocks."""
    norm_source = source.replace('\r\n', '\n')
    norm_search = search.replace('\r\n', '\n').strip()
    
    # Remove skip markers from search for fairer ratio matching
    clean_search_lines = [
        l for l in norm_search.splitlines() 
        if not re.search(r'^\s*(//|#|<!--)?\s*(\.{3,}|…|\[?rest of|\[?skipped|\[?more)', l, re.I)
    ]
    clean_search = "\n".join(clean_search_lines).strip()
    if not clean_search:
        return source
    
    source_lines = norm_source.splitlines(keepends=True)
    search_lines = clean_search.splitlines(keepends=True)
    
    if not source_lines or not search_lines:
        return source
        
    window_size = len(search_lines)
    best_ratio = 0.0
    best_start = -1
    best_end = -1
    
    # Search with a slight variance in window size (-2 to +2 lines)
    for w_delta in range(-2, 3):
        w_len = window_size + w_delta
        if w_len <= 0 or w_len > len(source_lines):
            continue
        for i in range(len(source_lines) - w_len + 1):
            window_text = "".join(source_lines[i:i+w_len]).strip()
            ratio = difflib.SequenceMatcher(None, window_text, clean_search).ratio()
            if ratio > best_ratio:
                best_ratio = ratio
                best_start = i
                best_end = i + w_len
                
    if best_ratio >= 0.82 and best_start != -1:
        before = "".join(source_lines[:best_start])
        after = "".join(source_lines[best_end:])
        return before + replace + ("\n" if not replace.endswith("\n") and after else "") + after
        
    return source

def apply_patches(source: str, patch_text: str) -> str:
    if not patch_text or not patch_text.strip():
        return source

    pattern = re.compile(r'<<<< SEARCH\s*\n(.*?)\n\s*====\s*\n(.*?)\n\s*>>>> REPLACE', re.DOTALL)
    new_source = source
    
    matches = pattern.findall(patch_text)
    if not matches:
        if "<<<< SEARCH" in patch_text:
            # LLM tried to use blocks but formatting was completely broken
            lenient_pattern = re.compile(r'<<<< SEARCH\s*\n(.*?)\n\s*(?:====\s*\n)?(.*?)\n\s*>>>> REPLACE', re.DOTALL)
            matches = lenient_pattern.findall(patch_text)
            if not matches:
                return source
        else:
            # Fallback: The LLM outputted the full file directly (Option 2: Full Document Rewrite).
            cleaned = patch_text.strip()
            if not cleaned or (len(cleaned) < 15 and len(source) > 50):
                return source
            return cleaned
        
    for search_text, replace_text in matches:
        if not search_text.strip():
            continue
        
        # Tier 1: Exact substring match
        if search_text in new_source:
            new_source = new_source.replace(search_text, replace_text, 1)
            continue
            
        # Tier 2: Normalized line endings & trailing whitespace match
        norm_source = new_source.replace('\r\n', '\n')
        norm_search = search_text.replace('\r\n', '\n')
        if norm_search in norm_source:
            new_source = norm_source.replace(norm_search, replace_text, 1)
            continue
            
        # Tier 3: Start/End Anchor "Breadcrumb" match
        anchor_res = anchor_replace(new_source, search_text, replace_text)
        if anchor_res != new_source:
            new_source = anchor_res
            continue
            
        # Tier 4: Fuzzy sequence match
        fuzzy_res = fuzzy_replace(new_source, search_text, replace_text)
        if fuzzy_res != new_source:
            new_source = fuzzy_res
            continue
            
        # Tier 5: Word-based regex fallback
        new_source = robust_replace(new_source, search_text, replace_text)
            
    return new_source

@router.post("/vibe", response_model=VibeResponse)
async def vibe_coding(request: VibeRequest):
    prompt = f"""You are an expert Typst coding assistant.
The user has provided an instruction to modify their document.

You have two ways to respond depending on the instruction:

OPTION 1 - TARGETED EDITS (Preferred for most tasks):
If the instruction applies to specific parts of the document (e.g. changing a section, translating a chapter, editing a title, fixing a table, adding a paragraph), output ONLY Search/Replace blocks:
<<<< SEARCH
Exact lines from the original file to replace
====
The new lines to insert
>>>> REPLACE

OPTION 2 - FULL DOCUMENT REWRITE (Only for global tasks):
If and ONLY if the instruction asks to transform, rewrite, or translate the ENTIRE document from beginning to end (e.g. "translate everything to English", "rewrite the whole document", "format the entire code"), DO NOT use Search/Replace blocks. Instead, output the complete, valid Typst code for the entire rewritten document directly enclosed in ```typst ... ``` code blocks.

CRITICAL RULES FOR SEARCH/REPLACE BLOCKS:
1. The SEARCH block MUST be an EXACT, literal substring of the original file.
2. Include enough context (a few surrounding lines) so the SEARCH block is unique in the file.
3. Preserve all original indentation and whitespace in the SEARCH block.
4. Never use placeholders like "// rest of code" in SEARCH blocks. If you are modifying a large section (like a chapter), break it down into multiple smaller, precise SEARCH/REPLACE blocks (e.g. paragraph by paragraph or subsection by subsection) rather than one giant block.
5. You may output multiple blocks for multiple changes. DO NOT output any other text or markdown wrappers.

INSTRUCTION:
{request.instruction}

CURRENT FILE CONTENT:
{request.current_code}"""

    try:
        response = await llm_client.chat.completions.create(
            model=request.model,
            messages=[
                {"role": "system", "content": "You are a code patching engine."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.1,
            max_tokens=8192
        )
        patch_text = response.choices[0].message.content.strip()
        
        # Strip markdown code blocks if the LLM outputted them
        if patch_text.startswith("```"):
            patch_text = re.sub(r'^```[a-zA-Z]*\n', '', patch_text)
            patch_text = re.sub(r'\n```$', '', patch_text)
            patch_text = patch_text.strip()
        
        # Apply the patches to the current code
        proposed_code = apply_patches(request.current_code, patch_text)
        
        # If the patching failed (e.g., search text not found), we fallback to original or let user know
        # But for now, we just return the best effort.
        return VibeResponse(proposed_code=proposed_code)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
