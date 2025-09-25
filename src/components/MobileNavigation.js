import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faBars } from '@fortawesome/free-solid-svg-icons';
import { allowDelete } from '../redux/reducers/cars';
import logo from '../assets/logo.png';
import useAuth from '../hooks/useAuth';

const MobileNavigation = () => {
  const crossIcon = <FontAwesomeIcon icon={faXmark} />;
  const hamburguerIcon = <FontAwesomeIcon icon={faBars} />;
  const [showMenu, setShowMenu] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation();
  const {
    displayName,
    isAuthenticated,
    logout,
    requireLogin,
  } = useAuth();

  const activateDelete = () => {
    dispatch(allowDelete());
  };

  const handleAuthClick = () => {
    if (!isAuthenticated) {
      requireLogin({ message: false });
    } else {
      logout();
    }
    setShowMenu(false);
  };

  const handleProtectedNav = (event, onSuccess = () => {}) => {
    if (!requireLogin()) {
      event.preventDefault();
      setShowMenu(false);
      return;
    }
    onSuccess();
    setShowMenu(false);
  };

  return (
    <div className="mobile-menu lg:hidden">
      <button
        type="button"
        className="menu-btn absolute top-4 left-4 text-xl z-30"
        onClick={() => setShowMenu(true)}
      >
        {hamburguerIcon}
      </button>
      {showMenu && (
        <div className="menu fixed inset-0 bg-white z-30 pt-8">
          <button
            type="button"
            onClick={() => setShowMenu(false)}
            className="absolute top-4 right-4 text-3xl"
          >
            {crossIcon}
          </button>
          <NavLink to="/">
            <img className="w-20 mx-auto" src={logo} alt="logo" />
          </NavLink>
          <ul className="flex items-stretch text-center flex-col mt-16 px-4">
            <NavLink to="/cars" onClick={() => setShowMenu(false)}>
              <li className="cursor-pointer py-4 text-xl font-semibold">CARS</li>
            </NavLink>
            <NavLink to="/reserved" onClick={() => setShowMenu(false)}>
              <li className="cursor-pointer py-4 text-xl font-semibold">MY RESERVATIONS</li>
            </NavLink>
            <NavLink
              to="/new-reservation"
              onClick={(event) => handleProtectedNav(event, () => sessionStorage.removeItem('id'))}
            >
              <li className="cursor-pointer py-4 text-xl font-semibold">NEW RESERVATION</li>
            </NavLink>
            <NavLink
              to="/new-car"
              onClick={handleProtectedNav}
            >
              <li className="cursor-pointer py-4 text-xl font-semibold">ADD CAR</li>
            </NavLink>
            {(location.pathname.match('/cars')) && (
              <li className="cursor-pointer py-4 text-xl font-semibold">
                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    activateDelete();
                  }}
                >
                  DELETE CAR
                </button>
              </li>
            )}
            <li className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
              <div className="flex gap-2 items-baseline justify-center">
                <div className="tracking-wide text-xl mt-2 w-max text-gray-800">
                  {displayName}
                </div>
                <button
                  type="button"
                  className="bg-black bg-opacity-70 text-slate-100 py-2 px-6 rounded-full hover:bg-black hover:text-orange hover:opacity-80 hover:font-bold"
                  onClick={handleAuthClick}
                >
                  {isAuthenticated ? 'LOGOUT' : 'LOGIN'}
                </button>
              </div>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default MobileNavigation;
