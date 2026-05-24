---
title: "Running Hermes Agent on Railway's Free Tier: A Disk-Space Adventure"
date: 2026-05-24
description: "What we learned trying to squeeze a modern AI agent into a 434 MB box — and the tricks that kept it running."
tags: ["hermes-agent", "devops", "railway", "hosting", "ai-agents"]
---

I've been running [Hermes Agent](https://hermes-agent.nousresearch.com) on Railway's free tier for a while now, and if there's one thing I've learned, it's this: **AI agents are hungry, and I don't just mean for tokens.**

## The 434MB Problem

Railway's free tier gives you a VM. That VM comes with a disk. That disk is, in our experience, **434 MB total**.

To put that in perspective:

- A modern Node.js project with `npm install` can easily consume 150–200 MB for `node_modules` alone
- The npm cache adds another ~20 MB
- Python venvs (for tools like ComfyUI or vLLM) can run 200–500 MB each
- A single `git clone` of a moderately-sized repo is 10–50 MB
- Logs, `.npm` caches, and temporary build artifacts pile up fast

You can't `npm install` an Astro site and keep your Python environment at the same time. You can't run two significant codebases side-by-side. You can't even cache both npm and pip packages without watching `df -h` like a hawk.

## Hard-Earned Workarounds

### 1. Cache Rotation

The biggest win was aggressively managing caches. Hermes uses `~/.npm` and pip caches, and they grow silently. We made a habit of:

```bash
npm cache clean --force
pip cache purge
```

After cleaning `~/.npm` (which was 18 MB alone — not huge, but every megabyte counts), we went from 86% to 29% disk usage.

### 2. Watch `df -h` Like It's Your Job

We built a habit of checking disk before any significant operation:

```
/dev/zd1088   434M  365M   60M   86%
```

Seeing that "86%" warning should trigger a cleanup, not a new install.

### 3. One Project at a Time

You can't have the existing site clone, the new site build, and Hermes' runtime all in working state simultaneously. Our flow became:

1. Clone what you need
2. Extract the data
3. Delete the clone
4. Install what you need next

It sounds obvious, but getting disciplined about cleanup is the difference between a working agent and a stuck one.

### 4. Push Early, Build Elsewhere

The most freeing decision was: **don't build on the server**. We started pushing source code to GitHub and running builds in CI. Railway's free tier became a thin control plane — the heavy lifting (npm install, vite builds, Astro compilation) happened in GitHub Actions, which has far more generous resources.

## What I'd Do Differently

If I were starting fresh on Railway free tier, I'd:

1. **Set up a cron-based disk monitor** — auto-clean caches when usage exceeds 70%
2. **Use Railway volumes** — they cost a bit more but add persistent, larger storage
3. **Prefix every install with a cleanup** — make it a habit, not a reaction
4. **Consider an alternative** — if your workload is heavy, Railway's $5/mo Hobby tier gives you a full GB of RAM and more disk, which is probably worth it

## The Bottom Line

Running Hermes Agent on Railway's free tier is **totally viable** — it's Linux, it has internet access, and it can run pretty much anything you throw at it. The constraint is disk, not compute. As long as you treat your 434 MB like the precious resource it is, and you design around it (build elsewhere, clean aggressively), it works.

But if you ever hear yourself think *"I'll just npm install that real quick"* without checking `df -h` first — you haven't learned the lesson yet. I know I hadn't.