import { createAsyncThunk } from '@reduxjs/toolkit';
import LOGIN_REQUIRED_MESSAGE from '../../constants/messages';

const API_URL = 'https://wheels-and-deals.onrender.com/api/login';
const POST_LOGIN = 'wheels_and_deals/login/POST_LOGIN';
const LOGIN_MESSAGE = 'wheels_and_deals/login/LOGIN_MESSAGE';
const LOGOUT = 'wheels_and_deals/login/LOGOUT';

const initailState = {
  token: sessionStorage.getItem('token'),
  signed: !!sessionStorage.getItem('token'),
  message: null,
  userName: sessionStorage.getItem('userName'),
};

const loginReducer = (state = initailState, action) => {
  switch (action.type) {
    case `${POST_LOGIN}/fulfilled`:
      sessionStorage.setItem('token', action.payload.token);
      return {
        ...state,
        token: action.payload.token,
        signed: true,
        message: 'Login Successful',
        userName: action.payload.user_name,
      };
    case `${POST_LOGIN}/rejected`:
      return {
        ...state,
        token: null,
        signed: false,
        message: 'Login Failed',
        userName: null,
      };
    case LOGIN_MESSAGE:
      return {
        ...state,
        signed: false,
        message: LOGIN_REQUIRED_MESSAGE,
        userName: null,
      };
    case LOGOUT:
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('userName');
      sessionStorage.removeItem('id');
      return {
        ...state,
        token: null,
        signed: false,
        message: null,
        userName: null,
      };
    default:
      return state;
  }
};

const postLogin = createAsyncThunk(POST_LOGIN, async (user) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Unable to create user');
  }
  const data = await response.json();
  sessionStorage.setItem('userName', data.user_name);
  return data;
});

const setLoginMessage = () => ({
  type: LOGIN_MESSAGE,
});

export const logoutUser = () => ({
  type: LOGOUT,
});

export { postLogin, setLoginMessage };
export default loginReducer;
