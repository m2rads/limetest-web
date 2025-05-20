"use client"

import { useEffect, useState } from "react"
import { Avatar } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useOrgContext } from "@/lib/context/org-context"

export function OrganizationDisplay() {
  const { activeOrg, isLoading, lastUpdated } = useOrgContext()

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Active Organization</CardTitle>
          <CardDescription>The GitHub organization you're currently working with</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!activeOrg) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">No Organization Connected</CardTitle>
          <CardDescription>Please connect a GitHub organization to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            You need to install the GitHub App and select an organization to use this feature.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Active Organization</CardTitle>
        <CardDescription>The GitHub organization you're currently working with</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 rounded-full">
            {activeOrg.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img 
                src={activeOrg.avatar_url} 
                alt={activeOrg.name} 
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                {activeOrg.name.charAt(0)}
              </div>
            )}
          </Avatar>
          <div>
            <h3 className="font-medium">{activeOrg.name}</h3>
            <p className="text-xs text-muted-foreground">GitHub Organization</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 