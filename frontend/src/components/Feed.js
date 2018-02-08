import React, { Component } from 'react';
//import { Link } from 'react-router-dom';
import { getRequests, getMessages} from '../utils/dmeetup-api';

export default class Feed extends Component {
    constructor(props){
        super(props);
        this.state = { 
            connections: [],
            messages: [],
        };
    }
    getUserFeed(){
        getRequests(this.props.auth_token).then((data) => {
            this.setState({connections: data.data});
        });
    }

    getMessages(){
        getMessages(this.props.auth_token).then((data) => {
            this.setState({messages: data.data});
        });
    }
 
    componentDidMount(){
        this.getUserFeed();
        this.getMessages();
    }

    render(){
        const connections = this.state.connections || [];
        const messages = this.state.messages || [];
        return (
            <div>
                <div className="row">
                    <div className="col-sm-12">
                        Connection Requests:
                    </div>
                    <div className="col-sm-12">
                        <div className="list-group">
                            {connections.map((feed) => {
                                return (
                                    <div key={feed.id} className="list-group-item">
                                        {feed.id}: {feed.sender_message} - {feed.request_status} 
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-12">
                        Messages:
                    </div>
                    <div className="col-sm-12">
                        <div className="list-group">
                            {messages.map((feed) => {
                                return (
                                    <div key={feed.id} className="list-group-item">
                                        {feed.id}: {feed.sender} - {feed.message} - {feed.sent_time} 
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

