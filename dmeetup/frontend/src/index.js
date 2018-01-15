import React from 'react';
import ReactDOM from 'react-dom';

import {Alerts} from './alerts';
import {Map} from './map';
import {Login} from './login';
import {Profile} from './profile';
import {Navigation} from './navigation';

class App extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            isLogin: false,
            auth_token: null,
            message: null,
            page: null
        };
        this.onSuccessLogin = this.onSuccessLogin.bind(this);
        this.onFailedLogin = this.onFailedLogin.bind(this);
        this.logout = this.logout.bind(this);
        this.navigation = this.navigation.bind(this);
    }

    logout(){
        $.ajax({
            url: '/auth/logout',
            dataType: "json",
            method: 'GET',
            headers:{
                'Content-Type':'application/json',
                'Authorization':'Bearer '+this.state.auth_token
            },
            success: (data)=>{
                this.setState({
                    isLogin: false, 
                    auth_token: null,
                    message: {message: "Logout successfully", type:"info"}
                });
            },
            error: (err)=>{
                this.setState({
                    isLogin: false, 
                    auth_token: null,
                    message: {message: "Logout successfully", type:"info"}
                });
            }
        });
    }

    navigation(cmd){
        switch(cmd){
            case "logout":
                this.logout();
                break;
            default:
                this.setState({
                    message: null,
                    page: cmd
                });
        }
    }

    onSuccessLogin(u){
        this.setState({
            message: {message: 'Welcome back!', type:"info"},
            isLogin: true,
            auth_token: u
        });
    }

    onFailedLogin(m){
        this.setState({
            message: {message: m, type: 'warning'},
            isLogin: false,
            auth_token: null
        });
    }

    render(){
        let navigation = null;
        let body = null;
        if(this.state.isLogin){
            navigation = <Navigation action={this.navigation} />;
            switch(this.state.page){
                case "map":
                    body = <Map />;
                    break;
                case "profile":
                    body = <Profile auth_token={this.state.auth_token}/>;
                    break;
                default:
                    body = <div>Home page</div>;
            }
        }else{
            body = <Login onSuccessLogin={this.onSuccessLogin} onFailedLogin={this.onFailedLogin} />;
        }
        return (
            <div>
            {navigation}
                <Alerts alerts={this.state.message} show={true} />
            {body}
            </div>
        );
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);

