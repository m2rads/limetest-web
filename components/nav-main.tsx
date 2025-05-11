"use client"

import { useState, useTransition } from "react"
import { IconBrandGithub, IconChevronDown } from "@tabler/icons-react"
import { iconMap } from "./app-sidebar"
import { redirectToGitHubAppInstall, setActiveOrganization } from '@/lib/github/actions'
import { useRouter, usePathname } from "next/navigation"
import Image from "next/image"
import Link from "next/link"

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

export type Organization = {
  id: string | number;
  name: string;
  avatar_url?: string;
  is_active?: boolean;
}

export function NavMain({
  items,
  organizations = [],
}: {
  items: {
    title: string
    url: string
    icon: string
  }[];
  organizations: Organization[];
}) {
  // Find the active organization or default to the first one
  const activeOrg = organizations.find(org => org.is_active) || organizations[0]
  const [currentOrg, setCurrentOrg] = useState(activeOrg || null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const pathname = usePathname()

  function handleAddOrg() {
    startTransition(() => {
      redirectToGitHubAppInstall()
    })
  }

  async function handleSelectOrg(org: Organization) {
    if (org.id === currentOrg?.id) return

    startTransition(async () => {
      try {
        setCurrentOrg(org)
        
        if (typeof org.id === 'string') {
          const result = await setActiveOrganization(org.id)
          
          if (result.success) {
            router.refresh()
          } else {
            console.error('Failed to update active organization:', result.error)
          }
        }
      } catch (error) {
        console.error('Failed to update active organization:', error)
      }
    })
  }

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            {organizations.length > 0 ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    tooltip="Select organization"
                    className="bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground active:bg-accent/90 active:text-accent-foreground min-w-8 duration-200 ease-linear justify-between"
                  >
                    <div className="flex items-center gap-2">
                      {currentOrg?.avatar_url ? (
                        <div className="relative w-5 h-5 rounded-full overflow-hidden">
                          <Image 
                            src={currentOrg.avatar_url} 
                            alt={currentOrg.name} 
                            fill
                            sizes="20px"
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">
                          {currentOrg?.name?.charAt(0) || '?'}
                        </div>
                      )}
                      <span>{currentOrg?.name}</span>
                    </div>
                    <IconChevronDown className="h-4 w-4 opacity-70" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg">
                  {organizations.map((org) => (
                    <DropdownMenuItem 
                      key={org.id} 
                      onClick={() => handleSelectOrg(org)}
                      className={org.is_active ? "bg-accent/50" : ""}
                    >
                      <div className="flex items-center gap-2">
                        {org.avatar_url ? (
                          <div className="relative w-5 h-5 rounded-full overflow-hidden">
                            <Image 
                              src={org.avatar_url} 
                              alt={org.name}
                              fill
                              sizes="20px"
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">
                            {org.name.charAt(0)}
                          </div>
                        )}
                        <span>{org.name}</span>
                      </div>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleAddOrg} disabled={isPending}>
                    <div className="flex items-center gap-2">
                      <IconBrandGithub />
                      <span>{isPending ? 'Redirecting...' : 'Add an organization'}</span>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <SidebarMenuButton
                tooltip="Add GitHub organization"
                onClick={handleAddOrg}
                disabled={isPending}
              >
                <IconBrandGithub />
                <span>{isPending ? 'Redirecting...' : 'Connect GitHub organization'}</span>
              </SidebarMenuButton>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => {
            const Icon = item.icon ? iconMap[item.icon] : null;
            const isActive = pathname === item.url || 
                            (item.url !== '/' && item.url !== '#' && pathname?.startsWith(item.url));
            
            return (
              <SidebarMenuItem key={item.title}>
                <Link href={item.url !== '#' ? item.url : '#'} className="w-full">
                  <SidebarMenuButton 
                    tooltip={item.title}
                    className={isActive ? "bg-accent/70 text-accent-foreground" : ""}
                  >
                    {Icon && <Icon />}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
