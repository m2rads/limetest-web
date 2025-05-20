"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { Check, ChevronsUpDown, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { fetchRepositories } from "@/lib/github/actions"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useOrgContext } from "@/lib/context/org-context"

export type Repository = {
  id: number
  name: string
  full_name: string
  description: string
  html_url: string
  private: boolean
  updated_at: string | null
}

interface RepositorySearchProps {
  onSelectRepository: (repository: Repository) => void
}

export function RepositorySearch({ onSelectRepository }: RepositorySearchProps) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [repositories, setRepositories] = useState<Repository[]>([])
  const [selectedRepository, setSelectedRepository] = useState<Repository | null>(null)
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const { lastUpdated } = useOrgContext()

  const loadRepositories = useCallback(async (query?: string, pageNum: number = 1) => {
    if (pageNum === 1) {
      setLoading(true)
    } else {
      setLoadingMore(true)
    }

    try {
      // For now, the API returns all repos without pagination
      // So we'll simulate pagination on the client side
      const allRepos = await fetchRepositories(query)
      
      // Apply client-side pagination
      const pageSize = 10
      const startIndex = (pageNum - 1) * pageSize
      const endIndex = startIndex + pageSize
      const paginatedRepos = allRepos.slice(startIndex, endIndex)
      
      // Only set repositories if we have results or it's the first page
      if (paginatedRepos.length > 0 || pageNum === 1) {
        setRepositories(prev => pageNum === 1 ? paginatedRepos : [...prev, ...paginatedRepos])
      }
      
      // Only has more if we haven't reached the end of all repos
      setHasMore(endIndex < allRepos.length)
    } catch (error) {
      console.error("Failed to load repositories:", error)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [])

  // Initial data load when component mounts or search query changes or org changes
  useEffect(() => {
    // Reset and load first page when search query or organization changes
    setPage(1)
    setRepositories([])
    const timeoutId = setTimeout(() => {
      loadRepositories(searchQuery)
    }, 300)
    
    return () => clearTimeout(timeoutId)
  }, [searchQuery, loadRepositories, lastUpdated])

  // Setup intersection observer for infinite scrolling
  useEffect(() => {
    // Create observer for infinite scrolling
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
          // When the sentinel comes into view, load the next page
          const nextPage = page + 1
          setPage(nextPage)
          loadRepositories(searchQuery, nextPage)
        }
      },
      { threshold: 0.1 }
    );

    // Observe the sentinel element
    const sentinelElement = loadMoreRef.current
    if (sentinelElement) {
      observer.observe(sentinelElement)
    }

    // Cleanup
    return () => {
      if (sentinelElement) {
        observer.unobserve(sentinelElement)
      }
      observer.disconnect()
    }
  }, [page, hasMore, loadingMore, loading, searchQuery, loadRepositories])

  const handleSelectRepository = (repository: Repository) => {
    setSelectedRepository(repository)
    setOpen(false)
    onSelectRepository(repository)
    console.log("Selected repository:", repository)
  }

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="repository-search" className="text-sm font-medium">
        Select Repository
      </label>
      
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="justify-between w-full">
            {selectedRepository ? (
              <span className="flex items-center gap-2">
                <span className="font-medium">{selectedRepository.name}</span>
                {selectedRepository.private && (
                  <Badge variant="outline" className="ml-2 text-xs">
                    Private
                  </Badge>
                )}
              </span>
            ) : (
              "Select a repository"
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0">
          <Command>
            <CommandInput 
              placeholder="Search repositories..." 
              value={searchQuery}
              onValueChange={setSearchQuery}
              className="h-9"
            />
            <CommandList className="max-h-[300px] overflow-y-auto">
              <CommandEmpty>
                {loading ? (
                  <div className="p-2 flex flex-col gap-2">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                ) : (
                  "No repositories found. Try broadening your search."
                )}
              </CommandEmpty>
              <CommandGroup>
                {loading && repositories.length === 0 ? (
                  <div className="p-2 flex flex-col gap-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ) : (
                  repositories.map((repo) => (
                    <CommandItem
                      key={repo.id}
                      value={repo.full_name}
                      onSelect={() => handleSelectRepository(repo)}
                      className="flex items-start gap-2 py-2"
                    >
                      <div className="flex-1 flex flex-col">
                        <div className="flex items-center">
                          <span className="font-medium mr-2">{repo.name}</span>
                          {repo.private && (
                            <Badge variant="outline" className="ml-auto text-xs">
                              Private
                            </Badge>
                          )}
                        </div>
                        {repo.description && (
                          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                            {repo.description}
                          </p>
                        )}
                      </div>
                      {selectedRepository?.id === repo.id && (
                        <Check className="h-4 w-4 text-green-500" />
                      )}
                    </CommandItem>
                  ))
                )}

                {/* Infinite scroll loading indicator */}
                <div 
                  ref={loadMoreRef} 
                  className={cn(
                    "py-2 text-center",
                    (!hasMore || repositories.length === 0) && "hidden"
                  )}
                >
                  {loadingMore ? (
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Loading more...</span>
                    </div>
                  ) : (
                    <div className="h-4" />
                  )}
                </div>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
} 