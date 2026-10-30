# Daily Grind · Testimony demo shop

A tiny coffee shop with a real bug, used to demo [Testimony](https://dsplce.co): capture the bug in the browser, send it to GitHub, and let Claude open a fix PR.

## The bug

Add a coffee to the cart, type a discount code that doesn't exist (for example `WELCOME`) and press **Apply**. The page crashes with:

```
TypeError: Cannot read properties of undefined (reading 'percent')
```

Valid codes are `SAVE10` and `COFFEE20`.

## Demo flow

1. Open the shop with the Testimony extension installed and start a recording (or use Instant Replay).
2. Reproduce the bug above and stop the recording.
3. In the review, check the title and description Claude drafted, upload, then **Send to GitHub → Create issue + open fix PR**.
4. The issue gets the `testimony:fix` label, which starts the **Testimony fix** workflow.
5. Claude reads the issue, fixes `applyDiscount`, adds a test and opens a draft PR that says `Fixes #<issue>`.

## Setup

1. Install the [Claude GitHub App](https://github.com/apps/claude) on this repository.
2. Add an `ANTHROPIC_API_KEY` repository secret.
3. In **Settings → Actions → General**, allow GitHub Actions to create pull requests.

## Development

```bash
npm install
npm run dev
npm test
```
