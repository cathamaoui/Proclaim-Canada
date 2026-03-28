'use client'

import { useState } from 'react'

interface PDFViewerModalProps {
  pdfUrl: string
  preacherName: string
}

export default function PDFViewerModal({ pdfUrl, preacherName }: PDFViewerModalProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* View Resume Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
      >
        📄 View Resume
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full h-full max-w-4xl max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between border-b p-4 bg-gray-50">
              <h2 className="text-xl font-bold text-gray-900">
                {preacherName}'s Resume
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold w-10 h-10 flex items-center justify-center hover:bg-gray-200 rounded"
              >
                ✕
              </button>
            </div>

            {/* PDF Viewer */}
            <div className="flex-1 overflow-auto bg-gray-100">
              <embed
                src={pdfUrl}
                type="application/pdf"
                className="w-full h-full"
                style={{ border: 'none' }}
              />
            </div>

            {/* Footer with Download Button */}
            <div className="border-t p-4 bg-gray-50 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                If the PDF doesn't display, you can download it
              </p>
              <div className="flex gap-3">
                <a
                  href={pdfUrl}
                  download
                  className="inline-flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-semibold text-sm"
                >
                  ⬇️ Download PDF
                </a>
                <button
                  onClick={() => setIsOpen(false)}
                  className="inline-flex items-center bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition-colors font-semibold text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
