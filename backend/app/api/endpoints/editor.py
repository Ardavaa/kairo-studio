from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.core.llm import llm_client
import re

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

def apply_patches(source: str, patch_text: str) -> str:
    pattern = re.compile(r'<<<< SEARCH\s*\n(.*?)\n\s*====\s*\n(.*?)\n\s*>>>> REPLACE', re.DOTALL)
    new_source = source
    
    matches = pattern.findall(patch_text)
    if not matches:
        if "<<<< SEARCH" in patch_text:
            # LLM tried to use blocks but formatting was completely broken
            # Let's try a very lenient extraction that makes `====` optional
            lenient_pattern = re.compile(r'<<<< SEARCH\s*\n(.*?)\n\s*(?:====\s*\n)?(.*?)\n\s*>>>> REPLACE', re.DOTALL)
            matches = lenient_pattern.findall(patch_text)
            if not matches:
                # Still broken, return original code rather than leaking tokens
                return source
        else:
            # Fallback: The LLM might have ignored the block format and just output the full file.
            return patch_text
        
    for search_text, replace_text in matches:
        if search_text in new_source:
            new_source = new_source.replace(search_text, replace_text)
        else:
            # Fallback: use robust fuzzy matcher that ignores all whitespace/newline differences
            new_source = robust_replace(new_source, search_text, replace_text)
            
    return new_source

@router.post("/vibe", response_model=VibeResponse)
async def vibe_coding(request: VibeRequest):
    prompt = f"""You are an expert Typst coding assistant.
The user has provided an instruction to modify their document.
You must output ONLY Search/Replace blocks to implement the instruction.
Use this format exactly:

<<<< SEARCH
Exact lines from the original file to replace
====
The new lines to insert
>>>> REPLACE

CRITICAL RULES:
1. The SEARCH block MUST be an EXACT, literal substring of the original file.
2. Include enough context (a few surrounding lines) so the SEARCH block is unique in the file.
3. Preserve all original indentation and whitespace in the SEARCH block.
4. You may output multiple blocks for multiple changes. DO NOT output any other text or markdown wrappers.

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
            temperature=0.1
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
