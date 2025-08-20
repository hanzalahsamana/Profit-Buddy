import axios from 'axios';
import { EndPoints } from '../Utils/EndPoints';
import { store } from '../Redux/Store';
import { setCurrentPage, setProducts, setProductsLoading } from '../Redux/Slices/ProductSlice';

export const searchProducts = async (searchTerm, page = 0) => {
  try {
    const query = new URLSearchParams({
      searchTerm: searchTerm,
      page: page,
    });
    store.dispatch(setProductsLoading(true));
    const response = await axios.get(`${EndPoints.searchProducts}?${query.toString()}`);
   
    return response.data.products;
  } catch (error) {
    throw error;
  } finally {
    store.dispatch(setProductsLoading(false));
  }
};

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
