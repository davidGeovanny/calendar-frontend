import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { CalendarEvent } from './CalendarEvent';
import { CalendarModal } from './CalendarModal';
import 'moment/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { messages } from '../../helpers/calendar-messages-es';
import { Navbar } from '../ui/Navbar';
import { uiOpenModal } from '../../actions/uiActions';
import { eventSetActive, eventClearActiveEvent, eventStartLoad } from '../../actions/eventActions';
import { AddNewFAB } from '../ui/AddNewFAB';
import { DeleteEventFAB } from '../ui/DeleteEventFAB';

moment.locale('es');

const localizer = momentLocalizer(moment);

export const CalendarScreen = () => {

    const { uid } = useSelector(state => state.auth)

    const dispatch = useDispatch();

    const { events, activeEvent } = useSelector(state => state.calendar);

    const [lastView, setLastView] = useState( localStorage.getItem('lastView') || 'month' );

    const onDoubleClick = (e) => {
        dispatch( uiOpenModal() );
    };

    const onSelectEvent = (e) => {
        dispatch( eventSetActive( e ) );
    };

    const onViewChange = (e) => {
        setLastView( e );
        localStorage.setItem('lastView', e);
    };

    const onSelectSlot = (e) => {
        // console.log(e);
        dispatch( eventClearActiveEvent() );
    };

    const eventStyleGetter = ( event, start, end, isSelected ) => {
        const style = {
            backgroundColor: ( uid === event.user._id ) ? '#367CF7' : '#465660',
            borderRadius: '0px',
            opacity: 0.8,
            display: 'block',
            color: 'white',
        };

        return {
            style
        }
    };

    useEffect(() => {
        dispatch( eventStartLoad() );
    }, [ dispatch ]);

    return (
        <div className="calendar-screen">
            <Navbar />

            <Calendar
                localizer={ localizer }
                events={ events }
                startAccessor="start"
                endAccessor="end"
                messages={ messages }
                eventPropGetter={ eventStyleGetter }
                onDoubleClickEvent={ onDoubleClick }
                onSelectEvent={ onSelectEvent }
                onView={ onViewChange }
                view={ lastView }
                onSelectSlot={ onSelectSlot }
                selectable={ true }
                components={{
                    event: CalendarEvent
                }}
            />

            <AddNewFAB />

            {
                ( activeEvent )
                && <DeleteEventFAB />
            }

            <CalendarModal />
        </div>
    )
}
