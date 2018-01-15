import React from 'react';


export class Navigation extends React.Component {
    constructor(props){
        super(props);
    }

    doAction(cmd){
        this.props.action(cmd);
    }

    render(){
        return (
            <nav className="navbar navbar-default">
              <div className="container-fluid">
                <div className="navbar-header">
                  <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                    <span className="sr-only">Toggle navigation</span>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                  </button>
                  <a className="navbar-brand" href="/">DMeetup</a>
                </div>

                <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                  <ul className="nav navbar-nav">
                    <li><a href="#" onClick={this.doAction.bind(this, "map")}>Map</a></li>
                    <li><a href="#" onClick={this.doAction.bind(this, "profile")}>Profile</a></li>
                    <li><a href="#" onClick={this.doAction.bind(this, "logout")}>Logout</a></li>
                  </ul>
                </div>
              </div>
            </nav>
        );
    }
}
