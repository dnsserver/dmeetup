import React, { Component } from 'react';
//import { Link } from 'react-router-dom';
import { getUserInfo } from '../utils/dmeetup-api';

export default class Profile extends Component {
    constructor(props){
        super(props);
        this.state = { userInfo: null};
    }
    getUserInfo(){
        getUserInfo(this.props.auth_token).then((data) => {
            this.setState({userInfo: data.data});
        });
    }

    componentDidMount(){
        this.getUserInfo();
    }

    render(){
        const data = this.state.userInfo;
        if(data){
            return (
                <div>
                    <div>Email: {data.email}</div>
                    <div>Full Name: {data.full_name}</div>
                    <div>ID: {data.id}</div>
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

