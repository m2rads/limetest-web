import { getGitHubInstallationData, saveGitHubConnection } from "@/lib/github/actions"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const installationId = url.searchParams.get('installation_id')
  
  if (!installationId) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  try {
    const installationData = await getGitHubInstallationData(installationId)
    const account = installationData.data.account
    
    // TODO: Handle the case where the account is not found insaide dashboard page
    if (!account) {
      return NextResponse.redirect(new URL('/dashboard?error=installation_failed', request.url))
    }
    
    const formData = new FormData()
    formData.append('installation_id', installationId)
    formData.append('org_id', account.id.toString())
    formData.append('org_name', 'login' in account ? account.login : account.name)
    formData.append('org_avatar', account.avatar_url)
    
    const result = await saveGitHubConnection(formData)
    
    // TODO: Handle the case where the connection is not saved
    if (result.error) {
      return NextResponse.redirect(new URL(`/dashboard?error=${encodeURIComponent(result.error)}`, request.url))
    }
    
    // Redirect to dashboard with success message
    return NextResponse.redirect(new URL('/dashboard?success=installation_complete', request.url))
  } catch (error) {
    console.error('Error processing GitHub installation:', error)
    return NextResponse.redirect(new URL('/dashboard?error=installation_failed', request.url))
  }
} 