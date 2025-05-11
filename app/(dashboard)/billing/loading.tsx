import { AppSidebarContainer } from "@/components/app-sidebar-container"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset } from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"

export default function BillingLoading() {
  return (
    <>
      <AppSidebarContainer variant="inset" />
      <SidebarInset>
        <SiteHeader title="Billing & Plans" />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <Skeleton className="h-[180px] rounded-lg" />
                  <Skeleton className="h-[180px] rounded-lg" />
                  <Skeleton className="h-[180px] rounded-lg" />
                </div>
                <Skeleton className="h-[320px] rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </>
  )
} 