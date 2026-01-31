/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  safelist: [
    // Blue color classes for Mathematics
    'from-blue-50', 'to-blue-100', 'from-blue-200', 'to-blue-300',
    'border-blue-200', 'text-blue-600', 'text-blue-800', 'bg-blue-50', 'bg-blue-100',
    // Green color classes for Science/Environmental Science
    'from-green-50', 'to-green-100', 'from-green-200', 'to-green-300',
    'border-green-200', 'text-green-600', 'text-green-800', 'bg-green-50', 'bg-green-100',
    // Purple color classes
    'from-purple-50', 'to-purple-100', 'from-purple-200', 'to-purple-300',
    'border-purple-200', 'text-purple-600', 'text-purple-800', 'bg-purple-50', 'bg-purple-100',
    // Red color classes
    'from-red-50', 'to-red-100', 'from-red-200', 'to-red-300',
    'border-red-200', 'text-red-600', 'text-red-800', 'bg-red-50', 'bg-red-100',
    // Orange color classes
    'from-orange-50', 'to-orange-100', 'from-orange-200', 'to-orange-300',
    'border-orange-200', 'text-orange-600', 'text-orange-800', 'bg-orange-50', 'bg-orange-100',
    // Yellow color classes
    'from-yellow-50', 'to-yellow-100', 'from-yellow-200', 'to-yellow-300',
    'border-yellow-200', 'text-yellow-600', 'text-yellow-800', 'bg-yellow-50', 'bg-yellow-100',
    // Indigo color classes
    'from-indigo-50', 'to-indigo-100', 'from-indigo-200', 'to-indigo-300',
    'border-indigo-200', 'text-indigo-600', 'text-indigo-800', 'bg-indigo-50', 'bg-indigo-100',
    // Pink color classes
    'from-pink-50', 'to-pink-100', 'from-pink-200', 'to-pink-300',
    'border-pink-200', 'text-pink-600', 'text-pink-800', 'bg-pink-50', 'bg-pink-100',
    // Teal color classes
    'from-teal-50', 'to-teal-100', 'from-teal-200', 'to-teal-300',
    'border-teal-200', 'text-teal-600', 'text-teal-800', 'bg-teal-50', 'bg-teal-100',
    // Cyan color classes
    'from-cyan-50', 'to-cyan-100', 'from-cyan-200', 'to-cyan-300',
    'border-cyan-200', 'text-cyan-600', 'text-cyan-800', 'bg-cyan-50', 'bg-cyan-100',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};