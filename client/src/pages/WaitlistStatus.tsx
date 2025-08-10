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
      padding: '2rem'
    }}>
      {/* Full Page Status Layout - NO POPUP */}
      <div style={{ 
        maxWidth: '1200px',
        margin: '0 auto',
        backgroundColor: '#ffffff',
        padding: '2rem',
        borderRadius: '1rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}>
        {/* Header Section */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '2rem',
          paddingBottom: '1rem',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold', 
            color: '#1f2937',
            margin: 0
          }}>
            🎉 VeeFore Status Dashboard
          </h1>
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
        </div>

        {/* Welcome Section */}
        <div style={{ 
          padding: '2rem', 
          backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '1rem',
          marginBottom: '2rem',
          color: 'white',
          textAlign: 'center'
        }}>
          <h2 style={{ 
            fontSize: '2rem', 
            fontWeight: 'bold',
            marginBottom: '1rem',
            margin: 0
          }}>
            Welcome back, {user?.name || 'Member'}!
          </h2>
          <p style={{ 
            fontSize: '1.2rem', 
            opacity: 0.9,
            margin: 0
          }}>
            You're position <strong>#{user?.position || '247'}</strong> in the VeeFore early access waitlist
          </p>
        </div>

        {/* Stats Grid - Full Width */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <div style={{ 
            padding: '1.5rem', 
            backgroundColor: '#ecfdf5', 
            borderRadius: '1rem',
            border: '1px solid #d1fae5',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#065f46', marginBottom: '0.5rem' }}>
              {user?.referralCount || 0}
            </div>
            <div style={{ fontSize: '1rem', color: '#047857', fontWeight: 'medium' }}>Friends Invited</div>
            <div style={{ fontSize: '0.875rem', color: '#059669', marginTop: '0.5rem' }}>
              +{user?.referralCount * 10 || 0} bonus credits
            </div>
          </div>
          
          <div style={{ 
            padding: '1.5rem', 
            backgroundColor: '#eff6ff', 
            borderRadius: '1rem',
            border: '1px solid #dbeafe',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1e40af', marginBottom: '0.5rem' }}>
              {user?.credits || 0}
            </div>
            <div style={{ fontSize: '1rem', color: '#2563eb', fontWeight: 'medium' }}>Credits Earned</div>
            <div style={{ fontSize: '0.875rem', color: '#3b82f6', marginTop: '0.5rem' }}>
              Early access rewards
            </div>
          </div>

          <div style={{ 
            padding: '1.5rem', 
            backgroundColor: '#fdf2f8', 
            borderRadius: '1rem',
            border: '1px solid #fce7f3',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#be185d', marginBottom: '0.5rem' }}>
              78%
            </div>
            <div style={{ fontSize: '1rem', color: '#c2185b', fontWeight: 'medium' }}>Launch Progress</div>
            <div style={{ fontSize: '0.875rem', color: '#ec4899', marginTop: '0.5rem' }}>
              Almost ready!
            </div>
          </div>
        </div>

        {/* Status Updates Section */}
        <div style={{ 
          backgroundColor: '#f9fafb',
          padding: '1.5rem',
          borderRadius: '1rem',
          marginBottom: '2rem'
        }}>
          <h3 style={{ 
            fontSize: '1.5rem', 
            fontWeight: 'bold', 
            color: '#374151',
            marginBottom: '1rem',
            margin: 0,
            marginBottom: '1rem'
          }}>
            Latest Updates
          </h3>
          <div style={{ space: '1rem' }}>
            <div style={{ 
              padding: '1rem',
              backgroundColor: 'white',
              borderRadius: '0.5rem',
              marginBottom: '0.75rem',
              borderLeft: '4px solid #10b981'
            }}>
              <div style={{ fontWeight: 'medium', color: '#374151' }}>Platform Beta Testing Complete</div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
                All core features tested and optimized for launch
              </div>
            </div>
            <div style={{ 
              padding: '1rem',
              backgroundColor: 'white',
              borderRadius: '0.5rem',
              marginBottom: '0.75rem',
              borderLeft: '4px solid #3b82f6'
            }}>
              <div style={{ fontWeight: 'medium', color: '#374151' }}>Infrastructure Scaling</div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
                Servers ready to handle increased user load
              </div>
            </div>
            <div style={{ 
              padding: '1rem',
              backgroundColor: 'white',
              borderRadius: '0.5rem',
              borderLeft: '4px solid #f59e0b'
            }}>
              <div style={{ fontWeight: 'medium', color: '#374151' }}>Final Security Audit</div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
                Currently in progress - Expected completion this week
              </div>
            </div>
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
            style={{
              padding: '1rem 2rem',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '0.75rem',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'medium'
            }}
          >
            Share Referral Code
          </button>
          <button 
            style={{
              padding: '1rem 2rem',
              backgroundColor: '#f3f4f6',
              color: '#374151',
              border: '1px solid #d1d5db',
              borderRadius: '0.75rem',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'medium'
            }}
          >
            Download Mobile App
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