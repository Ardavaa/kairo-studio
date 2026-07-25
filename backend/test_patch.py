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

if __name__ == "__main__":
    test_targeted_edit()
    test_empty_search_guard()
    test_full_document_rewrite()
    test_garbage_short_fallback()
    print("\nALL TESTS PASSED SUCCESSFULLY!")
