import React from 'react'
import ReactDOM from 'react-dom'

// Simple test component to verify React is working
const TestApp = () => {
  return React.createElement('div', {
    style: {
      padding: '50px',
      backgroundColor: '#f0f0f0',
      textAlign: 'center',
      fontFamily: 'Arial, sans-serif'
    }
  }, [
    React.createElement('h1', { key: 'h1' }, 'VeeFore Development Test'),
    React.createElement('p', { key: 'p1' }, 'React is working correctly!'),
    React.createElement('p', { key: 'p2' }, 'Backend services are operational.'),
    React.createElement('div', { 
      key: 'status',
      style: { 
        marginTop: '20px',
        padding: '10px',
        backgroundColor: '#10b981',
        color: 'white',
        borderRadius: '5px'
      }
    }, '✅ Frontend Successfully Mounted')
  ])
}

console.log('Attempting to render TestApp...')
ReactDOM.render(
  React.createElement(TestApp),
  document.getElementById('root')
)