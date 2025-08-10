import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';

interface User {
  _id: string;
  name: string;
  email: string;
  position: number;
  referralCount: number;
  credits: number;
  status: string;
}

const WaitlistStatus = () => {
  console.log('WaitlistStatus component rendered');
  
  const [, setLocation] = useLocation();
  
  // Get user ID from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get('user');

  // Fetch user data
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ['/api/users', userId],
    queryFn: async () => {
      const response = await fetch(`/api/users/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      return response.json();
    },
    enabled: !!userId
  });

  if (isLoading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#f8fafc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '50px', 
            height: '50px', 
            border: '4px solid #e2e8f0', 
            borderTop: '4px solid #3b82f6', 
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }} />
          <p style={{ color: '#6b7280' }}>Loading your status...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8fafc',
      padding: '2rem',
      position: 'relative'
    }}>
      {/* Fixed Simple Status Card */}
      <div style={{ 
        position: 'fixed', 
        top: '50%', 
        left: '50%', 
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#ffffff',
        padding: '3rem',
        borderRadius: '1rem',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        zIndex: 1000,
        maxWidth: '500px',
        width: '90%'
      }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: 'bold', 
          color: '#1f2937',
          marginBottom: '1rem'
        }}>
          🎉 VeeFore Status Dashboard
        </h1>
        
        <div style={{ 
          padding: '1.5rem', 
          backgroundColor: '#f3f4f6', 
          borderRadius: '0.75rem',
          marginBottom: '2rem'
        }}>
          <p style={{ 
            fontSize: '1.2rem', 
            color: '#374151',
            marginBottom: '0.5rem'
          }}>
            Welcome back, <strong>{user?.name || 'Member'}</strong>!
          </p>
          <p style={{ 
            fontSize: '1rem', 
            color: '#6b7280'
          }}>
            You're position <strong>#{user?.position || '247'}</strong> in the waitlist
          </p>
        </div>

        {/* Stats Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)', 
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div style={{ 
            padding: '1rem', 
            backgroundColor: '#ecfdf5', 
            borderRadius: '0.5rem',
            border: '1px solid #d1fae5'
          }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#065f46' }}>
              {user?.referralCount || 0}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#047857' }}>Friends Invited</div>
          </div>
          <div style={{ 
            padding: '1rem', 
            backgroundColor: '#eff6ff', 
            borderRadius: '0.5rem',
            border: '1px solid #dbeafe'
          }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e40af' }}>
              {user?.credits || 0}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#2563eb' }}>Credits Earned</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button 
            onClick={() => setLocation('/waitlist')}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'medium'
            }}
          >
            ← Back to Waitlist
          </button>
          <button 
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#f3f4f6',
              color: '#374151',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'medium'
            }}
          >
            Share Referral
          </button>
        </div>
      </div>

      {/* Simple CSS Animation */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default WaitlistStatus;