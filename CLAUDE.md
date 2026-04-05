# CLAUDE.md

This project is a wedding website.

## Purpose

- Present useful information for wedding guests.
- Provide an RSVP form.
- Require guests to enter a password before viewing site content.
- Work well as a static website on both desktop and mobile.

## Priorities

- Move quickly and keep momentum.
- Favor simple static-site solutions over unnecessary complexity.
- Preserve a polished experience on phones and computers.
- Keep copy and visuals appropriate for a wedding website: warm, clear, and intentional.
- Keep private wedding details behind the site entry gate where practical.

## How to work here

- Focus first on guest-facing feature delivery.
- Ask before making major structural, architectural, or visual-direction changes.
- Update documentation when behavior, structure, or setup changes.
- Prefer small, practical changes that are easy to review.
- Treat privacy-sensitive guest information and event details carefully.

## Implementation guidance

- Assume deployment on GitHub Pages and favor solutions that work well on static hosting.
- Prioritize responsive layouts, readable typography, and fast loading.
- Treat the RSVP flow as a core feature and avoid breaking it.
- Preserve the password entry flow when changing routing, page load behavior, or shared layout code.
- Reuse existing patterns once they exist; do not introduce new frameworks or tooling without a clear reason.

## brollobfuscate

The password gate uses [brollobfuscate](https://github.com/ocyj/brollobfuscate) for client-side encryption. Sensitive content (addresses, venue names, times) is stored in an encrypted `data.json` hosted on a GitHub Gist, not in the HTML. The browser runtime (`decrypt.js`) is loaded via jsDelivr.

- `data/source.json` contains the plaintext sensitive data. It is **gitignored and must never be committed**.
- Elements with `data-brob="key"` attributes are populated from the decrypted data after the guest enters the password.
- The encrypted envelope is stored in `url-envelope.json` in the repo root and loaded automatically at runtime. Save the brollobfuscate CLI output there.
- On `localhost`, a dev bypass script skips encryption and loads `data/source.json` directly. Run `npx serve .` to develop locally.

## RSVP via Google Sheets

The RSVP form submits group/family RSVPs to a Google Sheet via a Google Apps Script web app.

- **Form flow:** Guests enter email, choose attending yes/no. If yes: add guests dynamically (name + diet), set extra kids count, message, and Peppade. If no: provide name.
- **Endpoint protection:** The Apps Script URL is stored in `data/source.json` under `rsvpEndpoint` and encrypted via brollobfuscate. A hidden `<span id="rsvp-endpoint" data-brob="rsvpEndpoint">` is populated after decryption.
- **Sheet structure (sheet name: "RSVP"):** Columns: Tidsstampel | E-post | Kommer | Extraungar dopfika | Meddelande | Peppade | Gästnamn | Kost | Kostdetalj. Each submission produces one submission-level row followed by one row per guest.
- **Google Apps Script:** `Code.gs` in the repo root is the source for the Apps Script. Deploy as web app (Execute as: Me, Access: Anyone). The client POSTs JSON with `Content-Type: text/plain` to avoid CORS preflight.
- **Dev/test:** The form always POSTs to whatever URL is in `rsvpEndpoint`. For local testing, point `source.json` at a test Apps Script deployment. Delete the test deployment before going live.
- **After changing `source.json`:** Re-run the brollobfuscate CLI, update the Gist, and save the new envelope to `url-envelope.json`.

## Definition of done

- Changes support the guest experience.
- Pages and interactions work on mobile and desktop.
- The password entry flow still works as intended.
- Any related docs are updated.
