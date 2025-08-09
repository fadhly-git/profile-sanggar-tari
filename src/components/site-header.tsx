"use client"

import { SidebarIcon } from "lucide-react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useSidebar } from "@/components/ui/sidebar"
import { type BreadcrumbItem as BreadcrumbItemType } from "@/types"
import { usePathname } from "next/navigation"
import React from "react"
import { ModeToggle } from "./mode-togle"

export function SiteHeader() {
  const { toggleSidebar } = useSidebar()
  const pathname = usePathname()
  const breadcrumbs: BreadcrumbItemType[] = pathname.split('/')
    .filter(Boolean)
    .map((path, index, array) => {
      const href = '/' + array.slice(0, index + 1).join('/')
      return {
        title: path.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        href: index < array.length - 1 ? href : '' // href kosong untuk item terakhir
      }
    })

  return (
    <header className="bg-background sticky top-0 z-50 flex w-full items-center border-b">
      <div className="flex h-(--header-height) w-full items-center gap-2 px-4">
        <Button
          className="h-8 w-8"
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
        >
          <SidebarIcon />
        </Button>
        <Separator orientation="vertical" className="mr-2 h-4" />
        {(breadcrumbs && breadcrumbs.length > 0) && (
          <Breadcrumb className="hidden sm:block">
            <BreadcrumbList>
              {breadcrumbs.map((item, idx) => (
                <React.Fragment key={item.href || idx}>
                  <BreadcrumbItem>
                    {item.href ? (
                      <BreadcrumbLink href={item.href}>{item.title}</BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage>{item.title}</BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                  {idx < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        )}
        <ModeToggle className="w-full sm:ml-auto sm:w-auto" />
        {/* <SearchForm className="w-full sm:ml-auto sm:w-auto" /> */}
      </div>
    </header>
  )
}
