import {useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// import axios from '../../api/axios';
// import { authActions } from '../../store/auth-slice';
import { setLogin } from '../../store/auth-slice';
import classes from './Login.module.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const isLogin = useSelector(state => state.auth.isLogin);

    const onLoginHandler = event => {
    
        event.preventDefault();

        // first scenario using redux thunk
        dispatch(setLogin( {email, password} ) )
        if(isLogin) navigate('/', { replace: true });

        // second scenario without using redux thunk
        // const login = async() => {
        //     try {
        //     
        //     const user = await axios.post(`/login`,{
        //         email,
        //         password
        //     })

        //     if(user?.data?.success) {
        //         dispatch(authActions.setToken(user.data.data.accessToken))
        //         navigate('/', { replace: true });
        //     }

        //     } catch (error) {
        //         console.log(error)
        //     }
        // }

        // login()

         
    };

    const onPasswordChangeHandler = event => {
        setPassword(event.target.value)
    };

    const onEmailChangeHandler = event => {
        setEmail(event.target.value)
    };
  
    const onSwitchRegister = () => {
        navigate('/register', { replace: true });
    };

    return(
        <section>
            <form  className={classes.login} onSubmit={onLoginHandler}>
                <input 
                    type="text" 
                    placeholder='email' 
                    onChange={onEmailChangeHandler}
                    value={email}
                />
        
                <input 
                    type='password' 
                    placeholder='password' 
                    onChange={onPasswordChangeHandler}
                    value={password}
                />
                <div className={classes.submit}>
                    <div className={classes.checkbox}>
                        <input type='checkbox' id='rememberMe'></input>
                        <label htmlFor='rememberMe'>Remember Me</label>
                    </div>
                    <button>Login</button>
                </div>
                <div className={classes.option}>
                    <label className={classes.register} onClick={onSwitchRegister}>Register now</label>
                    <label className={classes.forgot}>Forgot password?</label>
                </div>
                <div className={classes.break}>
                    <hr/>
                    <p>or</p>
                    <hr/>
                </div>
                <div className={classes.social}>
                    <button className={classes.facebook}>Login with facebook</button>
                    <button className={classes.twitter}>Login with twitter</button>
                    <button className={classes.google}>Login with google</button>
                </div>
            </form>
        </section>
    )
};

export default Login;