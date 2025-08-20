# Synnes Dyreklinik

A Danish veterinary clinic website built with Next.js and Supabase.

**Live website:** [synnesdyreklinik.dk](https://www.synnesdyreklinik.dk/)

## Features

- 🔐 **Authentication** - Supabase Auth with email/password and Google OAuth
- 👤 **User Dashboard** - Personalized dashboard for logged-in users
- 📱 **Responsive Design** - Mobile-first design with Tailwind CSS
- 🏥 **Veterinary Services** - Information about clinic services
- 🇩🇰 **Danish Language** - Fully localized in Danish

## About the Clinic

Synnes Dyreklinik is located in Kirke Hyllinge, Denmark, and is run by experienced veterinarian Synne Fyhn Stephansen. The clinic offers:

- Medical examinations and diagnostics
- Surgical procedures  
- Dental treatments
- Consultations for all types of pets
- Over 10 years of experience
- Experience from referral hospitals in Copenhagen
- Veterinarian for police service dogs

**Contact Information:**
- **Address:** Gammel Skolevej 5, Ejby, 4070 Kirke Hyllinge
- **Phone:** 49 40 05 99
- **Email:** info@synnesdyreklinik.dk
- **Hours:** Weekdays 8-16

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Localization**: Danish (da-DK)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account and project

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/HrEsben/synnes-dyreklinik.git
   cd synnes-dyreklinik
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Go to Settings > API to get your project URL and anon key
   - Copy `.env.local` and update with your Supabase credentials:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

4. **Configure Authentication**
   - In your Supabase dashboard, go to Authentication > Settings
   - Add your site URL (e.g., `http://localhost:3000`) to the list of redirect URLs
   - For production, add your domain (e.g., `https://yourdomain.com`)

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication routes
│   ├── dashboard/         # Protected dashboard page
│   ├── login/             # Login page
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── auth/              # Authentication components
│   └── navigation.tsx     # Navigation component
├── lib/                   # Utility libraries
│   └── supabase/          # Supabase client configurations
└── middleware.ts          # Next.js middleware for auth
```

## Authentication Flow

1. **Registration/Login**: Users can sign up or log in using email/password or Google OAuth
2. **Session Management**: Supabase handles session management automatically
3. **Protected Routes**: Middleware protects authenticated routes
4. **Logout**: Users can log out from their dashboard

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your environment variables in Vercel dashboard
4. Deploy

### Other Platforms

Make sure to:
- Set the environment variables
- Update Supabase redirect URLs with your production domain

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is for educational purposes.
