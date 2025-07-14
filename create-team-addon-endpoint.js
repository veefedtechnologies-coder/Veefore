import fetch from 'node-fetch';

async function createTeamAddonDirectly() {
  try {
    console.log('Creating team member addon via API endpoint...');
    
    // First, let's check what payments exist for the user
    const checkPaymentsResponse = await fetch('http://localhost:5000/api/debug-payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: '6844027426cae0200f88b5db'
      })
    });

    if (checkPaymentsResponse.ok) {
      const paymentsData = await checkPaymentsResponse.json();
      console.log('Payments data:', paymentsData);
    }

    // Create the team member addon directly
    const response = await fetch('http://localhost:5000/api/create-team-addon', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: '6844027426cae0200f88b5db',
        name: 'Additional Team Member Seat',
        type: 'team-member',
        price: 19900,
        isActive: true,
        metadata: {
          createdFromPayment: true,
          autoCreated: true,
          reason: 'Missing addon record for successful payment'
        }
      })
    });

    if (response.ok) {
      const result = await response.json();
      console.log('Successfully created team member addon:', result);
    } else {
      const error = await response.text();
      console.error('Failed to create addon:', error);
    }

  } catch (error) {
    console.error('Error creating team addon:', error);
  }
}

createTeamAddonDirectly();