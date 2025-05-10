"use client"

import { useState } from "react"
import { IconBrandGithub, IconChevronDown, IconLeaf, IconUser, type Icon } from "@tabler/icons-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

// Mock data for organizations
const organizations = [
  { id: 1, name: "lime-test", icon: IconLeaf },
  { id: 2, name: "m2rads", icon: IconUser },
]

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: Icon
  }[]
}) {
  const [currentOrg, setCurrentOrg] = useState(organizations[0])

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  tooltip="Select organization"
                  className="bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground active:bg-accent/90 active:text-accent-foreground min-w-8 duration-200 ease-linear justify-between"
                >
                  <div className="flex items-center gap-2">
                    {currentOrg.icon && <currentOrg.icon className="text-green-500" />}
                    <span>{currentOrg.name}</span>
                  </div>
                  <IconChevronDown className="h-4 w-4 opacity-70" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-52">
                {organizations.map((org) => (
                  <DropdownMenuItem key={org.id} onClick={() => setCurrentOrg(org)}>
                    <div className="flex items-center gap-2">
                      {org.icon && <org.icon className={org.name === "lime-test" ? "text-green-500" : "text-primary"} />}
                      <span>{org.name}</span>
                    </div>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <div className="flex items-center gap-2">
                    <IconBrandGithub />
                    <span>Add an organization</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton tooltip={item.title}>
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
