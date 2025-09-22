import BASE_URL from './../../config';
import { EndPoints } from './../Utils/EndPoints';

export const aiChatStream = async ({ message = '' }) => {
  try {
    const token = localStorage.getItem('ProfitBuddyToken'); // get your auth token

    const response = await fetch(`${BASE_URL}${EndPoints.aiChat}?message=${encodeURIComponent(message)}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error('SSE failed:', err);
    throw error;
  }
};
