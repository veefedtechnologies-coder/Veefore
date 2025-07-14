// Quick fix to update cvfbf workspace credits via API
async function fixCreditsViaAPI() {
  try {
    console.log('=== FIXING CVFBF WORKSPACE CREDITS VIA API ===');
    
    // Get current workspace data
    const workspacesResponse = await fetch('http://localhost:5000/api/workspaces', {
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODQ0MDI3NDI2Y2FlMDIwMGY4OGI1ZGIiLCJlbWFpbCI6ImNob3VkaGFyeWFycGl0OTc3QGdtYWlsLmNvbSIsImlhdCI6MTczMzc0NzE1MSwiZXhwIjoxNzM0MzUxOTUxfQ.V5qO0N8aU2YgU4uiagJxfqOe-_QCuFCXqPGK3o44TwGXUe-vAKCJbhWGsIl_SYRyFSlCJqVOqH5_fzASi2G0iNJIr_xZFNS6TqCqZpZxLnm4vJqSKpB3Ol3iRwUlF6EKHP3qVJoOvEPGJzz-uN_CNsyLgNmGJOBCF4wqJVyWYOiJF8__ZlZ1QGfKXsGFvY-H-nJpKy-i9Oq4PqU_Q8Q2DQeG9HBV_zI1M3A5nX8qO7pWFNFNgJ7kQlJgOlOGK7PqYxuRTM8zHvTpVpH-uBqLFBIJgvQZ8KJ0QVJ-8F4Lh5_z6M-nTqGzXJr-L8SYTJZ_F1A'
      }
    });
    
    if (!workspacesResponse.ok) {
      throw new Error(`Failed to fetch workspaces: ${workspacesResponse.status}`);
    }
    
    const workspaces = await workspacesResponse.json();
    console.log('Found workspaces:', workspaces.map(w => `${w.name}: ${w.credits} credits`));
    
    // Find cvfbf workspace
    const cvfbfWorkspace = workspaces.find(w => w.name === 'cvfbf');
    if (!cvfbfWorkspace) {
      console.log('❌ cvfbf workspace not found');
      return;
    }
    
    console.log(`Current cvfbf credits: ${cvfbfWorkspace.credits}`);
    
    // Update cvfbf workspace to have 2 credits
    const updateResponse = await fetch(`http://localhost:5000/api/workspaces/${cvfbfWorkspace.id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODQ0MDI3NDI2Y2FlMDIwMGY4OGI1ZGIiLCJlbWFpbCI6ImNob3VkaGFyeWFycGl0OTc3QGdtYWlsLmNvbSIsImlhdCI6MTczMzc0NzE1MSwiZXhwIjoxNzM0MzUxOTUxfQ.V5qO0N8aU2YgU4uiagJxfqOe-_QCuFCXqPGK3o44TwGXUe-vAKCJbhWGsIl_SYRyFSlCJqVOqH5_fzASi2G0iNJIr_xZFNS6TqCqZpZxLnm4vJqSKpB3Ol3iRwUlF6EKHP3qVJoOvEPGJzz-uN_CNsyLgNmGJOBCF4wqJVyWYOiJF8__ZlZ1QGfKXsGFvY-H-nJpKy-i9Oq4PqU_Q8Q2DQeG9HBV_zI1M3A5nX8qO7pWFNFNgJ7kQlJgOlOGK7PqYxuRTM8zHvTpVpH-uBqLFBIJgvQZ8KJ0QVJ-8F4Lh5_z6M-nTqGzXJr-L8SYTJZ_F1A',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        credits: 2
      })
    });
    
    if (updateResponse.ok) {
      console.log('✅ cvfbf workspace credits updated to 2');
    } else {
      console.log(`❌ Failed to update credits: ${updateResponse.status}`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

fixCreditsViaAPI();