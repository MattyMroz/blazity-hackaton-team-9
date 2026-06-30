import Anthropic from '@anthropic-ai/sdk'
import { reportSchema, type Report } from './schema'

// Demo wants maximum "wow" → Opus (top quality).
// Swap to 'claude-sonnet-4-6' for a cheaper/faster sweet spot.
export const MODEL = 'claude-opus-4-8'

const SYSTEM = `You are BrandLint, a senior brand-compliance reviewer.
Compare the DRAFT CONTENT against the BRAND GUIDELINES and judge how on-brand it is.
You MUST answer only by calling the \`report\` tool, never write prose.
Be specific and actionable. Quote the offending phrasing inside each issue's detail.
score: 0-100 (100 = perfectly on-brand). improved_version: the draft rewritten to be fully on-brand.
publish_checklist: concrete pre-publish checks with a boolean pass/fail.

WRITE ALL OUTPUT IN POLISH. Every text field (summary, issues' title/detail/suggestion,
improved_version, checklist labels) must be in natural Polish. Do not use em dashes.`

// Forced tool use is the most reliable way to get structured JSON out of the model.
const reportTool: Anthropic.Tool = {
  name: 'report',
  description: 'Return the brand-compliance review for the draft.',
  input_schema: {
    type: 'object',
    properties: {
      score: { type: 'integer', description: '0-100 brand alignment score' },
      summary: { type: 'string', description: 'One short paragraph verdict' },
      issues: {
        type: 'array',
        description: 'Concrete on-brand problems found in the draft',
        items: {
          type: 'object',
          properties: {
            severity: { type: 'string', enum: ['low', 'medium', 'high'] },
            title: { type: 'string', description: 'Short label for the issue' },
            detail: { type: 'string', description: 'What is wrong, quoting the draft' },
            suggestion: { type: 'string', description: 'How to fix it' },
          },
          required: ['severity', 'title', 'detail', 'suggestion'],
        },
      },
      improved_version: { type: 'string', description: 'The draft rewritten fully on-brand' },
      publish_checklist: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            label: { type: 'string' },
            passed: { type: 'boolean' },
          },
          required: ['label', 'passed'],
        },
      },
    },
    required: ['score', 'summary', 'issues', 'improved_version', 'publish_checklist'],
  },
}

export async function analyzeContent(opts: {
  apiKey: string
  guidelines: string
  draft: string
}): Promise<Report> {
  // The key never leaves the browser except in the request straight to Anthropic.
  const client = new Anthropic({ apiKey: opts.apiKey, dangerouslyAllowBrowser: true })

  const res = await client.messages.create({
    model: MODEL,
    max_tokens: 4000,
    system: SYSTEM,
    tools: [reportTool],
    tool_choice: { type: 'tool', name: 'report' },
    messages: [
      {
        role: 'user',
        content: `BRAND GUIDELINES:\n${opts.guidelines}\n\nDRAFT CONTENT:\n${opts.draft}`,
      },
    ],
  })

  const block = res.content.find((b) => b.type === 'tool_use')
  if (!block || block.type !== 'tool_use') {
    throw new Error('Model nie zwrócił ustrukturyzowanego raportu.')
  }

  // Throws on shape mismatch → handled by the caller and shown to the user.
  return reportSchema.parse(block.input)
}
