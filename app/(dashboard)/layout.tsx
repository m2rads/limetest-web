"use client"

import React from 'react'
import { SidebarProvider } from "@/components/ui/sidebar"
import { OrgContextProvider, useOrgContext } from '@/lib/context/org-context'
import { Loader2 } from 'lucide-react'

// Loading overlay component
function LoadingOverlay() {
  const { isLoading } = useOrgContext()
  
  if (!isLoading) return null
  
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Updating organization data...</p>
      </div>
    </div>
  )
}

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <>
      <LoadingOverlay />
      {children}
    </>
  )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <OrgContextProvider>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <DashboardLayoutContent>
          {children}
        </DashboardLayoutContent>
      </SidebarProvider>
    </OrgContextProvider>
  )
} 