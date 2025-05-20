"use client"

import { ReactNode } from "react"

interface PageHeaderProps {
  children?: ReactNode
}

export function PageHeader({ children }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-1 pb-4 md:flex-row md:items-center md:justify-between">
      {children && (
        <div className={`mt-2 flex items-center gap-2 md:mt-0`}>
          {children}
        </div>
      )}
    </div>
  )
} 