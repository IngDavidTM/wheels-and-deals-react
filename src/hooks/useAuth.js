import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutUser, setLoginMessage } from '../redux/reducers/loginUsers';
import { resetDeletePermission } from '../redux/reducers/cars';

const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { signed, userName } = useSelector((state) => state.loginUsers);

  const logout = useCallback(() => {
    dispatch(logoutUser());
    dispatch(resetDeletePermission());
    navigate('/');
  }, [dispatch, navigate]);

  const requireLogin = useCallback(({ redirect = true, message = true } = {}) => {
    if (signed) {
      return true;
    }
    if (message) {
      dispatch(setLoginMessage());
    }
    if (redirect) {
      navigate('/login', { replace: true });
    }
    return false;
  }, [signed, dispatch, navigate]);

  return {
    currentUser: userName || null,
    displayName: userName || 'Guest',
    isAuthenticated: signed,
    logout,
    requireLogin,
  };
};

export default useAuth;
