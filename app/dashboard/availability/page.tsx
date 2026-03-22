'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from 'date-fns'

interface AvailabilitySlot {
  id: string
  date: string
  startTime: string
  endTime: string
  notes?: string
  willingToTravel?: boolean
  travelDistance?: number
}

export default function AvailabilityPage() {
  const { data: session, status } = useSession()
  const [slots, setSlots] = useState<AvailabilitySlot[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd'),
    startTime: '09:00',
    endTime: '17:00',
    notes: '',
    willingToTravel: false,
    travelDistance: '',
  })

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role === 'PREACHER') {
      fetchAvailability()
    }
  }, [status, session?.user?.role])

  async function fetchAvailability() {
    try {
      setLoading(true)
      const monthStart = format(startOfMonth(currentDate), 'yyyy-MM-dd')
      const monthEnd = format(endOfMonth(currentDate), 'yyyy-MM-dd')
      const response = await fetch(`/api/availability?monthStart=${monthStart}&monthEnd=${monthEnd}`)
      if (!response.ok) throw new Error('Failed to fetch availability')
      const data = await response.json()
      setSlots(data.availability || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading availability')
    } finally {
      setLoading(false)
    }
  }

  async function handleAddSlot(e: React.FormEvent) {
    e.preventDefault()
    try {
      // Helper function to parse date strings as local dates (not UTC)
      const parseLocalDate = (dateStr: string) => {
        const [year, month, day] = dateStr.split('-')
        return new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
      }

      // Parse date range as local dates
      const startDateObj = parseLocalDate(formData.startDate)
      const endDateObj = parseLocalDate(formData.endDate)

      if (startDateObj > endDateObj) {
        setError('Start date must be before end date')
        return
      }

      // Generate all dates in range
      const datesInRange: string[] = []
      const currentDate = new Date(startDateObj)
      while (currentDate <= endDateObj) {
        datesInRange.push(format(currentDate, 'yyyy-MM-dd'))
        currentDate.setDate(currentDate.getDate() + 1)
      }

      // Create a slot for each date
      let successCount = 0
      for (const date of datesInRange) {
        const travelDist = formData.willingToTravel && formData.travelDistance 
          ? parseInt(formData.travelDistance as string) 
          : undefined

        const response = await fetch('/api/availability', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            date,
            startTime: formData.startTime,
            endTime: formData.endTime,
            notes: formData.notes,
            willingToTravel: formData.willingToTravel,
            travelDistance: travelDist,
          }),
        })

        if (response.ok) {
          successCount++
        } else {
          const errorData = await response.json()
          console.error(`Failed to create slot for ${date}:`, errorData)
        }
      }

      if (successCount === datesInRange.length) {
        // Reset form and refresh
        setFormData({
          startDate: format(new Date(), 'yyyy-MM-dd'),
          endDate: format(new Date(), 'yyyy-MM-dd'),
          startTime: '09:00',
          endTime: '17:00',
          notes: '',
          willingToTravel: false,
          travelDistance: '',
        })
        setShowForm(false)
        await fetchAvailability()
      } else {
        setError(`Created ${successCount} of ${datesInRange.length} slots`)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creating slots')
    }
  }

  async function handleDeleteSlot(slotId: string) {
    if (!confirm('Are you sure you want to delete this availability?')) return

    try {
      const response = await fetch(`/api/availability/${slotId}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete slot')
      await fetchAvailability()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error deleting slot')
    }
  }

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (session?.user?.role !== 'PREACHER') {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Only preachers can manage availability</p>
      </div>
    )
  }

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const slotsByDate = (dateStr: string) =>
    slots.filter((s) => format(new Date(s.date), 'yyyy-MM-dd') === dateStr)

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Availability Calendar</h1>
          <p className="text-gray-600">Manage when you're available to preach</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          {showForm ? 'Cancel' : 'Add Availability'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Add Slot Form */}
      {showForm && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Add Availability Slot</h3>
          <form onSubmit={handleAddSlot} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
              <div className="flex gap-2">
                <input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) =>
                    setFormData({ ...formData, startTime: e.target.value })
                  }
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600"
                  required
                />
                <input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) =>
                    setFormData({ ...formData, endTime: e.target.value })
                  }
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes (optional)</label>
              <textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Any special notes about this availability"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="willingToTravel"
                  checked={formData.willingToTravel}
                  onChange={(e) =>
                    setFormData({ ...formData, willingToTravel: e.target.checked })
                  }
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="willingToTravel" className="ml-2 block text-sm font-medium text-gray-700">
                  Willing to travel
                </label>
              </div>
              {formData.willingToTravel && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Travel Distance (km)</label>
                  <input
                    type="number"
                    min="1"
                    max="500"
                    value={formData.travelDistance}
                    onChange={(e) =>
                      setFormData({ ...formData, travelDistance: e.target.value })
                    }
                    placeholder="e.g., 50"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600"
                  />
                </div>
              )}
            </div>
            <button
              type="submit"
              className="w-full px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Save Availability
            </button>
          </form>
        </div>
      )}

      {/* Calendar */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
            >
              ← Previous
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
            >
              Today
            </button>
            <button
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
            >
              Next →
            </button>
          </div>
        </div>

        {/* Days Grid */}
        <div className="p-6">
          <div className="grid grid-cols-7 gap-4 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center font-semibold text-gray-700">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-4">
            {daysInMonth.map((date) => {
              const dateStr = format(date, 'yyyy-MM-dd')
              const daySlots = slotsByDate(dateStr)
              const isDayToday = isToday(date)

              return (
                <div
                  key={dateStr}
                  className={`min-h-[120px] border rounded-lg p-2 ${
                    isSameMonth(date, currentDate)
                      ? isDayToday
                        ? 'bg-primary-50 border-primary-600'
                        : 'bg-white border-gray-200'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <p className="font-semibold text-gray-900">{format(date, 'd')}</p>
                  <div className="space-y-1 mt-2">
                    {daySlots.map((slot) => (
                      <div
                        key={slot.id}
                        className="text-xs bg-primary-100 text-primary-700 p-1 rounded relative group"
                      >
                        <p>{slot.startTime?.substring(0, 5)}</p>
                        <button
                          onClick={() => handleDeleteSlot(slot.id)}
                          className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 bg-red-500 text-white rounded px-1 text-xs"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Upcoming Slots Summary */}
      {slots.length > 0 && (
        <div className="mt-6 bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Upcoming Availability</h3>
          <div className="space-y-2">
            {slots
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .map((slot) => (
                <div key={slot.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium text-gray-900">
                      {format(new Date(slot.date), 'EEEE, MMMM d')}
                    </p>
                    <p className="text-sm text-gray-600">
                      {slot.startTime?.substring(0, 5)} - {slot.endTime?.substring(0, 5)}
                    </p>
                    {slot.notes && <p className="text-sm text-gray-500">{slot.notes}</p>}
                  </div>
                  <button
                    onClick={() => handleDeleteSlot(slot.id)}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    Delete
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
