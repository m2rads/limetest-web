"use client"

import * as React from "react"
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
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
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
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
