---
title: Which Claude Code skills should I have?
description: Skills are saved prompts that take arguments. Here are the ones I actually use.
date: 2026-05-12
slug: claude-code-skills
readingTime: 4
importance: level-up
tags: claude-code, skills, customization
---

If you've ever typed `/something` in Claude Code and watched it run a bunch of commands, that was a **skill**. Here's how to get more of them.

## TL;DR

- **Skills** are markdown files that give Claude a custom command + instructions.
- They live in **`~/.claude/skills/`** (global) or **`.claude/skills/`** (project).
- You **trigger them** with `/skill-name`.
- A few are worth installing on day 1.

## What is a skill?

A markdown file with a name + description + instructions. When you type `/foo`, Claude runs the steps in `~/.claude/skills/foo/SKILL.md`.

Think of it as **"saved prompts that take arguments"**.

Quick examples:

- `/commit` - my git commit workflow with the right prefix + format.
- `/screenshot` - takes screenshots of the current project.
- `/close` - end-of-session retrospective + cleanup.

## Which ones do I use most?

> [!note] (Joe to fill in)
> List your top 5-7 most-used skills with one line each on what they do and when you reach for them. Pull from your `~/.claude/skills/` folder. From context I can see at least these are yours: `/commit`, `/close`, `/screenshot`, `/caveman`, `/rate-it`, `/git-init`, `/favicon`, `/meta-tags`, `/pwa`, `/portfolio-data`, `/inject-widgets`. Pick the ones you actually use weekly. Replace this callout.

## Which ones do I recommend everyone install?

> [!note] (Joe to fill in)
> The "public good" recommendations. Skills any vibecoder benefits from, regardless of their stack. Could be your own (sirbepy/skills) or community ones. 3-5 is plenty. Replace this callout.

> [!tip] Don't install dozens
> Each skill loads context when invoked. Pick 5-10 that genuinely save you time. **Quality > quantity.**
