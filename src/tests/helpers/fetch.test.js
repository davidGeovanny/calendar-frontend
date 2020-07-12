import '@testing-library/jest-dom';
import { fetchWithoutToken, fetchWithToken } from '../../helpers/fetch';

describe('Test with fetch helper', () => {

    let token = '';

    test('fetchWithoutToken should works', async () => {
        const resp = await fetchWithoutToken(
            'auth', 
            { 
                email: 'david.geovanny.cr@gmail.com', 
                password: '123456' 
            },
            'POST' 
        );

        const body = await resp.json();

        token = body.token;

        expect( resp instanceof Response ).toBe( true );
        expect( body.ok ).toBe( true );
    });

    test('fetchWithToken should works', async () => {
        localStorage.setItem('token', token);

        const resp = await fetchWithToken(
            'events/5f050c2e83d2a02fd4fd150c',
            {},
            'DELETE'
        );
        const body = await resp.json();

        expect( body.msg ).toBe('El evento especificado no existe');
    });
});
