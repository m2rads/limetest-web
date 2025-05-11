import { createHmac, timingSafeEqual } from 'crypto'
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

const WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET

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

// Define a type for the webhook body to avoid using 'any'
interface WebhookBody {
  action?: string;
  installation?: {
    id: number;
  };
  repository?: {
    full_name: string;
  };
  [key: string]: unknown;
}

export async function POST(request: Request) {
  console.log('GitHub webhook received!', new Date().toISOString());
  
  try {
    const signature = request.headers.get('x-hub-signature-256');
    if (!signature) {
      console.error('❌ No signature provided in webhook');
      return NextResponse.json({ error: 'No signature provided' }, { status: 401 });
    }

    const payload = await request.text();
    
    // Verify signature before processing content
    if (!verifyGitHubWebhook(payload, signature)) {
      console.error('❌ Invalid signature in webhook');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }
    
    let body: WebhookBody = {};
    const githubEvent = request.headers.get('x-github-event');
    
    try {
      body = JSON.parse(payload) as WebhookBody;
      console.log(`✅ Webhook verified: ${githubEvent}, action: ${body.action || 'none'}`);
    } catch {
      console.error('❌ Error parsing webhook payload');
      return NextResponse.json({ error: 'Invalid payload format' }, { status: 400 });
    }
    
    switch (githubEvent) {
      case 'installation':        
        if (body.action === 'deleted') {
          const installationId = body.installation?.id.toString();
          if (!installationId) {
            console.error('❌ Missing installation ID in webhook payload');
            return NextResponse.json({ error: 'Invalid payload format' }, { status: 400 });
          }
          
          console.log(`🗑️ GitHub App uninstalled from installation ${installationId}`);
          
          try {
            const supabase = await createClient();
            
            const { data: affectedRows } = await supabase.rpc(
              'delete_github_connection',
              { p_installation_id: installationId }
            );
            
            if (affectedRows) {
              console.log(`✅ Installation ${installationId} uninstalled successfully`);
              if (affectedRows.updated > 0) {
                console.log(`   New active connection set for user`);
              }
              revalidatePath('/dashboard');
            }
          } catch {
            console.error('❌ Error processing uninstallation');
          }
        }
        break;
        
      case 'push':
        // Log minimal information about the push event
        console.log('Push event received');
        break;
        
      default:
        console.log(`Received webhook: ${githubEvent}`);
    }

    return NextResponse.json({ success: true });
  } catch {
    console.error('Error processing webhook');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 