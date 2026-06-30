export const CONTENT_CATEGORIES = [
  {
    id: 'instagram',
    label: 'Instagram',
    emoji: '📷',
    context: `CONTENT TYPE: Instagram Post
Platform norms: visual-first, caption supports the image, hook in first line (visible before "more" cut-off ~125 chars), emojis encouraged, 5–10 relevant hashtags, casual-but-on-brand tone.
PLATFORM CHECKS — include these as publish_checklist items with platform_check: true:
- First 125 characters form a compelling standalone hook (visible before "more")
- Caption total length is under 2200 characters
- Contains 5–10 hashtags (not more, not fewer)
- At least one emoji used (unless brand strictly forbids)
- Tone is casual and engaging, not corporate
- Contains a call-to-action (e.g. "link in bio", question for comments)`,
  },
  {
    id: 'facebook',
    label: 'Facebook',
    emoji: 'f',
    context: `CONTENT TYPE: Facebook Post
Platform norms: mix of personal and professional, algorithm rewards engagement (questions, reactions), link previews auto-generate so URL in text is optional, moderate length works (40–80 words sweet spot for organic), emojis acceptable.
PLATFORM CHECKS — include these as publish_checklist items with platform_check: true:
- Post length is between 40 and 300 words (avoids truncation and drop-off)
- Opens with a hook or question that invites engagement
- Contains no more than 3 hashtags (Facebook penalises hashtag spam)
- Tone is conversational and community-oriented
- Includes a clear call-to-action or engagement prompt
- No raw URLs in post body if a link preview will be attached`,
  },
  {
    id: 'twitter',
    label: 'X',
    emoji: '𝕏',
    context: `CONTENT TYPE: Twitter / X Post
Platform norms: strict 280-character limit (URLs count as 23 chars), punchy and direct, threads for longer content, 1–2 hashtags max, no filler, every word counts.
PLATFORM CHECKS — include these as publish_checklist items with platform_check: true:
- Total character count is under 280 (count URLs as 23 chars each)
- No more than 2 hashtags
- Opening word or phrase grabs attention immediately
- No filler phrases or unnecessary words
- Tone is direct, confident, and conversational
- If the content is too long for one tweet, it is structured as a thread (numbered tweets)`,
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    emoji: 'in',
    context: `CONTENT TYPE: LinkedIn Post
Platform norms: professional audience, 1300-char soft limit, value-first hook, 3–5 paragraphs max, minimal hashtags (1–3), no emojis unless brand uses them. Judge whether the opening line grabs attention, the structure builds credibility, and the tone matches a professional network.`,
  },
  {
    id: 'newsletter',
    label: 'Newsletter',
    emoji: '📧',
    context: `CONTENT TYPE: Newsletter / Email
Platform norms: opted-in readers — respect their inbox. Subject-line energy in the opener, one primary CTA, scannable sections, personal/direct tone ("you"), no pressure language or false urgency.`,
  },
  {
    id: 'blog',
    label: 'Blog',
    emoji: '✍️',
    context: `CONTENT TYPE: Blog Post / Article
Platform norms: longer-form, structured with clear headings, intro sets up the problem, body delivers value, conclusion includes a clear takeaway. Tone authoritative yet accessible, no jargon-heavy paragraphs.`,
  },
  {
    id: 'marketing',
    label: 'Marketing',
    emoji: '🎯',
    context: `CONTENT TYPE: Marketing Copy (ads, landing pages, product descriptions)
Platform norms: every word earns its place, benefit-led not feature-led, clear value proposition in the first two sentences, strong specific CTA, no hype words ("amazing", "revolutionary", "game-changer"), no filler phrases ("In today's world...").`,
  },
] as const

export type CategoryId = typeof CONTENT_CATEGORIES[number]['id']
