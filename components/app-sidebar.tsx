"use client"

import * as React from "react"
import {
  IconLemon,
  IconChartBar,
  IconDashboard,
  IconActivity,
  IconReport,
  IconSettings,
  type Icon
} from "@tabler/icons-react"

import { NavMain, type Organization } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"

export type UserData = {
  name: string
  email: string
  avatar: string
}

export type NavItem = {
  title: string
  url: string
  icon: string
}

export const iconMap: Record<string, Icon> = {
  dashboard: IconDashboard,
  activity: IconActivity,
  report: IconReport,
  chartBar: IconChartBar,
  settings: IconSettings,
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  userData: UserData
  navItems: NavItem[]
  organizations: Organization[]
}

export function AppSidebar({ userData, navItems, organizations, ...props }: AppSidebarProps) {
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
        <NavMain items={navItems} organizations={organizations} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  )
}
