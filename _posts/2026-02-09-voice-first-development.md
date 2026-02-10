---
layout: post
title:  "Voice-First Development"
date:   2026-02-09 10:00:00
---

I've been using voice-to-text as my primary way to talk to CLI agents for a few months now, and it changed how I work more than I expected.

My setup is simple - a MAONO PD100¹ desktop mic, Superwhisper² for local transcription, and Claude Code in the terminal. When you type, you need a synthesized thought before your fingers move. Voice doesn't work like that - you start talking before you've finished thinking, which means you ramble toward clarity instead of waiting for it.

> You don't wait for the thought to form. You talk your way into it.

There's research³ suggesting that verbalizing activates different cognitive processing than silent thought, which tracks with the experience. It's rubber duck debugging⁴ except the duck talks back - the AI hears the messy version of your thinking, pulls the intent out of the noise, and you skip the step where you compress your thoughts into clean prose.

Voice also unlocks parallelism. I run multiple terminal tabs with separate Claude instances, flip between them speaking for ten seconds each. The throughput ceiling moves from "how fast can I type" to "how fast can I think."

For anyone already living in the terminal, adding voice is the cheapest high-leverage change I've found. Install Superwhisper, point it at your terminal, start talking. The adjustment period is about a day.

-Tom

---

¹ [MAONO PD100](https://www.amazon.com/MAONO-Microphone-Voice-Over-Technology-Card-PD100/dp/B0BC3XB26X/)
² [Superwhisper](https://superwhisper.com)
³ [Think-aloud protocols - PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC6099082/)
⁴ [Rubber duck debugging - Wikipedia](https://en.wikipedia.org/wiki/Rubber_duck_debugging)
