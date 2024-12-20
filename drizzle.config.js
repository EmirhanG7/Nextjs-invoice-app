import {defineConfig} from "drizzle-kit";
import * as dotenv from 'dotenv';
dotenv.config({
  // path: './.env.local'
  path:'./.env.local'
});

// if(typeof process.env.XATA_DATABASE_URL !== 'string') {
//   throw new Error('Please set your XATA_DATABASE_URL in your .env.local file');
// }
export default defineConfig({
  dialect: 'postgresql',
  schema: './src/db/schema.js',
  out: './src/db/migrations',
  dbCredentials: {
    url: process.env.XATA_DATABASE_URL,
  }
})