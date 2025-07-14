// Fix content status via API call
import fetch from 'node-fetch';

async function fixContentStatus() {
  try {
    // First get all scheduled content
    const response = await fetch('http://localhost:5000/api/content?workspaceId=6841a7d5d70118ce230574f8&status=scheduled', {
      headers: {
        'Authorization': 'Bearer ' + process.env.FIREBASE_TOKEN
      }
    });
    
    const content = await response.json();
    console.log('Found content:', content);
    
    // Find the story content and update it
    const storyContent = content.find(c => c.type === 'story' && c.title === 'dvd');
    if (storyContent) {
      console.log('Updating story content status:', storyContent.id);
      
      const updateResponse = await fetch(`http://localhost:5000/api/content/${storyContent.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + process.env.FIREBASE_TOKEN
        },
        body: JSON.stringify({
          status: 'published',
          publishedAt: new Date()
        })
      });
      
      const result = await updateResponse.json();
      console.log('Update result:', result);
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

fixContentStatus();