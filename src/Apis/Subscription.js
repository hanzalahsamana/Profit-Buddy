import { authClient } from '../Services/Axios';
import { EndPoints } from '../Utils/EndPoints';

export const createSubscription = async (payload) => {
  try {
    const { data } = await authClient.post(EndPoints.createSubscription, payload);
    return data;
  } catch (err) {
    console.error('Failed to upsert history:', err);
    throw err;
  }
};

export const cancelSubscription = async () => {
  try {
    const { data } = await authClient.post(EndPoints.cancelSubscription);
    return data;
  } catch (err) {
    console.error('Failed to upsert history:', err);
    throw err;
  }
};
