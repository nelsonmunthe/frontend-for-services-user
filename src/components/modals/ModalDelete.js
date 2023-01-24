import classes from './ModalDelete.module.css'
import ReactDOM from 'react-dom';

const ModalDelete = props => {

    return ReactDOM.createPortal(
        <div className={classes.overlay}>
            <div className={classes.modal} id="modal">
                <h2>Confirm Delete</h2>
                <div className={classes.content}>Are you sure to delete this {props.message}?`</div>
                <div className={classes.actions}>
                    <button className="toggle-button" onClick={props.setModal}>Cancel</button>
                    <button className="toggle-button" onClick={props.onSubmitDelete} >Delete</button>
                </div>
            </div>
        </div>,
        document.getElementById('portal')
    )
};

export default ModalDelete;