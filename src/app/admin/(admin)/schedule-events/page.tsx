import { ScheduleClientPage } from '@/components/admin/schedule-event/schedule-client'
import { getScheduleEvents } from '@/lib/actions/schedule-actions'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'

export default async function ScheduleEventsPage() {
    const session = await getServerSession(authOptions)
    if (!session) {
        return <div>Unauthorized</div>
    }

    const rawData = await getScheduleEvents()
    const data = rawData.map(event => ({
        ...event,
        description: event.description === null ? undefined : event.description,
        startDate: new Date(event.startDate),
        endDate: event.endDate ? new Date(event.endDate) : undefined,
        createdAt: new Date(event.createdAt),
        updatedAt: new Date(event.updatedAt),
    }))

    return (
        <ScheduleClientPage
            currentUserId={session.user.id}
            data={data}
        />
    )
}