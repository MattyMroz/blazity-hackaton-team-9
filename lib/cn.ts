import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Copied 1:1 from MangaShiftWebsite (shared/lib/utils/cn.ts).
export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs))
