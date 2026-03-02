'use client'

import { useEffect, useState, useMemo } from 'react'
import { useAppStore, useFilteredData } from '@/store/useFilters'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { GlobalFilters } from '@/components/filters/GlobalFilters'

import { Skeleton } from '@/components/ui/skeleton'
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  createColumnHelper,
  flexRender,
} from '@tanstack/react-table'
import { VideoData, getEmotionBadgeClass } from '@/lib/types'
import { NerDisplay } from '@/components/NerDisplay'
import VideoPreview from '@/components/VideoPreview'
import { ExternalLink, Play, Search, ChevronLeft, ChevronRight } from 'lucide-react'

export default function VideosPage() {
  const { loadData, loading, error } = useAppStore()
  const filteredData = useFilteredData()
  const [globalFilter, setGlobalFilter] = useState('')

  useEffect(() => {
    loadData()
  }, [loadData])

  const columnHelper = createColumnHelper<VideoData>()

  const columns = useMemo(
    () => [

      columnHelper.accessor('id', {
        header: 'ID',
        cell: ({ getValue }) => (
          <span className="font-mono text-sm">{getValue()}</span>
        ),
        size: 80,
      }),
      columnHelper.accessor('Topic_Label', {
        header: 'Topic',
        cell: ({ getValue }) => (
          <span className="font-medium">{getValue()}</span>
        ),
        size: 150,
      }),
      columnHelper.accessor('Emotion', {
        header: 'Emotion',
        cell: ({ getValue }) => (
          <Badge className={getEmotionBadgeClass(getValue())}>
            {getValue()}
          </Badge>
        ),
        size: 100,
      }),
      columnHelper.accessor('Platform', {
        header: 'Platform',
        cell: ({ getValue }) => (
          <Badge variant="outline" className="capitalize">
            {getValue().replace('_', ' ')}
          </Badge>
        ),
        size: 120,
      }),
      columnHelper.accessor('Summary', {
        header: 'Summary',
        cell: ({ getValue }) => (
          <div className="max-w-xs">
            <p className="text-sm text-muted-foreground truncate" title={getValue()}>
              {getValue()}
            </p>
          </div>
        ),
        size: 200,
      }),
      columnHelper.display({
        header: 'Entities',
        cell: ({ row }) => (
          <div className="max-w-xs">
            <NerDisplay data={row.original} maxDisplay={3} />
          </div>
        ),
        size: 200,
      }),
      columnHelper.accessor('Video', {
        header: 'Actions',
        cell: ({ getValue, row }) => (
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.open(getValue(), '_blank')}
              className="h-8 w-8 p-0"
            >
              <ExternalLink className="h-3 w-3" />
            </Button>
          </div>
        ),
        size: 100,
        enableSorting: false,
      }),
    ],
    [columnHelper]
  )

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: 'includesString',
    initialState: {
      pagination: {
        pageSize: 20,
      },
    },
  })

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32" />
        <Skeleton className="h-96" />
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-destructive">Error loading data: {error}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Video Browser</h1>
          <p className="text-muted-foreground">
            Browse and explore individual video content
          </p>
        </div>
        <GlobalFilters />
      </div>

      {/* Video Preview Section */}
      <VideoPreview data={filteredData} />

      {/* Table Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search table..."
                  value={globalFilter}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <div className="text-sm text-muted-foreground">
                {table.getFilteredRowModel().rows.length} of {filteredData.length} videos
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-auto">
            <table className="w-full">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id} className="border-b">
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-4 py-3 text-left text-sm font-medium text-muted-foreground"
                        style={{ width: header.getSize() }}
                      >
                        {header.isPlaceholder ? null : (
                          <div
                            className={`flex items-center space-x-1 ${
                              header.column.getCanSort() ? 'cursor-pointer select-none' : ''
                            }`}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {{
                              asc: ' ↑',
                              desc: ' ↓',
                            }[header.column.getIsSorted() as string] ?? null}
                          </div>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="border-b hover:bg-muted/50 transition-colors">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3 text-sm">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-4 border-t">
            <div className="text-sm text-muted-foreground">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {table.getFilteredRowModel().rows.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">
              No videos found matching your criteria
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}