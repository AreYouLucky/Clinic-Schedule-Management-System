import React from 'react'

export default function Divider({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative my-8">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-200"></div>
      </div>
      <div className="relative flex justify-center">
        {children}
      </div>
    </div>
  )
}
