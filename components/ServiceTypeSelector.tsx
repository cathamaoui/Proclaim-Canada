'use client'

import { useEffect, useState } from 'react'

// Service types organized by category
const SERVICE_TYPES = {
  'Standard Services': [
    'Midweek Service / Bible Study',
    'Sunday Evening Service',
    'Sunday Morning Service',
  ],
  'Specialized Outreach': [
    'Evangelistic Crusade / Rally',
    'Revival Meetings (Multi-day)',
    'Seeker-Sensitive / Guest Sunday',
  ],
  'Targeted Ministry': [
    'Campus / University Outreach',
    "Men's / Women's Conference",
    'Young Adults Gathering',
    'Youth Rally / Youth Retreat',
  ],
  'Training & Equipping': [
    'Evangelism Workshop / Seminar',
    'Leadership Development',
    'VBS / Family Night Keynote',
  ],
  'General': [
    'Community Event / Festival',
    'Holiday Special Service',
    'Other (Please specify)',
  ],
}

interface ServiceTypeSelectorProps {
  selectedServices?: string[]
  onSelectionChange: (services: string[]) => void
  showCustomField?: boolean
}

export default function ServiceTypeSelector({
  selectedServices = [],
  onSelectionChange,
  showCustomField = true,
}: ServiceTypeSelectorProps) {
  const [selected, setSelected] = useState<string[]>(selectedServices)
  const [customService, setCustomService] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [choicesInstance, setChoicesInstance] = useState<any>(null)

  // Initialize Choices.js for enhanced dropdown
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/choices.js/public/assets/scripts/choices.min.js'
    script.async = true
    script.onload = () => {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://cdn.jsdelivr.net/npm/choices.js/public/assets/styles/choices.min.css'
      document.head.appendChild(link)

      const serviceSelect = document.getElementById('serviceTypes') as HTMLSelectElement
      if (serviceSelect) {
        const choices = new (window as any).Choices(serviceSelect, {
          searchEnabled: true,
          searchChoices: true,
          shouldSort: false,
          placeholderValue: 'Search service types...',
          noResultsText: 'No matches found',
          noChoicesText: 'No available services',
          removeItemButton: true,
          duplicateItemsAllowed: false,
        })
        setChoicesInstance(choices)
      }
    }
    document.head.appendChild(script)

    return () => {
      if (choicesInstance) {
        choicesInstance.destroy()
      }
    }
  }, [])

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value)
    setSelected(selectedOptions)
    onSelectionChange(selectedOptions)
  }

  const showOtherField =
    (selected.includes('Other (Please specify)') || selectedServices.includes('Other (Please specify)')) &&
    showCustomField

  // Filter services based on search term
  const getFilteredServices = () => {
    const term = searchTerm.toLowerCase()
    const filtered: Record<string, string[]> = {}

    Object.entries(SERVICE_TYPES).forEach(([category, services]) => {
      const filteredServices = services.filter((service) => service.toLowerCase().includes(term))
      if (filteredServices.length > 0) {
        filtered[category] = filteredServices
      }
    })

    return filtered
  }

  const filteredServices = searchTerm ? getFilteredServices() : SERVICE_TYPES

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="serviceTypes" className="block text-sm font-medium text-gray-700 mb-3">
          Service Types You Can Lead <span className="text-red-500">*</span>
        </label>
        <p className="text-xs text-gray-500 mb-3">
          Select all service types you are qualified and willing to lead (multi-select)
        </p>

        {/* Choices.js Powered Multi-Select Dropdown */}
        <select
          id="serviceTypes"
          name="serviceTypes"
          multiple
          value={selected}
          onChange={handleSelect}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent"
        >
          {Object.entries(SERVICE_TYPES).map(([category, services]) => (
            <optgroup key={category} label={category}>
              {services.map((service) => (
                <option key={service} value={service}>
                  {service}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      {/* Selected Services Display */}
      {selected.length > 0 && (
        <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm font-medium text-gray-700 mb-2">Selected Services ({selected.length}):</p>
          <div className="flex flex-wrap gap-2">
            {selected.map((service) => (
              <span key={service} className="inline-flex items-center gap-2 px-3 py-1 bg-primary-600 text-white rounded-full text-sm">
                {service}
                <button
                  type="button"
                  onClick={() => {
                    const updated = selected.filter((s) => s !== service)
                    setSelected(updated)
                    onSelectionChange(updated)
                    // Update the Choices.js instance
                    if (choicesInstance) {
                      const selectEl = document.getElementById('serviceTypes') as HTMLSelectElement
                      if (selectEl) {
                        Array.from(selectEl.options).forEach((option) => {
                          option.selected = updated.includes(option.value)
                        })
                        choicesInstance.setChoiceByValue(updated)
                      }
                    }
                  }}
                  className="hover:opacity-80 transition-opacity"
                  aria-label={`Remove ${service}`}
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Conditional: Custom Service Type Field */}
      {showOtherField && (
        <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <label htmlFor="customService" className="block text-sm font-medium text-gray-700 mb-2">
            Please Specify Your Service Type <span className="text-red-500">*</span>
          </label>
          <input
            id="customService"
            type="text"
            value={customService}
            onChange={(e) => setCustomService(e.target.value)}
            placeholder="e.g., Corporate Prayer Meeting, Street Evangelism, etc."
            className="w-full px-4 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent"
            required={showOtherField}
          />
          <p className="text-xs text-gray-500 mt-2">Help us understand the specialized service type you lead</p>
        </div>
      )}

      {/* Helper Text */}
      <div className="text-xs text-gray-600 space-y-1">
        <p>💡 Use the search box to quickly find relevant services</p>
        <p>✓ You can select multiple service types</p>
        <p>ℹ️ If your specialty isn't listed, select "Other" and describe it</p>
      </div>
    </div>
  )
}
