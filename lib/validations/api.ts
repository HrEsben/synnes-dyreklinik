import { z } from 'zod'

// ============================================
// Service Schemas
// ============================================

export const createServiceSchema = z.object({
  slug: z
    .string()
    .min(1, 'Slug er påkrævet')
    .max(100, 'Slug må max være 100 tegn')
    .regex(/^[a-z0-9-]+$/, 'Slug må kun indeholde små bogstaver, tal og bindestreger'),
  title: z
    .string()
    .min(1, 'Titel er påkrævet')
    .max(200, 'Titel må max være 200 tegn'),
  content: z
    .string()
    .min(1, 'Indhold er påkrævet')
    .max(10000, 'Indhold må max være 10.000 tegn'),
  icon: z
    .string()
    .max(50, 'Ikon må max være 50 tegn')
    .optional()
    .default('Stethoscope'),
  category: z
    .string()
    .max(50, 'Kategori må max være 50 tegn')
    .optional()
    .default('basis'),
  image_key: z
    .string()
    .max(500, 'Image key må max være 500 tegn')
    .optional()
    .nullable(),
})

export const updateServiceSchema = z.object({
  slug: z
    .string()
    .min(1, 'Slug er påkrævet')
    .max(100, 'Slug må max være 100 tegn')
    .regex(/^[a-z0-9-]+$/, 'Slug må kun indeholde små bogstaver, tal og bindestreger')
    .optional(),
  title: z
    .string()
    .min(1, 'Titel er påkrævet')
    .max(200, 'Titel må max være 200 tegn')
    .optional(),
  content: z
    .string()
    .min(1, 'Indhold er påkrævet')
    .max(10000, 'Indhold må max være 10.000 tegn')
    .optional(),
  icon: z
    .string()
    .max(50, 'Ikon må max være 50 tegn')
    .optional(),
  category: z
    .string()
    .max(50, 'Kategori må max være 50 tegn')
    .optional(),
  image_key: z
    .string()
    .max(500, 'Image key må max være 500 tegn')
    .optional()
    .nullable(),
  is_active: z.boolean().optional(),
})

export type CreateServiceInput = z.infer<typeof createServiceSchema>
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>

// ============================================
// FAQ Schemas
// ============================================

export const createFaqSchema = z.object({
  question: z
    .string()
    .min(1, 'Spørgsmål er påkrævet')
    .max(500, 'Spørgsmål må max være 500 tegn')
    .transform((val) => val.trim()),
  answer: z
    .string()
    .min(1, 'Svar er påkrævet')
    .max(5000, 'Svar må max være 5.000 tegn')
    .transform((val) => val.trim()),
})

export const updateFaqSchema = createFaqSchema

export type CreateFaqInput = z.infer<typeof createFaqSchema>
export type UpdateFaqInput = z.infer<typeof updateFaqSchema>

// ============================================
// Service Category Schemas
// ============================================

export const createCategorySchema = z.object({
  slug: z
    .string()
    .min(1, 'Slug er påkrævet')
    .max(100, 'Slug må max være 100 tegn')
    .regex(/^[a-z0-9-]+$/, 'Slug må kun indeholde små bogstaver, tal og bindestreger'),
  label: z
    .string()
    .min(1, 'Label er påkrævet')
    .max(100, 'Label må max være 100 tegn'),
})

export const updateCategorySchema = z.object({
  slug: z
    .string()
    .min(1, 'Slug er påkrævet')
    .max(100, 'Slug må max være 100 tegn')
    .regex(/^[a-z0-9-]+$/, 'Slug må kun indeholde små bogstaver, tal og bindestreger')
    .optional(),
  label: z
    .string()
    .min(1, 'Label er påkrævet')
    .max(100, 'Label må max være 100 tegn')
    .optional(),
})

export type CreateCategoryInput = z.infer<typeof createCategorySchema>
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>

// ============================================
// Reorder Schema (for drag-and-drop)
// ============================================

export const reorderSchema = z.object({
  items: z.array(
    z.object({
      id: z.union([z.string(), z.number()]),
      order: z.number().int().min(0),
    })
  ).min(1, 'Mindst ét element er påkrævet'),
})

export type ReorderInput = z.infer<typeof reorderSchema>

// ============================================
// Price Category Schemas
// ============================================

export const createPriceCategorySchema = z.object({
  name: z
    .string()
    .min(1, 'Navn er påkrævet')
    .max(100, 'Navn må max være 100 tegn')
    .transform((val) => val.trim()),
  slug: z
    .string()
    .min(1, 'Slug er påkrævet')
    .max(100, 'Slug må max være 100 tegn')
    .regex(/^[a-z0-9-]+$/, 'Slug må kun indeholde små bogstaver, tal og bindestreger'),
  description: z
    .string()
    .max(500, 'Beskrivelse må max være 500 tegn')
    .optional()
    .nullable()
    .transform((val) => val?.trim() || null),
})

export const updatePriceCategorySchema = z.object({
  name: z
    .string()
    .min(1, 'Navn er påkrævet')
    .max(100, 'Navn må max være 100 tegn')
    .transform((val) => val.trim())
    .optional(),
  slug: z
    .string()
    .min(1, 'Slug er påkrævet')
    .max(100, 'Slug må max være 100 tegn')
    .regex(/^[a-z0-9-]+$/, 'Slug må kun indeholde små bogstaver, tal og bindestreger')
    .optional(),
  description: z
    .string()
    .max(500, 'Beskrivelse må max være 500 tegn')
    .optional()
    .nullable()
    .transform((val) => val?.trim() || null),
  is_active: z.boolean().optional(),
})

export type CreatePriceCategoryInput = z.infer<typeof createPriceCategorySchema>
export type UpdatePriceCategoryInput = z.infer<typeof updatePriceCategorySchema>

// ============================================
// Price Item Schemas
// ============================================

export const createPriceItemSchema = z.object({
  category_id: z.string().uuid('Ugyldig kategori ID'),
  name: z
    .string()
    .min(1, 'Navn er påkrævet')
    .max(200, 'Navn må max være 200 tegn')
    .transform((val) => val.trim()),
  description: z
    .string()
    .max(500, 'Beskrivelse må max være 500 tegn')
    .optional()
    .nullable()
    .transform((val) => val?.trim() || null),
  price_from: z
    .number()
    .min(0, 'Pris skal være positiv')
    .optional()
    .nullable(),
  price_to: z
    .number()
    .min(0, 'Pris skal være positiv')
    .optional()
    .nullable(),
  price_note: z
    .string()
    .max(200, 'Prisnote må max være 200 tegn')
    .optional()
    .nullable()
    .transform((val) => val?.trim() || null),
})

export const updatePriceItemSchema = z.object({
  category_id: z.string().uuid('Ugyldig kategori ID').optional(),
  name: z
    .string()
    .min(1, 'Navn er påkrævet')
    .max(200, 'Navn må max være 200 tegn')
    .transform((val) => val.trim())
    .optional(),
  description: z
    .string()
    .max(500, 'Beskrivelse må max være 500 tegn')
    .optional()
    .nullable()
    .transform((val) => val?.trim() || null),
  price_from: z
    .number()
    .min(0, 'Pris skal være positiv')
    .optional()
    .nullable(),
  price_to: z
    .number()
    .min(0, 'Pris skal være positiv')
    .optional()
    .nullable(),
  price_note: z
    .string()
    .max(200, 'Prisnote må max være 200 tegn')
    .optional()
    .nullable()
    .transform((val) => val?.trim() || null),
  is_active: z.boolean().optional(),
})

export type CreatePriceItemInput = z.infer<typeof createPriceItemSchema>
export type UpdatePriceItemInput = z.infer<typeof updatePriceItemSchema>

// ============================================
// Helper function for API validation
// ============================================

export function validateInput<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: string } {
  const result = schema.safeParse(data)
  
  if (!result.success) {
    const errors = result.error.issues.map((e) => e.message).join(', ')
    return { success: false, error: errors }
  }
  
  return { success: true, data: result.data }
}
