---
title: How does Claude Code actually work?
description: A quick mental model so you stop fighting the tool.
date: 2026-05-09
slug: how-claude-code-works
readingTime: 3
importance: must-know
tags: claude-code, basics, vibecoding
---

If you only read one Claude Code post, make it this one. The rest of the posts build on it.

## TL;DR

- Rereads the **entire chat** every turn.
- Long chats = **dumber answers**. Normal, not a bug.
- **`/clear`** is your best friend. **`/compact`** is not.
- **`CLAUDE.md`** keeps your standards across clears.

## What gets sent when you hit enter?

Every turn, Claude Code packages this up and sends it to the AI:

1. **System prompt** (built-in instructions).
2. **Your `CLAUDE.md`** files.
3. **Every previous message** in this chat.
4. **Every tool result** (file reads, command outputs, diffs).
5. **Your new message**.

The AI reads all of it, then writes back.

The model itself has **no memory**. Each turn = full transcript reread from scratch.

> [!note] What about Claude's memory?
> Not really. Claude does technically have `/memory`, but it doesn't work as well as you'd hope. More details in [this post](./what-is-claude-memory.html).
>
> For now: assume **nothing** carries over unless `CLAUDE.md` says so.

## Why do long chats get dumber?

Imagine asking a friend a quick question, but first you make them reread your last 200 texts.

They CAN answer. But they'll be way more distracted than if you just asked.

Same with Claude. Symptoms of "context rot":

- Slower replies.
- Forgetting what you asked 2 messages ago.
- Contradicting decisions you already locked in.
- Repeating mistakes you already corrected.

You didn't break Claude... The chat is just too full.

## What's the solution?

Task done? Type **`/clear`**. Wipes the chat. Fresh start.

The instinct to "keep the same chat going so it remembers" is wrong. It doesn't remember anyway. The transcript is the thing dragging it down.

> [!tip] Rule of thumb
> Finished a feature? `/clear` before the next one.

## What about `/compact`?

`/compact` summarizes the chat and replaces the transcript with the summary.

Sounds great right? Yeah... in theory.

Why it goes wrong:

- Summary loses detail. Subtle decisions become vague bullets.
- AI keeps acting confidently on the summary.
- You debug "why did it forget that" five minutes later.

`/clear` = clean reset. `/compact` = lossy compression.

> [!warning] So don't forget...
> Friends don't let friends `/compact`.
