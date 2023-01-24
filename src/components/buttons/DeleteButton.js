import classes from './DeleteButton.module.css';

const DeleteButton = props => {
    return ( 
        <button className={classes.delete} onClick={props.onShowModalDelete}>Hapus</button>
    )
};

export default DeleteButton;