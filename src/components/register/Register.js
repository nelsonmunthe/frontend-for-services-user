import axios from '../../api/axios';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classes from './Register.module.css';

const Register = () => {
    const navigate = useNavigate();

    const onCancelHandler = event => {
        event.preventDefault();
        navigate('/login', { replace: true });
    };

    const user ={
        firstname: '',
        lastname: '',
        email: '',
        dob: '',
        phone: '',
        no_ktp: '',
        address: '',
        password: '',
        city_id: ''
    };

    const [userInput, setUserInput] = useState(user);
    const [cities, setCities] = useState([]);

    
    const fetchCitiesHandler = useCallback(async () => {
        const listCities = await axios.get(`/cities`);
        if(listCities?.data?.success){
            setCities(prevState => [...listCities?.data?.data ]);
            return listCities?.data?.data
        }
    }, [])

    useEffect(() => {
        fetchCitiesHandler()
    }, [fetchCitiesHandler]);


    const onSubmitHandler = event => {
        event.preventDefault();
        const addUser = async () => {
            const user = await axios.post(`/register`, userInput);
            if(user.data.success) {
                navigate('/login', { replace: true });
            };
        };
        addUser();

    };

    const onChangeFirstname = event => {
        setUserInput(prevState => {
            return {
                ...prevState,
                firstname: event.target.value
            }
        })
    };

    const onChangeLastname = event => {
        setUserInput(prevState => {
            return {
                ...prevState,
                lastname: event.target.value
            }
        })
    };

    const onChangeEmail = event => {
        setUserInput(prevState => {
            return {
                ...prevState,
                email: event.target.value
            }
        })
    };

    const onChangePassword = event => {
        setUserInput(prevState => {
            return {
                ...prevState,
                password: event.target.value
            }
        })
    };

    const onChangeDOB = event => {
        setUserInput(prevState => {
            return {
                ...prevState,
                dob: event.target.value
            }
        })
    };

    const onChangePhone = event => {
        setUserInput(prevState => {
            return {
                ...prevState,
                phone: event.target.value
            }
        })
    };

    const onChangeId = event => {
        setUserInput(prevState => {
            return {
                ...prevState,
                no_ktp: event.target.value
            }
        })
    };

    const onChangeAddress = event => {
        setUserInput(prevState => {
            return {
                ...prevState,
                address: event.target.value
            }
        })
    };

    const onChangeCity = event => {
        setUserInput(prevState => {
            return {
                ...prevState,
                city_id: event.target.value
            }
        })
    };

    return(
        <form className={classes.registration} onSubmit={onSubmitHandler}>
            <div className={classes.submit}>
                <label>Firstname :</label>
                <input 
                    type='text' 
                    value={userInput.firstname} 
                    onChange={onChangeFirstname}
                />
            </div>
            <div className={classes.submit}>
                <label>Lastname :</label>
                <input 
                    type='text' 
                    value={userInput.lastname}
                    onChange={onChangeLastname}
                />
            </div>
            <div className={classes.submit}>
                <label>DOB :</label>
                <input 
                    type='date' 
                    value={userInput.dob}
                    onChange={onChangeDOB}
                />
            </div>
            <div className={classes.submit}>
                <label>Email :</label>
                <input 
                    type='text' 
                    value={userInput.email}
                    onChange={onChangeEmail}
                />
            </div>
            <div className={classes.submit}>
                <label>Password :</label>
                <input 
                    type='password' 
                    value={userInput.password}
                    onChange={onChangePassword}
                />
            </div>
            <div className={classes.submit}>
                <label>Phone number :</label>
                <input 
                    type='text' 
                    value={userInput.phone}
                    onChange={onChangePhone}
                />
            </div>
            <div className={classes.submit}>
                <label>No. KTP :</label>
                <input 
                    type='text' 
                    value={userInput.no_ktp}
                    onChange={onChangeId}
                />
            </div>
            <div className={classes.submit}>
                <label>Address :</label>
                <textarea 
                    rows="3" 
                    type='text' 
                    value={userInput.address}
                    onChange={onChangeAddress}
                />
            </div>
            <div className={classes.submit}>
                <label>City :</label>
                <select onChange={onChangeCity}>
                    {cities.length >= 1 
                        ? cities.map(city => {
                            return <option key={city.id} value={city.id}>{city.name}</option>
                        }) : <option value={userInput.city_id}>--Please choose city--</option>
                    }
                </select>
            </div>
            <div className={classes.submit}>
                <button type='submit'>Submit</button>
                <button onClick={onCancelHandler}>Cancel</button>
            </div>
            
        </form>
    )
};

export default Register;