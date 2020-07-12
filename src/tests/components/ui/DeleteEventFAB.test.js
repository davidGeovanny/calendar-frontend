import React from 'react';
import '@testing-library/jest-dom';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { DeleteEventFAB } from '../../../components/ui/DeleteEventFAB';
import { eventStartDelete } from '../../../actions/eventActions';

jest.mock( '../../../actions/eventActions', () => {
    return {
        eventStartDelete: jest.fn(),
    };
});

const middlewares = [ thunk ];
const mockStore = configureStore( middlewares );

const initState = {};

const store = mockStore( initState );
store.dispatch = jest.fn();

const wrapper = mount(
    <Provider store={ store }>
        <DeleteEventFAB />
    </Provider>
);

describe('Test with DeleteEventFAB component', () => {
    
    test('should match with the snapshot', () => {
        expect( wrapper ).toMatchSnapshot();
    });

    test('should call the event eventStartDelete when the button is clicked', () => {
        wrapper.find('button').simulate('click', {
            preventDefault() {}
        });

        expect( eventStartDelete ).toHaveBeenCalled();
    });
    
    
});
