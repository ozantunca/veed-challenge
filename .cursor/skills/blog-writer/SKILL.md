---
name: blog-writer
description: Researches topics from quality online sources and writes engaging, substantive blog articles with a natural voice. Use when the user asks for a blog post, article, long-form content, editorial, or thought leadership piece that is well sourced and reader-first.
---

# Blog Writer

Produce **well-researched, engaging articles** that reward the reader’s time. The goal is **substance and a human-readable voice**—specific details, clear thinking, and verified information—not generic filler or template prose.

## Workflow

1. **Clarify** — Topic, audience, length target, tone (e.g. technical vs. general), and any must-include angles or constraints.
2. **Research** — Use web search and fetch authoritative pages. Prefer: primary sources (docs, papers, official posts), respected outlets, and subject-matter experts. Avoid relying on a single SEO-focused page. Cross-check claims; note dates and version-sensitive facts. Where the topic is contested, surface at least two perspectives or limitations.
3. **Outline** — One-line thesis; 3–7 sections with a logical arc (problem → context → depth → synthesis → close). Sections should flow; avoid abrupt topic jumps. Close must end with **one sharp takeaway or open question**—never "In conclusion" or summary rehash.
4. **Draft** — Write from notes and sources; **cite or link** non-obvious facts using `[Source Name](url)` format. Every section should add information the reader couldn’t get from a one-line summary.
5. **Edit** — Cut sentences that restate the obvious or pad length. Tighten openings and transitions. Remove any sentence that could be deleted without losing information. Run the **Evaluation** checklist in this file before delivering.

## Voice and style

- **Specific over vague** — Numbers, names, dates, and concrete scenarios beat abstract praise. Aim for at least one specific number or named example in the first two paragraphs.
- **Varied rhythm** — Mix short and long sentences; avoid every paragraph starting the same way.
- **Paragraph discipline** — Each paragraph should advance one point; merge or split if it does more or less.
- **One job per paragraph** — Don’t stack three ideas in one block unless bridging deliberately.
- **Honest limits** — Say when something is uncertain, debated, or context-dependent. Use "it depends," "evidence is mixed," or "no consensus yet" where accurate.

## What to avoid (reads as low-effort or “template”)

- Empty openers: “In today’s fast-paced world…”, “It goes without saying…”, “Let’s dive in.”
- Filler bridges: “Furthermore,” “Moreover,” “Additionally” as glue between unrelated thoughts.
- **AI-shaped prose**: symmetrical “Firstly… Secondly…”, hedging stacks (“may potentially”), repeating the user’s prompt as the intro, listicles with one sentence per item and no insight.
- Unsourced strong claims, outdated stats presented as current, or paraphrasing one SEO article as “research.”

## Output format

- **Title** — Specific; promises what the article actually delivers. No clickbait; the title should survive a "did the article deliver?" check.
- **Optional dek/subtitle** — One line if useful; can preview the angle or key tension.
- **Body** — Markdown with `##` / `###` headings; **links or footnotes** for key sources.
- **Length** — Match brief unless user specifies (e.g. 800 vs. 2,000 words). Default target: 900–1200 words for standard posts.

For patterns, anti-patterns, scoring rubric used in autoresearch, and examples, see [reference.md](reference.md).

## Evaluation (must pass before shipping)

Self-score each row **0–2** (0 = weak, 2 = strong). Target high totals; revise weak rows.

| # | Criterion |
|---|-----------|
| 1 | **LLM-likeness (inverse)** — Reads like a specific human writer, not generic LLM prose |
| 2 | **Filler** — Few or no sentences that add nothing for the reader |
| 3 | **Information value** — Non-obvious, useful, decision-relevant takeaways |
| 4 | **Research quality** — Credible sources; claims supported or qualified |
| 5 | **Structure & flow** — Clear arc; scannable headings |
| 6 | **Hook & close** — Opening grabs; ending lands |
| 7 | **Originality** — Angle or synthesis beyond echoing common search results |

**Sum:** 0–14 (strong articles often ≥ 10). Full rubric: [reference.md](reference.md).
