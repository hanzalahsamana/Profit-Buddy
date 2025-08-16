import axios from 'axios';
import { EndPoints } from '../Utils/EndPoints';
import { store } from '../Redux/Store';
import { setProducts, setProductsLoading } from '../Redux/Slices/productSlice';

export const searchProducts = async (searchTerm, page = 0) => {
  try {
    const query =new URLSearchParams({
      searchTerm: searchTerm,
      page: page,
    });
    store.dispatch(setProductsLoading(true));
    const response = await axios.get(`${EndPoints.searchProducts}?${query.toString()}`);
    store.dispatch(setProducts(response?.data?.products));
    return response.data;
  } catch (error) {
    store.dispatch(setProducts([]));
    throw error;
  } finally {
    store.dispatch(setProductsLoading(false));
  }
};
