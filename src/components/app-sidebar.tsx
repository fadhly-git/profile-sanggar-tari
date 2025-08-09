"use client"

import * as React from "react"
import {
  ChartNoAxesCombinedIcon,
  DatabaseBackup,
  Folders,
  Hospital,
  ImageIcon,
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
      title: "Kritik & Saran",
      url: "/admin/kritik-saran",
      icon: MessageSquareWarning,
      isActive: true,
    },
    {
      title: "Kategori",
      url: "/admin/kategori",
      icon: Folders,
    },
    {
      title: "Berita",
      url: "/admin/berita",
      icon: NewspaperIcon,
    },
    {
      title: "Hero Section / Banner",
      url: "/admin/hero-section-or-banner",
      icon: ImageIcon,
    },
    {
      title: "Indikator Mutu",
      url: "/admin/indikator-mutu",
      icon: ChartNoAxesCombinedIcon,
    },
    {
      title: "Manajemen Pengguna",
      url: "#",
      icon: SquareUser,
      items: [
        {
          title: "User",
          url: "/admin/user-management",
        },
      ],
    },
    {
      title: "Konfigurasi Website",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Website Settings",
          url: "/admin/website-settings",
        },
        {
          title: "Tentang Kami",
          url: "/admin/tentang-kami",
        },
        {
          title: "Promosi",
          url: "/admin/promosi",
        },
        {
          title: "Layanan",
          url: "/admin/layanan",
        },
        {
          title: "Halaman",
          url: "/admin/halaman",
        },
      ],
    },
    {
      title: "Manajemen Dokter",
      url: "#",
      icon: Hospital,
      items: [
        {
          title: "Data Dokter",
          url: "/admin/data-dokter",
        },
        {
          title: "Jadwal Dokter",
          url: "/admin/jadwal-dokter",
        },
        {
          title: "Kategori Spesialis",
          url: "/admin/kategori-spesialis",
        },
      ]
    },
  ],
  navSecondary: [
    {
      title: "cache",
      url: "/admin/cache",
      icon: DatabaseBackup,
    },
    {
      title: "Galeri",
      url: "/admin/media",
      icon: Images,
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
