# TidyCal → beehiiv Webhook

Replaces the Zapier workflow that adds newsletter subscribers from TidyCal bookings.

**Logic:**
1. TidyCal sends a `booking_created` event to this function
2. If the guest answered "Yes" to the newsletter opt-in question, they're added as a free subscriber to *The Life Shift Reflections* on beehiiv
3. A welcome email is sent automatically

---

## Setup

### 1. Create a GitHub repo

1. Create a new repo on GitHub (can be private)
2. Add these files exactly as structured:
   ```
   netlify.toml
   netlify/functions/tidycal-webhook.js
   ```

### 2. Deploy to Netlify

1. Go to [netlify.com](https://netlify.com) and click **Add new site → Import an existing project**
2. Connect your GitHub repo
3. Leave build settings blank (no build command needed)
4. Click **Deploy**

### 3. Add your beehiiv API key

1. In Netlify, go to **Site configuration → Environment variables**
2. Add a new variable:
   - **Key:** `BEEHIIV_API_KEY`
   - **Value:** your beehiiv API key (starts with `bh-...`)
3. Click **Save**, then **Trigger redeploy**

### 4. Get your function URL

After deploy, your webhook URL will be:
```
https://YOUR-SITE-NAME.netlify.app/.netlify/functions/tidycal-webhook
```

### 5. Configure TidyCal webhook

1. In TidyCal, go to **Settings → Webhooks** (or Integrations → Webhooks)
2. Add a new webhook:
   - **URL:** your Netlify function URL from Step 4
   - **Event:** `booking_created`
3. Save

### 6. Turn off the Zapier Zap

Once you've confirmed a test booking flows through correctly, disable the Zap.

---

## Testing

Book a test appointment in TidyCal and answer "Yes" to the newsletter question.

In Netlify, go to **Functions → tidycal-webhook → Logs** to see real-time output confirming the subscriber was added (or why it was skipped).

---

## Notes

- If the opt-in answer is anything other than "Yes" (case-insensitive), the function exits cleanly with no action
- Existing subscribers are not reactivated (matches original Zap behavior)
- The beehiiv publication is hardcoded to *The Life Shift Reflections* (`pub_3284b86e-f06e-40e3-9721-ec688d175198`)
