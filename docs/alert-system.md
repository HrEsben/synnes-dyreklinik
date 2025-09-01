# Site Alert System

## Overview
The site alert system allows administrators to display important messages at the top of all pages on the website. This is useful for announcing service disruptions, important news, or temporary notices.

## Setup

### 1. Database Setup
Run the SQL script to create the necessary table:
```sql
-- Run this in your Supabase SQL editor
\i scripts/create_site_alerts_table.sql
```

Or manually execute the contents of `/scripts/create_site_alerts_table.sql` in your Supabase dashboard.

### 2. Features
- **Toggle On/Off**: Easily enable or disable alerts
- **Alert Types**: Choose from Info (blue), Warning (yellow), Error (red), or Success (green)
- **Message Management**: Write custom alert messages
- **Live Preview**: See how the alert will look before saving
- **Auto-dismissible**: Users can close alerts they've seen

## Usage

### Managing Alerts (Dashboard)
1. Go to `/dashboard` (requires authentication)
2. Find the "Site Alert" section at the top
3. Use the toggle to enable/disable the alert
4. Select an alert type (Info, Warning, Error, Success)
5. Write your message in the text area
6. Preview the alert appearance
7. Click "Gem Alert" to save changes

### Alert Display
- Alerts appear at the top of all pages when active
- They show above the navigation bar
- Users can dismiss alerts with the X button
- Only one alert is shown at a time (most recent active alert)

## Alert Types
- **Info (Blue)**: General information, announcements
- **Warning (Yellow)**: Important notices, temporary changes
- **Error (Red)**: Service disruptions, urgent issues
- **Success (Green)**: Positive announcements, updates

## Examples
- "Telefonerne virker ikke. Ring på 20 12 34 56 i stedet."
- "Klinikken er lukket 24-26. december på grund af jul."
- "Nye åbningstider fra 1. januar: Man-Fre 8-17, Lør 9-14."
- "Online booking er midlertidigt utilgængelig. Ring for aftale."

## Technical Details
- Alerts are stored in the `site_alerts` table
- Only one alert can be active at a time
- The system fetches the most recently updated active alert
- Real-time updates require a page refresh
- Row Level Security (RLS) is enabled for data protection
