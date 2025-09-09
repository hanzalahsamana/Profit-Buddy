import { authClient } from '../Services/Axios';
import { EndPoints } from '../Utils/EndPoints';

export const upsertHistory = async ({ asin, buyCost }) => {
  try {
    const { data } = await authClient.post(EndPoints.upsertHistory, { asin, buyCost });
    return data;
  } catch (err) {
    console.error('Failed to upsert history:', err);
  }
};
