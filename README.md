This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started
### Supabase Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)

2. Add environment variables to `.env.local`:


First, run the development server:

```bash
pnpm dev
```

### GitHub App Setup

1. Create a GitHub App at github.com/settings/apps/new with these permissions:

- Actions: Read-only
- Checks: Read-only  
- Workflows: Read & write
- Contents: Read-only
- Metadata: Read-only

2. Subscribe to these webhook events:

Required:
- Workflow job
- Workflow run  
- Check run
- Workflow dispatch
- Repository dispatch
- Meta

3. Generate a webhook secret:

```bash
# On macOS/Linux
openssl rand -hex 32

# On Windows with PowerShell
[Convert]::ToHexString((1..32 | ForEach-Object { [byte](Get-Random -Minimum 0 -Maximum 256) }))
```

4. Add the generated secret to your GitHub App:
   - In the "Webhook" section of your GitHub App settings
   - Paste the generated secret into the "Webhook Secret" field
   - Save changes

5. Add the same secret to your `.env.local` file:

```
GITHUB_WEBHOOK_SECRET=your_generated_secret
```

6. Set the Webhook URL in GitHub to:

```
https://your-domain.com/api/github/webhook
```

For local development, you can use a tool like [ngrok](https://ngrok.com/) to expose your local server to the internet or deploy to Vercel:

```bash
ngrok http 3000
```
