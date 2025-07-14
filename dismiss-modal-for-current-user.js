/**
 * Dismiss Both Modals for Current User
 * This script sets the localStorage flags to prevent both modals from showing again
 */

// Since the current user already has 634 credits (already claimed), 
// we need to set the localStorage flags to prevent both modals from appearing

if (typeof window !== 'undefined' && window.localStorage) {
  const userEmail = 'arpitchoudhary128@gmail.com';
  
  // Dismiss the starter plan welcome modal
  const modalKey = `welcome-modal-dismissed-${userEmail}`;
  localStorage.setItem(modalKey, 'true');
  console.log('✅ Welcome modal dismissal flag set for:', userEmail);
  
  // Dismiss the early access notification modal
  const notificationKey = `early-access-notification-dismissed-${userEmail}`;
  localStorage.setItem(notificationKey, 'true');
  console.log('✅ Early access notification dismissal flag set for:', userEmail);
  
  console.log('\n🎉 Both modals have been permanently dismissed!');
  console.log('- Welcome modal will no longer appear on dashboard');
  console.log('- Early access notification will no longer appear on auth page');
  console.log('\nYou can verify this by checking localStorage:');
  console.log('Welcome modal:', localStorage.getItem(modalKey));
  console.log('Notification modal:', localStorage.getItem(notificationKey));
} else {
  console.log('This script should be run in the browser console, not in Node.js');
}