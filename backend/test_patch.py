import re

def apply_patches(source: str, patch_text: str) -> str:
    pattern = re.compile(r'<<<< SEARCH\s*\n(.*?)\n\s*====\s*\n(.*?)\n\s*>>>> REPLACE', re.DOTALL)
    new_source = source
    
    matches = pattern.findall(patch_text)
    print("Matches found:", len(matches))
    if not matches:
        return source # no patches found
        
    for search_text, replace_text in matches:
        print("SEARCH TEXT:", repr(search_text))
        if search_text in new_source:
            print("EXACT MATCH SUCCESS")
            new_source = new_source.replace(search_text, replace_text)
        else:
            # Fallback: try stripping trailing/leading whitespaces on both sides
            search_text_stripped = search_text.strip()
            print("FALLBACK ATTEMPT. STRIPPED:", repr(search_text_stripped))
            if search_text_stripped and search_text_stripped in new_source:
                print("FALLBACK MATCH SUCCESS")
                new_source = new_source.replace(search_text_stripped, replace_text.strip())
            else:
                print("FALLBACK MATCH FAILED")
                
    return new_source

source = """
= Introduction
#lorem(120)
By leveraging advanced ALGORITHM we can conclude that the @netwok2020
"""

patch = """
<<<< SEARCH
= Introduction
#lorem(120)
By leveraging advanced ALGORITHM we can conclude that the @netwok2020
====
= Introduction
Attention mechanisms allow transformers to weigh importance of different words.
>>>> REPLACE
"""

print(apply_patches(source, patch))
