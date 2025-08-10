import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';

interface WaitlistUser {
  id: string;
  name: string;
  email: string;
  referralCode: string;
  referredBy?: string;
  referralCount: number;
  credits: number;
  status: string;
  joinedAt: string;
  position?: number;
  metadata?: {
    questionnaire?: any;
  };
}

const WaitlistStatus = () => {
  console.log('WaitlistStatus component rendered');
  
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [user, setUser] = useState<WaitlistUser | null>(null);
  const [copiedReferral, setCopiedReferral] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('user');
    
    console.log('WaitlistStatus: URL params:', { userId, fullUrl: window.location.href });
    
    if (userId) {
      fetchUserData(userId);
    } else {
      console.log('WaitlistStatus: No user ID found, redirecting to waitlist');
      setLocation('/waitlist');
    }
  }, []);

  const fetchUserData = async (userId: string) => {
    try {
      const response = await fetch(`/api/early-access/status/user/${userId}`);
      const data = await response.json();
      
      if (data.success) {
        setUser(data.user);
      } else {
        toast({
          title: "Error",
          description: "Could not load your waitlist status.",
          variant: "destructive",
        });
        setLocation('/waitlist');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setLocation('/waitlist');
    } finally {
      setLoading(false);
    }
  };

  const copyReferralCode = async () => {
    if (!user?.referralCode) return;
    
    try {
      await navigator.clipboard.writeText(`https://veefore.com/waitlist?ref=${user.referralCode}`);
      setCopiedReferral(true);
      toast({
        title: "Referral link copied!",
        description: "Share it with friends to skip ahead in line.",
      });
      setTimeout(() => setCopiedReferral(false), 2000);
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your status...</p>
        </div>
      </div>
    );
  }

  console.log('WaitlistStatus: About to render with user:', user, 'loading:', loading);
  
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: '#ffffff',
      zIndex: 10000,
      padding: '2rem',
      overflow: 'auto'
    }}>
      <h1 style={{ fontSize: '2rem', color: '#000000', marginBottom: '1rem' }}>
        VeeFore Waitlist Status
      </h1>
      <p style={{ fontSize: '1.2rem', color: '#333333', marginBottom: '2rem' }}>
        Hello {user?.name || 'Member'}! You're position #{user?.position || '247'} in the waitlist
      </p>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(2, 1fr)', 
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div style={{ 
          backgroundColor: '#f5f5f5', 
          padding: '1rem', 
          borderRadius: '0.5rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#000' }}>
            {user?.referralCount || 0}
          </div>
          <div style={{ color: '#666' }}>Friends Invited</div>
        </div>
        <div style={{ 
          backgroundColor: '#f5f5f5', 
          padding: '1rem', 
          borderRadius: '0.5rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#000' }}>
            {user?.credits || 0}
          </div>
          <div style={{ color: '#666' }}>Credits Earned</div>
        </div>
      </div>
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            VeeFore Waitlist Status
          </h1>
          <p className="text-gray-600 text-lg">
            Hello {user?.name || 'Member'}! You're position #{user?.position || '247'} in the waitlist
          </p>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <div className="text-2xl font-bold text-gray-900 mb-2">
              {user?.referralCount || 0}
            </div>
            <div className="text-gray-600">Friends Invited</div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <div className="text-2xl font-bold text-gray-900 mb-2">
              {user?.credits || 0}
            </div>
            <div className="text-gray-600">Credits Earned</div>
          </div>
        </div>
        
        {/* Referral Section */}
        {user && (
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Your Referral Code
            </h3>
            <p className="text-blue-700 mb-4">
              Share this link with friends to move up in the waitlist together!
            </p>
            <div className="flex items-center space-x-3">
              <code className="flex-1 bg-white border rounded px-3 py-2 text-sm">
                https://veefore.com/waitlist?ref={user.referralCode || 'SAMPLE123'}
              </code>
              <button
                onClick={copyReferralCode}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                {copiedReferral ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        )}

        {/* Back Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => setLocation('/waitlist')}
            className="text-blue-600 hover:text-blue-700 underline"
          >
            ← Back to Waitlist
          </button>
        </div>
      </div>
    </div>
  );
};

export default WaitlistStatus;