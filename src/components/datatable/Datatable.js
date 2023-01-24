import { useSelector } from 'react-redux';
import { ADMIN } from '../../constants/role';
import DeleteButton from '../buttons/DeleteButton';
import EditButton from '../buttons/EditButton';
import classes from './Datatable.module.css';

const Datatable = props => {
    const userRole = useSelector(state => state.auth.role);

    if(!props.columns.includes('Action') && userRole === ADMIN){
        props.columns.push('Action')
    };

    const columnAction = userRole === ADMIN && 
        <td data-label="action" className={classes.actions}>
            <EditButton onEditUserHandler={props.onEditUserHandler}/>
            <DeleteButton  onShowModalDelete={props.onShowModalDelete} />
        </td>;

    const tableBody = props.data.map((item) => (
            <tr key={item.id}>
                {
                    props.columns.map((column) => {
                        return column !== 'Action' ? <td>{item[column]}</td> : columnAction
                    })
                }
            </tr>
    ));
    
    return(
        <div className={classes.datatable}>
            <div className={classes.heading}>
                <caption className={classes.caption}>{props.description}</caption>
                <input placeholder='searching...' onChange={props.onchangeSearch} />
            </div>
            <table className={classes.table}> 
                <thead>
                    <tr>
                        {
                            props.columns.map(column => (
                                <th scope="col">{column}</th>
                            ))
                        }
                    </tr>
                </thead>
                <tbody>
                    {
                        tableBody
                    }
                </tbody>
            </table>
        </div>
    );
};

export default Datatable;