
import './App.css';
import Register from './components/register/Register';
import Login from './components/login/Login';
import { Routes, Route } from 'react-router-dom';
import Home from './components/home/Home';
import { useSelector } from 'react-redux';
import Navbar from './components/navbar/Navbar';
import Users from './components/users/Users';
import DetailUser from './components/users/DetailUser';
import PersistLogin from './components/PersistLogin';
import City from './components/city/City';
import Role from './components/role/Role';

function App() {
  const isLogin = useSelector(state => state.auth.isLogin);

  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route element={<PersistLogin />}> 
          {isLogin && <Route path='/detail-user'  element={<DetailUser />}/>}
          {isLogin && <Route path='/users' element={<Users />}/>}
          {isLogin && <Route path='/cities' element={<City />} />}
          {isLogin && <Route path='/roles' element={<Role />} />}
        </Route>
        {!isLogin && <Route path='/register' element={<Register />} />}
        {!isLogin && <Route path='/login' element={<Login />} />}
        <Route path='/' element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
