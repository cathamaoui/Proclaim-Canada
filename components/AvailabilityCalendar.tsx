'use client'

import { useState, useEffect } from 'react'

interface AvailabilitySlot {
  id: string
  date: string
  startTime: string
  endTime: string
  available: boolean
  notes: string | null
}

interface AvailabilityCalendarProps {
  userId: string
  editable?: boolean
  onSlotClick?: (slot: AvailabilitySlot) => void
}

export default function AvailabilityCalendar({ userId, editable = false, onSlotClick }: AvailabilityCalendarProps) {
  const [slots, setSlots] = useState<AvailabilitySlot[]>([])
  const [loading, setLoading] = useState(true)
  const [currentMonth, setCurrentMonth] = useState(new Date())

  useEffect(() => {
    fetchSlots()
  }, [userId, currentMonth])

  const fetchSlots = async () => {
    try {
      const monthStart = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-01`
      const monthEnd = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()}`
      
      const response = await fetch(`/api/availability?userId=${userId}&monthStart=${monthStart}&monthEnd=${monthEnd}`)
      const data = await response.json()
      setSlots(data.availability || [])
    } catch (error) {
      console.error('Failed to fetch availability:', error)
    } finally {
      setLoading(false)
    }
  }

  const getDaysInMonth = () => {
    return new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()
  }

  const getSlotsByDate = (date: number) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`
    return slots.filter(s => s.date.startsWith(dateStr))
  }

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  if (loading) return <div className="text-gray-500">Loading availability...</div>

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Availability Calendar</h3>
        <div className="flex items-center gap-4">
          <button onClick={previousMonth} className="text-blue-600 hover:text-blue-700">←</button>
          <span className="font-medium min-w-[200px] text-center">{monthName}</span>
          <button onClick={nextMonth} className="text-blue-600 hover:text-blue-700">→</button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="space-y-4">
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center font-semibold text-sm text-gray-600">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: getDaysInMonth() }).map((_, i) => {
            const daySlots = getSlotsByDate(i + 1)
            const hasAvailability = daySlots.length > 0

            return (
              <div
                key={i}
                onClick={() => hasAvailability && onSlotClick?.(daySlots[0])}
                className={`aspect-square flex flex-col items-center justify-center rounded-lg border p-1 text-sm ${
                  hasAvailability
                    ? 'bg-green-50 border-green-300 cursor-pointer hover:bg-green-100'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <span className="font-semibold">{i + 1}</span>
                {hasAvailability && (
                  <span className="text-xs text-green-700 mt-1">
                    {daySlots.length} slot{daySlots.length > 1 ? 's' : ''}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Availability List */}
      {slots.length > 0 && (
        <div className="mt-8 pt-6 border-t">
          <h4 className="font-semibold mb-4">Upcoming Availability</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {slots.map(slot => (
              <div
                key={slot.id}
                className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200 cursor-pointer hover:bg-green-100 transition"
                onClick={() => onSlotClick?.(slot)}
              >
                <div>
                  <p className="font-medium">
                    {new Date(slot.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </p>
                  <p className="text-sm text-gray-600">
                    {slot.startTime} - {slot.endTime}
                  </p>
                  {slot.notes && <p className="text-xs text-gray-500 mt-1">{slot.notes}</p>}
                </div>
                <div className="text-right">
                  {slot.available ? (
                    <span className="inline-block bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      Available
                    </span>
                  ) : (
                    <span className="inline-block bg-gray-400 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      Booked
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {slots.length === 0 && (
        <p className="text-center text-gray-500 py-8">No availability slots for this month</p>
      )}
    </div>
  )
}
