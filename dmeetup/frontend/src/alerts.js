import React from 'react';

function Alert(props){
	if(!props.message || !props.type){
		return null;
	}
	const cls ="alert alert-"+props.type;
	return (
		<div className={cls} role="alert">{props.message}</div>
	);
}

export class Alerts extends React.Component {
	constructor(props){
		super(props);
	}

	render(){
		if(this.props.show && this.props.alerts){
            if(this.props.alerts instanceof Array){
                const alerts = this.props.alerts.map((alert,index) =>
                    <Alert message={alert.message} key={index} type={alert.type} />
                );
                return alerts;
            }else if(this.props.alerts instanceof Object){
                return <Alert message={this.props.alerts.message} type={this.props.alerts.type} />;
            }
		}
		return null;
	}
}
