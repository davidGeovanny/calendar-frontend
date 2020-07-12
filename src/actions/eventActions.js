import Swal from "sweetalert2";
import { types } from "../types/types";
import { fetchWithToken } from "../helpers/fetch";
import { prepareEvents } from "../helpers/prepareEvents";

export const eventStartAddNew = ( event ) => {
    return async ( dispatch, getState ) => {

        const { uid, name } = getState().auth;

        try {
            const resp = await fetchWithToken( 'events', event, 'POST' );
            const body = await resp.json();
        
            if( body.ok ) {
                event.id = body.event.id;
                event.user = {
                    _id: uid,
                    name
                };

                dispatch( eventAddNew( event ) );
            }  
        } catch (error) {
            console.log(error);
        }
    };
};

const eventAddNew = ( event ) => {
    return {
        type: types.eventAddNew,
        payload: event
    };
}

export const eventSetActive = ( event ) => {
    return {
        type: types.eventSetActive,
        payload: event
    };
}

export const eventClearActiveEvent = () => {
    return {
        type: types.eventClearActiveEvent,
    };
}

export const eventStartUpdate = ( event ) => {
    return async ( dispatch ) => {
        try {
            const resp = await fetchWithToken( `events/${ event.id }`, event, 'PUT' );
            const body = await resp.json();

            if( body.ok ) {
                dispatch( eventUpdated( event ) );
            } else {
                Swal.fire({
                    title: 'Error',
                    text: body.msg,
                    icon: 'error'
                });
            }
        } catch (error) {
            console.log(error);
        }
    };
};

const eventUpdated = ( event ) => {
    return {
        type: types.eventUpdated,
        payload: event
    };
}

export const eventStartDelete = () => {
    return async ( dispatch, getState ) => {

        const { id } = getState().calendar.activeEvent;

        try {
            const resp = await fetchWithToken( `events/${ id }`, {}, 'DELETE' );
            const body = await resp.json();

            if( body.ok ) {
                dispatch( eventDeleted() );
            } else {
                Swal.fire({
                    title: 'Error',
                    text: body.msg,
                    icon: 'error'
                });
            }
        } catch (error) {
            console.log(error);
        }
    };
};

const eventDeleted = () => {
    return {
        type: types.eventDeleted,
    };
}

export const eventStartLoad = () => {
    return async ( dispatch ) => {
        try {
            const resp = await fetchWithToken( 'events' );
            const body = await resp.json();

            const events = prepareEvents( body.events );

            dispatch( eventLoaded( events ) );
        } catch (error) {
            console.log(error);
        }
    };
}

const eventLoaded = ( events ) => {
    return {
        type: types.eventLoaded,
        payload: events
    }
};

export const eventLogout = () => {
    return {
        type: types.eventLogout,
    }
};