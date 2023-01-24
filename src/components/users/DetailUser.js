import classes from './DetailUser.module.css';
import axios from '../../api/axios';
import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import queryString from 'query-string';
import { useSelector } from 'react-redux';
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const DetailUser = (props) => {
    const navigate = useNavigate();
    const location = useLocation();
    const{ userId} = queryString.parse(location.search);
    const [roles, setRoles] = useState([]);
    const accessToken = useSelector(state => state.auth.accessToken);
    const axiosPrivate = useAxiosPrivate();

    const onCancelHandler = event => {
        event.preventDefault();
        navigate('/users', { replace: true });
    };

    const user = {
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
            setCities(prevState => {
                return [
                    {id: null, name: "--Please choose City--"},
                    ...listCities?.data?.data 
                ]
            });
            return listCities?.data?.data
        }
    }, [])

    const fetchDetailUser = useCallback(async () => {
        const userDetail = await axios.get(`/users/${userId}`,{
            headers: {"Authorization" : `Bearer ${accessToken}`}
        });
    
        if(userDetail?.data?.success){
            setUserInput(prevState => prevState = userDetail?.data?.data)
        }
    }, [accessToken, userId])

    const fetchRoleHandler = useCallback(async () => {
        // const listRole = await axios.get(`/roles`, {
        //     headers: {"Authorization" : `Bearer ${accessToken}`}
        // });

        const controller = new AbortController();
        const listRole = await axiosPrivate.get(`/roles`, {
            signal: controller.signal
        });

        if(listRole?.data?.success){
            setRoles(prevState => {
                return [ 
                    { id: null, original_name: "--Please choose role--", description: "--Please choose role--" },
                    ...listRole?.data?.data.rows 
                ]
            });

            return listRole?.data?.data
        }
    }, [accessToken])

    useEffect(() => {
        fetchCitiesHandler();
        fetchDetailUser();
        fetchRoleHandler();
    }, [fetchCitiesHandler, fetchDetailUser, fetchRoleHandler]);

    
    const onSubmitHandler = event => {
        event.preventDefault();
        const updateUser = async () => {
            const user = await axios.put(`/users/${userId}`, userInput, 
                {
                    headers: {"Authorization" : `Bearer ${accessToken}`},
                }
            );

            if(user.data.success) {
                navigate('/users', { replace: true });
            };
        };
        updateUser();

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

    const onChangeRole = event => {
        
        setUserInput(prevState => {
            return {
                ...prevState,
                role_id: event.target.value
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
                    type='text' 
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
                            return <option key={city.id} value={city.id}>{ city?.name || userInput?.city?.name}</option>
                        }) : <option value={userInput.city_id}>{userInput?.city?.name}</option>
                    }
                </select>
            </div>

            <div className={classes.submit}>
                <label>Role: </label>
                <select onChange={onChangeRole}>
                {roles.length >= 1 
                    ? roles.map(role => {
                        return <option key={role.id} value={role.id}>{ role?.description || userInput?.role?.description}</option>
                    }) : <option value={userInput.role_id}>{userInput?.role?.description}</option>
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

export default DetailUser;