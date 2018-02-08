import React , {Component} from 'react';

import { doLogin, doRegister } from '../utils/dmeetup-api';

export default class Authentication extends Component {
    constructor(props){
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.register = this.register.bind(this);

    }

    register(){
        let that = this;
        doRegister(this.email.value, this.password.value).then((data) => {
            if(data['status'] === 'success'){
                if(that.props.onSuccessLogin){
                    that.props.onSuccessLogin(data['auth_token']);
                }
            }else{
                if(that.props.onFailedLogin){
                    that.props.onFailedLogin(data['message']);
                }
            }
        }).catch((error)=> {
            if(that.props.onFailedLogin){
                that.props.onFailedLogin(error.message);
            }
        });
    }

    handleSubmit(e){
        e.preventDefault();
        doLogin(this.email.value, this.password.value).then((data) => {
            if(data['status'] === 'success'){
                if(this.props.onSuccessLogin){
                    this.props.onSuccessLogin(data['auth_token']);
                }
            }else{
                if(this.props.onFailedLogin){
                    this.props.onFailedLogin(data['message']);
                }
            }
        });
    }

    render(){
        return (
            <div>
            <br/>
            <div>
            Please Login:
            </div>
            <form onSubmit={this.handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" required="required"
                            ref={(input) => {this.email = input; }}
                            className="form-control" id="email" placeholder="Email" />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Passowrd</label>
                    <input type="password" required="required" 
                            ref={(input) => {this.password = input; }}
                            className="form-control" id="password" placeholder="Password" />
                </div>
                <button type="submit" className="btn btn-default pull-left">Login</button>
                &nbsp; or &nbsp;
                <button type="button" onClick={this.register} className="btn pull-right">Sign up</button>
            </form>
            </div>
        );
    }
}
