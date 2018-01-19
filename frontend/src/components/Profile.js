import React, { Component } from 'react';
//import { Link } from 'react-router-dom';
import { getUserInfo } from '../utils/dmeetup-api';

class Profile extends Component {
    constructor(props){
        super(props);
        this.state = { data: null};
    }
    getUserInfo(auth_token){
        getUserInfo(auth_token).then((data) => {
            this.setState({userInfo: data.data});
        });
    }

    componentDidMount(){
        if(this.props.auth_token){
            this.getUserInfo(this.props.auth_token);
        }

    }

    render(){
        const data = this.state.userInfo;
        if(data){

            return (
                <div>
                    <div>Email: {data.email}</div>
                    <div>Full Name: {data.full_name}</div>
                    <div>ID: {data.user_id}</div>
                </div>
            );
        }else{
            return (
                <div>
                    Loading profile...
                </div>
            );
        }
    }

}

export default Profile;
