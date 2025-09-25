import { useDispatch } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';
import { allowDelete } from '../redux/reducers/cars';
import useAuth from '../hooks/useAuth';

const Navigation = () => {
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
      return;
    }
    logout();
  };

  const handleProtectedNav = (event, onSuccess = () => {}) => {
    if (!requireLogin()) {
      event.preventDefault();
      return;
    }
    onSuccess();
  };

  return (
    <div className="fixed top-0 bottom-0 text-left navigation hidden border-r border-gray-300 float-left py-8 w-[250px] bg-slate-100 h-screen lg:block">
      <NavLink to="/">
        <img className="w-24 mx-auto" src={logo} alt="logo" />
      </NavLink>
      <ul className="flex flex-col mt-16 ml-4 h-[70%]">
        <NavLink to="/cars">
          <li className="cursor-pointer py-4 text-xl font-semibold pl-4">CARS</li>
        </NavLink>
        <NavLink to="/reserved">
          <li className="cursor-pointer py-4 text-xl font-semibold pl-4">MY RESERVATIONS</li>
        </NavLink>
        <NavLink
          to="/new-reservation"
          onClick={(event) => handleProtectedNav(event, () => sessionStorage.removeItem('id'))}
        >
          <li className="cursor-pointer py-4 text-xl font-semibold pl-4">
            NEW RESERVATION
          </li>
        </NavLink>
        <NavLink
          to="/new-car"
          onClick={handleProtectedNav}
        >
          <li className="cursor-pointer py-4 text-xl font-semibold pl-4">
            ADD CAR
          </li>
        </NavLink>
        {location.pathname.match('/cars') && (
          <li className="cursor-pointer py-4 text-xl font-semibold pl-4">
            <button
              type="button"
              onClick={activateDelete}
            >
              DELETE CAR
            </button>
          </li>
        )}
        <li className="mt-auto">
          <div className="flex gap-2 items-baseline justify-center flex-wrap">
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
  );
};

export default Navigation;
