# Blog Writer — Reference

## Research checklist

- [ ] Searched for recent, authoritative material (not only top SEO pages).
- [ ] Checked primary sources where possible (docs, papers, filings, official blogs).
- [ ] Noted publication dates; flagged anything that may be outdated.
- [ ] Contrasted at least two perspectives or limitations where the topic is contested.
- [ ] Ensured at least 3 distinct external sources for claims that require support.
- [ ] Prepared a short “source list” (URLs or citations) before drafting.

## Article structure patterns

| Section | Role |
|---------|------|
| Opening | Hook with a **concrete** fact, question, war story, or scene—not a thesis restatement. Prefer incident/anecdote over abstract claim. |
| Context | Why this matters **now**; who cares. Ground in a timeframe or event when relevant. |
| Core | Depth: mechanisms, tradeoffs, examples, data. |
| Synthesis | So what—tie threads; avoid introducing brand-new claims here. No new evidence in the synthesis. |
| Close | One sharp takeaway or open question; avoid “In conclusion.” |

## Phrases that often signal filler

- “In today’s digital landscape…”
- “Whether you’re a beginner or an expert…”
- “The importance of X cannot be overstated.”
- “In this article we will explore…”
- “X is not just Y—it’s Z.” (unless Z is genuinely surprising)
- “At the end of the day…” / “It is worth noting that…”

## Stronger alternatives

- Lead with **one specific claim or stat** (sourced).
- Replace “many people believe” with **who** and **evidence**.
- Use **examples** (product, study, version number) instead of abstractions. Name the product or study (e.g. "LangChain 0.2", "the SEC filings study")—not "one framework" or "a 2024 study."
- Replace "studies show" with the study name and link when making claims.

---

## Autoresearch scoring rubric (0–2 per row; max **14**)

Score the **finished article**, not the skill text. Higher = better.

| # | Criterion | 0 | 1 | 2 |
|---|-----------|---|---|---|
| 1 | **LLM-likeness (inverse)** — Reads like thoughtful human writing, not template LLM output | Heavy AI tells; symmetrical fluff; prompt-parroting | Mixed | Natural voice, varied structure, specific |
| 2 | **Filler / fat** — Sentences that add no value for the reader | Many deletable lines | Some padding | Tight; every paragraph earns its place |
| 3 | **Information value** — Useful, non-obvious, decision-relevant | Vague or only common knowledge | Solid middle | Specific insights, data, or synthesis |
| 4 | **Research quality** — Depth and credibility of sourcing | Thin or one generic source | Decent mix | Multiple strong sources; facts checked |
| 5 | **Structure & flow** — Arc, headings, logical progression | Rambling or list-only | OK | Clear narrative; scannable; purposeful sections |
| 6 | **Hook & close** — Opening grabs; ending lands | Generic both | One strong | Sharp hook; memorable or actionable close |
| 7 | **Originality** — Angle, synthesis, or POV beyond summarizing SERP | Pure echo of common takes | Some angle | Distinct thread, comparison, or expert framing |

**Total:** Sum rows 1–7 → **0–14**. Optional: normalize to 10 with `round(score / 14 * 10)`.

### Quick failure modes (score row 1 or 2 as 0)

- Article could be generated without reading any source (pure platitude).
- Entire sections are synonyms of the title.
- No links/citations where claims require support.
- Opening paragraph restates the title or user's prompt.
- Listicle where each item is one sentence with no insight or synthesis.
