import { z } from 'zod'

// Common validation schemas
export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Invalid email format')

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number')

export const nameSchema = z
  .string()
  .min(1, 'Name is required')
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name must be less than 50 characters')

// User validation schemas
export const userSchema = z.object({
  id: z.string().uuid(),
  name: nameSchema,
  email: emailSchema,
  avatar: z.string().url().optional(),
})

export const createUserSchema = userSchema.omit({ id: true })
export const updateUserSchema = createUserSchema.partial()

// Form validation schemas
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
})

export const registerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

// API response validation schemas
export const apiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    data: dataSchema,
    success: z.boolean(),
    message: z.string().optional(),
    errors: z.record(z.array(z.string())).optional(),
  })

export const paginatedResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  apiResponseSchema(z.array(dataSchema)).extend({
    pagination: z.object({
      page: z.number().int().min(1),
      limit: z.number().int().min(1),
      total: z.number().int().min(0),
      totalPages: z.number().int().min(0),
    }),
  })

// Environment validation schema
export const envSchema = z.object({
  VITE_APP_TITLE: z.string(),
  VITE_API_URL: z.string().url(),
  VITE_APP_VERSION: z.string(),
  VITE_APP_ENV: z.enum(['development', 'staging', 'production']),
})

// Utility functions
export const validateEnv = () => {
  try {
    return envSchema.parse(import.meta.env)
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Environment validation failed:', error.errors)
      throw new Error('Invalid environment configuration')
    }
    throw error
  }
}

export const safeParse = <T>(
  schema: z.ZodSchema<T>,
  data: unknown,
): { success: true; data: T } | { success: false; error: z.ZodError } => {
  const result = schema.safeParse(data)
  return result
}

// Type exports
export type User = z.infer<typeof userSchema>
export type CreateUser = z.infer<typeof createUserSchema>
export type UpdateUser = z.infer<typeof updateUserSchema>
export type LoginData = z.infer<typeof loginSchema>
export type RegisterData = z.infer<typeof registerSchema>
export type Env = z.infer<typeof envSchema> 