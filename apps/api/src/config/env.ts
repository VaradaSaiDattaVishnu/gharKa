import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  FIREBASE_PROJECT_ID: z.string().min(1),
  CLOUDINARY_CLOUD_NAME: z.string().min(1),
  CLOUDINARY_API_KEY: z.string().min(1),
  CLOUDINARY_API_SECRET: z.string().min(1),
  ADMIN_PHONE_NUMBERS: z.string().default(""),
  CORS_ORIGINS: z.string().default("http://localhost:3000"),
  PORT: z.coerce.number().default(3001),
});

export type Env = z.infer<typeof envSchema>;

let _env: Env | null = null;

export function getEnv(): Env {
  if (_env) return _env;
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    const formatted = parsed.error.format();
    console.error("Invalid environment variables:", formatted);
    throw new Error("Invalid environment variables");
  }
  _env = parsed.data;
  return _env;
}
