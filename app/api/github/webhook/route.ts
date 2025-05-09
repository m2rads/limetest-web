import { createHmac, timingSafeEqual } from 'crypto'
import { NextResponse } from 'next/server'

// This secret should match what you set in the GitHub App settings
const WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET

/**
 * Verify that the webhook request is coming from GitHub by
 * checking the X-Hub-Signature-256 header
 */
function verifyGitHubWebhook(payload: string, signature: string): boolean {
  if (!WEBHOOK_SECRET) {
    console.error('GITHUB_WEBHOOK_SECRET is not set')
    return false
  }

  try {
    const hmac = createHmac('sha256', WEBHOOK_SECRET)
    const digest = 'sha256=' + hmac.update(payload).digest('hex')
    const checksum = Buffer.from(digest, 'utf8')
    const signatureBuffer = Buffer.from(signature, 'utf8')
    return timingSafeEqual(checksum, signatureBuffer)
  } catch (error) {
    console.error('Error verifying webhook signature:', error)
    return false
  }
}

export async function POST(request: Request) {
  try {
    // Get the signature from the headers
    const signature = request.headers.get('x-hub-signature-256')
    if (!signature) {
      return NextResponse.json({ error: 'No signature provided' }, { status: 401 })
    }

    // Get the webhook payload
    const payload = await request.text()
    
    // Verify the signature
    if (!verifyGitHubWebhook(payload, signature)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    // Parse the body and get the event type
    const body = JSON.parse(payload)
    const githubEvent = request.headers.get('x-github-event')

    console.log(`Received GitHub webhook event: ${githubEvent}`)

    // Handle different event types
    switch (githubEvent) {
      case 'installation':
        // Handle app installation/uninstallation
        console.log('App installation event:', body.action)
        break
        
      case 'push':
        // Handle push events
        console.log('Push event to:', body.repository.full_name)
        break
        
      // Add more event handlers as needed
      
      default:
        console.log(`Unhandled event type: ${githubEvent}`)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 