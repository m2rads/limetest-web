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

- Actions: Read & write
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

7. Next add the name of your Github app to your `.env.local` file: 
```
GITHUB_APP_NAME=lime-test
```

# Add your GitHub App Private Key:
In order to act on behalf of your GitHub app, you need to create a private key when setting up your app. You need to add this 
private key to your `env.local` this way: 

1. Start with your original PEM file
This is your standard private key file that looks like:

```
-----BEGIN RSA PRIVATE KEY-----
MIIEogIBAAKCAQEAuvhXnq...
(many lines of base64 content)
...gIt5dsqY20U/ck7CE9tJYX
-----END RSA PRIVATE KEY-----
```

2. Remove the headers and line breaks
Extract just the content between the BEGIN and END lines, removing all line breaks:
`MIIEogIBAAKCAQEAuvhXnq...gIt5dsqY20U/ck7CE9tJYX`

3. Base64 encode this content
Use the command line to encode this content:
```bash
echo -n "MIIEogIBAAKCAQEAuvhXnq...gIt5dsqY20U/ck7CE9tJYX" | base64
```
This will give you a single line of base64-encoded text like:
`TUlJRW9nSUJBQUtDQVFFQXV2aFhucS4uLmdJdDVkc3FZMjBVL2NrN0NFOXRKWVg=`

4. Add this to Vercel as `GITHUB_APP_PRIVATE_KEY_BASE64`
In your Vercel environment variables, add:
`GITHUB_APP_PRIVATE_KEY_BASE64=TUlJRW9nSUJBQUtDQVFFQXV2aFhucS4uLmdJdDVkc3FZMjBVL2NrN0NFOXRKWVg=`


For local development and your GIthub App Webhook, you can use a tool like [ngrok](https://ngrok.com/) to expose your local server to the internet or deploy to Vercel:

```bash
ngrok http 3000
```
