---
title: How Claude Code actually works
description: A quick mental model so you stop fighting the tool.
date: 2026-05-09
slug: how-claude-code-works
readingTime: 4
tags: claude-code, basics, vibecoding
---

If you only read one post about Claude Code, make it this one. Everything else makes more sense after this.

## TL;DR

- It rereads the entire chat every single turn.
- Long chats turn dumb. That is normal, not a bug.
- `/clear` is your best friend. `/compact` is not.
- `CLAUDE.md` is how you keep your standards across clears.

## What is actually happening when you hit enter

Claude Code is a wrapper around an AI. When you type a message, here is what gets sent to the AI:

1. A system prompt (instructions Claude was started with).
2. Your `CLAUDE.md` files (more on those below).
3. Every previous message in this chat. Yours and the AI's.
4. Every tool result (every file read, every command run, every diff).
5. Your new message.

The AI reads all of that, then writes the next reply. The model itself does not "remember" anything between turns. Each turn, the whole transcript gets reread from the top.

> [!note] "Wait, doesn't Claude have memory?"
> Yes and no. The underlying model is stateless. There IS a separate memory feature that can save notes between conversations and reinject them into future ones, but that is a layer ON TOP of the model, not the model itself. We will cover it in its own post. For now: assume nothing carries over unless you put it in `CLAUDE.md`.

> [!info] Wait, isn't rereading 200 messages every turn wasteful?
> Money-wise, no. Anthropic caches the front of your conversation, so reading the same prefix 20 times is cheap. The real cost is something else: more text in the chat means more noise for the model to filter, which means worse focus.

## Why long chats get dumber

Imagine asking a friend a quick question, but first you make them reread your last 200 text messages, including the thread from Tuesday about pizza. They CAN still answer, but they will be way more distracted than if you had asked them fresh.

Symptoms of a chat that has gone on too long:

- Slower replies.
- Forgetting what you asked two messages ago.
- Giving you advice that contradicts a decision you already locked in.
- Repeating mistakes you already corrected.

This is sometimes called "context rot". You did not break Claude. The chat is just full.

## The fix: /clear early, /clear often

When a task wraps up, type `/clear`. This wipes the chat and starts a fresh one.

> [!tip] Rule of thumb
> Finished a feature? `/clear` before the next one. New task, new chat. You will feel the difference immediately.

The instinct to "keep the same chat going so it remembers" is wrong. It does not remember anything anyway. All it has is the transcript, and the transcript is dragging it down.

## What about /compact?

Claude Code has another command, `/compact`, that asks the AI to summarize the conversation so far and replace the transcript with the summary. Sounds great in theory: shorter chat, same context, no `/clear`.

In practice, it is mid at best.

- The summary loses detail. Subtle decisions you made earlier turn into vague bullet points.
- The AI keeps acting confidently on the summary even when key context got dropped.
- You often end up debugging "wait why did it forget that" five minutes later.

`/clear` is a clean reset. `/compact` is a lossy compression. The lossy version sneaks in errors you do not notice until they cost you.

> [!warning] Friends do not let friends /compact
> If a chat is too long, `/clear` and rely on `CLAUDE.md` plus a fresh prompt to bring back what matters. You will know exactly what is in context. With `/compact`, you do not.

## CLAUDE.md: the only thing that survives /clear

Claude Code automatically reads two files at the start of every conversation:

1. **Global**: `~/.claude/CLAUDE.md` - your personal preferences. Applies to every project.
2. **Project-local**: `CLAUDE.md` at the root of your repo. Specific to that project.

Think of them as instructions you do not have to retype. Whatever is in there is loaded fresh on every `/clear`. So you can blow away the chat without losing your standards.

Tiny global `CLAUDE.md` example:

```md
## Communication
- Keep replies short.
- No em dashes anywhere.

## Git
- Never commit without asking first.
```

Tiny project-local `CLAUDE.md` example:

```md
## Project rules
- No npm in local dev.
- Blog posts live in posts/*.md.
- Do not hand-edit posts/*.html, they are generated in CI.
```

> [!warning] Common mistake
> People dump their entire codebase docs into `CLAUDE.md` and wonder why Claude is slow and overwhelmed. That file is loaded on every turn. Keep it small. A future post will go deep on what belongs there and what does not.

## Takeaways

- Claude rereads everything each turn. There is no memory.
- Long chats = noisy chats = worse answers.
- `/clear` between tasks. It is not destructive, it is hygiene.
- Use `CLAUDE.md` so your preferences survive every clear.

That is the mental model. The rest of the tool, slash commands, hooks, statuslines, MCP servers, makes way more sense once this part clicks.
