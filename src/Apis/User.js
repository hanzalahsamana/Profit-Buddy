import axios from 'axios';
import { EndPoints } from '../Utils/EndPoints';
import { setUser, setUserLoading } from '../Redux/Slices/UserSlice';
import { dispatch } from '../Redux/Store';
import { toast } from 'react-toastify';

export const registerUser = async (payload) => {
  try {
    const { data } = await axios.post(`${EndPoints.registerUser}`, payload);
    dispatch(setUser({ ...data?.user, token: data?.token }));
    localStorage.setItem('ProfitBuddyToken', data?.token);
    return data;
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (payload) => {
  try {
    const { data } = await axios.post(`${EndPoints.loginUser}`, payload);
    dispatch(setUser({ ...data?.user, token: data?.token }));
    localStorage.setItem('ProfitBuddyToken', data?.token);
    return data;
  } catch (error) {
    throw error;
  }
};
