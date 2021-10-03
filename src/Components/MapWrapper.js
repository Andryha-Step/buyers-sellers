import React from 'react';

import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"

const MapComponent = withScriptjs(withGoogleMap((props) => {

    return (
        <GoogleMap
            defaultZoom={8}
            defaultCenter={props.coords}
        >
            <Marker position={props.coords} />
        </GoogleMap>
    )

}))

export default function MapWrapper(props) {
    return (
        <MapComponent 
            {...props}
            googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
            loadingElement={<div style={{ height: `100%` }} />}
        >

        </MapComponent>
    )
}