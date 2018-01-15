import React from 'react';
import ReactDOM from 'react-dom';

class Map extends React.Component {
    loadMap() {
        // google is available
        const maps = google.maps;

        const mapRef = this.refs.map;
        const node = ReactDOM.findDOMNode(mapRef);

        const zoom = 14;
        const center = {lat: 37.774929, lng: -122.419416};
        const mapConfig = {
            center: center,
            zoom: zoom
        };
        this.map = new maps.Map(node, mapConfig);
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(pos => {
                var position = {
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude
                };
                this.map.setCenter(position);
                var marker = new maps.Marker({
                    position: position,
                    map: this.map
                });
            }, function(e){
                console.log(e);
            });
        }
    }

    componentDidMount(){
        this.loadMap();
    }

    render(){
        const style = {
            width: '100vw',
            height: '100vh',
        };
        return (
            <div ref='map' style={style}>Loading map...</div>
        );
    }
}

export class Container extends React.Component {
    render(){
        const style = {
            width: '100vw',
            height: '100vh',
        };
        return (
            <div style={style}>
                <Map />
            </div>
        );
    }
}

