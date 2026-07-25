import re

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

source = """
= Introduction
#lorem(120)
By leveraging advanced ALGORITHM we can conclude that the @netwok2020 

#image("image.jfif")
"""

search = """
= Introduction
#lorem(120)
By leveraging advanced ALGORITHM we can conclude that the @netwok2020
"""

replace = """
= Introduction
Attention mechanisms...
"""

print(robust_replace(source, search, replace))
