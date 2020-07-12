import '@testing-library/jest-dom';
import { authReducer } from '../../reducers/authReducer';
import { types } from '../../types/types';

const initialState = {
    checking: true,
    // uid,
    // name,
};

describe('Test with authReducer', () => {
    test('should return the default state', () => {
        const action = {};
        const state = authReducer( initialState, action );

        expect( state ).toEqual( initialState );
    });

    test('should return the login state', () => {
        const user = {
            uid: '123abc',
            name: 'Test'
        };

        const action = {
            type: types.authLogin,
            payload: user
        };

        const state = authReducer( initialState, action );

        expect( state ).toEqual( {
            checking: false,
            name: user.name,
            uid: user.uid,
        });
    });
    
})
