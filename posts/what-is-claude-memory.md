---
title: What is Claude's /memory?
description: Claude has a memory feature. Here's why it's flaky and what to do instead.
date: 2026-05-10
slug: what-is-claude-memory
readingTime: 3
importance: optional
tags: claude-code, memory, basics
---

In [How does Claude Code actually work?](./how-claude-code-works.html), I said the model has no memory. Technically there's a feature called **`/memory`**. Here's the catch.

## TL;DR

- `/memory` lets Claude **save notes between conversations** and reload them later.
- It works by **writing files** to your machine. Not magic.
- The memory only kicks in when **Claude decides to read it**, which is unreliable.
- For consistency, **`CLAUDE.md`** is better for things you actually want to persist.

## How does /memory work?

When you say "remember that I prefer X", Claude can use the memory tool to write a small note to a file in `~/.claude/projects/<your-project>/memory/`.

Next conversation, Claude reads those files at the start (or when it thinks the topic is relevant) and uses them as context.

It's just files. You can open them, read them, edit them by hand if you want.

## Why doesn't it work as well as you'd hope?

Two reasons:

- **Claude has to decide to read it.** If the relevance isn't obvious, Claude might not pull the memory in. So your saved fact just sits there.
- **It's a tool call, not a guarantee.** Each new conversation Claude has to remember to USE the memory tool. Sometimes it doesn't.

Result: you save something important, then five conversations later Claude still asks "what's your tech stack?". The memory was there but never recalled.

## What should I do instead?

For things you ACTUALLY want Claude to know **every conversation**, use [`CLAUDE.md`](./what-is-claude-md.html). It's loaded automatically every turn. No decision-making required.

Use `/memory` for things that are:

- **Specific** (one quirky preference, not your whole stack).
- **Conversation-spanning** (across multiple sessions on the same project).
- **Not catastrophic** if forgotten.

> [!tip] When in doubt
> Put it in `CLAUDE.md`. `/memory` is a "would be nice" feature, not a "must work" one.
