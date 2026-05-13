# UTM Link Kit — paste these into each channel

The links below give you per-channel attribution in the dashboard. Until you
paste them in, those channels will keep showing up as "direct" (which is why
direct was 87% of traffic — it's literally everything you haven't tagged).

Tag conventions used:
- `utm_source` = the platform (instagram, facebook, email, gbp, card, qr)
- `utm_medium` = how the link is reached (bio, post, story, signature, listing, print)
- `utm_campaign` = the time-bucket or specific push (2026-05, motorisation-sale, etc.)
- `utm_content` = which specific creative / spot (only when running multiple things at once)

You can always change `utm_campaign` to whatever you want for a specific push.

---

## Instagram

### Bio link (the single link at the top of your profile)
```
https://moderncurtainsandblinds.com.au/?utm_source=instagram&utm_medium=bio&utm_campaign=evergreen
```

### Story / post link sticker
```
https://moderncurtainsandblinds.com.au/?utm_source=instagram&utm_medium=story&utm_campaign=2026-05
```

### Specific product link (example: roller blinds post)
```
https://moderncurtainsandblinds.com.au/blinds/roller-blinds?utm_source=instagram&utm_medium=post&utm_campaign=2026-05&utm_content=roller-reel
```

**Tip:** swap `utm_content` per post to see which specific reel/post sends traffic.

---

## Facebook

### Page "Book now" button / page link
```
https://moderncurtainsandblinds.com.au/quote?utm_source=facebook&utm_medium=page-button&utm_campaign=evergreen
```

### Standard Facebook post
```
https://moderncurtainsandblinds.com.au/?utm_source=facebook&utm_medium=post&utm_campaign=2026-05
```

### Facebook ad (only if you run organic-looking paid posts — actual ad-manager links auto-tag like Google Ads)
```
https://moderncurtainsandblinds.com.au/quote?utm_source=facebook&utm_medium=cpc&utm_campaign=motorisation-sale&utm_content=carousel-a
```

---

## Email signature

Replace your "Get a free quote" link in your email signature with:
```
https://moderncurtainsandblinds.com.au/quote?utm_source=email&utm_medium=signature&utm_campaign=evergreen
```

If you do a one-off email blast, use:
```
https://moderncurtainsandblinds.com.au/?utm_source=email&utm_medium=blast&utm_campaign=2026-05-newsletter
```

---

## Google Business Profile (GBP)

The "Website" button on your GBP listing currently points to your home page
with no UTM. Edit that link to:
```
https://moderncurtainsandblinds.com.au/?utm_source=gbp&utm_medium=listing&utm_campaign=evergreen
```

**Where to edit:** Go to https://business.google.com → your listing → Edit profile → Contact → Website → paste the tagged URL.

---

## Business cards / printed material

Print a QR code that points to:
```
https://moderncurtainsandblinds.com.au/quote?utm_source=card&utm_medium=print&utm_campaign=business-card
```

For direct-mail flyer or door drop:
```
https://moderncurtainsandblinds.com.au/quote?utm_source=mail&utm_medium=print&utm_campaign=2026-q2-flyer
```

Use https://www.qrcode-monkey.com or any QR generator. The tag travels through
the QR scan because the URL is preserved.

---

## What you should see in the dashboard once tagged

After you paste these and traffic starts flowing through them, the Traffic
Sources panel should look like this in ~7 days:

| Source | Was | Should be |
|---|---|---|
| direct | 87% | 20–40% (mostly typed URLs + bookmark visits + AI assistants) |
| Google Ads | mixed into "google.com" | own row |
| Google Organic | mixed into "google.com" | own row |
| instagram | 0% | trackable |
| facebook | 0% | trackable |
| email | 0% | trackable |
| gbp | 0% | trackable |

You'll finally see which channels are actually driving leads vs which ones look busy but don't convert.

---

## Important quirks

- **iOS Instagram in-app browser strips referrers** — that's why IG traffic shows as "direct" without UTMs. The UTM is the only way to track it.
- **Apple Mail / Outlook on mobile** may strip referrers for the same reason — UTMs survive.
- **TikTok** and **LinkedIn** if you ever post there: same pattern. Use `utm_source=tiktok` or `utm_source=linkedin`.
- **Google Ads** already auto-tags via `gclid` — don't add UTMs to ad URLs, you'll break Google's auto-attribution. Leave those URLs raw in Google Ads.
- **Never** put a UTM on internal links between pages of your own site. UTMs are for *inbound* links only. Internal UTMs will overwrite the original attribution.

## When to roll campaigns over

- `utm_campaign=evergreen` — never change, this is the always-on link
- `utm_campaign=2026-05` — bump to `2026-06` on June 1 so you can compare months
- `utm_campaign=motorisation-sale` — kill when sale ends, replace with the next push
