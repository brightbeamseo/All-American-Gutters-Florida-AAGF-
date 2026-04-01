# Reviews (AAGF)

**Business:** SunLife Gutters Tampa (Google listing may still show legacy name “SunLife Gutters & Homes”)  
**Google Business Profile (Maps):** https://maps.app.goo.gl/zPRAe4qAJ4sntCNh8  
**Document purpose:** Single place to reference **5‑star Google reviews** with **reviewer name**, **date relativity** (and optional calendar date), **quote**, and a **local image file** for the reviewer’s profile picture.

---

## How this folder is organized

| Item | Role |
|------|------|
| **`Reviews (AAGF).md`** (this file) | Human-readable master list with quick links to each photo |
| **`images/`** | Reviewer profile images saved from Google (see `images/README.md`) |
| **`reviews-export-template.csv`** | Same columns as a spreadsheet for sorting/filtering |

**Important — Google Business Profile access:**  
Automated scraping of Google Maps is unreliable and often violates Google’s terms. Bulk **text** reviews can be pulled later with the **Google Places API (New)** if you add a server-side key and Place ID (profile photos are **not** always exposed the same way as in the Maps UI). For **photos**, the practical approach is to save each avatar from the Maps / Business Profile UI into `images/` and name the files to match the rows below.

---

## Quick reference — image paths

All local photos are under **`images/`** (relative to this file). Example: `./images/reviewer-01.jpg`.

| # | Reviewer | Date (relative) | Local image |
|---|----------|-----------------|-------------|
| 01 | Marisol V. | 3 weeks ago | `./images/reviewer-01.jpg` *(save avatar from GBP or copy from Sanity asset)* |
| 02 | Derrick L. | 5 weeks ago | `./images/reviewer-02.jpg` |
| 03 | Priya S. | 2 months ago | `./images/reviewer-03.jpg` |
| 04 | Calvin R. | 4 months ago | `./images/reviewer-04.jpg` |
| 05 | Shane White | *TBD — add from GBP* | `./images/reviewer-05.jpg` |
| 06 | Maximilian Feeney | *TBD* | `./images/reviewer-06.jpg` |
| 07 | Alex Witkowicz | *TBD* | `./images/reviewer-07.jpg` |
| 08 | Michael Tinker | *TBD* | `./images/reviewer-08.jpg` |
| 09 | Michael McCausey | *TBD* | `./images/reviewer-09.jpg` |
| 10–20 | *Fill from GBP (5★ only)* | *from Maps* | `./images/reviewer-10.jpg` … `./images/reviewer-20.jpg` |

---

## Entries from Sanity CMS (website testimonials)

These match **`homePageSingleton` → `reviews.testimonials`** (used on the live site). They are **not** a full export of Google Business Profile; use them as structured copy until GBP rows are pasted in below.

**Sanity avatar paths (for Studio / dev):** files live under paths like `Media (MHG)/Reviews (MHG)/…` — copy those assets into `images/reviewer-0N.jpg` if you want this folder to be self-contained.

### 01 — Marisol V.

- **Reviewer name:** Marisol V.  
- **Date (relative):** 3 weeks ago  
- **Stars:** 5 *(as used on site — verify on GBP)*  
- **Quote:** They re-leveled our back run before hurricane season and the downspouts finally clear the pool deck. Communication from the Seffner office was clear every step of the way.  
- **Local profile image:** `./images/reviewer-01.jpg`  
- **Sanity `avatarSrc`:** `Media (MHG)/Reviews (MHG)/Alex Witkowicz.png`  
- **Sanity `avatarLocation`:** Headshot on file — homeowner near Westchase  

### 02 — Derrick L.

- **Reviewer name:** Derrick L.  
- **Date (relative):** 5 weeks ago  
- **Stars:** 5  
- **Quote:** Our live oak dumps leaves straight into the old gutters. SunLife swapped in guards that still move serious rain—no more midnight overflow during Tampa thunderstorms.  
- **Local profile image:** `./images/reviewer-02.jpg`  
- **Sanity `avatarSrc`:** `Media (MHG)/Reviews (MHG)/Maximilian Feeney.png`  
- **Sanity `avatarLocation`:** Headshot on file — homeowner in Riverview  

### 03 — Priya S.

- **Reviewer name:** Priya S.  
- **Date (relative):** 2 months ago  
- **Stars:** 5  
- **Quote:** Salt air chewed through our fascia boards. The crew replaced fascia, matched paint, and tied the gutters into buried drains—finished ahead of the quoted window.  
- **Local profile image:** `./images/reviewer-03.jpg`  
- **Sanity `avatarSrc`:** `Media (MHG)/Reviews (MHG)/Michael Tinker.png`  
- **Sanity `avatarLocation`:** Headshot on file — homeowner near St. Pete Beach  

### 04 — Calvin R.

- **Reviewer name:** Calvin R.  
- **Date (relative):** 4 months ago  
- **Stars:** 5  
- **Quote:** Straightforward estimate, no upsell drama. Install day was tidy and the new seamless color blends with our stucco—exactly what we wanted before rainy season.  
- **Local profile image:** `./images/reviewer-04.jpg`  
- **Sanity `avatarSrc`:** `Media (MHG)/Reviews (MHG)/Michael McCausey.png`  
- **Sanity `avatarLocation`:** Headshot on file — homeowner in Brandon  

---

## Legacy archive — five 5★ reviews (text only, from `Reviews (MHG).rtf`)

Source file in repo: `astro-site/public/Media (AAGF)/Reviews (MHG)/Reviews (MHG).rtf`  
These lines are **not** pulled live from Google; they are legacy marketing copy. **Relative dates** were not in the RTF — add them when you verify each review on GBP. **Profile photos** are not in this repo; save into `images/reviewer-05.jpg` … `reviewer-09.jpg` when you have them.

### 05 — Shane White

- **Stars:** 5  
- **Date (relative):** *Add from GBP*  
- **Quote:** I had a wonderful experience with SunLife Gutters Tampa Company from start to finish. Their communication was excellent clear, timely, and professional every step of the way. They were very responsive to questions and made the entire process easy and stress-free. The pricing was fair and reasonable, especially for the quality of work provided. The team was punctual, efficient, and paid great attention to detail. Beyond that, they were genuinely a joy to work with friendly, respectful, and clearly took pride in their work. It’s refreshing to work with a company that delivers exactly what they promise and makes the experience so positive. I would absolutely recommend SunLife Gutters Tampa Company and wouldn’t hesitate to work with them again.  
- **Local profile image:** `./images/reviewer-05.jpg`  

### 06 — Maximilian Feeney

- **Stars:** 5  
- **Date (relative):** *Add from GBP*  
- **Quote:** We had our gutters replaced by SunLife Gutters Tampas and couldn’t be happier. The team was professional, quick, and did excellent work. Everything looks great and functions perfectly. Highly recommend!  
- **Local profile image:** `./images/reviewer-06.jpg`  

### 07 — Alex Witkowicz

- **Stars:** 5  
- **Date (relative):** *Add from GBP*  
- **Quote:** Great experience overall. The front desk called me back quickly after my initial inquiry, and the estimator came out the next day to look at our house. When the install team was scheduled, they showed up right on time, and most importantly the quality of the work appears very high. The pricing was very fair as well.  
- **Local profile image:** `./images/reviewer-07.jpg`  

### 08 — Michael Tinker

- **Stars:** 5  
- **Date (relative):** *Add from GBP*  
- **Quote:** My house had a tricky drainage situation, so I gave Mile High a rather elaborate gutter request and they made it look beautiful. They even came back the next day to make sure it was perfect. On top of that, they gave me a good deal. I sincerely recommend SunLife Gutters Tampas.  
- **Local profile image:** `./images/reviewer-08.jpg`  

### 09 — Michael McCausey

- **Stars:** 5  
- **Date (relative):** *Add from GBP*  
- **Quote:** I needed gutters put on my new addition. I did research and decided on SunLife Gutters Tampa. Ken came out and answered all of my questions about downspout locations, how they would tie into my existing gutters, material choice and color. Then gave me a quote I was happy with. I wasn't able to be home when Landon and Daniel came to install them. I was very happy with their work when I got home. Ken, Landon, Daniel, and the office personell made the whole process a pleasure, something that is increasingly hard to find. I highly recommend them.  
- **Local profile image:** `./images/reviewer-09.jpg`  

---

## Slots 10–20 — fill from Google Business Profile (5★ only)

For each review on Google:

1. Confirm **5 stars**.  
2. Copy **reviewer display name** and **relative time** (“2 weeks ago”) as shown on Google.  
3. Optionally note **absolute date** if Google shows it.  
4. Paste the **review text**.  
5. Save the **profile photo** into `images/reviewer-NN.jpg`.  
6. Fill the matching row in **`reviews-export-template.csv`**.

| # | Reviewer name | Relative date | Absolute date (optional) | Quote | Local image |
|---|---------------|-----------------|---------------------------|-------|-------------|
| 10 | *TBD* | *TBD* | | | `./images/reviewer-10.jpg` |
| 11 | *TBD* | *TBD* | | | `./images/reviewer-11.jpg` |
| 12 | *TBD* | *TBD* | | | `./images/reviewer-12.jpg` |
| 13 | *TBD* | *TBD* | | | `./images/reviewer-13.jpg` |
| 14 | *TBD* | *TBD* | | | `./images/reviewer-14.jpg` |
| 15 | *TBD* | *TBD* | | | `./images/reviewer-15.jpg` |
| 16 | *TBD* | *TBD* | | | `./images/reviewer-16.jpg` |
| 17 | *TBD* | *TBD* | | | `./images/reviewer-17.jpg` |
| 18 | *TBD* | *TBD* | | | `./images/reviewer-18.jpg` |
| 19 | *TBD* | *TBD* | | | `./images/reviewer-19.jpg` |
| 20 | *TBD* | *TBD* | | | `./images/reviewer-20.jpg` |

---

## Aggregate rating (from CMS snapshot)

From **`homePageSingleton` → `reviews.reviewValues`:** rating **4.9** and **200** reviews (update if GBP numbers change).

---

*Last updated: 2026-03-30 — folder created; slots 05–20 await manual GBP export or API-backed text import.*
