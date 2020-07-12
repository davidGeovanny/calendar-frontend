import React from 'react';
import '@testing-library/jest-dom';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { CalendarScreen } from '../../../components/calendar/CalendarScreen';
import { messages } from '../../../helpers/calendar-messages-es';
import { types } from '../../../types/types';
import { eventSetActive, eventStartLoad } from '../../../actions/eventActions';
import { act } from 'react-dom/test-utils';

jest.mock( '../../../actions/eventActions', () => {
    return {
        eventSetActive: jest.fn(),
        eventStartLoad: jest.fn(),
    };
});

const middlewares = [ thunk ];
const mockStore = configureStore( middlewares );

const initState = {
    auth: {
        uid: 'ABC',
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
store.dispatch = jest.fn();
Storage.prototype.setItem = jest.fn();

const wrapper = mount(
    <Provider store={ store }>
        <CalendarScreen />
    </Provider>
);

describe('Test with CalendarScreen', () => {
    test('should match with the snapshot', () => {
        expect( wrapper ).toMatchSnapshot();
    });

    test('interactions with the calendar', () => {
        const calendar = wrapper.find('Calendar');
        const calendarMessages = calendar.prop('messages');
        expect( calendarMessages ).toEqual( messages );

        const calendarDoubleClick = calendar.prop('onDoubleClickEvent');
        calendarDoubleClick();
        expect( store.dispatch ).toHaveBeenCalledWith( { type: types.uiOpenModal } );

        const calendarSelectEvent = calendar.prop('onSelectEvent');
        calendarSelectEvent({ start: 'value' });
        expect( eventSetActive ).toHaveBeenCalledWith({ start: 'value' });

        act( () => {
            const calendarOnView = calendar.prop('onView');
            calendarOnView('week');
            expect( localStorage.setItem ).toHaveBeenCalledWith('lastView', 'week');
        });
    });
    
    
})
