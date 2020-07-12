import React from 'react';
import '@testing-library/jest-dom';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Swal from 'sweetalert2';
import { LoginScreen } from '../../../components/auth/LoginScreen';
import { startLogin, startRegister } from '../../../actions/authActions';

jest.mock( '../../../actions/authActions', () => {
    return {
        startLogin: jest.fn(),
        startRegister: jest.fn(),
    };
});

jest.mock( 'sweetalert2', () => {
    return {
        fire: jest.fn(),
    };
});

const middlewares = [ thunk ];
const mockStore = configureStore( middlewares );

const initState = {};

const store = mockStore( initState );
store.dispatch = jest.fn();

const wrapper = mount(
    <Provider store={ store }>
        <LoginScreen />
    </Provider>
);

describe('Test with LoginScreen component', () => {

    beforeEach( () => {
        jest.clearAllMocks();
    });

    test('should match with the snapshot', () => {
        expect( wrapper ).toMatchSnapshot();
    });

    test('should call the dispatch(startLogin)', () => {
        const loginEmail = 'email@gmail.com';
        const loginPassword = '123456';

        wrapper.find('input[name="loginEmail"]').simulate('change', {
            target: {
                name: 'loginEmail',
                value: loginEmail
            }
        });
        wrapper.find('input[name="loginPassword"]').simulate('change', {
            target: {
                name: 'loginPassword',
                value: loginPassword
            }
        });

        wrapper.find('form').at(0).simulate('submit', {
            preventDefault() {},
        });

        expect( startLogin ).toHaveBeenCalledWith( loginEmail, loginPassword );
    });
    
    test('should not register if the passwords are differente', () => {
        wrapper.find('input[name="registerPassword"]').simulate('change', {
            target: {
                name: 'registerPassword',
                value: '123456',
            }
        });
        wrapper.find('input[name="registerPasswordRepeat"]').simulate('change', {
            target: {
                name: 'registerPasswordRepeat',
                value: '1234567',
            }
        });

        wrapper.find('form').at(1).simulate('submit', {
            preventDefault() {},
        });

        expect( startRegister ).not.toHaveBeenCalled();
        expect( Swal.fire ).toHaveBeenCalled();
    });

    test('should dispatch startRegister when the passwords are the same', () => {
        wrapper.find('input[name="registerPassword"]').simulate('change', {
            target: {
                name: 'registerPassword',
                value: '123456',
            }
        });
        wrapper.find('input[name="registerPasswordRepeat"]').simulate('change', {
            target: {
                name: 'registerPasswordRepeat',
                value: '123456',
            }
        });

        wrapper.find('form').at(1).simulate('submit', {
            preventDefault() {},
        });

        expect( Swal.fire ).not.toHaveBeenCalled();
        expect( startRegister ).toHaveBeenCalled();
    });
    
    
})
