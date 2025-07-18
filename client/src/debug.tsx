import React from 'react'
import ReactDOM from 'react-dom/client'

// Debug logging
console.log('=== DEBUG START ===')
console.log('React:', React)
console.log('ReactDOM:', ReactDOM)
console.log('document:', document)
console.log('document.getElementById("root"):', document.getElementById('root'))

// Test basic React mounting
const rootElement = document.getElementById('root')
if (rootElement) {
  console.log('Root element found, creating React root...')
  try {
    const root = ReactDOM.createRoot(rootElement)
    console.log('React root created successfully')
    
    // Simple component test
    const TestComponent = () => {
      console.log('TestComponent rendering...')
      return React.createElement('div', { 
        style: { 
          padding: '20px', 
          background: '#f0f0f0', 
          textAlign: 'center' 
        } 
      }, 'React is working!')
    }
    
    root.render(React.createElement(TestComponent))
    console.log('React component rendered')
  } catch (error) {
    console.error('Error creating React root:', error)
  }
} else {
  console.error('Root element not found!')
}

console.log('=== DEBUG END ===')