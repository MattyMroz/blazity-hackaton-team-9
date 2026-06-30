import { z } from 'zod'

function arrayFromMaybe<T extends z.ZodType>(itemSchema: T, wrapperKeys: string[] = []) {
  return z.preprocess((value) => {
    if (Array.isArray(value)) return value

    if (value && typeof value === 'object') {
      const record = value as Record<string, unknown>
      const wrappedArray = wrapperKeys.map((key) => record[key]).find(Array.isArray)
      if (wrappedArray) return wrappedArray

      const values = Object.values(record)
      if (values.length > 0 && values.every((item) => item && typeof item === 'object')) {
        return values
      }

      return [value]
    }

    return value
  }, z.array(itemSchema))
}

// Runtime contract for whatever the model returns. Even with forced tool use,
// we validate so a malformed response fails loudly instead of breaking the UI.
export const issueSchema = z.object({
  impact_score: z.number().int().min(0).max(10),
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
  issues: arrayFromMaybe(issueSchema, ['issues', 'items']),
  improved_version: z.string(),
  publish_checklist: arrayFromMaybe(checklistItemSchema, ['publish_checklist', 'checklist', 'items']),
})

export type Issue = z.infer<typeof issueSchema>
export type ChecklistItem = z.infer<typeof checklistItemSchema>
export type Report = z.infer<typeof reportSchema>
