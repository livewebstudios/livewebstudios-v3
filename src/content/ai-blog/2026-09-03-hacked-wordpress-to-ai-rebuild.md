---
title: "How We Rebuilt a Hacked WordPress Site Without WordPress"
date: 2026-09-03
description: "Your WordPress site got hacked. Cleaning it in place rarely sticks. Here is the step-by-step playbook we use to rebuild it as a static, AI-built site instead."
image: "/images/ai/blog/hacked-wordpress-to-ai-rebuild.jpg"
imageAlt: "Laptop on a dark desk at night, its screen glowing with blurred abstract code and a thin violet edge light"
tags: ["websites"]
draft: false
---
<!-- imagePrompt (Higgsfield, 16:9, 1600x900 target):
Photorealistic open laptop on a dark wooden desk late at night, the screen showing heavily blurred abstract lines of code with no readable text, an unplugged ethernet cable coiled beside it, a cold mug in soft focus, no faces, no logos, no readable text, dark and cinematic. Shot on a 50mm lens at f/1.8, low-key lighting from the screen only, with a thin violet (#A78BFA) accent light rimming the edge of the laptop lid. -->

The call usually starts the same way. "Something's wrong with the website." Google is showing a warning. Or the homepage redirects to a pharmacy in another country. Or a customer emailed to say the contact page is full of links in a language nobody at the business speaks.

It's a hacked WordPress site. We spent twenty years building on WordPress. For a long stretch, something broke every single week: a compromised site, a plugin conflict, an update gone sideways. We know this call well.

For a lot of businesses, the right answer today is to stop cleaning and rebuild. Not on a fresh WordPress install. On static HTML, with no database, no admin login and no plugins. Here's the playbook we run.

## Why cleaning in place rarely sticks

The standard fix is to scan the site, delete the bad files, update everything and change the passwords. Sometimes that works. Often the site is reinfected within weeks.

The reason is simple. Attackers rarely leave one door open. They leave a backdoor file tucked in an uploads folder, an extra admin account, a line of code injected into the database. Miss one and you're back where you started. And you still have the same plugin stack that let them in the first time.

WordPress isn't bad software. It's just the most targeted software on the web, because it runs so much of it. Every plugin is another way in.

## Step 1: Contain it and take a snapshot

Before anything gets rebuilt, we freeze the evidence. A full backup of the files and a database export, stored somewhere offline. Nobody should trust any of it. It's reference material, not a starting point.

Then we change every credential that ever touched the site. Hosting control panel, FTP, the WordPress admins, the email accounts on the domain. If the domain registrar login is weak, that gets fixed too. This part is human work, done by a person, every time.

## Step 2: Pull the content out, not the code

This is where the approach splits from a traditional cleanup. We don't carry any code forward. We carry content.

AI goes through the old site page by page and extracts the parts that matter: headings, body copy, service descriptions, staff bios, blog posts, image files. While it's in there, it flags anything suspicious. Hidden links, script tags that don't belong, spam pages that were never part of the real site. Hacks often create hundreds of junk pages. Those don't come with us.

A person reviews the extracted content before it moves anywhere. AI is good at spotting a script tag. It's less reliable at noticing that a bio mentions someone who left the business in 2019.

## Step 3: Map every URL

This is the step people forget, and it's the one that protects your Google rankings.

We pull the list of real pages from Search Console and the old sitemap, then build a redirect map. Every old URL that had value points to its new home. The spam URLs the hack created get dropped entirely, so they fall out of the index instead of dragging the site down.

If this step gets skipped, the new site launches clean and the old rankings quietly disappear. We cover this in more depth in [WordPress to AI-Built: What Migration Actually Involves](wordpress-to-ai-built-migration.html).

## Step 4: Rebuild as static HTML

Now AI builds the new site. Hand-written HTML, CSS and a little JavaScript where a page genuinely needs it. The design can match the old site or move past it, depending on what the business wants.

What's missing is the point:

- **No database.** Nothing to inject code into.
- **No admin login.** Nothing to brute-force.
- **No plugins.** No abandoned add-on sitting there with a known hole in it.

Contact forms run through Formspree. If the business needs to edit its own blog or news, we set up Decap CMS, a light editor that writes plain files instead of database rows. Hosting moves to Netlify through GitHub, so every change is versioned and a bad edit can be rolled back.

The static sites we've built this way have landed PageSpeed scores in the mid to high 90s. Fast is a side effect of having nothing extra on the page.

## Step 5: Review every page

AI writes the pages. A person reads every one of them before launch. Phone numbers, hours, addresses, service areas, the spelling of the owner's name. Schema markup gets checked. Links get tested. Mobile layout gets looked at on an actual phone.

This is where an AI-staffed studio earns its keep or doesn't. Speed means nothing if the new site has the wrong phone number on it.

## Step 6: Cut over and clean up the record

Launch day is mostly a checklist. Point the domain at the new host. Turn on the redirect map. Send the new sitemap to Search Console. If Google flagged the old site as dangerous, request a review once the new one is live. Watch the crawl reports for the next few weeks for anything that 404s.

Then shut down the old hosting account. Don't leave the infected site sitting on a forgotten server with your domain's history attached to it.

## Who this is right for

This playbook fits most brochure sites, service businesses, law firms, churches, contractors and medical practices. The sites where content changes a few times a month and the main job is to make the phone ring.

It's the wrong fit for large e-commerce stores or membership sites that genuinely need a heavy application behind them. For those, the answer is usually better security on a platform built for that job. We'll tell you straight which side of the line you're on.

If you want to see how a rebuild runs from first call to launch, [How It Works](../how-it-works.html) lays out the process. If you're weighing the budget side, [What AI Website Design Costs in 2026](what-ai-website-design-costs.html) covers what drives the number.

Got a site that's been hacked, or one you're worried about? [Start here](../start.html) and we'll look at it with you.
