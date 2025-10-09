import React from 'react'
import Link from 'next/link'

const ErrorPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center p-8">
        <img 
          src="/globe.svg" 
          alt="Error"
          className="w-32 h-32 mx-auto mb-6 animate-bounce"
        />
        <h1 className="text-4xl font-bold text-red-600 mb-4">Oops!</h1>
        <p className="text-gray-800 text-lg mb-6">
          Something went wrong. Please try again later.
        </p>
        <Link 
          href="/"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          Return Home
        </Link>
      </div>
    </div>
  )
}

export default ErrorPage
