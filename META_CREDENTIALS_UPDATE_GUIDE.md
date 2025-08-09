# Meta Credentials Manual Update Guide

## Overview
This guide will help you manually update all Meta/Facebook/Instagram credentials in your Replit secrets tab for your new Meta account.

## Step 1: Access Replit Secrets Tab

### How to Find Secrets Tab
1. In your Replit workspace, look at the left sidebar
2. Click on the **"Secrets"** tab (lock icon 🔒)
3. This opens the environment variables/secrets panel

### Alternative Method
1. Click on **"Tools"** in the left sidebar
2. Select **"Secrets"** from the tools menu

## Step 2: Get Your New Meta Credentials

### A. Facebook App ID and Secret
1. Go to **developers.facebook.com**
2. Log in with your new Meta account
3. Click **"My Apps"** → Select your app (or create new one)
4. In the app dashboard:
   - **App ID**: Copy from the top of the dashboard
   - **App Secret**: Click "Show" next to App Secret, copy the value

### B. Page Access Token
1. In your Facebook App dashboard, go to **"Tools & Support"** → **"Graph API Explorer"**
2. Select your **Facebook Page** from dropdown
3. Add these permissions:
   - `instagram_basic`
   - `instagram_manage_messages`
   - `instagram_manage_comments`
   - `pages_manage_metadata`
4. Click **"Generate Access Token"**
5. Copy the generated token

### C. Webhook Verify Token
- Create a custom secure token (e.g., "myapp-webhook-2025")
- This can be any string you choose, but make it secure

## Step 3: Update Secrets in Replit

### Required Secrets to Update

#### 1. INSTAGRAM_APP_ID
- **Key**: `INSTAGRAM_APP_ID`
- **Value**: Your Facebook App ID (from Step 2A)
- **Example**: `1234567890123456`

#### 2. INSTAGRAM_APP_SECRET
- **Key**: `INSTAGRAM_APP_SECRET`
- **Value**: Your Facebook App Secret (from Step 2A)
- **Example**: `abc123def456ghi789jkl012mno345pqr678`

#### 3. PAGE_ACCESS_TOKEN
- **Key**: `PAGE_ACCESS_TOKEN`
- **Value**: Your Page Access Token (from Step 2B)
- **Example**: `EAABwzLixnjYBO1234567890...` (very long token)

#### 4. INSTAGRAM_WEBHOOK_VERIFY_TOKEN
- **Key**: `INSTAGRAM_WEBHOOK_VERIFY_TOKEN`
- **Value**: Your custom verify token (from Step 2C)
- **Example**: `myapp-webhook-2025`

### How to Add/Update Each Secret

For each secret above:

1. **In Replit Secrets Tab**:
   - If the key exists: Click the **edit** button (pencil icon)
   - If the key doesn't exist: Click **"+ Add Secret"**

2. **Enter the Details**:
   - **Key**: Enter the exact key name (e.g., `INSTAGRAM_APP_ID`)
   - **Value**: Paste the corresponding value
   - Click **"Add Secret"** or **"Update"**

3. **Verify**: The secret should appear in your secrets list

## Step 4: Remove Old/Unused Secrets (Optional)

### Check for Old Secrets
Look for these old secrets and delete them if they exist:
- `FACEBOOK_APP_ID`
- `FACEBOOK_APP_SECRET` 
- `VERIFY_TOKEN`
- `INSTAGRAM_PAGE_ACCESS_TOKEN`

### How to Delete
1. Find the secret in the list
2. Click the **delete** button (trash icon)
3. Confirm deletion

## Step 5: Restart Your Application

### Method 1: Automatic Restart
- Replit usually restarts automatically when secrets change
- Wait 10-15 seconds after updating secrets

### Method 2: Manual Restart
1. In the **Console** tab, press `Ctrl+C` to stop the server
2. Run `npm run dev` to restart
3. Or click the **"Run"** button

## Step 6: Verify Your Updates

### Test the Configuration
1. Go to your app URL: `https://workspace.veefedtechnolog.replit.app`
2. Check if the app starts without errors
3. Look for these in the console logs:
   ```
   ✅ Connected to MongoDB
   [express] serving on port 5000
   ```

### Test Webhook Verification
Visit this URL to test webhook:
```
https://workspace.veefedtechnolog.replit.app/webhook/instagram-comments?hub.mode=subscribe&hub.verify_token=YOUR_VERIFY_TOKEN&hub.challenge=test123
```

Replace `YOUR_VERIFY_TOKEN` with your actual verify token. Should return `test123`.

## Step 7: Update Meta for Developers Webhook

### Update Webhook URL
1. Go to **developers.facebook.com** → Your App → **Webhooks**
2. Update the webhook URL to: 
   ```
   https://workspace.veefedtechnolog.replit.app/webhook/instagram-comments
   ```
3. Update verify token to match your `INSTAGRAM_WEBHOOK_VERIFY_TOKEN`
4. Click **"Verify and Save"**

## Step 8: Connect New Instagram Account

### Remove Old Instagram Connection
1. In VeeFore, go to **Social Accounts**
2. Disconnect any old Instagram accounts
3. Clear any old data

### Connect New Account
1. Click **"Connect Instagram"**
2. Log in with your new Meta account
3. Select your Instagram Business account
4. Grant all required permissions

## Troubleshooting

### Common Issues

#### App Won't Start
- Check all secret keys are spelled correctly
- Ensure no extra spaces in values
- Verify tokens are valid and not expired

#### Webhook Verification Fails
- Double-check your `INSTAGRAM_WEBHOOK_VERIFY_TOKEN`
- Ensure it matches exactly in Meta for Developers
- Check the webhook URL is correct

#### Instagram Connection Issues
- Verify your `PAGE_ACCESS_TOKEN` has correct permissions
- Check the Instagram account is a Business account
- Ensure it's connected to a Facebook Page

### Getting Help
- Check the Replit console for error messages
- Use the test endpoint: `POST /api/test-instagram-webhook`
- Review the webhook setup guide: `INSTAGRAM_WEBHOOK_SETUP_GUIDE.md`

## Summary Checklist

- [ ] Got new App ID and Secret from developers.facebook.com
- [ ] Generated new Page Access Token with correct permissions
- [ ] Created custom webhook verify token
- [ ] Updated all 4 secrets in Replit Secrets tab
- [ ] Restarted the application
- [ ] Verified webhook URL works
- [ ] Updated webhook configuration in Meta for Developers
- [ ] Connected new Instagram Business account
- [ ] Tested the complete system

---
*Your VeeFore app is now configured with your new Meta account credentials!*