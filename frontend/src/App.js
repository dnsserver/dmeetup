import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';

import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import 'react-notifications/lib/notifications.css';
import {NotificationContainer, NotificationManager} from 'react-notifications';

import Nav from './components/Nav';
import Profile from './components/Profile';
import Authentication from './components/Authentication';
import Feed from './components/Feed';
import Map from './components/Map';

class App extends Component {
    constructor(props){
        super(props);
        const token = sessionStorage.getItem('session');
        this.state = {
            isAuthenticated : token ? true: false,
            auth_token : token
        }
        this.onSuccessLogin = this.onSuccessLogin.bind(this);
        this.onFailedLogin = this.onFailedLogin.bind(this);
        this.logout = this.logout.bind(this);
    }

    logout() {
        sessionStorage.clear();
        this.setState({
            isAuthenticated: false,
            auth_token: ''
        });
    }

    onSuccessLogin(u){
        sessionStorage.setItem('session', u);
        this.setState({
            isAuthenticated: true,
            auth_token: u
        });
        NotificationManager.info('Welcome back!', '', 1000);
    }

    onFailedLogin(m){
        sessionStorage.clear();
        this.setState({
            isAuthenticated: false,
            auth_token: ''
        });
        NotificationManager.error(m, '', 1000);
    }


    render(){
        if(this.state.isAuthenticated){
            return (
                <div className="container">
                    <Router >
                        <div>
                        <Route render={props => <Nav logout={this.logout} />} />
                        <Switch>
                            <Route exact path="/" component={Feed}/>
                            <Route path="/profile" render={props => <Profile auth_token={this.state.auth_token}/>} />
                            <Route path="/map" render={props => (
                                <div>
                                <script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCAZlHfI22LHKSX_Cczw4jAtFLYsXeZmok" type="text/javascript"></script>
                                <Map />
                                </div>
                            )} />
                        </Switch>
                        </div>
                    </Router>
                    <NotificationContainer />
                </div>
            );
        }else{
            return (
                <div className="container">
                <Router >
                    <Route render={props => <Authentication  onFailedLogin={this.onFailedLogin} onSuccessLogin={this.onSuccessLogin} />} />
                </Router>
                <NotificationContainer />
                </div>
            );
        }
    }
}



export default App;
