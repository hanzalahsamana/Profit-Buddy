import axios from 'axios';
import { EndPoints } from '../Utils/EndPoints';

export const getSellerInfo = async (sellerId = '') => {
  try {
    const query = new URLSearchParams({
      sellerId,
    });
    const { data } = await axios.get(`${EndPoints.getSellerInfo}?${query.toString()}`);
    return data?.seller;
  } catch (error) {
    throw error;
  }
};

export const getSellerRevenue = async (sellerId = '', sellerAsins = '') => {
  try {
    const query = new URLSearchParams({
      sellerId,
      sellerAsins,
    });
    const { data } = await axios.get(`${EndPoints.getSellerRevenue}?${query.toString()}`);
    return data?.sellerRevenue;
  } catch (error) {
    throw error;
  }
};
