import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from '../../api/axios';
import classes from './City.module.css';
import ModalDelete from '../modals/ModalDelete';
import { useNavigate } from 'react-router-dom';
import { ADMIN } from '../../constants/role';
import Datatable from '../datatable/Datatable';

const City = () => {
    const navigate = useNavigate();
    const [cities, setCities] = useState([]);
    const accessToken = useSelector(state => state.auth.accessToken);
    const [query, setQuery] = useState({search: ''});
    const [showModalDelete, setShowModalDelete] = useState(false);
    const [cityDelete, setCityDelete] = useState(false);
    const [inputCity, setInputCity] = useState('');
    const [idCity, setIdCity] = useState('');
    const [isEdit, setIsEdit] = useState(false);
    const userRole = useSelector(state => state.auth.role);

    const onShowModalDelete = (event) => {
        const idCity = event.target.parentNode.parentNode.childNodes[1].innerText;
        setShowModalDelete(prevState => !prevState);
        if(idCity) setCityDelete(idCity)
    };

    const turnOffModal = () => {
        setShowModalDelete(false);
    }

    const onSubmitDelete = async () => {
        const user = await axios.delete(`/city/${cityDelete}`,{
            headers: {"Authorization" : `Bearer ${accessToken}`}
        });
        
        if(user.data.success) {
            setCityDelete(false);
            setShowModalDelete(false)
            setInputCity('');
            navigate('/cities', { replace: true });
        }
    };

    let filter = '';

    for(let data in query){
        if(query[data]){
            filter += `${data}=${query[data]}&` 
        }
    };

    useEffect(() => {
        const fetchCity = async () => {
            const response = await  axios.get(`/cities?${filter}`, {
                headers: {"Authorization" : `Bearer ${accessToken}`},
            });

            if(response.data.success) {
                setCities(response.data.data)
            }

        }

        fetchCity()
    }, [showModalDelete, filter, isEdit, accessToken]);

    const onSearchCity = event => {
        if(event.target.value.length === 1){
            setQuery(prevState => {
                return {
                    ...prevState,
                    search: ''
                }
            })
        }
       
        if(event.target.value) {
            setQuery(prevState => {
                return {
                    ...prevState,
                    search: event.target.value
                }
            })
        }

        if(event.target.value === '') {
            setQuery(prevState => {
                return {
                    ...prevState,
                    search: ''
                }
            })
        }
    };

    const onSubmitHandler = (event) => {
        event.preventDefault()
        const createNewCity = async () => {
            const city = await axios.post('/city', 
                {
                    name: inputCity
                },
                {
                    headers: {"Authorization" : `Bearer ${accessToken}`},
                }
            );
            
            if(city?.data?.success){
                setCities(prevState => {
                    return[
                        ...prevState,
                        city.data.data
                    ]
                })
            }
           
        };

        createNewCity()
       

    };

    const onChangeEdit = event => {
        event.preventDefault();
        setIsEdit(true);
        setInputCity(event.target.parentNode.parentNode.childNodes[2].innerText);
        setIdCity(event.target.parentNode.parentNode.childNodes[1].innerText);
    };

    const onChangeInputCity = event => {
        setInputCity(event.target.value)
    }

    const onEditHandler = () => {
       
        const editCity = async () => {
            const response = await axios.put(`/city/${idCity}`, {name: inputCity}, {
                headers: {"Authorization" : `Bearer ${accessToken}`},
            });

            if(response.data.success) {
                setIsEdit(false);
                setInputCity('');
                setIdCity('')
            }
        }
        editCity()
        
    };

    const onCancelEdit = () => {
        setIsEdit(false);
        setInputCity('');
        setIdCity('')
    }

    const columns = ['No', 'CityID', 'Name', 'UpdatedAt', 'CreatedAt'];

    const data = cities.map((city, index) => {
        return{
            No: index + 1,
            CityID: city.id,
            Name: city.name,
            UpdatedAt: city.updatedAt,
            CreatedAt: city.createdAt
        }
    })

    return(
        <section>
            {showModalDelete && <ModalDelete 
                onSubmitDelete = {onSubmitDelete} 
                setModal = {turnOffModal}
                message = "City"
                />
            }
            <div className={classes.cities}>
                {userRole === ADMIN && 
                    <div className={classes.searching}>
                        <label>City Name: </label>
                        <input value={inputCity} onChange={onChangeInputCity}/>
                        {isEdit && <input readOnly disabled value={idCity}/>}
                        {isEdit && <button onClick={onCancelEdit}>Batal</button> }
                        {isEdit && <button onClick={onEditHandler}>Edit</button> }
                        {!isEdit && <button onClick={onSubmitHandler}>Add</button>}
                    </div>
                }

                <Datatable 
                    description = 'Cities Summary'
                    columns = {columns} 
                    data = {data}
                    onEditUserHandler={onChangeEdit}
                    onShowModalDelete={onShowModalDelete}
                    onchangeSearch={onSearchCity}
                />
            </div>
        </section>
    )
};

export default City;