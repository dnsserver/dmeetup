import {geolocated} from 'react-geolocated';

class Clock extends React.Component {
    constructor(props){
        super(props);
        this.state = {date: new Date()};
    }

    componentDidMount(){
        this.timerID = setInterval(
            () => this.tick(),
            1000
        );
    }

    componentWillUnmount(){
        clearInterval(this.timerID);
    }

    tick() {
        this.setState({
            date: new Date()
        });
    }

    render() {
        return (
            <div>
                <h1>Hello, world!</h1>
                <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
            </div>
        );
    }
}

class LoggingButton extends React.Component {
    constructor(props){
        super(props);
        this.state = {nrClicks: 0};
    }

    handleClick(nr) {
        console.log('this is: ', nr);
        this.setState((prevstate) => ({
            nrClicks : prevstate.nrClicks + 1
        }));
    }

    render(){
        return (
            <button class="btn btn-default" onClick={this.handleClick.bind(this, this.state.nrClicks)}> Log this</button>
        )
    }
}

function App(){
	const notifications = [{"message":"Alert1 - success", "type":"success"},
						{"message":"Alert2 - info", "type":"info"},
						{"message":"Alert3 - warning", "type":"warning"},
						{"message":"Alert4 - danger", "type":"danger"}];
	
    return (
        <div>
			<Notifications alerts={notifications} show={true} />
            <Clock />
            <LoggingButton />
			<LoginControl />
			<FileInput />
			<Calculator />
            <Container />
        </div>
    );
}

function UserGreeting(props){
	return <h1>Welcome back!</h1>;
}

function GuestGreeting(props){
	return <h1>Please sign up.</h1>;
}

function Greeting(props){
	const isLoggedIn = props.isLoggedIn;
	if(isLoggedIn){
		return <UserGreeting />;
	}
	return <GuestGreeting />;
}

function LoginButton(props){
    return (
        <button  class="btn btn-default" onClick={props.onClick}>
        Login
        </button>
    );
}

function LogoutButton(props){
    return (
        <button  class="btn btn-default" onClick={props.onClick}>
        Logout
        </button>
    );
}

class LoginControl extends React.Component {
    constructor(props){
        super(props);
        this.handleLoginClick = this.handleLoginClick.bind(this);
        this.handleLogoutClick = this.handleLogoutClick.bind(this);
        this.state = {isLoggedIn: false};
    }

    handleLoginClick(){
        this.setState({isLoggedIn: true});
    }

    handleLogoutClick(){
        this.setState({isLoggedIn: false});
    }

    render(){
        const isLoggedIn = this.state.isLoggedIn;
        
        let button = null;
        if(isLoggedIn){
            button = <LogoutButton onClick={this.handleLogoutClick} />;
        }else{
            button = <LoginButton onClick={this.handleLoginClick} />;
        }

        return (
            <div>
            <Greeting isLoggedIn={isLoggedIn} />
			{button}
            </div>
        );
    }
}

class FileInput extends React.Component {
	constructor(props){
		super(props);
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	handleSubmit(event){
		event.preventDefault();
		alert(`Selected file - ${this.fileInput.files[0].name}`);
	}
	render(){
		return (
			<form onSubmit={this.handleSubmit}>
				<label>Upload file:
					<input type="file"
						ref={input => {this.fileInput = input;}} />
				</label>
				<br />
				<button class="btn btn-default" type="submit">Submit</button>
			</form>
		);
	}
}

const scaleNames = {
	c: 'Celsius',
	f: 'Fahrenheit'
};

class TemperatureInput extends React.Component {
	constructor(props){
		super(props);
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(e){
		this.props.onTemperatureChange(e.target.value);
	}

	render() {
		const temperature = this.props.temperature;
		const scale = this.props.scale;
		return (
			<fieldset>
				<legend>Enter temperature in {scaleNames[scale]}:</legend>
				<input value={temperature} onChange={this.handleChange} />
			</fieldset>
		);
	}
}

function BoilingVerdict(props){
	if(props.celsius >= 100){
		return <p>The water would boil.</p>;
	}
	return <p>The water would not boil.</p>;
}

function toCelsius(fahrenheit){
	return (fahrenheit - 32) * 5 / 9;
}
function toFahrenheit(celsius){
	return (celsius * 9/5) + 32;
}
function tryConvert(temperature, convert) {
	const input = parseFloat(temperature);
	if(Number.isNaN(input)){
		return '';
	}
	const output = convert(input);
	const rounded = Math.round(output * 1000) / 1000;
	return rounded.toString();
}

class Calculator extends React.Component{
	constructor(props){
		super(props);
		this.handleCelsiusChange = this.handleCelsiusChange.bind(this);
		this.handleFahrenheitChange = this.handleFahrenheitChange.bind(this);
		this.state = {temperature: '0', scale: 'c'};
	}
	handleCelsiusChange(temperature){
		this.setState({scale: 'c', temperature: temperature});
	}
	handleFahrenheitChange(temperature){
		this.setState({scale: 'f', temperature: temperature});
	}

	render(){
		const scale = this.state.scale;
		const temperature = this.state.temperature;
		const celsius = scale === 'f' ? tryConvert(temperature, toCelsius): temperature;
		const fahrenheit = scale === 'c' ? tryConvert(temperature, toFahrenheit) : temperature;

		return (
			<div>
				<TemperatureInput 
					scale="c" 
					temperature ={celsius}
					onTemperatureChange={this.handleCelsiusChange} />
				<TemperatureInput 
					scale="f" 
					temperature={fahrenheit}
					onTemperatureChange={this.handleFahrenheitChange} />

				<BoilingVerdict celsius={parseFloat(celsius)} />
			</div>
		);
	}
}
    ReactDOM.render(
        <App />,
        document.getElementById('root')
    );


