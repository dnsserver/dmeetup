import React from 'react';

export class Login extends React.Component {
    constructor(props){
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.register = this.register.bind(this);

    }

    register(){
        $.ajax({
            url:'/auth/register',
            data: JSON.stringify({
                "email":this.email.value,
                "password":this.password.value
            }),
            dataType: "json",
            method: "POST",
            headers:{"Content-Type":"application/json"},
            success: (data)=>{
                console.log(data);
                if(data['status'] === "success"){
                    if(this.props.onSuccessLogin){
                        this.props.onSuccessLogin(data['auth_token']);
                    }
                }else{
                    if(this.props.onFailedLogin){
                        this.props.onFailedLogin(data['message']);
                    }
                }
            },
            error: (err)=>{
                if(this.props.onFailedLogin){
                    this.props.onFailedLogin(err);
                }
            }
        });
    }

    handleSubmit(e){
        e.preventDefault();
        $.ajax({
            url: '/auth/login',
            data: JSON.stringify({
                "email":this.email.value,
                "password":this.password.value
            }),
            dataType: "json",
            method: 'POST',
            headers:{
                'Content-Type':'application/json'
            },
            success: (data)=>{
                if(data['status'] === "success"){
                    if(this.props.onSuccessLogin){
                        this.props.onSuccessLogin(data['auth_token']);
                    }
                }else{
                    if(this.props.onFailedLogin){
                        this.props.onFailedLogin(data['message']);
                    }
                }

            },
            error: (err)=>{
                if(this.props.onFailedLogin){
                    this.props.onFailedLogin(err['responseJSON'].message);
                }
            }
        });
    }

    render(){
        return (
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
        );
    }
}
