# Subscription Tracker - Specification

## Project Overview
- **Name**: SubTrack
- **Type**: Full-stack web application
- **Core functionality**: Track subscriptions, calculate spending, send renewal reminders
- **Target users**: Individuals managing personal subscriptions

## Tech Stack
- **Frontend**: Next.js 14 (App Router), Tailwind CSS, Shadcn UI
- **Auth**: Clerk
- **Database**: SQLite with Prisma
- **Email**: Resend (for sending reminders)
- **Scheduling**: Vercel Cron (or node-cron for dev)

## UI/UX Specification

### Layout Structure
- **Sidebar**: Fixed left navigation (280px width on desktop)
- **Main content**: Fluid width with max-width 1400px
- **Mobile**: Bottom navigation bar, hamburger menu for sidebar

### Visual Design
- **Color palette**:
  - Background: `#0a0a0f` (dark)
  - Surface: `#13131a` (card background)
  - Surface elevated: `#1a1a24`
  - Primary accent: `#6366f1` (indigo)
  - Secondary accent: `#22d3ee` (cyan)
  - Success: `#10b981`
  - Warning: `#f59e0b`
  - Danger: `#ef4444`
  - Text primary: `#f4f4f5`
  - Text muted: `#71717a`
  - Border: `#27272a`
- **Typography**:
  - Font: "Geist" (sans-serif)
  - Headings: 700 weight, tracking-tight
  - Body: 400 weight
- **Spacing**: 4px base unit (0.25rem)
- **Border radius**: 8px (small), 12px (medium), 16px (large)
- **Effects**: Subtle glow on hover, smooth transitions (150ms)

### Pages

#### 1. Landing Page (`/`)
- Hero section with value proposition
- Features grid (3 cards)
- CTA button to sign up

#### 2. Dashboard (`/dashboard`)
- Welcome message with user name
- Summary cards (Monthly total, Yearly total, Active subscriptions count)
- Recent subscriptions list (last 5)
- Upcoming renewals (next 7 days)

#### 3. Subscriptions (`/subscriptions`)
- Add subscription button (top right)
- Grid of subscription cards
- Each card shows: Logo/Icon, Name, Price, Billing cycle, Next billing date, Category
- Filter by category
- Sort by: Name, Price, Next billing

#### 4. Add/Edit Subscription (`/subscriptions/new`, `/subscriptions/[id]/edit`)
- Form fields:
  - Name (text, required)
  - Price (number, required)
  - Currency (select: USD, EUR, GBP)
  - Billing cycle (select: Monthly, Yearly, Weekly)
  - Category (select: Entertainment, Productivity, Health, Finance, Other)
  - Next billing date (date picker, required)
  - Notes (textarea, optional)
  - Color (color picker, optional - defaults based on category)

#### 5. Settings (`/settings`)
- Profile section (name, email from Clerk)
- Notification preferences:
  - Enable email reminders (toggle)
  - Days before renewal (number: 1-7)
  - Reminder time (select: Morning, Afternoon, Evening)
- Danger zone: Delete account

### Components

#### Summary Card
- Icon (left)
- Label (muted text)
- Value (large, bold)
- Trend indicator (optional)

#### Subscription Card
- Colored left border (category color)
- Category icon
- Name
- Price with currency
- Billing cycle badge
- Next billing date (with countdown)
- Actions: Edit, Delete

#### Add Subscription Modal
- Slide-in from right on mobile
- Centered modal on desktop
- Form with validation
- Save/Cancel buttons

### Animations
- Page transitions: Fade in (200ms)
- Card hover: Subtle lift (transform: translateY(-2px))
- Button hover: Background color shift
- Modal: Slide + fade in/out

## Functionality Specification

### Authentication
- Clerk integration for sign up/login
- Protected routes (redirect to sign in)
- User metadata stored in Clerk

### Subscription Management
- CRUD operations for subscriptions
- Fields: name, price, currency, billingCycle, category, nextBillingDate, notes, color, userId
- Validation on all fields

### Spending Calculation
- Normalize all subscriptions to monthly/yearly:
  - Weekly × 4.33 = Monthly
  - Monthly × 12 = Yearly
  - Yearly ÷ 12 = Monthly
- Real-time calculation on dashboard

### Email Reminders
- Cron job runs daily at configured time
- Check subscriptions due within X days
- Send email via Resend API
- Email template with subscription details and total

### Data Model (Prisma)
```prisma
model User {
  id            String         @id @default(cuid())
  clerkId       String         @unique
  email         String
  name          String?
  subscriptions Subscription[]
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
}

model Subscription {
  id              String   @id @default(cuid())
  userId          String
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  name            String
  price           Float
  currency        String   @default("USD")
  billingCycle    String   // weekly, monthly, yearly
  category        String
  nextBillingDate DateTime
  notes           String?
  color           String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

## Acceptance Criteria
1. User can sign up/login via Clerk
2. User can add a subscription with all fields
3. User can view all their subscriptions
4. User can edit existing subscriptions
5. User can delete subscriptions
6. Dashboard shows accurate monthly/yearly totals
7. Dashboard shows upcoming renewals
8. Email reminders are sent before renewal date
9. App is responsive on mobile devices
10. All forms have proper validation
