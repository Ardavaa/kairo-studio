# DESIGN_[SYSTEM.md](http://SYSTEM.md)

# Kairo Studio Design System

&gt; **Design Philosophy**

&gt;

&gt; Professional. Timeless. Research-first.

&gt;

&gt; Kairo Studio is **not another AI chatbot**.

&gt; It is an academic operating system designed for researchers.

---

# Core Principles

## 1. Research First

Every interface should feel like it was designed for researchers, not social media users.

Avoid:

- flashy gradients

- neon colors

- oversized buttons

- excessive animations

Prefer:

- whitespace

- typography

- hierarchy

- structure

---

## 2. Trust over Excitement

Researchers trust interfaces similar to

- Elsevier

- ScienceDirect

- Scopus

- Nature

- ACM Digital Library

- IEEE Xplore

The UI should communicate

- credibility

- professionalism

- permanence

---

## 3. AI is Invisible

AI is an assistant.

Not the center of the interface.

Never build the UI around "ChatGPT".

Instead, AI appears naturally throughout the workflow.

Examples

✓ Summarize Paper

✓ Explain Figure

✓ Generate Literature Review

✓ Find Research Gap

Not

❌ Huge chatbot in the middle

---

## 4. Calm Interface

Reading papers requires concentration.

The UI should reduce cognitive load.

Every page should feel

- quiet

- elegant

- spacious

---

# Design Keywords

Academic

Minimal

Editorial

Professional

Neutral

Readable

Research-focused

Institutional

Premium

Timeless

---

# Inspiration

Primary

- ScienceDirect

- Scopus

- Elsevier

- Nature

- JSTOR

Secondary

- Linear

- Notion

- Arc Browser

- Stripe Docs

- Vercel Dashboard

Avoid copying

- alphaXiv

- Perplexity

- ChatGPT

- Lovable

- Bolt

- Cursor

---

# Visual Identity

Kairo Studio should look like

&gt; "If Elsevier was redesigned in 2027."

Not

&gt; "AI startup with gradients."

---

# Color Palette

## Primary

Deep Charcoal

```

#1D1D1F

```

Main text

---

Warm White

```

#FCFBF8

```

Background

---

Paper White

```

#FFFFFF

```

Cards

---

Soft Border

```

#E8E5E0

```

Dividers

---

Light Surface

```

#F6F4F1

```

Secondary backgrounds

---

## Accent

Academic Orange

```

#E86A24

```

Used sparingly

- primary buttons

- links

- highlights

---

Success

```

#2E7D32

```

---

Warning

```

#F5A623

```

---

Danger

```

#C62828

```

---

Muted Text

```

#6B7280

```

---

# Typography

## Font Family

Primary

Inter

Secondary

Source Serif 4

---

## Usage

Serif

- Hero title

- Paper title

- Journal title

Sans

- UI

- Sidebar

- Metadata

- Navigation

---

## Scale

Hero

56px

---

H1

40px

---

H2

32px

---

H3

24px

---

Section

20px

---

Body

16px

---

Small

14px

---

Caption

12px

---

# Layout

Maximum Width

```

1440px

```

Content Width

```

1280px

```

---

Grid

12-column grid

24px gutters

---

Spacing Scale

```

4

8

12

16

24

32

48

64

96

```

---

# Border Radius

Cards

```

12px

```

Buttons

```

10px

```

Inputs

```

10px

```

Small

```

8px

```

---

# Shadows

Cards

```

0 1px 3px rgba(0,0,0,.05)

```

Hover

```

0 6px 20px rgba(0,0,0,.08)

```

Never use heavy shadows.

---

# Navigation

Top Navigation

Contains

- Logo

- Journals

- Conferences

- Authors

- Institutions

- Research Tools

- Sign In

Height

```

72px

```

Background

White

Bottom Border

1px

---

Sidebar

Used only inside authenticated app.

Contains

- Workspace

- Papers

- Notes

- Literature Review

- Drafts

- Settings

Width

```

280px

```

---

# Buttons

Primary

Orange

Filled

Used once per screen.

---

Secondary

White

Border

---

Ghost

Text only

---

Never use more than

One primary CTA

per section.

---

# Inputs

Large

48px height

Rounded

Clean borders

No colored backgrounds

---

Search Bar

Should feel like

ScienceDirect

Not ChatGPT.

Contains

- category dropdown

- search field

- search button

---

# Cards

Card Background

White

Radius

12

Border

1px solid

Padding

24px

Cards never float on dark backgrounds.

---

# Homepage Structure

1

Hero

---

Large editorial headline

Large search bar

Background illustration

---

2

Research Statistics

100M+

Documents

28k+

Journals

20M+

Authors

---

3

Explore by Subject

Computer Science

Medicine

Engineering

Mathematics

Business

Psychology

etc.

---

4

Featured Journals

Journal covers

Titles

Publishers

---

5

Trending Research

Latest publications

Most cited

Editor's picks

---

6

Research Tools

Literature Review

Paper Summarizer

Citation Manager

Research Gap Finder

AI Writing

---

7

Testimonials

Universities

Researchers

Institutions

---

8

Footer

Resources

Company

Privacy

Support

Socials

---

# Workspace Design

Inside the application.

Structure

```

Workspace

├── Papers

├── Notes

├── Drafts

├── Literature Reviews

├── AI

└── Settings

```

---

# Paper Detail

Layout

```

---------------------------------------------------

Paper Title

Authors

Journal

Year

DOI

---------------------------------------------------

Abstract

---------------------------------------------------

AI Summary

---------------------------------------------------

Figures

---------------------------------------------------

References

---------------------------------------------------

```

No chat interface.

AI actions appear inline.

---

# AI Components

Never build

```

Big chatbot

```

Instead

Small contextual panels.

Example

```

Abstract

[ Summarize ]

--------------------------------

Methodology

[ Explain ]

--------------------------------

Results

[ Compare ]

--------------------------------

References

[ Export BibTeX ]

```

---

# Icons

Library

Lucide

Style

Outline

Stroke

1.75

---

# Motion

Very subtle.

Duration

```

150–250ms

```

Effects

Fade

Slide

Scale (1.02 max)

Avoid

Bounce

Elastic

Floating animations

---

# Accessibility

Minimum contrast

AA

Interactive area

44px

Keyboard navigable

Visible focus states

---

# Tone

Should feel like

- reading a journal

- using a university library

- working in a professional research environment

Never feel like

- Discord

- Slack

- ChatGPT

- AI playground

---

# Components

Core Components

- Navigation Bar

- Sidebar

- Search Bar

- Search Filters

- Research Card

- Journal Card

- Author Card

- Institution Card

- Statistic Card

- AI Insight Card

- Citation Card

- Workspace Card

- Note Card

- Paper Card

- Empty State

- Section Header

- Footer

---

# Brand Personality

Kairo Studio is

- Intelligent

- Reliable

- Calm

- Academic

- Modern

- Elegant

- Trustworthy

- Research-driven

Not

- Playful

- Futuristic

- Cyberpunk

- Startup-hype

- Gamer

- Cartoon

---

# North Star

Every screen should answer this question:

&gt; "Would a professor, PhD researcher, or scientist feel comfortable spending eight hours a day working here?"

If the answer is yes, the design is aligned with the Kairo Studio philosophy.