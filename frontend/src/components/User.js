import React, { Component } from 'react';
//import { Link } from 'react-router-dom';
import { sendConnectionRequest, searchUsers } from '../utils/dmeetup-api';

import {NotificationManager} from 'react-notifications';

export default class User extends Component {
    constructor(props){
        super(props);
        this.getUsers = this.getUsers.bind(this);
        this.sendConnectionRequest = this.sendConnectionRequest.bind(this);
        this.state = { users: []};
    }

    getUsers(e){
        e.preventDefault();
        searchUsers(this.props.auth_token, this.filter.value).then((data) => {
            this.setState({users: data.data});
        });
    }

    sendConnectionRequest(receiver, message){
        sendConnectionRequest(this.props.auth_token, receiver, message).then((data)=>{
            NotificationManager.success('Request sent.','',1000);
        });

    }

    render(){
        const data = this.state.users || [];
        const form = (
            <div className="row">
                <form onSubmit={this.getUsers}>
                    <div className="col-sm-6">
                        <div className="input-group">
                          <input type="text" required="required"
                                ref={(input) => {
                                    this.filter = input; 
                                }}
                                className="form-control" placeholder="Search for..." />
                          <span className="input-group-btn">
                            <button className="btn btn-default" type="submit">Search</button>
                          </span>
                        </div>
                      </div>
                </form>
            </div>
        );
        return (
            <div>
                {form}
                <br/>
                <div className="row">
                    <div className="col-sm-12">
                        <div className="list-group">
                            {data.map((user, index)=>{
                                return (
                                    <div key={user.id} className="list-group-item">
                                        {user.full_name}: {user.email}
                                        <div className="btn-group btn-group-xs pull-right" role="group">
                                            <button type="button"
                                                onClick={() => this.sendConnectionRequest(user.id, "connect")} 
                                                className="btn btn-default">Follow</button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

