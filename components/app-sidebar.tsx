"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import {
  IconChartBar,
  IconDashboard,
  IconLemon,
  IconActivity,
  IconReport,
  IconSettings,
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { createClient } from "@/lib/supabase/client"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

// Default data as fallback
const defaultData = {
  navMain: [
    {
      title: "Performance",
      url: "#",
      icon: IconDashboard,
    },
    {
      title: "Quality",
      url: "#",
      icon: IconActivity,
    },
    {
      title: "Reports",
      url: "#",
      icon: IconReport,
    },
    {
      title: "Billing",
      url: "#",
      icon: IconChartBar,
    },
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    }
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [userData, setUserData] = useState({
    name: "Loading...",
    email: "",
    avatar: ""
  })

  useEffect(() => {
    async function fetchUserData() {
      try {
        const supabase = createClient()
        
        // Get the user from Supabase auth
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          setUserData({
            name: "Guest",
            email: "",
            avatar: ""
          })
          return
        }
        
        // First try the profiles table
        const { data: profile } = await supabase
          .from('profiles')
          .select('username, full_name, avatar_url')
          .eq('id', user.id)
          .single()
        
        if (profile) {
          setUserData({
            name: profile.full_name || profile.username || user.email?.split('@')[0] || 'User',
            email: user.email || '',
            avatar: profile.avatar_url || ''
          })
        } else {
          // Fall back to user metadata from auth
          const metadata = user.user_metadata || {}
          
          setUserData({
            name: metadata.name || metadata.user_name || metadata.login || user.email?.split('@')[0] || 'User',
            email: user.email || '',
            avatar: metadata.avatar_url || ''
          })
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
        // Keep the loading placeholder on error
      }
    }
    
    fetchUserData()
  }, [])

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
              <IconLemon 
                  size={20} 
                  className="text-lime-600 dark:text-lime-400 transition-transform duration-300 group-hover:rotate-12" 
                  stroke={1.5} 
                />
                <span className="text-base font-semibold">Limetest</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={defaultData.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  )
}
