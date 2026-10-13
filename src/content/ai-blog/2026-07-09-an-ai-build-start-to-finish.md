---
title: "From Sketch to Site: An AI Build, Start to Finish"
date: 2026-07-09
description: "What really happens when a studio builds a small business website with AI, from the first sketch to launch day, and exactly where a human decides what ships."
image: "/images/ai/blog/an-ai-build-start-to-finish.jpg"
imageAlt: "A dark studio desk with a pencil sketch of a website layout beside a glowing monitor showing a finished page"
tags: ["websites"]
draft: false
---

<!-- imagePrompt (Higgsfield, 16:9, 1600x900 target):
Photorealistic close view of a dark wooden studio desk at night: a rough pencil wireframe sketch on paper in the foreground, a blurred monitor glowing behind it with an abstract web layout, a stylus resting on the sketch; no faces, no logos, no readable text, dark and cinematic. Shallow depth of field on a 50mm lens, low warm key light from the left, with a thin violet (#A78BFA) accent light rimming the monitor edge. -->

People hear "AI-built website" and picture someone typing one sentence into a chatbot and getting a finished site back. That isn't how it works. Not for anything a real business would put its name on.

We have done 14 full AI-built site rebuilds, including the Live Web Studios site this article lives on. Valley Tent. Community Church GR. D&J Power Washing. Manual Therapy. Küche+Cucina. Every one followed roughly the same path. Here is that path, start to finish, with the parts AI handles and the parts a human decides.

## Step one: the sketch

Every build starts with something rough. Sometimes it is an actual pencil sketch. More often it is a conversation: what the business does, who calls, what they need to find, and which competitor sites the owner likes or hates.

That conversation turns into a written brief. Pages, services, service area, the phone number that has to be on every page, the tone. AI helps organize it, but the brief itself comes out of a human asking the owner questions and listening to the answers.

This is the step that decides whether the site works. A fast site built on a bad brief is still a bad site.

## Step two: design direction

Next comes the look. We use tools like Google Stitch and Claude Design to turn reference sites and direction into actual layouts. Instead of one mockup that took a week, we can look at several directions in an afternoon and pick the one that fits the business.

The AI generates options. It does not choose. The human principal directing the build decides which direction holds up, which fonts read well on a phone, and whether the thing looks like the business or like a template. Plenty of generated layouts get thrown out at this stage. That is normal. That's the job.

## Step three: the build

Once the direction is set, the build moves to code. Claude Code writes the site as clean HTML, CSS and JavaScript, to the spec from the brief. There is no page builder and no theme. Every page is written for this business.

This is where AI changes the economics most. Work that used to take days of hand coding now takes a fraction of that. But speed isn't the interesting part. The interesting part is that a human can ask for a change, see it, and ask for another one in the same sitting. The site gets refined in conversation instead of in a two-week round trip.

Along the way, the build picks up the things a small business site needs and most templates skip:

- Titles and meta descriptions written for real searches
- Schema markup so search engines understand the business
- Images sized and compressed so the site loads fast on a phone
- A contact form (we use Formspree) that doesn't need a plugin

## Step four: content that sounds like the owner

A site is mostly words. AI drafts service descriptions, the about page and the rest. Then those drafts get edited hard.

Generic copy is the fastest way to make an AI-built site feel AI-built. Phrases like "comprehensive solutions" get cut. The copy has to say what the business actually does, in the way the owner would say it on the phone. We wrote more on this in [AI Content Without the Slop](ai-content-without-the-slop.html).

## Step five: editing, if the owner wants it

Some owners never want to touch their site. Others want to update hours, add a photo or post news. For them we set up Decap CMS, a lightweight editor that runs in the browser. Log in, change the text, save. No database, no plugin updates, no admin dashboard with forty menus.

## Step six: review and launch

Before launch, the site gets checked the way a picky client would check it. On a phone and on a laptop. Every link clicked. Every form tested. Page speed measured. Search basics confirmed: titles, descriptions, the canonical tags, the sitemap.

Then the owner reviews it. They can ask for anything to move or change. When they say go, the site deploys through GitHub to Netlify. Every change is versioned, so if anything ever goes wrong, rolling back is one step.

## What this means if you are the owner

A few things are different from the builds most owners remember.

**You see more options, sooner.** Because generating a direction is fast, you are not stuck reacting to the one mockup somebody had time to make.

**Changes are cheap.** Moving a section or rewriting a headline is a quick request, not a change order.

**There is less to maintain.** No WordPress means no plugin updates, no security patches for a stack you never asked for, and no database to get corrupted. If you are coming off WordPress, we walk through what that move involves in [WordPress to AI-Built: What Migration Actually Involves](wordpress-to-ai-built-migration.html).

**A person still owns the result.** Every page that ships was read and approved by the human who directs the studio. AI does a huge share of the work. It doesn't sign off on any of it.

## What still takes time

Honestly, the slowest part of most builds is not the code. It is waiting on content from the owner: photos, service lists, the story of how the business started. We can draft around gaps and use placeholders, but a site built on the owner's real details will always beat one built on guesses.

The other thing that takes time is getting the brief right. Rushing step one to get to the fun part is how you end up rebuilding step three.

## The short version

An AI build is still a build. It starts with a sketch and a conversation, runs through design, code and content, and ends with a human checking every page before it goes live. AI makes each step faster and makes changes cheaper. It doesn't replace the judgment about what the site should be.

If you want to see the whole process laid out step by step, it's on our [How It Works](../how-it-works.html) page.

When you are ready to see what your site would look like built this way, [start the conversation here](../start.html).
