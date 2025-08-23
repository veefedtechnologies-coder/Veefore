// ULTRA SIMPLE TEST COMPONENT
interface OnboardingModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
  console.log('🔵 SIMPLE MODAL CALLED - isOpen:', isOpen)
  console.log('🔵 SIMPLE MODAL PROPS:', { isOpen, onClose })
  
  if (!isOpen) {
    console.log('🔴 SIMPLE MODAL - returning null')
    return null
  }
  
  console.log('✅ SIMPLE MODAL - rendering now!')
  
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 99999
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        maxWidth: '400px',
        width: '90%'
      }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>
          🎉 Onboarding Test Works!
        </h2>
        <p style={{ marginBottom: '16px', color: '#666' }}>
          The strict signup flow is working correctly.
        </p>
        <button 
          onClick={onClose}
          style={{
            backgroundColor: '#059669',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
            width: '100%',
            fontSize: '16px'
          }}
        >
          Complete Onboarding
        </button>
      </div>
    </div>
  )
}