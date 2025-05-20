import { AppSidebarContainer } from "@/components/app-sidebar-container"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset } from "@/components/ui/sidebar"
import { RunnerCreation } from "@/components/repositories/runner-creation"

export default function RunnersPage() {
  return (
    <>
      <AppSidebarContainer variant="inset" />
      <SidebarInset>
        <SiteHeader title="Self-Hosted Runners" />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
              <RunnerCreation />
            </div>
          </div>
        </div>
      </SidebarInset>
    </>
  )
}
