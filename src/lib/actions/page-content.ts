// @/lib/actions/page-content.ts
"use server";

import { prisma } from "@/lib/prisma";
import { PageContent } from "@prisma/client";

export async function getPageContent(pageKey: string): Promise<PageContent | null> {
  try {
    const content = await prisma.pageContent.findUnique({
      where: {
        pageKey,
        isActive: true,
      },
    });
    return content;
  } catch (error) {
    console.error(`Error fetching page content for ${pageKey}:`, error);
    return null;
  }
}

export async function getAllActivePageContent(): Promise<PageContent[]> {
  try {
    const contents = await prisma.pageContent.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        title: 'asc',
      },
    });
    return contents;
  } catch (error) {
    console.error("Error fetching all page contents:", error);
    return [];
  }
}