import { z } from 'zod'

// Runtime contract for whatever the model returns. Even with forced tool use,
// we validate so a malformed response fails loudly instead of breaking the UI.
export const issueSchema = z.object({
  severity: z.enum(['low', 'medium', 'high']),
  title: z.string(),
  detail: z.string(),
  suggestion: z.string(),
})

export const checklistItemSchema = z.object({
  label: z.string(),
  passed: z.boolean(),
})

export const reportSchema = z.object({
  score: z.number(),
  summary: z.string(),
  issues: z.array(issueSchema),
  improved_version: z.string(),
  publish_checklist: z.array(checklistItemSchema),
})

export type Issue = z.infer<typeof issueSchema>
export type ChecklistItem = z.infer<typeof checklistItemSchema>
export type Report = z.infer<typeof reportSchema>
