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

interface Answer {
  questionId: string
  answerText?: string
  answerFile?: string
  answerOptions?: string[]
}

interface ApplicationQuestionsFormProps {
  listingId: string
  applicationId?: string
  onSubmit: (answers: Answer[]) => Promise<void>
  isLoading?: boolean
}

export default function ApplicationQuestionsForm({
  listingId,
  applicationId,
  onSubmit,
  isLoading = false
}: ApplicationQuestionsFormProps) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<Record<string, Answer>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchQuestions()
    if (applicationId) {
      fetchExistingAnswers()
    }
  }, [listingId, applicationId])

  const fetchQuestions = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/listings/${listingId}/questions`)
      if (res.ok) {
        const data = await res.json()
        setQuestions(data.questions || [])
        
        // Initialize answers object
        const initialAnswers: Record<string, Answer> = {}
        data.questions.forEach((q: Question) => {
          initialAnswers[q.id] = {
            questionId: q.id
          }
        })
        setAnswers(initialAnswers)
      }
    } catch (err) {
      console.error('Error fetching questions:', err)
      setError('Failed to load questions')
    } finally {
      setLoading(false)
    }
  }

  const fetchExistingAnswers = async () => {
    if (!applicationId) return
    try {
      const res = await fetch(`/api/applications/${applicationId}/answers`)
      if (res.ok) {
        const data = await res.json()
        const existing: Record<string, Answer> = {}
        data.answers.forEach((ans: any) => {
          existing[ans.questionId] = {
            questionId: ans.questionId,
            answerText: ans.answerText,
            answerFile: ans.answerFile,
            answerOptions: ans.answerOptions
          }
        })
        setAnswers(prev => ({ ...prev, ...existing }))
      }
    } catch (err) {
      console.error('Error fetching existing answers:', err)
    }
  }

  const handleAnswerChange = (questionId: string, value: string | string[]) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        answerText: typeof value === 'string' ? value : undefined,
        answerOptions: Array.isArray(value) ? value : undefined
      }
    }))
  }

  const handleFileUpload = async (questionId: string, file: File) => {
    // For now, store file reference. In production, upload to cloud storage
    setAnswers(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        answerFile: file.name
      }
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate required fields
    for (const q of questions) {
      if (q.required && !answers[q.id]?.answerText && !answers[q.id]?.answerFile && !answers[q.id]?.answerOptions?.length) {
        setError(`${q.questionText} is required`)
        return
      }
    }

    setSubmitting(true)
    setError('')

    try {
      await onSubmit(Object.values(answers))
    } catch (err) {
      console.error('Error submitting answers:', err)
      setError(err instanceof Error ? err.message : 'Failed to submit answers')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="text-center py-4 text-gray-500">Loading questions...</div>
  }

  if (questions.length === 0) {
    return null
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm font-medium">
          {error}
        </div>
      )}

      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Application Questions</h3>
        <p className="text-sm text-gray-600 mb-6">
          Please answer the following questions to complete your application.
        </p>

        <div className="space-y-6">
          {questions.map((q, idx) => (
            <div key={q.id} className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <label className="block font-semibold text-gray-900 mb-3">
                Q{idx + 1}: {q.questionText}
                {q.required && <span className="text-red-500 ml-1">*</span>}
              </label>

              {q.questionType === 'text' && (
                <input
                  type="text"
                  value={answers[q.id]?.answerText || ''}
                  onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                  placeholder="Your answer here..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required={q.required}
                />
              )}

              {q.questionType === 'textarea' && (
                <textarea
                  value={answers[q.id]?.answerText || ''}
                  onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                  placeholder="Your detailed answer here..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required={q.required}
                />
              )}

              {q.questionType === 'radio' && q.options && (
                <div className="space-y-2">
                  {q.options.map((option) => (
                    <label key={option} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name={q.id}
                        value={option}
                        checked={answers[q.id]?.answerText === option}
                        onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                        className="w-4 h-4 rounded border-gray-300"
                        required={q.required}
                      />
                      <span className="text-gray-700 text-sm">{option}</span>
                    </label>
                  ))}
                </div>
              )}

              {q.questionType === 'checkbox' && q.options && (
                <div className="space-y-2">
                  {q.options.map((option) => (
                    <label key={option} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        value={option}
                        checked={(answers[q.id]?.answerOptions || []).includes(option)}
                        onChange={(e) => {
                          const current = answers[q.id]?.answerOptions || []
                          const updated = e.target.checked
                            ? [...current, option]
                            : current.filter(o => o !== option)
                          handleAnswerChange(q.id, updated)
                        }}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <span className="text-gray-700 text-sm">{option}</span>
                    </label>
                  ))}
                </div>
              )}

              {q.questionType === 'file' && (
                <input
                  type="file"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      handleFileUpload(q.id, e.target.files[0])
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required={q.required}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting || isLoading}
        className="w-full px-4 py-3 bg-lime-500 hover:bg-lime-600 disabled:bg-gray-400 text-white font-bold rounded-lg transition"
      >
        {submitting || isLoading ? 'Submitting...' : 'Submit Answers'}
      </button>
    </form>
  )
}
