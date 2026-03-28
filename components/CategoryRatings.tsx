'use client'

interface CategoryRatingsProps {
  scripturalFidelity?: number | null
  audienceEngagement?: number | null
  professionalism?: number | null
}

export default function CategoryRatings({
  scripturalFidelity,
  audienceEngagement,
  professionalism,
}: CategoryRatingsProps) {
  const renderStars = (rating: number | undefined | null) => {
    if (!rating) return '—'
    return '★'.repeat(rating) + '☆'.repeat(5 - rating)
  }

  const categories = [
    {
      name: 'Scriptural Fidelity',
      description: 'Biblical accuracy & theological soundness',
      rating: scripturalFidelity,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      name: 'Audience Engagement',
      description: 'Ability to hold interest & inspire',
      rating: audienceEngagement,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
    },
    {
      name: 'Professionalism',
      description: 'Preparation, delivery & punctuality',
      rating: professionalism,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
    },
  ]

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold text-gray-900">Category Ratings</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {categories.map((category) => (
          <div
            key={category.name}
            className={`p-6 rounded-lg border-2 border-gray-200 ${category.bgColor}`}
          >
            <h4 className="text-lg font-bold text-gray-900 mb-1">
              {category.name}
            </h4>
            <p className="text-sm text-gray-600 mb-4">{category.description}</p>
            <div className={`text-3xl font-bold ${category.color} tracking-tight`}>
              {category.rating ? `${category.rating}/5` : 'N/A'}
            </div>
            <div className={`text-2xl ${category.color} mt-2`}>
              {renderStars(category.rating)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
