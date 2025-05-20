"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { RepositorySearch, Repository } from "./repository-search"
import { OrganizationDisplay } from "./organization-display"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function RunnerCreation() {
  const [selectedRepository, setSelectedRepository] = useState<Repository | null>(null)
  const [runnerName, setRunnerName] = useState("")
  const [cpuSize, setCpuSize] = useState("2")
  const [loading, setLoading] = useState(false)

  const handleRepositorySelect = (repo: Repository) => {
    setSelectedRepository(repo)
    // Generate a default runner name based on repo
    setRunnerName(`runner-${repo.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`)
  }

  const handleCreateRunner = async () => {
    setLoading(true)
    try {
      // For now, just console.log the data
      console.log("Creating runner with:", {
        repository: selectedRepository,
        runnerName,
        cpuSize
      })

      // In the future, this will make an API call to create the runner
    } catch (error) {
      console.error("Failed to create runner:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <OrganizationDisplay />
      
      <Card>
        <CardHeader>
          <CardTitle>Create Self-Hosted Runner</CardTitle>
          <CardDescription>
            Configure and deploy a new self-hosted runner for your repository
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <RepositorySearch onSelectRepository={handleRepositorySelect} />
            
            <div className="space-y-2">
              <Label htmlFor="runner-name">Runner Name</Label>
              <Input
                id="runner-name"
                placeholder="e.g., runner-production"
                value={runnerName}
                onChange={(e) => setRunnerName(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                This name will be used in your GitHub workflow files
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cpu-size">CPU Size</Label>
              <Select value={cpuSize} onValueChange={setCpuSize}>
                <SelectTrigger id="cpu-size">
                  <SelectValue placeholder="Select CPU size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2 vCPU</SelectItem>
                  <SelectItem value="4">4 vCPU</SelectItem>
                  <SelectItem value="8">8 vCPU</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Select the CPU size for your runner
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Cancel</Button>
          <Button 
            disabled={!selectedRepository || !runnerName || loading}
            onClick={handleCreateRunner}
          >
            {loading ? "Creating..." : "Create Runner"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
} 