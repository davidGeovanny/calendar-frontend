import React from 'react'
import { useDispatch } from 'react-redux'
import { uiOpenModal } from '../../actions/uiActions';

export const AddNewFAB = () => {

    const dispatch = useDispatch();

    const handleOpenModal = () => {
        dispatch( uiOpenModal() );
    }

    return (
        <button
            className="btn btn-primary fab"
            onClick={ handleOpenModal }
        >
            <i className="fas fa-plus"></i>
        </button>
    )
}
