import React from 'react';
import ReactDOM from 'react-dom';

export class Map extends React.Component {
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
            width: '90vw',
            height: '70vh',
        };
        return (
            <div>
            <div ref='map' style={style}>Loading map...</div>
            </div>
        );
    }
}

