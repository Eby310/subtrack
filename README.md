# SubTrack - Subscription Tracker

A full-stack subscription tracking application built with Next.js, Clerk authentication, Prisma with SQLite, and Resend for email reminders.

## Features

- **User Authentication**: Sign up and login via Clerk
- **Subscription Management**: Add, edit, and delete subscriptions
- **Spending Analytics**: View monthly and yearly spending totals
- **Renewal Reminders**: Get email notifications before subscriptions renew
- **Category Organization**: Organize subscriptions by category (Entertainment, Productivity, Health, Finance, Other)
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React, Tailwind CSS
- **Authentication**: Clerk
- **Database**: SQLite with Prisma ORM
- **Email**: Resend API
- **Scheduling**: Vercel Cron (for production)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables in `.env`:
   ```env
   DATABASE_URL="file:prisma/dev.db"

   # Clerk Authentication (get from https://clerk.com)
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

   # Resend (get from https://resend.com)
   RESEND_API_KEY=re..

   # Cron secret for reminders API
   CRON_SECRET=your_secret_here
   ```

4. Set up the database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── src/
│   ├── app/
│   │   ├── (dashboard)/        # Protected dashboard routes
│   │   │   ├── dashboard/      # Dashboard page
│   │   │   ├── subscriptions/  # Subscriptions CRUD
│   │   │   └── settings/       # Settings page
│   │   ├── api/               # API routes
│   │   │   ├── subscriptions/  # Subscription API
│   │   │   ├── cron/           # Cron jobs for reminders
│   │   │   └── webhooks/       # Clerk webhooks
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Landing page
│   ├── components/             # React components
│   └── lib/                    # Utilities and helpers
├── prisma/
│   └── schema.prisma           # Database schema
├── SPEC.md                    # Project specification
└── README.md
```

## Email Reminders

To enable email reminders in production:

1. Configure Resend API key in environment variables
2. Add the cron job to `vercel.json`:
   ```json
   {
     "crons": [
       {
         "path": "/api/cron/reminders",
         "schedule": "0 9 * * *"
       }
     ]
   }
   ```
3. Deploy to Vercel with the CRON_SECRET configured

## License

MIT
