# Alkansya

![Vercel](https://therealsujitk-vercel-badge.vercel.app/?app=alkansya)

## Introduction

Alkansya is a web app aiming to help users easily keep track of their expenses and income.

### Tech Stack

-   Sveltekit
-   Firebase
-   Tailwind CSS
-   PNPM
-   Vercel

### Web Preview

Alkansya is hosted on netlify at https://alkansya.vercel.app/

## Development

### Requirements

-   Node v16.x or greater
-   [pnpm](https://pnpm.io/installation)

### Get Started

1. Clone the repository
2. Run `pnpm install`
3. Run `pnpm dlx husky install`
4. Create a .env file at the project root and add in the following from firebase:
    - Firebase admin:
        - `WEB_API_KEY`
        - `PROJECT_ID`
        - `PRIVATE_KEY_ID`
        - `PRIVATE_KEY`
        - `CLIENT_EMAIL`
        - `CLIENT_ID`
        - `CLIENT_X509_CERT_URL`
    - Firebase client:
        - `VITE_API_KEY`
        - `VITE_AUTH_DOMAIN`
        - `VITE_STORAGE_BUCKET_ID`
        - `VITE_MESSAGING_SENDER_ID`
        - `VITE_APP_ID`
        - `VITE_MEASUREMENT_ID`
