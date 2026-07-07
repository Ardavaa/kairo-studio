# PROJECT_[CONTEXT.md](http://CONTEXT.md)

# Kairo Studio

&gt; **AI-native Research Workspace**

&gt;

&gt; Go from research idea → literature review → publication in one intelligent workspace.

---

# Vision

Kairo Studio is an AI-native research environment that helps researchers, students, engineers, and scientists perform the entire research workflow without switching between multiple tools.

Instead of using separate platforms for searching papers, reading PDFs, writing literature reviews, managing citations, and drafting manuscripts, Kairo Studio combines everything into one collaborative AI workspace.

The long-term vision is to become the **Cursor for Research**, enabling humans and AI agents to collaborate throughout the entire research lifecycle.

---

# Problem

Today's research workflow is fragmented.

A typical researcher needs to use:

- Google Scholar
- arXiv
- Semantic Scholar
- Zotero / Mendeley
- ChatGPT / Claude
- Overleaf
- Notion
- Obsidian
- GitHub

Information becomes scattered.

Context is constantly lost.

Researchers spend more time organizing information than generating knowledge.

---

# Solution

Kairo Studio centralizes the research workflow into one AI-powered workspace.

Users can:

- discover papers
- organize research projects
- understand papers using AI
- chat with individual or multiple papers
- generate literature reviews
- identify research gaps
- create citations automatically
- draft academic papers
- export to LaTeX, Word, or Markdown

Instead of AI replacing researchers, Kairo Studio acts as an intelligent research collaborator.

---

# Product Philosophy

AI should augment researchers—not replace them.

Every generated statement should be:

- traceable
- evidence-backed
- explainable
- editable

Human remains the author.

AI accelerates the process.

---

# Target Users

Primary

- AI Researchers
- Computer Science Students
- Master's Students
- PhD Candidates
- Research Engineers

Secondary

- Medical Researchers
- Social Science Researchers
- Professors
- R&amp;D Teams
- Startup Research Teams

---

# Core Workflow

Research Idea

↓

Literature Search

↓

Paper Collection

↓

Reading &amp; Annotation

↓

Knowledge Organization

↓

Literature Review

↓

Research Gap Analysis

↓

Paper Draft

↓

Revision

↓

Export

---

# MVP

## 1. Research Workspace

Users create multiple research projects.

Example:

- Multi-Agent Systems
- OCR Research
- Climate Prediction
- Healthcare AI

Each workspace stores:

- papers
- notes
- citations
- conversations
- drafts

---

## 2. AI Paper Search

Search papers using natural language.

Example:

&gt; Recent multimodal reasoning papers using reinforcement learning.

Supported sources:

- arXiv
- Semantic Scholar
- OpenAlex
- Crossref

Future:

- PubMed
- IEEE
- ACL Anthology

Search results include:

- title
- authors
- abstract
- venue
- publication year
- citations
- code availability
- relevance score

---

## 3. Paper Library

Users can save papers into collections.

Collections may be:

- Related Work
- Must Read
- Baseline Papers
- Survey Papers
- Experiments

Every paper includes

- metadata
- PDF
- extracted text
- embeddings
- notes
- AI summary

---

## 4. AI Reading

Every paper becomes interactive.

Features:

- summarize section
- explain equations
- simplify paragraphs
- explain methodology
- identify limitations
- explain contributions
- compare with another paper

Instead of reading PDFs passively, users interact with them conversationally.

---

## 5. Chat with Paper

Example:

"What dataset was used?"

"What is the novelty?"

"Explain Equation 7."

"What assumptions does this paper make?"

Answers always include evidence references.

---

## 6. Multi-Paper Chat

Instead of one paper:

Users can ask across dozens of papers.

Example

"What are the common datasets?"

"Which model performs best?"

"What methods use reinforcement learning?"

"What are the research gaps?"

The AI synthesizes information across multiple papers.

---

## 7. Literature Review Generator

One-click literature review generation.

Input:

Selected papers

Output:

Introduction

Research Landscape

Existing Methods

Datasets

Benchmarks

Limitations

Research Trends

Research Gaps

Future Directions

Every paragraph contains supporting citations.

---

## 8. Research Gap Finder

Analyze all selected papers.

Produce:

- unexplored problems
- inconsistent findings
- missing datasets
- evaluation weaknesses
- future opportunities

Each gap includes

difficulty

novelty

confidence

supporting papers

---

## 9. AI Paper Writer

Generate academic writing.

Supported sections:

- Title
- Abstract
- Introduction
- Related Work
- Methodology
- Experiment Design
- Results
- Discussion
- Conclusion

AI writes using cited evidence.

No unsupported claims.

---

## 10. Citation Manager

Automatic citation generation.

Support:

APA

IEEE

ACM

Nature

BibTeX

RIS

Automatic inline citations.

---

## 11. Research Notes

Markdown editor.

Supports

- equations
- Mermaid
- images
- tables
- references
- citations

Every note can reference papers.

---

## 12. Export

Export workspace into

- PDF
- DOCX
- Markdown
- LaTeX
- Overleaf
- BibTeX

---

# AI Agent Architecture

Rather than one monolithic AI, Kairo Studio consists of specialized agents.

## Planner Agent

Responsible for:

- understanding user goals
- planning workflows
- deciding which agents to invoke

---

## Search Agent

Responsible for:

- retrieving relevant papers
- ranking relevance
- searching multiple databases

---

## Retrieval Agent

Responsible for:

- fetching PDFs
- extracting metadata
- parsing references
- indexing documents

---

## Reading Agent

Responsible for:

- summarization
- explanation
- Q&amp;A
- extracting claims

---

## Evidence Agent

Responsible for:

- finding supporting passages
- citation grounding
- verifying evidence

---

## Literature Review Agent

Responsible for:

- synthesizing findings
- grouping papers
- identifying trends
- generating review text

---

## Gap Analysis Agent

Responsible for:

- identifying limitations
- suggesting opportunities
- finding underexplored topics

---

## Writing Agent

Responsible for:

- drafting sections
- improving writing
- maintaining academic tone
- integrating citations

---

## Reviewer Agent

Responsible for:

- critique
- logical consistency
- citation completeness
- novelty assessment

---

## Citation Agent

Responsible for

- bibliography
- formatting
- deduplication

---

# Design Principles

## Evidence First

Every generated statement should be traceable.

No hallucinated citations.

---

## Human in Control

Users approve every major generation.

Nothing is hidden.

---

## Project-Based

Everything belongs inside projects.

Context persists across sessions.

---

## AI-Native

The interface is designed around AI collaboration—not traditional document editing.

---

## Research-Centric

Every feature exists because it improves research quality.

Not because it is technically impressive.

---

# Future Features

## Knowledge Graph

Visualize relationships between

- papers
- authors
- concepts
- datasets
- methods

---

## Experiment Planner

Generate experiment designs.

Suggest

- baselines
- evaluation metrics
- datasets
- ablation studies

---

## Research Timeline

Track

- milestones
- experiments
- paper versions
- submission deadlines

---

## Team Collaboration

Shared workspaces.

Comments.

AI meeting summaries.

Version history.

---

## Reviewer Simulation

Simulate

ICML Reviewer

NeurIPS Reviewer

CVPR Reviewer

ACL Reviewer

Provide likely reviewer comments.

---

## Conference Assistant

Help users prepare submissions.

Includes

- formatting
- page limits
- checklist validation
- anonymization

---

## Auto Survey Builder

Generate survey papers from hundreds of references.

---

## Personal Research Memory

AI remembers

- projects
- writing style
- favorite conferences
- research interests
- previous conversations

---

# Suggested Technology Stack

Frontend

- Next.js
- React
- Tailwind CSS
- shadcn/ui
- Framer Motion

Backend

- FastAPI
- Python
- PostgreSQL
- Redis

AI

- OpenAI Responses API
- Anthropic Claude
- Gemini
- LiteLLM

Retrieval

- Qdrant
- pgvector
- Voyage AI embeddings (or OpenAI embeddings)

Search

- OpenAlex API
- Semantic Scholar API
- arXiv API
- Crossref API

Document Processing

- PyMuPDF
- GROBID
- Unstructured
- Docling

Storage

- S3-compatible object storage

Authentication

- Clerk
- Better Auth
- Auth.js

Deployment

- Vercel
- Railway
- [Fly.io](http://Fly.io)
- Docker

---

# North Star

&gt; Kairo Studio should feel like sitting beside an experienced research collaborator who has read thousands of papers, remembers every important detail, cites every claim correctly, and helps transform ideas into publishable research—while keeping the researcher fully in control of every decision.