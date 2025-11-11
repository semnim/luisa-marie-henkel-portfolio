# Luisa-Marie Henkel Portfolio

## About

This project is a realization of a minimal, bold art director portfolio.

[Check it out here.](https://luisa-marie-henkel-portfolio.vercel.app/)

## Stack

- Framework: Next.JS with TypeScript
- Package manager: pnpm
- Testing: Vitest
- Database: Neon PSQL
- ORM: Drizzle
- Static assets: Cloudinary
- Authentication: BetterAuth
- Schema validation: Zod
- E-Mail service: Resend
- Hosting service: Vercel

## Structure

- Home
- Portfolio
- Project details
- About
- Contact

## Features

- Unauthenticated, static pages served with dynamic assets fetched from cloudinary / neon
- Authenticated content management of sections, assets and text content
- Preprocessing of images (compression, creating scaled-down loading versions)
- Contact form using resend
