import React, { useState } from "react";
import {Route, Switch, Redirect} from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Home from "./Home";

function Main(props) {
    const { isLoggedIn, handleLoggedIn } = props;

    // handle login / redirect to home
    const showLogin = () => {
        return isLoggedIn ? (
            <Redirect to="/home"/>
        ) : (
            <Login handleLoggedIn={handleLoggedIn}/>
        );
    };

    // home page / redirect to login
    const showHome = () => {
        return isLoggedIn ? <Home /> : <Redirect to="/login"/>;
    };

    // main page
    return (
        <div className="main">
            <Switch>
                <Route path="/" exact render={showLogin} />
                <Route path="/login" render={showLogin} />
                <Route path="/register" component={Register} />
                <Route path="/Home" render={showHome} />
            </Switch>
        </div>
    );
}

export default Main;