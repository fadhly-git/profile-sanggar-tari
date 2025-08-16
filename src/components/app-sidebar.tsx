"use client"

import * as React from "react"
import {
  Calendar,
  DatabaseBackup,
  FileText,
  HelpCircle,
  Images,
  LayoutDashboard,
  MessageSquareWarning,
  NewspaperIcon,
  Send,
  Settings2,
  SquareUser,
} from "lucide-react"
import { dhaf } from "./atoms/d"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Image from "next/image"
import Link from "next/link"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Artikel & Blog",
      url: "/admin/articles",
      icon: NewspaperIcon,
    },
    {
      title: "Galeri Media",
      url: "#",
      icon: Images,
      items: [
        {
          title: "Kategori Galeri",
          url: "/admin/gallery/gallery-categories",
          icon: Images,
        },
        {
          title: "Galeri",
          url: "/admin/gallery/media-gallery",
          icon: Images,
        }
      ]
    },
    {
      title: "Jadwal Kegiatan",
      url: "/admin/schedule-events",
      icon: Calendar,
    },
    {
      title: "FAQ",
      url: "/admin/faq",
      icon: HelpCircle,
    },
    {
      title: "Pesan Kontak",
      url: "/admin/contact-submissions",
      icon: MessageSquareWarning,
    },
    {
      title: "Manajemen Pengguna",
      url: "/admin/users",
      icon: SquareUser,
    },
    {
      title: "Konten Halaman",
      url: "/admin/page-content",
      icon: FileText,
    },
    {
      title: "Pengaturan Website",
      url: "/admin/settings",
      icon: Settings2,
    },
  ],
  navSecondary: [
    {
      title: "Cache",
      url: "/admin/cache",
      icon: DatabaseBackup,
    },
    {
      title: "Feedback",
      url: dhaf,
      icon: Send,
    },
  ],
}
type AppSidebarProps = React.ComponentProps<typeof Sidebar> & { appName?: string }

export function AppSidebar(props: AppSidebarProps) {
  const { appName, ...rest } = props
  return (
    <Sidebar
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
      {...rest}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/admin/dashboard">
                <div className="bg-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Image
                    src={'/logo.png'}
                    alt="logo"
                    width={24}
                    height={24}
                    style={{ width: "auto", height: "auto" }}
                    className="w-6 h-6"
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight whitespace-normal break-words">
                  <span className="font-medium text-foreground">{appName}</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
