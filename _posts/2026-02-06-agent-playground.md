---
layout: post
title:  "Murmur and vandl: Playing with Claude Agents"
date:   2026-02-06 10:00:00
---

Claude shipped an [agents SDK](https://developers.cloudflare.com/agents/) and I wanted to play with it, but I'd been saving my "boil the ocean" energy for work stuff. So instead of anything useful I decided to just burn tokens and build two dumb collaborative apps — entirely from the terminal, no browser, prompting Claude agents through the whole thing.

## Murmur

[murmur.tomfuertes.com](https://murmur.tomfuertes.com) is a collaborative ambient soundscape. You type a feeling — "walking through rain," "fluorescent office anxiety" — and AI translates that into musical parameters that shift what everyone's hearing in real time. There's a WebGL visualizer too because why not.

## vandl

[vandl.tomfuertes.com](https://vandl.tomfuertes.com) is a shared wall where you click to place AI-generated street art. Type something, click a spot, and it sprays onto the wall for everyone. You can see other people's cursors moving around. The wall rotates every hour with a fresh background.

## The Fun Part

I normally talk myself out of side projects — the scope creeps, the motivation fades, the repo collects dust. These both went from zero to deployed in a weekend because I never left the terminal. No context switching, no yak shaving a dev environment, just describing what I wanted and watching it happen. It's the first time in a while I've actually shipped something for fun and not felt like I was fighting the tools the whole way there.

Both run on Cloudflare Workers + Durable Objects + Workers AI. Code's on GitHub ([murmur](https://github.com/tomfuertes/murmur), [vandl](https://github.com/tomfuertes/vandl)) if you want to poke around.

-Tom
