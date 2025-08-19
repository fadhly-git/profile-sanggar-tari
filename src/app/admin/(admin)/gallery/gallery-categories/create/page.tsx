import { GalleryCategoryForm } from "@/components/admin/gallery/category/gallery-category-form";
import { authOptions } from "@/lib/auth-options";
import { getServerSession } from "next-auth";

export default async function GalleryCategoryCreatePage() {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
        return <div>Unauthorized</div>
    }
    return <GalleryCategoryForm mode="create" userId={session.user.id} />
}