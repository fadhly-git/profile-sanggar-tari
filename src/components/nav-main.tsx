"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  const pathname = usePathname()

  const isActive = (url: string) => {
    return pathname === url || pathname.startsWith(url + '/')
  }

  const isParentActive = (item: typeof items[0]) => {
    // Check if current item URL is active
    if (isActive(item.url)) return true

    // Check if any child item is active
    if (item.items?.some(subItem => isActive(subItem.url))) return true

    return false
  }

  const hasActiveChild = (item: typeof items[0]) => {
    return item.items?.some(subItem => isActive(subItem.url)) || false
  }

  const shouldBeOpen = (item: typeof items[0]) => {
    // Open if parent is active OR any child is active
    return isParentActive(item)
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Admin Panel</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={shouldBeOpen(item)}
          >
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                isActive={isParentActive(item)}
                className={`data-[active=true]:bg-accent data-[active=true]:border data-[active=true]:border-primary data-[active=true]:text-accent-foreground ${hasActiveChild(item) && !isActive(item.url) ? " bg-muted/50" : ""}`}
              >
                <Link href={item.url}>
                  <item.icon />
                  <span>
                    {item.title}
                  </span>
                </Link>
              </SidebarMenuButton>
              {item.items?.length ? (
                <>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuAction className="data-[state=open]:rotate-90">
                      <ChevronRight />
                      <span className="sr-only">Toggle</span>
                    </SidebarMenuAction>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={isActive(subItem.url)}
                          >
                            <Link href={subItem.url}>
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </>
              ) : null}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}