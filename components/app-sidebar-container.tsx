import { AppSidebar, type NavItem } from "./app-sidebar"
import type { ComponentProps } from "react"
import { fetchUserGitHubOrganizations, fetchUserProfileData } from "@/lib/github/actions"

const defaultNavItems: NavItem[] = [
  {
    title: "Performance",
    url: "/performance",
    icon: "dashboard",
  },
  // {
  //   title: "Quality",
  //   url: "#",
  //   icon: "activity",
  // },
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

type AppSidebarContainerProps = Omit<ComponentProps<typeof AppSidebar>, 'userData' | 'navItems' | 'organizations'>

export async function AppSidebarContainer(props: AppSidebarContainerProps) {
  const navItems = defaultNavItems
  
  try {
    const userData = await fetchUserProfileData()
    const organizations = await fetchUserGitHubOrganizations()
    
    return <AppSidebar 
      userData={userData} 
      navItems={navItems} 
      organizations={organizations} 
      {...props} 
    />
  } catch (error) {
    console.error("Error fetching data:", error)
    
    return <AppSidebar 
      userData={{name: "Guest", email: "", avatar: ""}} 
      navItems={navItems} 
      organizations={[]} 
      {...props} 
    />
  }
} 