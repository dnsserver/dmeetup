import React from 'react';

export class Profile extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            profile: null
        }
    }

    loadInfo(token){
        $.ajax({
            url: '/api/userinfo',
            dataType: "json",
            method: 'GET',
            headers:{
                'Content-Type':'application/json',
                'Authorization':'Bearer '+token
            },
            success: (data)=>{
                if(data['status'] === "success"){
                    this.setState({profile: data['data']});
                }
            },
            error: (err)=>{
                
            }
        });
    }

    componentDidMount(){
        if(this.props.auth_token){
            this.loadInfo(this.props.auth_token);
        }
    }

    render(){
        const profile = this.state.profile;
        if(profile){

            return (
                <div>
                    <div>Email: {profile.email}</div>
                    <div>Full Name: {profile.full_name}</div>
                    <div>ID: {profile.user_id}</div>
                </div>
            );
        }else{
            return (
                <div>Loading...</div>
            );
        }
    }
}

