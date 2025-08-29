"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { X, Plus, CalendarX } from 'lucide-react'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

interface RecurringManagerProps {
  exceptions: Date[]
  onExceptionsChange: (exceptions: Date[]) => void
  recurringEndDate?: Date | null
  onRecurringEndDateChange: (endDate: Date | null) => void
  recurringType?: string
}

export function RecurringManager({ 
  exceptions,
  onExceptionsChange,
  recurringEndDate,
  onRecurringEndDateChange,
}: RecurringManagerProps) {
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedEndDate, setSelectedEndDate] = useState<Date | undefined>(recurringEndDate || undefined)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [isEndDateOpen, setIsEndDateOpen] = useState(false)

  const handleAddException = () => {
    if (selectedDate) {
      onExceptionsChange([...exceptions, selectedDate])
      setSelectedDate(undefined)
      setIsCalendarOpen(false)
    }
  }

  const handleUpdateEndDate = () => {
    if (onRecurringEndDateChange) {
      onRecurringEndDateChange(selectedEndDate || null)
      setIsEndDateOpen(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Recurring End Date Manager */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CalendarX className="h-5 w-5" />
            Batas Waktu Recurring
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recurringEndDate ? (
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">Berakhir pada:</p>
                  <p className="text-sm text-muted-foreground">
                    {format(recurringEndDate, 'dd MMMM yyyy, EEEE', { locale: id })}
                  </p>
                </div>
                <Dialog open={isEndDateOpen} onOpenChange={setIsEndDateOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      Ubah
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Ubah Tanggal Berakhir</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Calendar
                        mode="single"
                        selected={selectedEndDate}
                        onSelect={setSelectedEndDate}
                        className="rounded-md border"
                        disabled={(date) => date < new Date()}
                      />
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setSelectedEndDate(undefined)
                            handleUpdateEndDate()
                          }}
                        >
                          Hapus Batas
                        </Button>
                        <Button onClick={handleUpdateEndDate}>
                          Simpan
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            ) : (
              <div className="text-center p-6 bg-muted/50 rounded-lg">
                <CalendarX className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground mb-3">Tidak ada batas waktu</p>
                <Dialog open={isEndDateOpen} onOpenChange={setIsEndDateOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      Set Tanggal Berakhir
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Set Tanggal Berakhir Recurring</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Calendar
                        mode="single"
                        selected={selectedEndDate}
                        onSelect={setSelectedEndDate}
                        className="rounded-md border"
                        disabled={(date) => date < new Date()}
                      />
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsEndDateOpen(false)}>
                          Batal
                        </Button>
                        <Button onClick={handleUpdateEndDate} disabled={!selectedEndDate}>
                          Simpan
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Exception Manager */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CalendarX className="h-5 w-5" />
            Kelola Hari Libur
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Dialog open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Hari Libur
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Pilih Tanggal Libur</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                    disabled={(date) => {
                      // Disable tanggal yang sudah ada di exceptions
                      return exceptions.some(exception => 
                        exception.toDateString() === date.toDateString()
                      )
                    }}
                  />
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsCalendarOpen(false)}>
                      Batal
                    </Button>
                    <Button onClick={handleAddException} disabled={!selectedDate}>
                      Tambah Libur
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {exceptions.length > 0 ? (
            <div>
              <h4 className="font-medium mb-3">Daftar Hari Libur:</h4>
              <div className="space-y-2">
                {exceptions
                  .sort((a, b) => a.getTime() - b.getTime())
                  .map((date, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-md">
                      <div className="flex items-center space-x-3">
                        <CalendarX className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                        <div>
                          <p className="text-sm font-medium text-orange-700 dark:text-orange-300">
                            {format(date, 'dd MMMM yyyy', { locale: id })}
                          </p>
                          <p className="text-xs text-orange-600 dark:text-orange-400">
                            {format(date, 'EEEE', { locale: id })}
                          </p>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => onExceptionsChange(exceptions.filter(d => d.getTime() !== date.getTime()))}
                        className="text-orange-600 hover:text-orange-700 hover:bg-orange-100 dark:text-orange-400 dark:hover:text-orange-300"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
              </div>
            </div>
          ) : (
            <div className="text-center p-6 bg-muted/50 rounded-lg">
              <CalendarX className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">Belum ada hari libur</p>
              <p className="text-xs text-muted-foreground mt-1">
                Tambahkan tanggal yang ingin dikecualikan dari jadwal berulang
              </p>
            </div>
          )}

          {exceptions.length > 0 && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-xs text-blue-700 dark:text-blue-300">
                <strong>Info:</strong> Hari libur akan tetap muncul di jadwal tapi ditandai sebagai &quot;Libur&quot;. 
                Jadwal akan otomatis lanjut ke periode berikutnya.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
