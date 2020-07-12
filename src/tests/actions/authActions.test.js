import '@testing-library/jest-dom';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Swal from 'sweetalert2';
import { startLogin, startRegister, startChecking } from '../../actions/authActions';
import { types } from '../../types/types';
import * as fetchModule from '../../helpers/fetch';

jest.mock('sweetalert2', () => {
    return {
        fire: jest.fn(),
    }
});

const middlewares = [ thunk ];
const mockStore = configureStore( middlewares );

const initState = {

};

let store = mockStore( initState );

Storage.prototype.setItem = jest.fn();

describe('Test with authActions', () => {

    beforeEach( () => {
        store = mockStore( initState );
        jest.clearAllMocks();
    });

    test('should startLogin correctly', async () => {
        await store.dispatch( startLogin('david.geovanny.cr@gmail.com', '123456') );

        const actions = store.getActions();
        
        expect( actions[0] ).toEqual( {
            type: types.authLogin,
            payload: {
                uid: expect.any(String),
                name: expect.any(String),
            }
        });

        expect( localStorage.setItem ).toHaveBeenCalledWith('token', expect.any( String ));
        expect( localStorage.setItem ).toHaveBeenCalledWith('token-init-date', expect.any( Number ));

        /** Obtener los valores con las que las funciones fueron llamadas */
        // console.log(localStorage.setItem.mock.calls);
        // token = localStorage.setItem.mock.calls
        // console.log(localStorage.setItem.mock.calls[0][1]);
    });

    test('should startLogin incorrectly', async () => {
        await store.dispatch( startLogin('david.geovanny.cr@gmail.com', 'incorrect') );

        const actions = store.getActions();

        expect( actions ).toEqual( [] );
        expect( Swal.fire ).toHaveBeenCalled();
    });

    test('should startRegister correctly', async () => {
        /** Mock only in this test */
        fetchModule.fetchWithoutToken = jest.fn( () => {
            return {
                json() {
                    return {
                        ok: true,
                        uid: '123',
                        name: 'testName',
                        token: 'token123abc',
                    }
                }
            };
        });

        await store.dispatch( startRegister('Test', 'test@test.com', '123456') );

        const actions = store.getActions();

        expect( actions[0] ).toEqual( {
            type: types.authLogin,
            payload: {
                uid: '123',
                name: 'testName',
            },
        });
        expect( localStorage.setItem ).toHaveBeenCalledWith('token', 'token123abc');
        expect( localStorage.setItem ).toHaveBeenCalledWith('token-init-date', expect.any( Number ));
    });

    test('should startChecking correctly', async () => {
        /** Mock only in this test */
        fetchModule.fetchWithToken = jest.fn( () => {
            return {
                json() {
                    return {
                        ok: true,
                        uid: '123',
                        name: 'testName',
                        token: 'token123abc',
                    }
                }
            };
        });

        await store.dispatch( startChecking() );
        
        const actions = store.getActions();

        expect( actions[0] ).toEqual( {
            type: types.authLogin,
            payload: {
                uid: '123',
                name: 'testName',
            }
        });
        expect( localStorage.setItem ).toHaveBeenCalledWith('token', 'token123abc');
    });
    
    
});
