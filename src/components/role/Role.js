import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from '../../api/axios';
import classes from './Role.module.css';
import ModalDelete from '../modals/ModalDelete';
import { useNavigate } from 'react-router-dom';
import Datatable from '../datatable/Datatable';
import { ADMIN } from '../../constants/role';

const Role = () => {
    const navigate = useNavigate();
    const [roles, setRoles] = useState([]);
    const accessToken = useSelector(state => state.auth.accessToken);
    const [query, setQuery] = useState({search: ''});
    const [showModalDelete, setShowModalDelete] = useState(false);
    const [roleDelete, setRoleDelete] = useState(false);
    const [inputRole, setInputRole] = useState({id: '', original_name: '', description: ''});
    const [isEdit, setIsEdit] = useState(false);
    const userRole =  useSelector(state => state.auth.role);
    
    const onShowModalDelete = (event) => {
        const cityId = event.target.parentNode.parentNode.childNodes[1].innerText;
        setShowModalDelete(prevState => !prevState);
        if(cityId) setRoleDelete(cityId)
    };

    const turnOffModal = () => {
        setShowModalDelete(false);
    }

    const onSubmitDelete = async () => {
        const user = await axios.delete(`/role/${roleDelete}`,{
            headers: {"Authorization" : `Bearer ${accessToken}`}
        });
        
        if(user.data.success) {
            setRoleDelete(false);
            setShowModalDelete(false)
            setInputRole({id: '', original_name: '', description: ''});
            navigate('/roles', { replace: true });
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
            const response = await  axios.get(`/roles?${filter}`, {
                headers: {"Authorization" : `Bearer ${accessToken}`},
            });

            if(response.data.success) {
                setRoles(response.data.data.rows)
            }

        }
       
        fetchCity()
    }, [showModalDelete, filter, isEdit, accessToken]);

    const onSearchRole = event => {
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
        const createNewRole = async () => {
            const city = await axios.post('/role', 
                {
                    original_name: inputRole.original_name,
                    description: inputRole.description
                },
                {
                    headers: {"Authorization" : `Bearer ${accessToken}`},
                }
            );
        
            if(city?.data?.success){
                setRoles(prevState => {
                    return[
                        ...prevState,
                        city.data.data
                    ]
                })
            }
           
        };

        createNewRole()
    };

    const onChangeEdit = event => {
        event.preventDefault();
        setIsEdit(true);
        const description = event.target.parentNode.parentNode.childNodes[3].innerText;
        const id = event.target.parentNode.parentNode.childNodes[1].innerText;
        const original_name = event.target.parentNode.parentNode.childNodes[2].innerText
        setInputRole(prevState => {
            return{
                ...prevState,
                id,
                description,
                original_name
            }
        })
    };

    const onChangeDescription = event => {
        setInputRole(prevState => {
            return{
                ...prevState,
                description: event.target.value
            }
        })
    }

    const onChangeName = event => {
        setInputRole(prevState => {
            return{
                ...prevState,
                original_name: event.target.value
            }
        })
    }

    const onEditHandler = () => {
       
        const editCity = async () => {
            const response = await axios.put(`/role/${inputRole.id}`, {description: inputRole.description}, {
                headers: {"Authorization" : `Bearer ${accessToken}`},
            });

            if(response.data.success) {
                setIsEdit(false);
                setInputRole({id: '', original_name: '', description: ''})
            }
        }
        editCity()
        
    };

    const onCancelEdit = () => {
        setIsEdit(false);
        setInputRole({id: '', original_name: '', description: ''})
    }

    const columns = ['no', 'roleId', 'name', 'description', 'UpdatedAt', 'CreatedAt'];
    const data = roles.map((role, index) => {
        console.log(role)
        return{
            no : index + 1,
            roleId: role.id,
            name: role.original_name,
            description: role.description,
            UpdatedAt: role.updatedAt,
            CreatedAt: role.createdAt
        }
    })

    return(
        <section>
            {showModalDelete && <ModalDelete 
                onSubmitDelete = {onSubmitDelete} 
                setModal = {turnOffModal}
                message = "Role"
                />
            }
            <div className={classes.roles}>
                { userRole === ADMIN &&
                    <div className={classes.searching}>
                        <label>Name: </label>
                        <input value={inputRole.original_name} onChange={onChangeName}/>
                        <label>Description: </label>
                        <input value={inputRole.description} onChange={onChangeDescription}/>
                        {isEdit && <input readOnly disabled value={inputRole.id}/>}
                        {isEdit && <button onClick={onCancelEdit}>Batal</button> }
                        {isEdit && <button onClick={onEditHandler}>Edit</button> }
                        {!isEdit && <button onClick={onSubmitHandler}>Add</button>}
                    </div>
                }
                
                <Datatable 
                    description = 'Role Summary'
                    columns = {columns} 
                    data = {data}
                    onEditUserHandler={onChangeEdit}
                    onShowModalDelete={onShowModalDelete}
                    onchangeSearch={onSearchRole}
                />
            </div>
        </section>
    )
};

export default Role;