// Step components for the multi-step job posting flow

import { useState } from 'react'

interface FormDataType {
  // Church Identity
  churchName: string
  contactName: string
  contactEmailUsername: string
  contactEmailExtension: string
  contactPhone: string
  denomination: string
  congregationProfile: string
  avgAttendance: string
  address: string
  city: string
  province: string
  country: string
  customCountry: string
  postalCode: string
  neighborhood: string

  // Service Position/Details
  title: string
  description: string

  // Theological & Liturgical
  statementOfFaithUrl: string
  preferredBibleTranslation: string
  preachingStyleSought: string
  dresscode: string

  // Service Logistics
  date: string
  time: string
  arrivalTime: string
  sermonLength: string
  additionalDuties: string
  technologyAvailable: string
  technologyRequired: string

  // Compensation
  honorarium: string
  mileageReimbursement: string
  travelLodging: string
  meals: string

  // Requirements
  necessaryDocuments: string
  backgroundCheckRequired: string
  compensation: string
}

interface StepProps {
  formData: FormDataType
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  onNext: () => void
  onPrev?: () => void
  canProceed: boolean
}

// Step 1: Basic Job Details
export function Step1JobDetails({ formData, onChange, onNext, canProceed }: StepProps) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">Job Title *</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={onChange}
          placeholder="e.g., Sunday Morning Service Speaker"
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">Job Description *</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={onChange}
          placeholder="Describe the opportunity, what you're looking for, and any specific details..."
          rows={6}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
        />
      </div>

      <button
        onClick={onNext}
        disabled={!canProceed}
        className="w-full bg-lime-600 hover:bg-lime-700 text-white px-6 py-3 rounded-lg font-semibold transition disabled:opacity-50"
      >
        Continue
      </button>
    </div>
  )
}

// Step 2: Service Details
export function Step2ServiceDetails({ formData, onChange, onNext, onPrev }: StepProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Service Date *</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={onChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Service Time *</label>
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={onChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">Sermon Length (minutes)</label>
        <input
          type="number"
          name="sermonLength"
          value={formData.sermonLength}
          onChange={onChange}
          placeholder="45"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">Expected Arrival Time</label>
        <input
          type="time"
          name="arrivalTime"
          value={formData.arrivalTime}
          onChange={onChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
        />
      </div>

      <div className="flex gap-3">
        {onPrev && (
          <button
            onClick={onPrev}
            type="button"
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 px-6 py-3 rounded-lg font-semibold transition"
          >
            Back
          </button>
        )}
        <button
          onClick={onNext}
          type="button"
          className="flex-1 bg-lime-600 hover:bg-lime-700 text-white px-6 py-3 rounded-lg font-semibold transition"
        >
          Continue
        </button>
      </div>
    </div>
  )
}

// Step 3: Compensation & Requirements
export function Step3CompensationRequirements({ formData, onChange, onNext, onPrev }: StepProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Honorarium Amount</label>
          <div className="flex">
            <span className="inline-flex items-center px-3 bg-gray-100 border border-r-0 border-gray-300 text-gray-600 rounded-l-lg">$</span>
            <input
              type="number"
              name="honorarium"
              value={formData.honorarium}
              onChange={onChange}
              placeholder="500"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Mileage Reimbursement</label>
          <input
            type="text"
            name="mileageReimbursement"
            value={formData.mileageReimbursement}
            onChange={onChange}
            placeholder="e.g., $0.50 per km"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">Travel & Lodging</label>
        <textarea
          name="travelLodging"
          value={formData.travelLodging}
          onChange={onChange}
          placeholder="Will you provide lodging? Cover travel costs?"
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">Meals Provided</label>
        <input
          type="text"
          name="meals"
          value={formData.meals}
          onChange={onChange}
          placeholder="e.g., Lunch provided"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">Background Check Required</label>
        <select
          name="backgroundCheckRequired"
          value={formData.backgroundCheckRequired}
          onChange={onChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
        >
          <option value="no">No</option>
          <option value="yes">Yes, required</option>
        </select>
      </div>

      <div className="flex gap-3">
        {onPrev && (
          <button
            onClick={onPrev}
            type="button"
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 px-6 py-3 rounded-lg font-semibold transition"
          >
            Back
          </button>
        )}
        <button
          onClick={onNext}
          type="button"
          className="flex-1 bg-lime-600 hover:bg-lime-700 text-white px-6 py-3 rounded-lg font-semibold transition"
        >
          Review & Continue
        </button>
      </div>
    </div>
  )
}

// Step 4: Review
export function Step4Review({ formData, onNext, onPrev }: StepProps) {
  return (
    <div className="space-y-6">
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Job Details</h3>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-600">Title</p>
            <p className="font-semibold text-gray-900">{formData.title}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Date & Time</p>
            <p className="font-semibold text-gray-900">
              {formData.date} at {formData.time}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Honorarium</p>
            <p className="font-semibold text-gray-900">${formData.honorarium || 'Not specified'}</p>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          ✓ Your job posting looks good! Next, you'll select a plan and complete payment.
        </p>
      </div>

      <div className="flex gap-3">
        {onPrev && (
          <button
            onClick={onPrev}
            type="button"
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 px-6 py-3 rounded-lg font-semibold transition"
          >
            Back
          </button>
        )}
        <button
          onClick={onNext}
          type="button"
          className="flex-1 bg-lime-600 hover:bg-lime-700 text-white px-6 py-3 rounded-lg font-semibold transition"
        >
          Choose Package
        </button>
      </div>
    </div>
  )
}
