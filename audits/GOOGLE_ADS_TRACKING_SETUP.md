# Google Ads Conversion Tracking — Setup Guide

**Purpose:** wire up GTM → GA4 → Google Ads so every successful quote-form submission registers as a conversion in Google Ads at A$1,179, with Enhanced Conversions (hashed email/phone/name) attached.

**Context:** the website code (in this repo) is already done — `quote_success` now fires with `value`, `currency`, `gclid`, and four `ec_*_sha256` fields. This guide configures the Google side (GTM, GA4, Google Ads) to act on those events.

## The value model (for non-technical reference)

| Number | Source | Why |
|---|---|---|
| Average sale | A$4,717 | From Alex's books |
| Lead → sale close rate | 25% | From Alex's books |
| **Value per lead** | **A$1,179** (= 4,717 × 0.25) | What we tell Google Ads on each form submit |
| Target ROAS | 1500% | Current Smart Bidding strategy parameter |

The A$1,179 is not real money; it's the bidding signal. Smart Bidding (Maximize Conversion Value @ 1500% target ROAS) cannot work without it.

---

## Pre-flight values to capture before importing

Before driving any of the Google admin UIs, capture these three IDs into a scratchpad — every step below references them.

1. **GTM Container ID** — `GTM-NC37ZBB9` (confirmed 2026-05-14 via direct audit).
2. **GA4 Measurement ID** — analytics.google.com → Admin → Data Streams → Web stream → top-right of the stream details panel, format `G-XXXXXXXXXX`. (Need to capture; the existing `Analytics` Google Tag in GTM likely references it.)
3. **Google Ads Customer ID** — `663-202-5586`.

You'll also need:
4. **Google Ads Form Submit Conversion Label** — the existing tag `Google Ads - Lead Conversion (Submit lead form)` already has a Conversion ID + Label baked in. We'll inspect and reuse them; do NOT create a new conversion action unless that one turns out to be wrong.

## ⚠️ CRITICAL — what the audit found

The GTM container is **NOT empty**. As of 2026-05-14, Version 6 (published by alexlekewis@gmail.com) contains 4 tags:

| Tag | Type | Fires on | Status |
|---|---|---|---|
| `Analytics` | Google Tag (GA4 Config) | Initialization - All Pages | ✅ Likely correct |
| `Conversion Linker` | Conversion Linker | All Pages | ✅ Correct |
| `Google Ads - Lead Conversion (Submit lead form)` | Google Ads Conversion Tracking | `CE - generate_lead` + `Thank you` triggers | ❌ **DEAD TAG** — site fires `quote_success`, not `generate_lead` |
| `Google Ads - Phone Click Conversion` | Google Ads Conversion Tracking | `CE - phone_click` trigger | ❌ **DEAD TAG** — site fires `phone_tap`, not `phone_click` |

**Result: zero Google Ads conversions have been recording from the website**, even though the tags exist. This is almost certainly why the container quality badge shows "Urgent — 2 issues".

## The reconciliation plan (NEW — supersedes original "create from scratch")

Instead of creating fresh tags, **edit the two existing dead tags**:

### Fix the lead conversion tag
1. Open `Google Ads - Lead Conversion (Submit lead form)`.
2. Note the existing Conversion ID + Label (they're real — don't blow them away).
3. Change Conversion Value → `{{DLV - value}}` (was likely fixed at A$1,179 or empty).
4. Change Currency → `{{DLV - currency}}` (or hardcode "AUD").
5. **Enable Enhanced Conversions** — Method: Manual. Map the four `ec_*_sha256` DLV variables to email/phone/first/last.
6. Replace firing triggers: remove `CE - generate_lead` and `Thank you`; add a new `CE - quote_success` trigger.

### Fix the phone click conversion tag
1. Open `Google Ads - Phone Click Conversion`.
2. Decide: keep as Primary or downgrade to Secondary (recommendation: **downgrade to Secondary** in Google Ads, no value, observation only).
3. Replace firing trigger: remove `CE - phone_click`; add a new `CE - phone_tap` trigger.

### Create the missing custom event triggers
- `CE - quote_success` — Trigger Type: Custom Event, Event name: `quote_success`
- `CE - phone_tap` — Trigger Type: Custom Event, Event name: `phone_tap`

(The existing `CE - generate_lead` and `CE - phone_click` triggers can be deleted after the tags are rewired — but only after, to avoid orphan references.)

### Add the missing Data Layer Variables
The Variables section below lists what's needed. The container almost certainly doesn't have `DLV - value`, `DLV - currency`, or the four `ec_*_sha256` variables yet — add them.

### Audit the GA4 Configuration ("Analytics") tag
1. Open it, confirm it points at the right `G-XXXXXXXXXX`.
2. Verify `send_page_view` is set to **false** (the EventTracker component fires page_view manually — without this setting, page views double-count).
3. **Add Enhanced Conversions user-provided data**: under "User-provided data" settings of the Google Tag, set Manual Configuration with the four `ec_*` variables. This is what enables Enhanced Conversions for GA4 → Google Ads import.

---

## A. GTM container — what to build

Open https://tagmanager.google.com → MCB workspace.

### Variables (Workspace → Variables → New)

#### Built-in variables to enable
Workspace → Variables → Built-In Variables → Configure → tick these:
- `Click URL`
- `Click Text`
- `Form ID`
- `Page Path`
- `Page Hostname`

#### Data Layer Variables (User-Defined)

| Name | Type | Data Layer Variable Name |
|---|---|---|
| `DLV - value` | Data Layer Variable | `value` |
| `DLV - currency` | Data Layer Variable | `currency` |
| `DLV - gclid` | Data Layer Variable | `gclid` |
| `DLV - ec_email_sha256` | Data Layer Variable | `ec_email_sha256` |
| `DLV - ec_phone_e164_sha256` | Data Layer Variable | `ec_phone_e164_sha256` |
| `DLV - ec_first_name_sha256` | Data Layer Variable | `ec_first_name_sha256` |
| `DLV - ec_last_name_sha256` | Data Layer Variable | `ec_last_name_sha256` |
| `DLV - location` | Data Layer Variable | `location` |
| `DLV - product_context` | Data Layer Variable | `product_context` |

All Data Layer Version = **Version 2**. Leave "Set default value" unchecked.

#### Constant variables

| Name | Type | Value |
|---|---|---|
| `Const - GA4 Measurement ID` | Constant | `G-XXXXXXXXXX` (your real one) |
| `Const - Google Ads Conversion ID` | Constant | `AW-XXXXXXXXXX` (filled in after step E.1) |
| `Const - Google Ads Form Submit Conversion Label` | Constant | `<label string>` (from step E.1) |

### Triggers (Workspace → Triggers → New)

All these are **Trigger Type: Custom Event**, **Fires on: All Custom Events**, **Event name**: as listed below (no regex needed).

| Trigger name | Event name to match |
|---|---|
| `CE - quote_success` | `quote_success` |
| `CE - phone_tap` | `phone_tap` |
| `CE - quote_cta_click` | `quote_cta_click` |
| `CE - quote_form_start` | `quote_form_start` |
| `CE - quote_field_error` | `quote_field_error` |
| `CE - chat_widget_open` | `chat_widget_open` |
| `CE - chat_lead_success` | `chat_lead_success` |

Built-in `All Pages` trigger is used by the GA4 Config and Conversion Linker tags.

### Tags (Workspace → Tags → New)

#### A.1 GA4 Configuration

- **Type:** Google Tag (was "GA4 Configuration")
- **Tag ID:** `{{Const - GA4 Measurement ID}}`
- **Configuration settings:** add field `send_page_view` = `false`
  - **Critical** — the Next.js App Router already fires `page_view` manually via the EventTracker component. Letting GTM also fire page_view causes double-counting.
- **Triggering:** Initialization - All Pages

#### A.2 GA4 Event — lead_form_submit (the macro)

- **Type:** Google Analytics: GA4 Event
- **Tag ID:** `{{Const - GA4 Measurement ID}}`
- **Event Name:** `lead_form_submit`
- **Event Parameters:**
  - `value` → `{{DLV - value}}`
  - `currency` → `{{DLV - currency}}`
  - `gclid` → `{{DLV - gclid}}`
- **User Properties:** (none — leave blank)
- **More Settings → User-provided data → User data type:** Manual configuration
  - `email_address` → `{{DLV - ec_email_sha256}}`
  - `phone_number` → `{{DLV - ec_phone_e164_sha256}}`
  - `address.first_name` → `{{DLV - ec_first_name_sha256}}`
  - `address.last_name` → `{{DLV - ec_last_name_sha256}}`
  - **Note:** these fields are pre-hashed SHA-256. GA4 / Google Ads accept either raw or hashed — the dataLayer carries hashed values for PII safety.
- **Triggering:** CE - quote_success

#### A.3 GA4 Event — phone_call_click

- **Type:** GA4 Event
- **Tag ID:** `{{Const - GA4 Measurement ID}}`
- **Event Name:** `phone_call_click`
- **Event Parameters:** (none — no value, observation only)
- **Triggering:** CE - phone_tap

#### A.4 GA4 Event — cta_click_measure_quote

- **Type:** GA4 Event
- **Tag ID:** `{{Const - GA4 Measurement ID}}`
- **Event Name:** `cta_click_measure_quote`
- **Event Parameters:**
  - `cta_location` → `{{DLV - location}}`
  - `product_context` → `{{DLV - product_context}}`
- **Triggering:** CE - quote_cta_click

#### A.5 GA4 Event — form_start

- **Type:** GA4 Event
- **Event Name:** `form_start`
- **Triggering:** CE - quote_form_start

#### A.6 GA4 Event — form_error

- **Type:** GA4 Event
- **Event Name:** `form_error`
- **Event Parameters:** `step` → `{{DLV - step}}` (add the DLV variable first), `missing_fields` → DLV
- **Triggering:** CE - quote_field_error

#### A.7 GA4 Event — chat_started

- **Type:** GA4 Event
- **Event Name:** `chat_started`
- **Triggering:** CE - chat_widget_open

#### A.8 GA4 Event — chat_lead

- **Type:** GA4 Event
- **Event Name:** `chat_lead`
- **Triggering:** CE - chat_lead_success

#### A.9 Google Ads Conversion Linker

- **Type:** Conversion Linker
- **Settings:** "Enable linking across domains" OFF, "Conversion linker" ON
- **Triggering:** All Pages

#### A.10 Google Ads Conversion Tracking — Form Submit (only fill after step E.1)

- **Type:** Google Ads Conversion Tracking
- **Conversion ID:** `{{Const - Google Ads Conversion ID}}` (paste the numeric part after AW-)
- **Conversion Label:** `{{Const - Google Ads Form Submit Conversion Label}}`
- **Conversion Value:** `{{DLV - value}}`
- **Currency Code:** `{{DLV - currency}}`
- **GCLID:** leave blank (Conversion Linker handles)
- **Enhanced Conversions:** toggle ON
  - Method: **Manual configuration**
  - email → `{{DLV - ec_email_sha256}}`
  - phone_number → `{{DLV - ec_phone_e164_sha256}}`
  - first_name → `{{DLV - ec_first_name_sha256}}`
  - last_name → `{{DLV - ec_last_name_sha256}}`
- **Triggering:** CE - quote_success

> Note: we recommend keeping this Google Ads tag in addition to importing GA4 conversions, as it gives us a redundant data path. If you'd rather rely only on GA4 → Ads import, you can skip A.10. Importing-via-GA4 is the primary plan; the direct Ads tag is belt-and-braces.

### Publish

Workspace → Submit → name the version e.g. "2026-05-14 Google Ads conversions". Publish.

---

## B. Database migration (Alex applies manually)

The new website code writes `gclid` to a top-level column on `lead_submissions`. The column must exist before deploy or inserts will fail.

**Steps:**
1. Open https://supabase.com/dashboard/project/lrhgrmklpvwyjzaipioh/sql/new (correct project — NOT the one connected via MCP per CLAUDE.md).
2. Paste contents of `supabase/migrations/20260514_add_gclid_to_lead_submissions.sql`.
3. Run.
4. Verify with: `SELECT column_name FROM information_schema.columns WHERE table_name = 'lead_submissions' AND column_name = 'gclid';`

---

## C. Deploy website code

From `/repo`:
```bash
npm run build              # already verified clean
vercel deploy --prod
```

Confirm the live URL renders a quote form and the GTM script loads (view-source, look for `GTM-XXXXXXX`).

---

## D. GA4 admin

Open https://analytics.google.com → MCB property → Admin.

1. **Data Streams → Web stream → Enhanced Measurement**: confirm ON, all sub-toggles ON.
2. **Events**: after the first real `lead_form_submit` event arrives in DebugView (do a test submission to trigger it), mark it as **Key Event**. Same for `phone_call_click`.
3. **Custom definitions → Custom dimensions** → register event-scoped:
   - `cta_location` (parameter: `cta_location`)
   - `product_context` (parameter: `product_context`)
   - `location` (parameter: `location`)
4. **Product links → Google Ads links**: confirm linked to **663-202-5586**. If not, click Link and authenticate. Enable "Personalized advertising" and "Auto-tagging".

---

## E. Google Ads admin (the most important step)

Open https://ads.google.com under account **663-202-5586**.

### E.1 Create the form-submit conversion action (imported from GA4)

1. Tools → Goals → **Conversions → New conversion action**.
2. Select **Import** → **Google Analytics 4 properties** → **Web**.
3. Pick `lead_form_submit` → **Import and continue**.
4. Edit settings:
   - **Conversion category**: Submit lead form
   - **Goal**: Submit lead form (Primary)
   - **Value**: "Use the value from the event" (will be A$1,179)
   - **Count**: One
   - **Click-through window**: 30 days
   - **View-through window**: 1 day
   - **Attribution model**: Data-driven
5. Save.
6. Open the new action → expand "Tag setup" → copy the **Conversion ID** (`AW-XXXXXXXXXX`) and the **Conversion Label** (long alphanumeric).
7. Paste them into the GTM constants `Const - Google Ads Conversion ID` and `Const - Google Ads Form Submit Conversion Label`. Publish GTM workspace.

### E.2 Import `phone_call_click` as Secondary (observation only)

1. Tools → Conversions → New → Import → GA4 → Web → `phone_call_click` → Continue.
2. Settings:
   - Goal: **Phone call leads** but marked **Secondary** (this is the toggle that determines whether it drives bidding)
   - Value: None
   - Count: One per click
3. Save.

### E.3 Update existing "Call Leads" action to A$1,179

The existing "Call Leads" action (for forwarded paid-search phone calls) should match the form-submit value.

1. Conversions → Call Leads → Edit settings → Value: A$1,179 (fixed).
2. Save.

### E.4 Enhanced Conversions for Leads

1. Conversions → Settings → **Enhanced Conversions for Leads** → ON.
2. Method: **Google tag** (which routes through your GTM setup).
3. Accept terms.
4. Run **Diagnostics** after first real submission — must turn green within 24h.

### E.5 Campaign goals

1. Campaigns → Phase 1 (or your active campaign) → Goals.
2. Confirm `lead_form_submit` Primary is active.
3. Confirm `Call Leads` stays Primary.
4. Bid strategy stays **Maximize Conversion Value @ 1500% target ROAS** — no change.

---

## F. QA checklist (must all pass)

Use GTM Preview + GA4 DebugView in parallel. Screenshot each pass.

- [ ] GTM Preview connects to `https://moderncurtainsandblinds.com.au` and shows the container loading
- [ ] One `page_view` per route change in GA4 DebugView (not zero, not multiple)
- [ ] Clicking "Book Free Measure & Quote" CTA fires `quote_cta_click` → GA4 receives `cta_click_measure_quote` with correct `location`
- [ ] Submitting form (test email + phone) fires `quote_success` → GA4 receives `lead_form_submit` with:
  - `value` = 1179
  - `currency` = AUD
  - All four `ec_*_sha256` fields as 64-char hex strings
  - `gclid` populated if test URL had `?gclid=test123`
- [ ] Supabase: `SELECT id, gclid FROM lead_submissions ORDER BY created_at DESC LIMIT 5` shows test row with `gclid=test123`
- [ ] Tapping a `tel:` link fires `phone_tap` → GA4 `phone_call_click` (no value)
- [ ] Google Ads → Conversions → `lead_form_submit` row: status "Recording conversions" within 24h
- [ ] Google Ads → Conversions → Diagnostics → Enhanced Conversions: green
- [ ] No console errors on submit
- [ ] No duplicate `lead_form_submit` (one submit = one event)
