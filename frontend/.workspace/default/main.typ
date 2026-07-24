#import "@preview/charged-ieee:0.1.4": ieee

#show: ieee.with(
  title: [Public Complaint Classification for Government Agency Identification Using Visual and Textual Representations Based on a Multimodal Transformer],
  abstract: [
    The surge in the volume of public complaint reports on e-government platforms such as CRM (Cepat Respons Masyarakat) and JAKI has created significant challenges, as the process of routing reports to the appropriate government agencies is still performed manually. Single-modality classification approaches that rely solely on textual report descriptions possess inherent limitations due to the nature of public complaint texts, which are typically short, informal, and often contain slang and typographical errors. Consequently, visual information from supporting images becomes a crucial complement.
  ]
)

This study proposes a multimodal classification system that integrates Transformer-based textual embedding representations and Vision Transformer (ViT)-based visual representations to automatically identify the target government agency. Three fusion strategies are experimentally compared, namely early fusion, intermediate fusion, and late fusion, with CatBoost employed as the downstream classifier, using a CRM dataset consisting of 81,676 reports categorized into 12 government agency classes.

The evaluation uses Macro F1-score as the primary metric to accommodate the class imbalance within the dataset, aiming to determine the most optimal fusion strategy and to measure the contribution of the multimodal approach compared to unimodal approaches in the context of public complaint report classification.