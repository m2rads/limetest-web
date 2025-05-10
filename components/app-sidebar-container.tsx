import { createClient } from "@/lib/supabase/server"
import { AppSidebar, type NavItem, type UserData } from "./app-sidebar"
import type { ComponentProps } from "react"

const defaultNavItems: NavItem[] = [
  {
    title: "Performance",
    url: "#",
    icon: "dashboard",
  },
  {
    title: "Quality",
    url: "#",
    icon: "activity",
  },
  {
    title: "Reports",
    url: "#",
    icon: "report",
  },
  {
    title: "Billing",
    url: "#",
    icon: "chartBar",
  },
  {
    title: "Settings",
    url: "#",
    icon: "settings",
  }
]

const defaultUserData: UserData = {
  name: "Guest",
  email: "",
  avatar: ""
}

type AppSidebarContainerProps = Omit<ComponentProps<typeof AppSidebar>, 'userData' | 'navItems'>

export async function AppSidebarContainer(props: AppSidebarContainerProps) {
  let userData = defaultUserData
  const navItems = defaultNavItems

  try {
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('username, full_name, avatar_url')
        .eq('id', user.id)
        .single()
      
      if (profile) {
        userData = {
          name: profile.full_name || profile.username || user.email?.split('@')[0] || 'User',
          email: user.email || '',
          avatar: profile.avatar_url || ''
        }
      } else {
        const metadata = user.user_metadata || {}
        
        userData = {
          name: metadata.name || metadata.user_name || metadata.login || user.email?.split('@')[0] || 'User',
          email: user.email || '',
          avatar: metadata.avatar_url || ''
        }
      }
    }
  } catch (error) {
    console.error("Error fetching user data:", error)
    // TODO: Handle error
    // Use default user data on error
  }

  return <AppSidebar userData={userData} navItems={navItems} {...props} />
} 