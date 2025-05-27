import axios from 'axios';

export async function pushOpportunity(opportunity: any) {
  try {
    await axios.post(`${process.env.BACKEND_API_URL}/api/opportunities`, opportunity, {
      headers: {
        Authorization: `Bearer ${process.env.API_SECRET}`
      }
    });
    console.log('📤 Opportunity pushed to backend');
  } catch (err: any) {
    console.error('❌ Failed to push opportunity:', err.message);
  }
}
