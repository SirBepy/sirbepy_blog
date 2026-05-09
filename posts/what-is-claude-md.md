---
title: What is CLAUDE.md?
description: The two files that keep your standards alive across every /clear.
date: 2026-05-10
slug: what-is-claude-md
readingTime: 3
importance: must-know
tags: claude-code, claude-md, basics
---

If you've read [How does Claude Code actually work?](./how-claude-code-works.html), you know `/clear` wipes the chat. **`CLAUDE.md` is what survives.**

## TL;DR

- **Two files**, auto-loaded by Claude Code at every conversation start.
- **Global** = your prefs across all projects. **Project-local** = rules for one repo.
- **Loaded fresh** on every `/clear`. Your standards never get wiped.
- Keep it **small**. It loads on every turn = more text = more noise.

## Where does CLAUDE.md live?

Two locations, both auto-loaded:

- **Global**: `~/.claude/CLAUDE.md` (Mac/Linux) or `C:\Users\<you>\.claude\CLAUDE.md` (Windows). Applies to every project.
- **Project-local**: `CLAUDE.md` at the root of your repo. Only loads for that project.

You don't run any command to make it work. Just put the file there.

## What goes in it?

Anything you'd say "I keep telling Claude this every time, can it just remember?" about.

Examples that belong:

- **Communication**: no em dashes, keep replies short, no jokes.
- **Git**: never commit without asking.
- **Tech stack**: "we use vitest, not jest".
- **Style**: single quotes, 2-space indent.
- **Process**: run lint before declaring done.

> [!tip] Rule of thumb
> If you'd say it to a new contractor on day 1, it goes in `CLAUDE.md`.

## What should NOT go in it?

`CLAUDE.md` is loaded on **every single turn**. Big file = slower, dumber Claude (see [why long chats get dumber](./how-claude-code-works.html#why-do-long-chats-get-dumber)).

Don't put:

- Your full architecture doc (link to it instead).
- API reference dumps (Claude can read them when needed).
- Stuff Claude can figure out from reading the code.

> [!warning] Watch the size
> If your `CLAUDE.md` is over ~200 lines, you're hurting yourself. Split into linked docs, reference them.
