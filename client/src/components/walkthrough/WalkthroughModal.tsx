interface WalkthroughModalProps {
  open: boolean
  onClose: () => void
  userName?: string
}

export default function WalkthroughModal({ open, onClose, userName }: WalkthroughModalProps) {
  console.log('🎯 WALKTHROUGH MODAL: Component function called with open:', open, 'userName:', userName)
  
  if (!open) {
    console.log('🎯 WALKTHROUGH MODAL: Open is false, returning null')
    return null
  }
  
  console.log('🎯 WALKTHROUGH MODAL: About to render ultra-simple test modal')
  
  try {
    console.log('🎯 WALKTHROUGH MODAL: Inside try block, rendering basic modal')
    
    return (
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}
        onClick={onClose}
      >
        <div 
          style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '1rem',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            maxWidth: '400px',
            width: '90%'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            🎯 VeeFore Walkthrough
          </h2>
          <p style={{ marginBottom: '1rem', color: '#666' }}>
            Welcome, {userName}! This is a basic test modal to see if it renders.
          </p>
          <button 
            onClick={onClose}
            style={{
              backgroundColor: '#8b5cf6',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Close Modal
          </button>
        </div>
      </div>
    )
  } catch (error) {
    console.error('🎯 WALKTHROUGH MODAL: Error rendering:', error)
    return (
      <div style={{ 
        position: 'fixed', 
        top: '20px', 
        right: '20px', 
        backgroundColor: 'red', 
        color: 'white', 
        padding: '1rem',
        borderRadius: '0.5rem',
        zIndex: 1000
      }}>
        Modal Error: {String(error)}
      </div>
    )
  }
}