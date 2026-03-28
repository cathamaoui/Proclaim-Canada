'use client'

interface ChurchVerificationBadgeProps {
  isVerified: boolean
  serviceDate?: Date | string | null
}

export default function ChurchVerificationBadge({
  isVerified,
  serviceDate,
}: ChurchVerificationBadgeProps) {
  if (!isVerified) {
    return null
  }

  const formatDate = (date: Date | string | undefined | null) => {
    if (!date) return null
    const d = typeof date === 'string' ? new Date(date) : date
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const formattedDate = formatDate(serviceDate)

  return (
    <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1.5 rounded-full text-sm font-semibold">
      <span className="text-lg">✓</span>
      <span>Verified Service</span>
      {formattedDate && <span className="text-xs text-green-700">({formattedDate})</span>}
    </div>
  )
}
