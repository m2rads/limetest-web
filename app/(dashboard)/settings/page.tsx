import { AppSidebarContainer } from "@/components/app-sidebar-container"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset } from "@/components/ui/sidebar"

export default function SettingsPage() {
  return (
    <>
      <AppSidebarContainer variant="inset" />
      <SidebarInset>
        <SiteHeader title="Settings" />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              {/* content goes here */}
            </div>
          </div>
        </div>
      </SidebarInset>
    </>
  )
}
