import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import Modal from 'react-modal';
import DateTimePicker from 'react-datetime-picker';
import Swal from 'sweetalert2';
import { uiCloseModal } from '../../actions/uiActions';
import { eventClearActiveEvent, eventStartAddNew, eventStartUpdate } from '../../actions/eventActions';

const customStyles = {
	content: {
		top: "50%",
		left: "50%",
		right: "auto",
		bottom: "auto",
		marginRight: "-50%",
		transform: "translate(-50%, -50%)",
	},
};

if( process.env.NODE_ENV !== 'test' ) {
    Modal.setAppElement('#root');
}


const now = moment().minutes(0).seconds(0).add(1, 'hours');
const finishDate = now.clone().add(1, 'hours');

const initEvent = {
    title: '',
    notes: '',
    start: now.toDate(),
    end: finishDate.toDate(),
};

export const CalendarModal = () => {

    const dispatch = useDispatch();

    const { modalOpen } = useSelector(state => state.ui);
    const { activeEvent } = useSelector(state => state.calendar);

    const [dateStart, setDateStart] = useState( now.toDate() );
    const [dateEnd, setDateEnd] = useState( finishDate.toDate() );
    const [titleValid, setTitleValid] = useState( true );

    const [formValues, setFormValues] = useState( initEvent );

    const { title, notes, start, end } = formValues;

    useEffect(() => {
        if( activeEvent ) {
            setFormValues( activeEvent );
        } else {
            setFormValues( initEvent );
        }
    }, [ activeEvent, setFormValues ])

    const closeModal = () => {
        dispatch( uiCloseModal() );
        dispatch( eventClearActiveEvent() );
        setFormValues( initEvent );
    };

    const handleStartDateChange = (e) => {
        setDateStart( e );
        setFormValues({
            ...formValues,
            start: e
        });
    };

    const handleEndDateChange = (e) => {
        setDateEnd( e );
        setFormValues({
            ...formValues,
            end: e
        });
    };

    const handleInputChange = (e) => {
        const { target } = e;
        setFormValues({
            ...formValues,
            [target.name]: target.value
        });
    };

    const handleSubmitForm = (e) => {
        e.preventDefault();

        const momentStart = moment( start );
        const momentEnd = moment( end );

        if( momentStart.isSameOrAfter( momentEnd ) ) {
            return Swal.fire({
                title: 'Error',
                text: 'La fecha de fin debe ser mayor a la fecha de inicio',
                icon: 'error',
            });
        }

        if( title.trim().length < 2 ) {
            return setTitleValid( false );
        }

        /** Realizar grabación */
        if( activeEvent ) {
            dispatch( eventStartUpdate( formValues ) );
        } else {
            dispatch( eventStartAddNew( formValues ) );
        }

        setTitleValid( true );
        closeModal();
    };

    return (
        <Modal
            isOpen={ modalOpen }
            //   onAfterOpen={ afterOpenModal }
            onRequestClose={ closeModal }
            style={ customStyles }
            // contentLabel="Example Modal"
            closeTimeoutMS={ 200 }
            className="modal"
            overlayClassName="modal-fondo"
            ariaHideApp={ !process.env.NODE_ENV === 'test' }
        >
            <h1> { ( activeEvent ) ? 'Editar evento' : 'Nuevo evento' } </h1>
            <hr />
            <form 
                className="container"
                onSubmit={ handleSubmitForm }
            >

                <div className="form-group">
                    <label>Fecha y hora inicio</label>
                    <DateTimePicker
                        onChange={ handleStartDateChange }
                        value={ dateStart }
                        className="form-control"
                    />
                </div>

                <div className="form-group">
                    <label>Fecha y hora fin</label>
                    <DateTimePicker
                        onChange={ handleEndDateChange }
                        value={ dateEnd }
                        className="form-control"
                        minDate={ dateStart }
                    />
                </div>

                <hr />
                <div className="form-group">
                    <label>Titulo y notas</label>
                    <input 
                        type="text" 
                        className={`form-control ${ !titleValid && 'is-invalid' }`}
                        placeholder="Título del evento"
                        name="title"
                        autoComplete="off"
                        value={ title }
                        onChange={ handleInputChange }
                    />
                    <small id="emailHelp" className="form-text text-muted">Una descripción corta</small>
                </div>

                <div className="form-group">
                    <textarea 
                        type="text" 
                        className="form-control"
                        placeholder="Notas"
                        rows="5"
                        name="notes"
                        value={ notes }
                        onChange={ handleInputChange }
                    ></textarea>
                    <small id="emailHelp" className="form-text text-muted">Información adicional</small>
                </div>

                <button
                    type="submit"
                    className="btn btn-outline-primary btn-block"
                >
                    <i className="far fa-save"></i>
                    <span> Guardar</span>
                </button>

            </form>
        </Modal>
    )
}
