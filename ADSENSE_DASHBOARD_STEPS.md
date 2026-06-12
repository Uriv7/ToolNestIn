# Steps to complete IN the AdSense Dashboard (not in code)

These cannot be done in code — do these in your AdSense account after deploying.

## Step 1 — Disable Auto Ads (CRITICAL)
1. Go to: adsense.google.com
2. Click: Ads → By site → toolnestin.co.in
3. Click the pencil/edit icon
4. Toggle OFF "Auto ads"
5. Save

Why: Auto ads can place ads in positions that violate the "Abusive experiences" policy
(fake close buttons, transparent overlays, etc.). Your 2 manual ad units are safe.

## Step 2 — Verify ads.txt is live
After deploying, visit: https://toolnestin.co.in/ads.txt
Should show exactly: google.com, pub-8140114372302035, DIRECT, f08c47fec0942fa0
If it shows a 404, check that /public/ads.txt was included in your deployment.

## Step 3 — Request review (only after getting traffic)
1. Get at least 100–200 real sessions (share on WhatsApp, LinkedIn, Reddit)
2. Wait 14 days after deploying updated code (Google needs to re-crawl)
3. Go to: AdSense → toolnestin.co.in → Policy violations
4. Tick "I confirm that I have fixed the issues"
5. Click "Request review"

## Step 4 — If approved, link AdSense to Search Console
1. AdSense → Account → Access and authorisation → Link to Search Console
2. This lets you see which search queries drive ad revenue

## Step 5 — Monitor for policy violations weekly
Check AdSense → Policy centre every Monday.
If any new violation appears, fix within 48 hours before Google auto-disables ads.
