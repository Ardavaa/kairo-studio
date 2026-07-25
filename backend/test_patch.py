import sys
import os

# Add current directory to path so we can import app
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.api.endpoints.editor import apply_patches

def test_targeted_edit():
    source = """= Abstrak
Penelitian ini mengusulkan arsitektur baru untuk analisis teks.
= Pendahuluan
Rekrutmen berbasis AI telah menjadi standar baru."""
    
    patch = """<<<< SEARCH
= Abstrak
Penelitian ini mengusulkan arsitektur baru untuk analisis teks.
====
= Abstrak
Penelitian ini mengusulkan arsitektur Late Fusion yang lebih akurat.
>>>> REPLACE"""
    
    res = apply_patches(source, patch)
    assert "Late Fusion yang lebih akurat" in res
    assert "= Pendahuluan" in res
    print("test_targeted_edit PASSED")

def test_empty_search_guard():
    source = "= Abstrak\nIsi dokumen penting."
    patch = """<<<< SEARCH
====
Teks baru yang rusak
>>>> REPLACE"""
    
    res = apply_patches(source, patch)
    assert res == source, f"Expected unchanged source, got: {res}"
    print("test_empty_search_guard PASSED")

def test_full_document_rewrite():
    source = """= Abstrak
Penelitian ini mengusulkan arsitektur baru untuk analisis teks.
= Pendahuluan
Rekrutmen berbasis AI telah menjadi standar baru."""
    
    # LLM outputs Option 2: Full translation without SEARCH/REPLACE blocks
    patch = """= Abstract
This study proposes a new architecture for text analysis.
= Introduction
AI-based recruitment has become the new standard."""
    
    res = apply_patches(source, patch)
    assert "= Abstract" in res
    assert "AI-based recruitment" in res
    print("test_full_document_rewrite PASSED")

def test_garbage_short_fallback():
    source = """= Abstrak
Penelitian ini mengusulkan arsitektur baru untuk analisis teks yang sangat panjang sekali dan memiliki banyak kalimat di dalamnya agar lolos batas pengecekan fifty characters."""
    
    # LLM outputs empty or very short conversational error
    patch = "Error"
    
    res = apply_patches(source, patch)
    assert res == source, "Expected fallback to original source on short garbage input"
    print("test_garbage_short_fallback PASSED")

def test_anchor_replace_with_skipped_middle_lines():
    source = """== Bab 3
Baris pertama bab 3 yang sangat penting.
Baris kedua berisi penjelasan metodologi riset.
Baris ketiga berisi dataset dan pengumpulan data.
Baris keempat membahas analisis statistik.
Baris kelima adalah kesimpulan sementara bab 3.
Baris keenam penutup subbab."""
    
    # LLM skipped middle lines with "// ... skipped ..."
    patch = """<<<< SEARCH
== Bab 3
Baris pertama bab 3 yang sangat penting.
Baris kedua berisi penjelasan metodologi riset.
// ... skipped ...
Baris kelima adalah kesimpulan sementara bab 3.
Baris keenam penutup subbab.
====
== Chapter 3
First line of chapter 3 translated to English.
Second line containing research methodology.
Third line on dataset and data collection.
Fourth line on statistical analysis.
Fifth line temporary conclusion of chapter 3.
Sixth line closing subsection.
>>>> REPLACE"""
    
    res = apply_patches(source, patch)
    assert "== Chapter 3" in res
    assert "First line of chapter 3 translated to English" in res
    assert "Sixth line closing subsection." in res
    print("test_anchor_replace_with_skipped_middle_lines PASSED")

def test_fuzzy_replace_with_minor_typo_or_whitespace():
    source = """= Pendahuluan
Dalam era digitalisasi saat ini, penerapan teknologi artificial intelligence telah merambah ke berbagai sektor kehidupan termasuk rekrutmen sumber daya manusia secara otomatis dan skalabel."""
    
    # LLM has minor word difference / line break drift in SEARCH block
    patch = """<<<< SEARCH
= Pendahuluan
Dalam era digitalisasi saat ini penerapan teknologi artificial intelligence telah merambah ke berbagai sektor kehidupan termasuk rekrutmen sumber daya manusia.
====
= Introduction
In the current era of digitalization, the application of artificial intelligence technology has penetrated various sectors of life including automated human resource recruitment.
>>>> REPLACE"""
    
    res = apply_patches(source, patch)
    assert "= Introduction" in res
    assert "automated human resource recruitment" in res
    print("test_fuzzy_replace_with_minor_typo_or_whitespace PASSED")

def test_line_ending_normalization():
    source = "= Abstract\r\nThis is a test document with Windows line endings.\r\nIt has multiple lines.\r\n"
    patch = "<<<< SEARCH\n= Abstract\nThis is a test document with Windows line endings.\n====\n= Abstract\nThis is an upgraded document with Unix line endings.\n>>>> REPLACE"
    
    res = apply_patches(source, patch)
    assert "upgraded document with Unix line endings" in res
    print("test_line_ending_normalization PASSED")

if __name__ == "__main__":
    test_targeted_edit()
    test_empty_search_guard()
    test_full_document_rewrite()
    test_garbage_short_fallback()
    test_anchor_replace_with_skipped_middle_lines()
    test_fuzzy_replace_with_minor_typo_or_whitespace()
    test_line_ending_normalization()
    print("\nALL TESTS PASSED SUCCESSFULLY!")

