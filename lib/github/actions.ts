'use server';

import { App } from "@octokit/app"
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { loadGitHubPrivateKey } from '@/lib/github/utils'

export async function redirectToGitHubAppInstall() {
  const appName = process.env.GITHUB_APP_NAME  
  redirect(`https://github.com/apps/${appName}/installations/new`)
}

/**
 * Get the authenticated user from Supabase
 * @returns The authenticated user or null if not authenticated
 */
async function getAuthenticatedUser() {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error("Authentication error:", error);
      return null;
    }
    
    return data.user;
}  

export async function getGitHubInstallationData(installationId: string) {
  console.log('Getting installation data for ID:', installationId);
  
  try {
    const appId = process.env.GITHUB_APP_ID;
    const privateKey = loadGitHubPrivateKey();
    
    if (!appId || !privateKey) {
      throw new Error('GitHub App credentials not configured properly');
    }
        
    const app = new App({
      appId,
      privateKey,
    });
    
    const octokit = await app.getInstallationOctokit(parseInt(installationId));
    
    const { data } = await octokit.request('GET /app/installations/{installation_id}', {
      installation_id: parseInt(installationId)
    });
    
    return { data };
  } catch (error) {
    console.error('Error fetching installation data:', error);
    throw error;
  }
}

export async function saveGitHubConnection(formData: FormData): Promise<{ success?: string; error?: string }> {
  const installationId = formData.get('installation_id') as string
  const orgId = formData.get('org_id') as string
  const orgName = formData.get('org_name') as string
  const orgAvatar = formData.get('org_avatar') as string
  
  if (!installationId || !orgId || !orgName) {
    return { error: 'Missing required information' }
  }
  
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { error: 'User not authenticated' }
    }
    
    // First set all existing connections to inactive to avoid multiple active connections
    const { error: resetError } = await supabase
      .from('github_connections')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('user_id', user.id)
    
    if (resetError) {
      console.error('Error resetting active status:', resetError)
      // Continue anyway, we'll try to set the correct one
    }
    
    // Check if connection already exists
    const { data: existingConnection } = await supabase
      .from('github_connections')
      .select('id')
      .eq('user_id', user.id)
      .eq('github_org_id', orgId)
      .single()
    
    if (existingConnection) {
      // Update existing connection
      const { error } = await supabase
        .from('github_connections')
        .update({
          github_installation_id: installationId,
          github_org_name: orgName,
          github_org_avatar_url: orgAvatar,
          is_active: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingConnection.id)
      
      if (error) {
        console.error('Error updating connection:', error)
        return { error: error.message }
      }
    } else {
      // Create new connection
      const { error } = await supabase
        .from('github_connections')
        .insert({
          user_id: user.id,
          github_org_id: orgId,
          github_org_name: orgName,
          github_org_avatar_url: orgAvatar,
          github_installation_id: installationId,
          is_active: true
        })
      
      if (error) {
        console.error('Error creating connection:', error)
        return { error: error.message }
      }
    }
    
    revalidatePath('/dashboard')    
    return { success: 'GitHub connection saved successfully' }
  } catch (error) {
    console.error('Error saving GitHub connection:', error)
    return { error: 'Failed to save connection' }
  }
}

/**
 * Fetches user profile data from Supabase
 * @returns User profile data formatted for UI
 */
export async function fetchUserProfileData() {
  try {
    const user = await getAuthenticatedUser();
    
    if (!user) {
      return {
        name: "Guest",
        email: "",
        avatar: ""
      };
    }

    const supabase = await createClient();
    
    // First try to get profile from profiles table
    const { data: profile } = await supabase
      .from('profiles')
      .select('username, full_name, avatar_url')
      .eq('id', user.id)
      .single();
    
    if (profile) {
      return {
        name: profile.full_name || profile.username || user.email?.split('@')[0] || 'User',
        email: user.email || '',
        avatar: profile.avatar_url || ''
      };
    } else {
      // Fallback to metadata if no profile exists
      const metadata = user.user_metadata || {};
      
      return {
        name: metadata.name || metadata.user_name || metadata.login || user.email?.split('@')[0] || 'User',
        email: user.email || '',
        avatar: metadata.avatar_url || ''
      };
    }
  } catch (error) {
    console.error("Error fetching user profile data:", error);
    return {
      name: "Guest",
      email: "",
      avatar: ""
    };
  }
}

/**
 * Fetches all GitHub organizations connected to the current user
 * @returns Array of GitHub organizations with their active status
 */
export async function fetchUserGitHubOrganizations() {
  try {
    const user = await getAuthenticatedUser();
    
    if (!user) {
      return [];
    }
    
    const supabase = await createClient();
    
    const { data: githubConnections, error } = await supabase
      .from('github_connections')
      .select('*')
      .eq('user_id', user.id);
    
    if (error) {
      console.error("Error fetching GitHub connections:", error);
      return [];
    }
    
    if (!githubConnections || githubConnections.length === 0) {
      return [];
    }
    
    // Transform the connections to the expected Organization format
    return githubConnections.map(conn => ({
      id: conn.id,
      name: conn.github_org_name,
      avatar_url: conn.github_org_avatar_url,
      is_active: conn.is_active
    }));
  } catch (error) {
    console.error("Error fetching GitHub organizations:", error);
    return [];
  }
}

/**
 * Sets a GitHub organization as the active one for the current user
 * @param orgId The ID of the organization to set as active
 * @returns Success status and any error message
 */
export async function setActiveOrganization(orgId: string): Promise<{success: boolean; error?: string}> {
  try {
    const user = await getAuthenticatedUser();
    
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }
    
    const supabase = await createClient();
    
    // First, set all connections for this user to inactive
    const { error: resetError } = await supabase
      .from('github_connections')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('user_id', user.id);
      
    if (resetError) {
      console.error('Error resetting active organizations:', resetError);
      return { success: false, error: 'Failed to update organizations' };
    }
    
    // Then set the selected organization as active
    const { error } = await supabase
      .from('github_connections')
      .update({ is_active: true, updated_at: new Date().toISOString() })
      .eq('id', orgId);
    
    if (error) {
      console.error('Error setting active organization:', error);
      return { success: false, error: 'Failed to set active organization' };
    }
    
    // Revalidate relevant paths to update UI across the app
    revalidatePath('/dashboard');
    
    return { success: true };
  } catch (error) {
    console.error('Error setting active organization:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

/**
 * Gets the currently active GitHub organization for the user
 * @returns The active organization or null if none is active
 */
export async function getActiveOrganization() {
  try {
    const user = await getAuthenticatedUser();
    
    if (!user) {
      return null;
    }
    
    const supabase = await createClient();
    
    // Get the active organization
    const { data, error } = await supabase
      .from('github_connections')
      .select('id, github_org_name, github_org_avatar_url')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single();
    
    if (error || !data) {
      return null;
    }
    
    return {
      id: data.id,
      name: data.github_org_name,
      avatar_url: data.github_org_avatar_url,
      is_active: true
    };
  } catch (error) {
    console.error('Error getting active organization:', error);
    return null;
  }
}

