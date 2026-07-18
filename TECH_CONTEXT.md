# TECH_[CONTEXT.md](http://CONTEXT.md)

# Kairo Studio

### AI-Native Research Operating System

Version: 1.0

---

# Overview

Kairo Studio is not a chatbot.

It is an AI-native Research Operating System designed to help researchers discover, understand, synthesize, organize, and write scientific knowledge through multiple specialized AI agents.

Instead of relying on a traditional Retrieval-Augmented Generation (RAG) pipeline, Kairo Studio combines semantic retrieval, document understanding, structured knowledge extraction, and agentic reasoning into one unified research workflow.

---

# Core Philosophy

Traditional AI Research Tools

```

User

↓

Question

↓

Vector Search

↓

LLM

↓

Answer

```

Kairo Studio

```

Research Goal

↓

Planning

↓

Multi-source Retrieval

↓

Reading

↓

Knowledge Extraction

↓

Knowledge Graph

↓

Reasoning

↓

Writing

```

The system reasons over structured scientific knowledge instead of merely retrieving text chunks.

---

# High-Level Architecture

```

                    Frontend

                        │

                        ▼

                 API Gateway

                        │

──────────────────────────────────────

               Research Planner

                        │

──────────────────────────────────────

      Search Layer

      • OpenAlex

      • Semantic Scholar

      • Crossref

      • arXiv

      • PubMed

      • Springer

      • IEEE

──────────────────────────────────────

       Processing Layer

PDF Parser

Metadata Cleaner

Duplicate Detector

Reference Parser

Citation Extractor

Figure Extractor

Table Extractor

──────────────────────────────────────

      Knowledge Layer

PostgreSQL

Vector Database

Knowledge Graph

Citation Graph

Author Graph

──────────────────────────────────────

       AI Agent Layer

Planner Agent

Search Agent

Reader Agent

Literature Review Agent

Writer Agent

Citation Agent

Research Gap Agent

──────────────────────────────────────

Workspace Layer

Projects

References

Drafts

Notes

Collections

```

---

# Technology Stack

## Frontend

Next.js

TypeScript

TailwindCSS

shadcn/ui

TanStack Query

React Hook Form

Framer Motion

---

## Backend

FastAPI

Python 3.12

Pydantic

SQLAlchemy

Alembic

---

## Database

PostgreSQL (Neon)

Stores

Users

Projects

References

Metadata

Notes

Workspace

---

## Cache

Redis

Stores

Agent State

Search Cache

Session Cache

Rate Limits

---

## Object Storage

Supabase Storage

or

AWS S3

Stores

PDF

Figures

Supplementary Files

Generated Reports

---

## Queue

Celery

Redis Broker

Handles

PDF Parsing

Embedding

Knowledge Extraction

Agent Jobs

Large Literature Reviews

---

## Search APIs

OpenAlex

Semantic Scholar

Crossref

arXiv

PubMed

Springer

IEEE Xplore

Scopus (optional)

---

# AI Architecture

Unlike standard AI assistants, Kairo Studio consists of multiple specialized agents.

Each agent performs a single responsibility.

---

## Planner Agent

Role

Transforms user goals into executable research plans.

Example

User

```

I want to review recent multimodal fusion methods for medical imaging.

```

Planner Output

```

Intent

Literature Review

Research Area

Medical Imaging

Topics

Multimodal Fusion

Vision Transformers

Cross-modal Learning

Years

2022-2026

Sources

OpenAlex

PubMed

IEEE

Expected Output

Survey Paper

```

Planner never generates the final answer.

It only decomposes tasks.

---

## Search Agent

Responsible for scientific retrieval.

Responsibilities

Generate search queries

Query multiple providers

Merge results

Remove duplicates

Normalize metadata

Rank papers

Output

```

Ranked Paper List

```

---

## Ranking Engine

Ranking does not rely only on keyword similarity.

Final Score

```

0.35 Semantic Similarity

0.20 Citation Impact

0.20 Venue Quality

0.15 BM25

0.10 Publication Recency

```

Additional boosts

Open Access

Highly Influential Citation

Survey Papers

Benchmark Papers

---

## Reader Agent

The Reader Agent understands papers.

Pipeline

```

PDF

↓

OCR (optional)

↓

Layout Detection

↓

Section Segmentation

↓

Abstract

↓

Introduction

↓

Methods

↓

Experiments

↓

Conclusion

↓

References

```

Instead of embedding entire PDFs, each logical section becomes an independent knowledge object.

---

## Knowledge Extraction Agent

Converts unstructured papers into structured knowledge.

Extracts

Problem

Method

Dataset

Metrics

Results

Limitations

Contributions

Future Work

Tasks

Domain

Authors

Institutions

Funding

---

Example

```

Paper

↓

Method

CLIP

↓

Dataset

ImageNet

↓

Metric

Top-1 Accuracy

↓

Score

84.7%

```

---

## Embedding Pipeline

Embedding Model

Preferred

Jina Embeddings v4

Alternative

BAAI BGE-M3

Embedding Granularity

Abstract

Section

Paragraph

Figure Caption

Table Caption

Reference Context

---

# Knowledge Graph

This is one of Kairo Studio's core innovations.

Instead of storing only embeddings, scientific entities become connected.

Example

```

YOLOv11

improves

YOLOv10

↓

evaluated on

COCO

↓

outperforms

RT-DETR

```

Nodes

Paper

Author

Institution

Dataset

Method

Task

Metric

Conference

Journal

Concept

Edges

improves

extends

uses

evaluates

compares

proposed_by

published_at

cites

similar_to

---

# Citation Graph

Every paper automatically becomes part of a citation network.

Example

```

Paper A

↓

cites

Paper B

↓

extends

Paper C

```

Useful for

Research Trends

Citation Recommendation

Influential Paper Detection

Research Gap Analysis

---

# AI Workflow

Example

```

User Goal

↓

Planner Agent

↓

Search Agent

↓

Ranking

↓

Reader Agent

↓

Knowledge Extraction

↓

Knowledge Graph

↓

Reasoning Agent

↓

Writer Agent

↓

Literature Review

```

No single LLM performs every task.

---

# Literature Review Pipeline

```

Goal

↓

Paper Search

↓

Metadata Validation

↓

PDF Parsing

↓

Knowledge Extraction

↓

Topic Clustering

↓

Method Comparison

↓

Dataset Comparison

↓

Research Trend Analysis

↓

Research Gap Detection

↓

Outline Generation

↓

Section Writing

↓

Citation Formatting

```

---

# Writer Agent

Generates academic writing.

Capabilities

Survey Papers

Related Work

Method Comparison

Discussion

Conclusion

Future Work

All generated paragraphs include citation grounding.

---

# Citation Agent

Responsible for

APA

IEEE

MLA

Chicago

BibTeX

RIS

Crossref Validation

Duplicate Detection

Missing DOI Detection

---

# Research Gap Agent

Instead of hallucinating research gaps, the agent compares

Topics

Methods

Datasets

Benchmarks

Publication Timeline

Citation Clusters

Output

```

Current Trend

Transformer-based multimodal fusion.

↓

Observed Gap

Very few papers evaluate robustness against domain shift.

↓

Potential Research Direction

Domain-adaptive multimodal fusion.

```

---

# Vector Database

Preferred

Qdrant

Collections

Paper Sections

Abstracts

Figures

Tables

References

Notes

Workspace

---

# LLM Layer

The LLM is used as a reasoning engine.

It never acts as long-term storage.

Supported Models

GPT-5

Claude

Gemini

Future

Local Models

---

# Background Workers

Long-running tasks

PDF Parsing

Embedding

Knowledge Graph Updates

Citation Graph Updates

Large Literature Reviews

Scheduled Index Refresh

---

# Security

JWT Authentication

Row-Level Security

Signed URLs

Encrypted API Keys

Rate Limiting

Audit Logs

---

# Future Vision

Kairo Studio will evolve from a literature review assistant into a complete AI Research Operating System.

Future capabilities include

Scientific Knowledge Graph

Research Timeline Prediction

Automatic Benchmark Extraction

Experiment Reproduction Assistant

Dataset Recommendation

Reviewer Simulation

Grant Proposal Generator

Research Collaboration Graph

Personal Research Memory

Autonomous Research Agents