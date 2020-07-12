import React, { useEffect } from "react";
import { 
    BrowserRouter as 
    Router, 
    Switch, 
    Redirect,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LoginScreen } from "../components/auth/LoginScreen";
import { CalendarScreen } from "../components/calendar/CalendarScreen";
import { startChecking } from "../actions/authActions";
import { PublicRoutes } from "./PublicRoutes";
import { PrivateRoutes } from "./PrivateRoutes";

export const AppRouter = () => {

    const dispatch = useDispatch();
    const { checking, uid } = useSelector(state => state.auth);

    useEffect(() => {
        dispatch( startChecking() );
    }, [ dispatch ]);

    if( checking ) {
        return <h1>Cargando...</h1>
    }

	return (
        <Router>
            <div>
                <Switch>
                    <PublicRoutes 
                        exact
                        path="/login"
                        isAuthenticated={ !!uid }
                        component={ LoginScreen } 
                    />
                    <PrivateRoutes 
                        exact
                        path="/"
                        isAuthenticated={ !!uid }
                        component={ CalendarScreen } 
                    />

                    <Redirect to="/" />
                </Switch>
            </div>
        </Router>
	);
};
