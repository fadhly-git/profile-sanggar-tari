import { RecurringType } from '@prisma/client'

export interface ScheduleEvent {
  id: string
  title: string
  description?: string // optional, bisa undefined
  startDate: Date
  endDate?: Date | null // bisa undefined atau null
  location?: string
  isActive: boolean
  isRecurring: boolean
  recurringType?: RecurringType | null // bisa undefined atau null
  authorId: string
  createdAt: Date
  updatedAt: Date
  // Relation
  author: {
    id: string
    name: string
    email: string
  }
}


export interface ScheduleFormData {
  title: string
  description: string
  startDate: string
  endDate: string
  location: string
  isRecurring: boolean
  recurringType?: RecurringType | null
}

export interface CreateScheduleEventData {
    title: string
    description?: string
    startDate: Date
    endDate?: Date | null
    location?: string
    isActive?: boolean
    isRecurring: boolean
    recurringType?: RecurringType | null
    authorId: string
}

export interface UpdateScheduleEventData extends Partial<Omit<CreateScheduleEventData, 'authorId'>> {
    id: string
}