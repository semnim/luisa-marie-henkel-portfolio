import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as authSchema from './auth-schema';
import * as contentSchema from './schema';

const schema = { ...contentSchema, ...authSchema };
const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle({ client: sql, schema });
