import React from 'react'
import { useTestAuth } from './SimpleAuthProvider'

export const SimpleTest: React.FC = () => {
  console.log('SimpleTest: Component rendering')
  
  try {
    const value = useTestAuth()
    console.log('SimpleTest: Successfully got context value:', value)
    
    return (
      <div>
        <h2>Simple Context Test</h2>
        <p>Context Value: {value}</p>
        <p>Test Status: SUCCESS</p>
      </div>
    )
  } catch (error) {
    console.error('SimpleTest: Error using context', error)
    return (
      <div>
        <h2>Simple Context Test Error</h2>
        <p>Error: {error.message}</p>
        <p>Test Status: FAILED</p>
      </div>
    )
  }
}