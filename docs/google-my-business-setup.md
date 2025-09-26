# Google My Business API Setup Guide

This guide will help you set up Google My Business API integration for the reviews component.

## Prerequisites

1. **Google Cloud Console Account** - You need access to Google Cloud Console
2. **Google My Business Account** - Your veterinary clinic must be verified on Google My Business
3. **Business verification** - Your business must be verified and active

## Step 1: Google Cloud Console Setup

1. **Create/Select Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable billing (required for API access)

2. **Enable APIs**
   - Go to "APIs & Services" > "Library"
   - Search for and enable:
     - Google My Business API
     - Places API (as backup)

3. **Create Service Account**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "Service Account"
   - Name it `synnes-dyreklinik-reviews`
   - Grant role: "Project Editor"
   - Download the JSON key file (keep this secure!)

## Step 2: Google My Business Setup

1. **Link Business Account**
   - Go to [Google My Business](https://business.google.com/)
   - Verify you have admin access to Synnes Dyreklinik
   - Note down your Business Account ID

2. **Get Location/Place ID**
   - In Google My Business, find your location
   - The Place ID can be found in the URL or via the Places API
   - Format: Usually starts with `ChIJ...`

## Step 3: Install Dependencies

Add the required Google Auth library:

```bash
npm install google-auth-library
```

## Step 4: Environment Configuration

Add these environment variables to your `.env.local` file:

```bash
# Google My Business API
GOOGLE_MY_BUSINESS_API_KEY=your_api_key_here
GOOGLE_MY_BUSINESS_ACCOUNT_ID=your_business_account_id
GOOGLE_MY_BUSINESS_LOCATION_ID=your_location_place_id

# Alternative: Service Account (more secure)
GOOGLE_SERVICE_ACCOUNT_KEY='{...json key content...}'

# Backup: Places API (fallback)
GOOGLE_PLACES_API_KEY=your_places_api_key
```

## Step 4: Component Usage

Once configured, update your page component:

```tsx
// In app/page.tsx
<GoogleReviews 
  placeId="ChIJ..." // Your Google Place ID
  useMyBusinessAPI={true} // Enable My Business API
  maxReviews={6}
  className="bg-[#fffaf6]" 
/>
```

## Step 5: Authentication Methods

### Method A: API Key (Simple)
- Use the API key from Google Cloud Console
- Less secure but easier to implement
- Good for development/testing

### Method B: OAuth2 (Recommended)
- More secure
- Requires user consent flow
- Better for production

### Method C: Service Account (Best for Server)
- Server-to-server authentication
- No user interaction required
- Most secure for production

## Step 6: Testing

1. **Test with Mock Data First**
   ```tsx
   <GoogleReviews useMockData={true} />
   ```

2. **Test API Connection**
   - Check browser console for API errors
   - Verify environment variables are loaded
   - Test API endpoints directly

3. **Monitor API Quotas**
   - Check Google Cloud Console for API usage
   - Set up quotas and monitoring

## Common Issues & Solutions

### Issue: "API Key not valid"
**Solution:** 
- Verify API key is correct
- Ensure My Business API is enabled
- Check API key restrictions

### Issue: "Access denied"
**Solution:**
- Verify business ownership
- Check service account permissions
- Ensure location is verified

### Issue: "No reviews returned"
**Solution:**
- Verify Place ID is correct
- Check if location has public reviews
- Ensure API has proper permissions

## API Limits & Quotas

- **My Business API**: 1000 requests/day (free tier)
- **Places API**: $17 per 1000 requests (backup)
- **Rate Limiting**: 10 requests per second

## Security Best Practices

1. **Never expose API keys in client-side code**
2. **Use server-side API routes only**
3. **Implement proper error handling**
4. **Set up monitoring and alerts**
5. **Regularly rotate API keys**

## Next Steps After Setup

1. Test the API integration
2. Set up caching for better performance
3. Monitor API usage and costs
4. Implement automatic review updates
5. Add review response functionality (if needed)

---

## Quick Start Checklist

- [ ] Google Cloud project created
- [ ] APIs enabled
- [ ] Service account created
- [ ] Business verified on Google My Business
- [ ] Place ID obtained
- [ ] Environment variables configured
- [ ] Component updated with `useMyBusinessAPI={true}`
- [ ] API tested and working

Need help with any of these steps? Let me know!