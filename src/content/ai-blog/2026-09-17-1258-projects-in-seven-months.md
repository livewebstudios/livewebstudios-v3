---
title: "We Ran 1,258 AI Projects in Seven Months. Here Is What Held Up."
date: 2026-09-17
description: "Seven months, 1,258 AI projects, 472 files shipped. What held up in real client work, what fell apart, and the rules we wrote so the mistakes stopped repeating."
image: "/images/ai/blog/1258-projects-in-seven-months.svg"
imageAlt: "Data-viz style illustration of a violet bar grid rising across seven monthly columns on a dark ground"
tags: ["automation", "websites"]
draft: false
---

Seven months. 1,258 projects. 13,317 exchanges with the AI systems that do the work. 472 files shipped to 43 active clients, including 14 websites rebuilt from scratch.

We didn't run those numbers to brag. We ran them to find out which parts of an AI-staffed studio actually hold weight under real client work, and which parts only look good in a demo. Here's what we found.

## What held up

### Static websites built by AI, reviewed by a human

This was the clearest win. Fourteen full rebuilds, across very different businesses: Targeteers, Küche+Cucina, Legacy TCP, Winslow Eagles, Valley Tent, Community Church GR, Manual Therapy, Mianne Benchwork, D&J Power Washing, Level Set, Mosaic, Live Web Photos, VÖID, and the Live Web Studios site itself.

A church, a power washing company, a tent rental outfit, a kitchen showroom. They have nothing in common except that they all needed a fast site that works on a phone. AI handled that range without breaking a sweat. The HTML is clean, the pages are small, and there's no database or plugin stack to babysit afterward.

The review step is what made it hold. AI will happily put the wrong hours on a contact page. A person catches that.

### Narrow automations

The automations that survived were the ones with a tight job description. Hosting-renewal invoices built on Zoho and Google Apps Script, 15 script files that do one thing: get the right invoice to the right client at the right time. A weekly member-list automation. Facebook and Instagram posting. Email triage. A monthly reporting pipeline.

None of those try to be clever. Each one moves data from one place to another on a schedule, with a human check at the point where money or a client's name is involved. We wrote up the invoice one in [The Invoice That Sends Itself](the-invoice-that-sends-itself.html).

### Pipelines with a checklist

Content that runs on a pipeline held up. Content that ran on vibes did not.

The weekly comic strip is the best example. Script, then art, then publish, same steps every week, 13 strips so far. The newsletter engine works the same way. So do the social calendars. The AI does the drafting, the pipeline enforces the order, and a person approves the result. More on that in [A Comic Strip Every Week](content-pipelines-that-run-themselves.html).

### Reporting

Reporting might be the most underrated use of AI in a small agency. A DataForSEO pipeline, Search Console audits and a set of client report templates replaced hours of copy and paste. The numbers come straight from the source. AI writes the plain-English summary. A person reads it and fixes anything that overstates the good news.

## What fell apart

### Long sessions

Early on we let AI sessions run long. One conversation, a dozen tasks, all afternoon. The quality slid, quietly, the deeper we went. Instructions from the start got forgotten. Small errors compounded.

The fix was blunt. We now cap a working session at six tasks, then start fresh with the relevant context pasted in. Output got noticeably steadier the week we started doing that.

### Voice without rules

Left to its defaults, AI writes like AI. Tidy lists of three. Balanced "on one hand, on the other" sentences. Words like "synergy" that no real person says out loud.

A client once pointed out that one punctuation habit read as machine-written to them. That was enough. We wrote a voice file with a banned-phrase list and a structural checklist, and now a scan runs before anything client-facing goes out. It's a little obsessive. It's also why the copy doesn't sound generic.

### One-off prompts

Every time we treated AI like a vending machine, typing a question and taking whatever came out, the result needed heavy rework. The work that held up always had a written spec behind it. Page build standards, SEO standards, a pre-launch QA checklist. The AI reads those specs before it starts. That's the difference between a draft and a deliverable.

### Absolute file paths

Small one, but it bit us more than once. Sites tend to move hosts two or three times before a client signs off. AI loves to write file paths that only work on one server. So now there's a hard rule: relative paths only, checked before anything ships. It sounds trivial. It saved a lot of broken launches.

## The pattern underneath

Look at the list of what held up and one thing jumps out. Every success had a human deciding what "done" meant before the AI started, and checking it after.

That's the whole model. AI does the labor at a volume no traditional shop could match. A principal sets the direction, writes the rules and signs off on the output. When the same correction comes up more than twice, it becomes a permanent rule. The system gets better because it's built to learn from the mistakes instead of repeating them.

The things that fell apart all failed the same way. Somewhere, a person stopped directing and started hoping.

## What this means if you're thinking about AI

If you run a small business and you're wondering where AI fits, here's the honest read from seven months of doing it.

Start narrow. Pick one job that eats hours every week and has a clear right answer. Invoices, reports and social posting are all good candidates. Write down what "correct" looks like. Keep a person on the approval step, at least until you trust it.

Skip the magic. The flashy stuff makes for a nice demo, but the value came from the boring, repeatable work.

We laid out the full inventory of what shipped on the [proof page](../proof.html). If you're curious how the studio is structured to do all of this, [What Is an AI-Staffed Studio?](what-is-an-ai-staffed-studio.html) covers the model.

And if you want to figure out which parts of your week could run on the same system, [let's talk](../start.html).
