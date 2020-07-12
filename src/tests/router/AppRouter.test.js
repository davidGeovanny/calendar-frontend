import React from 'react';
import '@testing-library/jest-dom';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { AppRouter } from '../../routers/AppRouter';

const middlewares = [ thunk ];
const mockStore = configureStore( middlewares );

describe('Test with AppRouter', () => {
    test('should show "Cargando..." message', () => {
        const initState = {
            auth: {
                checking: true,
            },
        };
        
        const store = mockStore( initState );

        const wrapper = mount(
            <Provider store={ store }>
                <AppRouter />
            </Provider>
        );

        expect( wrapper ).toMatchSnapshot();
    });

    test('should show public route', () => {
        const initState = {
            auth: {
                checking: false,
                uid: null,
            },
        };
        
        const store = mockStore( initState );

        const wrapper = mount(
            <Provider store={ store }>
                <AppRouter />
            </Provider>
        );

        expect( wrapper ).toMatchSnapshot();
        expect( wrapper.find('.login-container').exists() ).toBe( true );
    });

    test('should show private route', () => {
        const initState = {
            auth: {
                checking: false,
                uid: '123ABC',
            },
            calendar: {
                activeEvent: null,
                events: [],
            },
            ui: {
                modalOpen: false,
            }
        };
        
        const store = mockStore( initState );

        const wrapper = mount(
            <Provider store={ store }>
                <AppRouter />
            </Provider>
        );

        expect( wrapper ).toMatchSnapshot();
        expect( wrapper.find('.calendar-screen').exists() ).toBe( true );
    });
    
})
