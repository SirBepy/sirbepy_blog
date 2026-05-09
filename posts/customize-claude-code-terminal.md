---
title: How do I customize the Claude Code terminal?
description: ccstatusline gives you a live readout right above your prompt. Here's how to set it up.
date: 2026-05-11
slug: customize-claude-code-terminal
readingTime: 4
importance: level-up
tags: claude-code, customization, ccstatusline
---

The default Claude Code terminal is bare. **ccstatusline** fixes that. Big quality-of-life upgrade for ~5 minutes of setup.

## TL;DR

- **ccstatusline** = a community tool that shows a live status line above your Claude Code prompt.
- Shows things like **current model, cwd, git branch, token usage**.
- **Configurable** - pick what matters to you.
- Setup is **one install** + a settings tweak.

## What is ccstatusline?

It's a small package that hooks into Claude Code's `statusline` setting. Once installed, Claude Code runs it on every prompt and shows whatever it outputs.

Out of the box it can display:

- The current **model** (Opus, Sonnet, Haiku).
- The current **working directory**.
- The current **git branch** + dirty/clean state.
- Approximate **token usage** for the conversation.
- Custom segments you define yourself.

You pick which segments show up.

## How do I install it?

> [!note] (Joe to fill in)
> Drop the actual install command + settings.json snippet you used. From memory it was something like `npm install -g ccstatusline` and then setting `statusline.command` in `~/.claude/settings.json`. Confirm the exact steps and replace this callout.

## What should I configure?

The defaults are decent, but here's what I run:

> [!note] (Joe to fill in)
> Paste your actual ccstatusline config (from `~/.claude/settings.json` or wherever it lives) here. Walk through each segment briefly, why you have it, why you don't have the others. Replace this callout with the real content.

> [!tip] Don't overload it
> Keep it scannable. 4-5 segments max. If you have to read it slowly, it's defeating the purpose.
