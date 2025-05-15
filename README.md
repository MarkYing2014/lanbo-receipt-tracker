# Lanbo 蓝博 - Receipt Tracker

Lanbo 蓝博 is a modern SaaS receipt tracking application that uses AI to extract and organize receipt data. Upload PDF receipts and let our system automatically extract merchant information, dates, items, and totals.

## Features

- **PDF Receipt Upload**: Securely upload your receipts in PDF format
- **AI-Powered Data Extraction**: Automatically extract key information using Inngest workflows
- **Real-time Dashboard**: View expense summaries and analytics in real-time
- **Receipt Management**: View, edit, categorize, and search your receipts
- **Subscription Plans**: Free, Starter, and Pro plans with different feature sets
- **AI Summaries**: Pro users get AI-generated receipt summaries

## Tech Stack

- **Frontend**: Next.js 15 with App Router and TypeScript
- **Backend**: Convex for real-time data storage
- **Authentication**: Clerk with email and Google login
- **Subscription Management**: Schematic + Stripe
- **AI Processing**: Inngest for background workflows
- **Styling**: Tailwind CSS, Shadcn UI, PostCSS

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Clerk account
- Convex account
- Stripe account (for payments)
- Inngest account

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/lanbo-receipt-tracker.git
cd lanbo-receipt-tracker
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env.local
```
Edit `.env.local` with your API keys and configuration values from Clerk, Convex, Stripe, and Inngest.

4. Initialize Convex backend
```bash
npx convex dev
```

5. Start the development server
```bash
npm run dev
```

6. Start the Inngest dev server in a separate terminal
```bash
npm run inngest:dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

This application can be deployed using Vercel, with the Convex backend automatically deployed to the Convex cloud infrastructure.

## Features by Plan

### Free Plan
- 10 receipts per month
- Basic receipt extraction
- Dashboard analytics

### Starter Plan ($9.99/month)
- 50 receipts per month
- Advanced receipt extraction
- Dashboard analytics
- CSV export
- Email support

### Pro Plan ($19.99/month)
- 200 receipts per month
- Premium receipt extraction
- Dashboard analytics
- CSV & PDF export
- AI receipt summaries
- Priority support
- Custom categories

## Security & Compliance

- **GDPR Compliant**: User data handling follows GDPR guidelines
- **PCI DSS**: Payment information processing complies with PCI DSS requirements
- **Secure File Storage**: PDF receipts are stored securely
- **Role-based Access**: Users can only access their own receipts
