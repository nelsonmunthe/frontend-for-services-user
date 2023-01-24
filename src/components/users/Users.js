import axios from '../../api/axios';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {useNavigate } from 'react-router-dom';
import ModalDelete from '../modals/ModalDelete';
import classes from './User.module.css';
import Datatable from '../datatable/Datatable';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [cities, setCities] = useState([]);
    const [roles, setRoles] = useState([]);
    const accessToken = useSelector(state => state.auth.accessToken);
    const [query, setQuery] = useState({role_id: '', city_id: '', search: ''});
    const [showModalDelete, setShowModalDelete] = useState(false);
    const [userDelete, setUserDelete] = useState(false);
    const navigate= useNavigate();
  
    const onShowModalDelete = (event) => {
        const userId = event.target.parentNode.parentNode.childNodes[1].innerText;
        setShowModalDelete(prevState => !prevState);
        if(userId) setUserDelete(userId)
    }

    const onEditUserHandler = event => {
        const userId = event.target.parentNode.parentNode.childNodes[1].innerText;
        if(userId) {
            navigate({
                pathname: `/detail-user`,
                search: `?userId=${userId}`,
            });
        }
    }

    const onChangeQueryRole = event => {
        if(event.target.value !== '--Please choose role--'){
            setQuery(prevState => {
                return{
                    ...prevState,
                    role_id: event.target.value 
                }
            })
        } else {
            setQuery(prevState => {
                return {
                    ...prevState,
                    role_id: ''
                }
            })
        }
    
    };

    const onChangeQueryCity = event => {
        if(event.target.value !== '--Please choose City--'){
            setQuery(prevState => {
                return {
                    ...prevState,
                    city_id: event.target.value
                }
            })
        } else {
            setQuery(prevState => {
                return {
                    ...prevState,
                    city_id: ''
                }
            })
        }
        
    };

    let filter = '';

    for(let data in query){
        if(query[data]){
            filter += `${data}=${query[data]}&` 
        }
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const users = await axios.get(`/users?${filter}`,{
                    headers: {"Authorization" : `Bearer ${accessToken}`}
                });
                // const controller = new AbortController();
                // const users = await axiosPrivate.get(`/users?${filter}`, {
                //     signal: controller.signal
                // });
                
                if(users.data.success) {
                    setUsers(users.data.data.data)
                }
                
            } catch (error) {
                console.log('ini error', error.message)
            }
        }

        fetchUser()
    }, [filter, accessToken, showModalDelete]);

    const fetchCitiesHandler = useCallback(async () => {
        const listCities = await axios.get(`/cities`,{
            // headers: {"Authorization" : `Bearer ${accessToken}`}
        });

        // const listCities = await axiosPrivate.get(`/cities`,{
        //     headers: {"Authorization" : `Bearer ${accessToken}`}
        // });
        
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
 
    const fetchRoleHandler = useCallback(async () => {
       
        const listRole = await axios.get(`/roles`, {
            headers: {"Authorization" : `Bearer ${accessToken}`}
        });
        // const controller = new AbortController();
        // const listRole = await axiosPrivate.get(`/roles`, {
        //     signal: controller.signal
        // });

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
        fetchCitiesHandler()
        fetchRoleHandler()
    }, [fetchCitiesHandler, fetchRoleHandler]);

    const onchangeSearch = (event) => {
        if(event.target.value) {
            setQuery(prevState => {
                return{
                    ...prevState,
                    search : event.target.value
                }
            })
        }

        if(event.target.value === '') {
            setQuery(prevState => {
                return{
                    ...prevState,
                    search: ''
                }
            })
        }
    };

    const turnOffModal = () => {
        setShowModalDelete(false);
    }

    const onSubmitDelete = async () => {
        const user = await axios.delete(`/users/${userDelete}`,{
            headers: {"Authorization" : `Bearer ${accessToken}`}
        });
        
        if(user.data.success) {
            setUserDelete(false);
            setShowModalDelete(false)
            navigate('/users', { replace: true });
        }
    };
    
    const columns = ['No', 'UserId', 'Fullname', 'Email', 'Phone', 'KTP', 'DOB', 'Address', 'City', 'Role'];
    const data = users.map((user, index) => {
        return {
            No: index + 1,
            UserId : user.id,
            Fullname: `${user.firstname} ${user.lastname}`,
            Email: user.email,
            Phone: user.phone,
            KTP: user.no_ktp,
            DOB: user.dob,
            Address: user.address,
            City: user?.city?.name || '',
            Role: user?.role?.original_name || ''
        }

    })
   
    return(
        <section>
            {showModalDelete && <ModalDelete 
                onSubmitDelete = {onSubmitDelete} 
                setModal = {turnOffModal}
                message = 'User'
                />
            }

            <div className={classes.users}>
                <div className={classes.searching}>
                    <div className={classes.filter}>
                        <label>Role: </label>
                        <select onChange={onChangeQueryRole}>
                        {roles.length >= 1 
                            ? roles.map(role => {
                                return <option key={role.id} value={role.id}>{role.description}</option>
                            }) : <option value={null}>--Please choose role--</option>
                        }
                        </select>
                    </div>

                    <div className={classes.filter}>
                        <label>City: </label>
                        <select onChange={onChangeQueryCity}>
                            {cities.length >= 1 
                                ? cities.map(city => {
                                    return <option key={city.id} value={city.id}>{city.name}</option>
                                }) : <option value={null}>--Please choose city--</option>
                            }
                        </select>
                    </div>

                </div>

                <Datatable 
                    description = 'Users Summary'
                    columns = {columns} 
                    data = {data}
                    onEditUserHandler={onEditUserHandler}
                    onShowModalDelete={onShowModalDelete}
                    onchangeSearch={onchangeSearch}
                />

            </div>
        </section>
    )
};

export default Users;