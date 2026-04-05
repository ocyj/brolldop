# Brölldop

Wedding website with password-protected content and RSVP.

**Live site:** https://ocyj.github.io/brolldop/

## Local development

```bash
npx serve .
```

On localhost the password gate is bypassed and `data/source.json` is loaded directly.

## Encrypting data

Sensitive content (names, addresses, times) lives in `data/source.json` (gitignored) and is encrypted via [brollobfuscate](https://github.com/ocyj/brollobfuscate).

After editing `data/source.json`:

1. Run the brollobfuscate CLI to encrypt.
2. Update the Gist with the new encrypted `data.json`.
3. Save the encrypted envelope to `url-envelope.json` in the repo root (loaded automatically at runtime).

## RSVP

The RSVP form posts to a Google Apps Script web app. The endpoint URL is stored in `data/source.json` under `rsvpEndpoint` and delivered to the browser via brollobfuscate.

`Code.gs` is the Apps Script source. Deploy as: Web app → Execute as Me → Access: Anyone.

## Deployment

The site is published via GitHub Pages from the `main` branch root. Push to `main` to deploy.
