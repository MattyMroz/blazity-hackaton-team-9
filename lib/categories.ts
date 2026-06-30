export const CONTENT_CATEGORIES = [
  {
    id: 'linkedin',
    label: 'Post LinkedIn',
    emoji: '💼',
    context: `CONTENT TYPE: LinkedIn Post
Platform norms: professional audience, 1300-char soft limit, value-first hook, 3–5 paragraphs max, minimal hashtags (1–3), no emojis unless brand uses them. Judge whether the opening line grabs attention, the structure builds credibility, and the tone matches a professional network.`,
  },
  {
    id: 'instagram',
    label: 'Post Instagram',
    emoji: '📸',
    context: `CONTENT TYPE: Instagram Post
Platform norms: visual-first, caption supports the image, engaging hook in first line (visible before "more"), emojis welcome, 5–10 hashtags typical, casual-but-on-brand tone. Judge hook strength, emoji usage, hashtag relevance, and whether the caption works without seeing the image.`,
  },
  {
    id: 'manager',
    label: 'Do przełożonego',
    emoji: '👔',
    context: `CONTENT TYPE: Message to a supervisor/manager
Communication norms: formal or semi-formal register, concise and clear, lead with the main point or ask, no filler phrases, respectful and professional tone throughout. Judge clarity of the request/update, appropriate formality level, and conciseness.`,
  },
  {
    id: 'mentee',
    label: 'Do podopiecznego',
    emoji: '🤝',
    context: `CONTENT TYPE: Message to a mentee/direct report
Communication norms: supportive and constructive tone, clear instructions or feedback, encouraging without being vague, actionable next steps. Judge whether feedback is specific and actionable, tone is coaching rather than critical, and the message empowers rather than overwhelms.`,
  },
] as const

export type CategoryId = typeof CONTENT_CATEGORIES[number]['id']
