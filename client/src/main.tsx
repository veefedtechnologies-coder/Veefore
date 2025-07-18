// Pure JavaScript test without React dependencies
console.log('=== FRONTEND DEBUG START ===')
console.log('Document ready state:', document.readyState)
console.log('Root element exists:', !!document.getElementById('root'))

// Test DOM manipulation
const rootElement = document.getElementById('root')
if (rootElement) {
  console.log('Root element found, creating content...')
  
  // Create content using pure DOM manipulation
  const container = document.createElement('div')
  container.style.cssText = `
    padding: 50px;
    background-color: #f0f0f0;
    text-align: center;
    font-family: Arial, sans-serif;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  `
  
  const title = document.createElement('h1')
  title.textContent = 'VeeFore Development Test'
  title.style.marginBottom = '20px'
  
  const message1 = document.createElement('p')
  message1.textContent = 'Pure JavaScript is working!'
  message1.style.marginBottom = '10px'
  
  const message2 = document.createElement('p')
  message2.textContent = 'Backend services are operational.'
  message2.style.marginBottom = '20px'
  
  const status = document.createElement('div')
  status.textContent = '✅ Frontend Successfully Mounted (No React)'
  status.style.cssText = `
    margin-top: 20px;
    padding: 15px;
    background-color: #10b981;
    color: white;
    border-radius: 5px;
    font-weight: bold;
  `
  
  container.appendChild(title)
  container.appendChild(message1)
  container.appendChild(message2)
  container.appendChild(status)
  
  rootElement.appendChild(container)
  console.log('Content appended to root element')
} else {
  console.error('Root element not found!')
  document.body.innerHTML = '<div style="padding: 50px; color: red;">ERROR: Root element not found!</div>'
}

console.log('=== FRONTEND DEBUG END ===')