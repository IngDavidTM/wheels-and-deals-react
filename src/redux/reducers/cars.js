import { createAsyncThunk } from '@reduxjs/toolkit';
import LOGIN_REQUIRED_MESSAGE from '../../constants/messages';

const URL = 'https://wheels-and-deals.onrender.com/api/cars';
const GET = 'wheels-and-deals/cars/GET';
const GET_INFO = 'wheels-and-deals/cars/GET_INFO';
const ADD = 'wheels-and-deals/cars/ADD';
const DELETE = 'wheels-and-deals/cars/DELETE';
const ACCESS = 'wheels-and-deals/cars/SU';
const RESET_ACCESS = 'wheels-and-deals/cars/RESET_ACCESS';

const initialState = {
  items: [],
  details: {},
  permission: false,
  message: '',
};

const carsReducer = (state = initialState, action) => {
  switch (action.type) {
    case `${GET}/fulfilled`:
      return {
        ...state,
        items: action.payload,
      };
    case `${GET_INFO}/fulfilled`:
      return {
        ...state,
        details: action.payload[0],
      };
    case ADD:
      return {
        ...state,
        items: [...state.items, action.payload],
      };
    case ACCESS:
      return {
        ...state,
        permission: action.payload.permission,
        message: action.payload.message,
      };
    case `${DELETE}/pending`:
      return {
        ...state,
        message: 'Deleting car...',
      };
    case `${DELETE}/fulfilled`:
      return {
        ...state,
        items: state.items.filter((car) => car.id !== action.payload.car.id),
        message: action.payload.message,
      };
    case RESET_ACCESS:
      return {
        ...state,
        permission: false,
        message: '',
      };
    default:
      return state;
  }
};

const getCars = createAsyncThunk(GET, async () => {
  const data = await fetch(URL).then((res) => res.json());
  return data;
});

const getCarInfo = createAsyncThunk(GET_INFO, async (id) => {
  const data = await fetch(`${URL}/${id}`).then((res) => res.json());
  return data;
});

const addCar = createAsyncThunk(ADD, async (car) => {
  const response = await fetch(URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sessionStorage.getItem('token')}`,
    },
    body: JSON.stringify(car),
  });
  return response.json();
});

const allowDelete = () => {
  const token = sessionStorage.getItem('token');
  if (token) {
    return {
      type: ACCESS,
      payload: {
        permission: true,
        message: 'Now you can delete cars!',
      },
    };
  }
  return {
    type: ACCESS,
    payload: {
      permission: false,
      message: LOGIN_REQUIRED_MESSAGE,
    },
  };
};

const resetDeletePermission = () => ({
  type: RESET_ACCESS,
});

const deleteCar = createAsyncThunk(DELETE, async (id) => {
  const response = await fetch(`${URL}/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem('token')}`,
    },
  });
  return response.json();
});

export {
  carsReducer,
  getCars,
  getCarInfo,
  addCar,
  allowDelete,
  resetDeletePermission,
  deleteCar,
};
