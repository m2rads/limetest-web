"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { RepositorySearch, Repository } from "./repository-search"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PlusCircle } from "lucide-react"

export function RepositoryModal() {
  const [open, setOpen] = useState(false)
  const [selectedRepository, setSelectedRepository] = useState<Repository | null>(null)
  const [prTitle, setPrTitle] = useState("")
  const [loading, setLoading] = useState(false)

  const handleRepositorySelect = (repo: Repository) => {
    setSelectedRepository(repo)
    // Generate a default PR title based on repo
    setPrTitle(`Add Limetest for ${repo.name}`)
  }

  const handleCreatePR = async () => {
    setLoading(true)
    try {
      // For now, just console.log the data
      console.log("Creating PR with:", {
        repository: selectedRepository,
        prTitle,
      })
      
      // Close the modal
      setOpen(false)
    } catch (error) {
      console.error("Failed to create PR:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <PlusCircle className="h-4 w-4" />
          <span>Add Runner</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Runner</DialogTitle>
          <DialogDescription>
            Select a repository to create a runner setup pull request.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <RepositorySearch onSelectRepository={handleRepositorySelect} />
          
          {selectedRepository && (
            <div className="grid gap-2">
              <Label htmlFor="pr-title">Pull Request Title</Label>
              <Input
                id="pr-title"
                value={prTitle}
                onChange={(e) => setPrTitle(e.target.value)}
                placeholder="Add Limetest configuration"
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleCreatePR}
            disabled={!selectedRepository || !prTitle || loading}
          >
            {loading ? "Creating..." : "Create PR"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 