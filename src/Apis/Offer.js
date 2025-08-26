import axios from "axios";
import { EndPoints } from "../Utils/EndPoints";

export const getProductOffers = async (asin = '') => {
  try {
    const query = new URLSearchParams({
      asin,
    });
    const response = await axios.get(`${EndPoints.getProductOffer}?${query.toString()}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
