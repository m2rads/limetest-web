"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { getActiveOrganization } from "@/lib/github/actions"

export type Organization = {
  id: string
  name: string
  avatar_url: string | null
  installation_id?: string
  is_active: boolean
}

interface OrgContextType {
  activeOrg: Organization | null
  isLoading: boolean
  refreshOrg: () => Promise<void>
  lastUpdated: number
}

const OrgContext = createContext<OrgContextType>({
  activeOrg: null,
  isLoading: false,
  refreshOrg: async () => {},
  lastUpdated: 0
})

export const useOrgContext = () => useContext(OrgContext)

export function OrgContextProvider({ children }: { children: ReactNode }) {
  const [activeOrg, setActiveOrg] = useState<Organization | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(Date.now())

  const refreshOrg = async () => {
    setIsLoading(true)
    try {
      const org = await getActiveOrganization()
      setActiveOrg(org)
      setLastUpdated(Date.now())
    } catch (error) {
      console.error("Failed to load active organization:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Load organization data on initial mount
  useEffect(() => {
    refreshOrg()
  }, [])

  // Set up interval to poll for organization changes
  useEffect(() => {
    // Check for organization changes every 10 seconds
    const intervalId = setInterval(() => {
      // Only check if not already loading
      if (!isLoading) {
        const checkForChanges = async () => {
          try {
            const org = await getActiveOrganization()
            
            // If organization changed, update state
            if (org?.id !== activeOrg?.id) {
              setActiveOrg(org)
              setLastUpdated(Date.now())
            }
          } catch (error) {
            console.error("Failed to check for organization changes:", error)
          }
        }
        
        checkForChanges()
      }
    }, 10000) // Check every 10 seconds
    
    return () => clearInterval(intervalId)
  }, [activeOrg, isLoading])

  return (
    <OrgContext.Provider value={{ activeOrg, isLoading, refreshOrg, lastUpdated }}>
      {children}
    </OrgContext.Provider>
  )
} 