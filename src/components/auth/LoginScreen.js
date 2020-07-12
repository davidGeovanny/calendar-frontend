import React from 'react';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { useForm } from '../../hooks/useForm';
import './login.css';
import { startLogin, startRegister } from '../../actions/authActions';

export const LoginScreen = () => {

    const dispatch = useDispatch();

    const initialLoginForm = {
        loginEmail: '',
        loginPassword: '',
    };

    const initialRegisterForm = {
        registerEmail: 'david.geovanny@hotmail.com',
        registerPassword: '',
        registerPasswordRepeat: '',
        registerName: 'David Geovanny',
    };

    const [ formLoginValues, handleLoginInputChange ] = useForm( initialLoginForm );
    const [ formRegisterValues, handleRegisterInputChange ] = useForm( initialRegisterForm );

    const { loginEmail, loginPassword } = formLoginValues;
    const { registerName, registerEmail, registerPassword, registerPasswordRepeat } = formRegisterValues;

    const handleLogin = (e) => {
        e.preventDefault();
        dispatch( startLogin( loginEmail, loginPassword ) );
    };

    const handleRegister = (e) => {
        e.preventDefault();

        if( registerPassword !== registerPasswordRepeat ) {
            return Swal.fire({
                title: 'Error',
                text: 'Las contraseñas deben de ser iguales',
                icon: 'error'
            });
        }

        dispatch( startRegister( registerName, registerEmail, registerPassword ) );
    };

    return (
        <div className="container login-container">
            <div className="row">
                <div className="col-md-6 login-form-1">
                    <h3>Ingreso</h3>
                    <form onSubmit={ handleLogin }>
                        <div className="form-group">
                            <input 
                                type="text"
                                className="form-control"
                                placeholder="Correo"
                                autoComplete="off"
                                name="loginEmail"
                                value={ loginEmail }
                                onChange={ handleLoginInputChange }
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Contraseña"
                                name="loginPassword"
                                value={ loginPassword }
                                onChange={ handleLoginInputChange }
                            />
                        </div>
                        <div className="form-group">
                            <input 
                                type="submit"
                                className="btnSubmit"
                                value="Login" 
                            />
                        </div>
                    </form>
                </div>

                <div className="col-md-6 login-form-2">
                    <h3>Registro</h3>
                    <form onSubmit={ handleRegister }>
                        <div className="form-group">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Nombre"
                                name="registerName"
                                value={ registerName }
                                onChange={ handleRegisterInputChange }
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Correo"
                                name="registerEmail"
                                value={ registerEmail }
                                onChange={ handleRegisterInputChange }
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Contraseña"
                                name="registerPassword"
                                value={ registerPassword }
                                onChange={ handleRegisterInputChange }
                            />
                        </div>

                        <div className="form-group">
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Repita la contraseña"
                                name="registerPasswordRepeat"
                                value={ registerPasswordRepeat }
                                onChange={ handleRegisterInputChange }
                            />
                        </div>

                        <div className="form-group">
                            <input 
                                type="submit" 
                                className="btnSubmit" 
                                value="Crear cuenta" />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}