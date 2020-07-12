import Swal from "sweetalert2";
import { types } from "../types/types";
import { fetchWithoutToken, fetchWithToken } from "../helpers/fetch";
import { eventLogout } from "./eventActions";

export const startLogin = ( email, password ) => {
    return async ( dispatch ) => {
        const resp = await fetchWithoutToken( 'auth/', { email, password }, 'POST' );
        const body = await resp.json();

        if( body.ok ) {
            localStorage.setItem('token', body.token );
            localStorage.setItem('token-init-date', new Date().getTime() );

            dispatch( login(
                { 
                    uid: body.uid, 
                    name: body.name 
                }
            ));
        } else {
            Swal.fire({
                title: 'Error',
                text: body.msg,
                icon: 'error' 
            });
        }
    };
};

const login = ( user ) => {
    return {
        type: types.authLogin,
        payload: user
    };
};

export const startRegister = ( name, email, password ) => {
    return async ( dispatch ) => {

        const resp = await fetchWithoutToken( 'auth/new', { name, email, password }, 'POST' );

        const body = await resp.json();

        if( body.ok ) {
            localStorage.setItem('token', body.token );
            localStorage.setItem('token-init-date', new Date().getTime() );

            dispatch( login(
                { 
                    uid: body.uid, 
                    name: body.name 
                }
            ));
        } else {
            Swal.fire({
                title: 'Error',
                text: body.msg,
                icon: 'error',
            });
            dispatch( checkingFinish() );
        }
    };
};

export const startChecking = () => {
    return async ( dispatch ) => {
        const resp = await fetchWithToken( 'auth/renew' );

        const body = await resp.json();

        if( body.ok ) {
            localStorage.setItem('token', body.token );
            localStorage.setItem('token-init-date', new Date().getTime() );

            dispatch( login(
                { 
                    uid: body.uid, 
                    name: body.name 
                }
            ));
        } else {
            dispatch( checkingFinish() );
        }
    };
};

const checkingFinish = () => {
    return {
        type: types.authCheckingFinish,
    };
};

export const startLogout = () => {
    return async ( dispatch ) => {
        localStorage.clear();
        dispatch( logout() );
        dispatch( eventLogout() );
    };
};

const logout = () => {
    return {
        type: types.authLogout,
    };
};