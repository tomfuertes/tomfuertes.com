---
layout: post
title:  "Murmur and vandl: Playing with Claude Agents"
date:   2026-02-06 10:00:00
---

Claude shipped an [agents SDK](https://developers.cloudflare.com/agents/) and I wanted to play with it, but I'd been saving my "boil the ocean" energy for work stuff. So instead of anything useful I decided to just burn tokens and build two collaborative apps - entirely via audio prompts in the terminal, no browser, no typing, just talking through what I wanted.

The thing that surprised me was how fun it was. I've built plenty of stuff on Cloudflare Workers before, but there's always that stretch where you're deep in docs trying to remember the Durable Objects API or how WebSocket hibernation works or whatever. With Claude handling that part, I could stay in the "what should this thing do" headspace instead of grinding through the "how does this specific API work" part. You describe the shape of what you want, it fetches the docs, contextualizes, implements - and you're back to guiding instead of fighting domain-specific details.

Both projects use real-time shared state across connected users, which is the kind of thing I'd normally talk myself out of because the coordination complexity feels like a weekend project that turns into three weekends. These didn't. They each went from zero to deployed in a sitting.

## Murmur

[murmur.tomfuertes.com](https://murmur.tomfuertes.com) is a collaborative ambient soundscape. You type a feeling - "walking through rain," "fluorescent office anxiety" - and AI translates that into musical parameters that shift what everyone's hearing in real time. There's a WebGL visualizer too because why not.

## vandl

[vandl.tomfuertes.com](https://vandl.tomfuertes.com) is a shared wall where you click to place AI-generated street art. Type something, click a spot, and it sprays onto the wall for everyone. You can see other people's cursors moving around. The wall rotates every hour with a fresh background.

## The Actual Takeaway

I normally talk myself out of side projects - the scope creeps, the motivation fades, the repo collects dust. Using Claude as an exploratory learning tool via audio changed that equation for me. You stay in the creative part, the part that's actually fun, and offload the pedantic parts you've done a hundred times before. It's the first time in a while I've shipped something just for the joy of it.

Both run on Cloudflare Workers + Durable Objects + Workers AI. Code's on GitHub ([murmur](https://github.com/tomfuertes/murmur), [vandl](https://github.com/tomfuertes/vandl)) if you want to poke around.

-Tom
