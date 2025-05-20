import { AppSidebarContainer } from "@/components/app-sidebar-container"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset } from "@/components/ui/sidebar"
import { RepositoryModal } from "@/components/repositories/repository-modal"

export default function RunnersPage() {
  return (
    <>
      <AppSidebarContainer variant="inset" />
      <SidebarInset>
        <SiteHeader title="Runners" />
        <div className="flex flex-1 flex-col">
          <div className="p-4 md:p-6 flex flex-col h-full">
            <div className="w-full h-full flex flex-col">
              <div className="flex justify-end mb-8">
                <RepositoryModal />
              </div>
              
              {/* TODO: Runner list will go here in the future */}
              <div className="flex-1 flex items-center justify-center">
                <div className="p-8 text-center text-muted-foreground max-w-2xl">
                  No runners configured yet. Click "Add Runner" to get started.
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </>
  )
}
