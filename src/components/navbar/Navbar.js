import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import classes from './Navbar.module.css';
import {authActions} from '../../store/auth-slice';
// import City from '../city/City';

const Navbar = () => {
  const isLogin = useSelector(state =>  state.auth.isLogin);
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const onLogoutHandler = () => {
    dispatch(authActions.setIsLogin(false));
    navigate('/', { replace: true })
  };

  return(
      <header className={classes.header}>
        <h1>CRUD</h1>
        <nav>
          <ul>
            {isLogin && <NavLink to="/">Home</NavLink>}
            {isLogin && <NavLink to="/users">Users</NavLink>}
            {isLogin && <NavLink to="/cities">Cities</NavLink>}
            {isLogin && <NavLink to="/roles" >Roles</NavLink>}
            {!isLogin && <NavLink to="/register">Registration</NavLink>}
            {isLogin ?  <NavLink onClick={onLogoutHandler}>Logout</NavLink> :<NavLink to="/login">Login</NavLink> }
          </ul>
        </nav>
    </header>
  )
};

export default Navbar;