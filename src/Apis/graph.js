import axios from 'axios';
import { EndPoints } from '../Utils/EndPoints';

export const getGraphData = async (asin = '', days = 'all') => {
  try {
    const query = new URLSearchParams({
      asin,
      days
    });
    const { data } = await axios.get(`${EndPoints.getGraphData}?${query.toString()}`);
    return data?.grpahData;
  } catch (error) {
    throw error;
  }
};
