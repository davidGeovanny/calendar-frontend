import '@testing-library/jest-dom';
import { uiReducer } from '../../reducers/uiReducer';
import { uiOpenModal, uiCloseModal } from '../../actions/uiActions';

const initialState = {
    modalOpen: false,
};

describe('Test with uiReducer', () => {
    test('should return the default state', () => {
        const state = uiReducer( initialState, {} );
        
        expect( state ).toEqual( initialState );
    });

    test('should open and close the modal', () => {
        const modalOpenAction = uiOpenModal();
        const stateOpen = uiReducer( initialState, modalOpenAction );

        expect( stateOpen ).toEqual( {
            modalOpen: true
        });

        const modalCloseAction = uiCloseModal();
        const stateClose = uiReducer( initialState, modalCloseAction );

        expect( stateClose ).toEqual( {
            modalOpen: false,
        });
    });
    
})
