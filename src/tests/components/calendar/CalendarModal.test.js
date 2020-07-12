import React from 'react';
import '@testing-library/jest-dom';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import moment from 'moment';
import Swal from 'sweetalert2';
import { CalendarModal } from '../../../components/calendar/CalendarModal';
import { eventStartUpdate, eventClearActiveEvent, eventStartAddNew } from '../../../actions/eventActions';

jest.mock( '../../../actions/eventActions', () => {
    return {
        eventStartUpdate: jest.fn(),
        eventClearActiveEvent: jest.fn(),
        eventStartAddNew: jest.fn(),
    };
});

jest.mock( 'sweetalert2', () => {
    return {
        fire: jest.fn(),
    };
});

const middlewares = [ thunk ];
const mockStore = configureStore( middlewares );

const now = moment().minutes(0).seconds(0).add(1, 'hours');
const finishDate = now.clone().add(1, 'hours');

const initState = {
    auth: {
        uid: 'ABC',
    },
    calendar: {
        activeEvent: {
            title: 'Hola mundo',
            notes: 'Notas',
            start: now.toDate(),
            end: finishDate.toDate(),
        },
        events: [],
    },
    ui: {
        modalOpen: true,
    }
};

const store = mockStore( initState );
store.dispatch = jest.fn();

const wrapper = mount(
    <Provider store={ store }>
        <CalendarModal />
    </Provider>
);

describe('Test with CalendarModal component', () => {

    beforeEach( () => {
        jest.clearAllMocks();
    });

    test('should ', () => {
        // expect( wrapper.find('.modal').exists() ).toBe( true );
        expect( wrapper.find('Modal').prop('isOpen') ).toBe( true );
    });

    test('should call the action update event and close modal', () => {
        wrapper.find('form').simulate('submit', {
            preventDefault() {}
        });

        expect( eventStartUpdate ).toHaveBeenCalledWith( initState.calendar.activeEvent );
        expect( eventClearActiveEvent ).toHaveBeenCalled();
    });

    test('should show error if the title is empty', () => {
        /** In this moment, title is empty because the event 
         * eventClearActiveEvent was called in the last test
         */
        wrapper.find('form').simulate('submit', {
            preventDefault() {}
        });
        expect( wrapper.find('input[name="title"]').hasClass('is-invalid') ).toBe( true );
    });

    test('should create a new event', () => {
        const initState = {
            auth: {
                uid: 'ABC',
            },
            calendar: {
                activeEvent: null,
                events: [],
            },
            ui: {
                modalOpen: true,
            }
        };
        
        const store = mockStore( initState );
        store.dispatch = jest.fn();
        
        const wrapper = mount(
            <Provider store={ store }>
                <CalendarModal />
            </Provider>
        );

        wrapper.find('input[name="title"]').simulate('change', {
            target: {
                name: 'title',
                value: 'Test',
            },
        });

        wrapper.find('form').simulate('submit', {
            preventDefault() {}
        });

        expect( eventStartAddNew ).toHaveBeenCalledWith( {
            title: 'Test',
            notes: '',
            start: expect.anything(),
            end: expect.anything(),
        });
        expect( eventClearActiveEvent ).toHaveBeenCalled();
    });

    test('should validate the dates', () => {
        wrapper.find('input[name="title"]').simulate('change', {
            target: {
                name: 'title',
                value: 'Test',
            },
        });

        const today = new Date();

        act( () => {
            const dateTimePickerEnd = wrapper.find('DateTimePicker').at(1).prop('onChange');
            dateTimePickerEnd( today );
        });

        wrapper.find('form').simulate('submit', {
            preventDefault() {}
        });

        expect( Swal.fire ).toHaveBeenCalled();
    });
    
});