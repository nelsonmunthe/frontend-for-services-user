import classes from './EditButton.module.css';

const EditButton = props => {
    return ( 
        <button className={classes.edit} onClick={props.onEditUserHandler}>Edit</button>
    )
};

export default EditButton;