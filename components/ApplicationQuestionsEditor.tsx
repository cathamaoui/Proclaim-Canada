'use client'

import { useState, useEffect } from 'react'

interface Question {
  id: string
  questionText: string
  questionType: string
  options?: string[]
  required: boolean
  order: number
}

interface ApplicationQuestionsEditorProps {
  listingId: string
  onQuestionsChange?: (questions: Question[]) => void
}

export default function ApplicationQuestionsEditor({
  listingId,
  onQuestionsChange
}: ApplicationQuestionsEditorProps) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [newQuestion, setNewQuestion] = useState({
    questionText: '',
    questionType: 'text',
    options: [] as string[],
    required: true,
    optionInput: ''
  })
  const [showForm, setShowForm] = useState(false)

  const questionTypes = [
    { value: 'text', label: 'Short Text' },
    { value: 'textarea', label: 'Long Text' },
    { value: 'radio', label: 'Multiple Choice' },
    { value: 'checkbox', label: 'Checkboxes' },
    { value: 'file', label: 'File Upload' }
  ]

  useEffect(() => {
    fetchQuestions()
  }, [listingId])

  const fetchQuestions = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/listings/${listingId}/questions`)
      if (res.ok) {
        const data = await res.json()
        setQuestions(data.questions || [])
      }
    } catch (err) {
      console.error('Error fetching questions:', err)
    } finally {
      setLoading(false)
    }
  }

  const addQuestion = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newQuestion.questionText.trim()) {
      setError('Question text is required')
      return
    }

    if (['radio', 'checkbox'].includes(newQuestion.questionType) && newQuestion.options.length < 2) {
      setError('Multiple choice questions need at least 2 options')
      return
    }

    try {
      const res = await fetch(`/api/listings/${listingId}/questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionText: newQuestion.questionText,
          questionType: newQuestion.questionType,
          options: newQuestion.options,
          required: newQuestion.required
        })
      })

      if (res.ok) {
        const data = await res.json()
        setQuestions([...questions, data.question])
        onQuestionsChange?.([...questions, data.question])
        setNewQuestion({
          questionText: '',
          questionType: 'text',
          options: [],
          required: true,
          optionInput: ''
        })
        setShowForm(false)
        setError('')
      } else {
        const err = await res.json()
        setError(err.error || 'Failed to add question')
      }
    } catch (err) {
      console.error('Error adding question:', err)
      setError('Failed to add question')
    }
  }

  const deleteQuestion = async (questionId: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return

    try {
      const res = await fetch(`/api/listings/${listingId}/questions`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId })
      })

      if (res.ok) {
        const updated = questions.filter(q => q.id !== questionId)
        setQuestions(updated)
        onQuestionsChange?.(updated)
      }
    } catch (err) {
      console.error('Error deleting question:', err)
      setError('Failed to delete question')
    }
  }

  const addOption = () => {
    if (newQuestion.optionInput.trim()) {
      setNewQuestion(prev => ({
        ...prev,
        options: [...prev.options, prev.optionInput.trim()],
        optionInput: ''
      }))
    }
  }

  const removeOption = (index: number) => {
    setNewQuestion(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index)
    }))
  }

  if (loading) {
    return <div className="text-center py-4 text-gray-500">Loading questions...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-900">Screening Questions</h3>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="px-3 py-1.5 bg-lime-500 hover:bg-lime-600 text-white text-sm font-semibold rounded-lg transition"
        >
          {showForm ? '✕ Cancel' : '+ Add Question'}
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Existing Questions */}
      {questions.length > 0 && (
        <div className="space-y-3">
          {questions.map((q, idx) => (
            <div key={q.id} className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-gray-900">Q{idx + 1}: {q.questionText}</h4>
                <button
                  type="button"
                  onClick={() => deleteQuestion(q.id)}
                  className="text-red-500 hover:text-red-700 text-sm font-medium"
                >
                  Delete
                </button>
              </div>
              <p className="text-sm text-gray-600">
                Type: <span className="font-medium">{questionTypes.find(t => t.value === q.questionType)?.label}</span>
              </p>
              {q.options && q.options.length > 0 && (
                <div className="mt-2 text-sm text-gray-600">
                  Options: {q.options.join(', ')}
                </div>
              )}
              {!q.required && (
                <p className="mt-1 text-xs text-gray-500 italic">Optional</p>
              )}
            </div>
          ))}
        </div>
      )}

      {questions.length === 0 && !showForm && (
        <p className="text-sm text-gray-500 py-4 text-center">
          No questions yet. Add one to screen applicants.
        </p>
      )}

      {/* Add Question Form */}
      {showForm && (
        <form onSubmit={addQuestion} className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Question *
            </label>
            <textarea
              value={newQuestion.questionText}
              onChange={(e) => setNewQuestion({ ...newQuestion, questionText: e.target.value })}
              placeholder="What would you like to ask applicants?"
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Question Type *
            </label>
            <select
              value={newQuestion.questionType}
              onChange={(e) => setNewQuestion({ ...newQuestion, questionType: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              {questionTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {['radio', 'checkbox'].includes(newQuestion.questionType) && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Options *
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newQuestion.optionInput}
                  onChange={(e) => setNewQuestion({ ...newQuestion, optionInput: e.target.value })}
                  placeholder="Add an option"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addOption()
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={addOption}
                  className="px-3 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 text-sm font-medium rounded-lg transition"
                >
                  Add
                </button>
              </div>
              {newQuestion.options.length > 0 && (
                <div className="space-y-1">
                  {newQuestion.options.map((opt, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-white p-2 rounded border border-gray-200 text-sm">
                      <span>{opt}</span>
                      <button
                        type="button"
                        onClick={() => removeOption(idx)}
                        className="text-red-500 hover:text-red-700 text-xs font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={newQuestion.required}
              onChange={(e) => setNewQuestion({ ...newQuestion, required: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-gray-700 font-medium">Required field</span>
          </label>

          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition"
            >
              Add Question
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg transition"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
