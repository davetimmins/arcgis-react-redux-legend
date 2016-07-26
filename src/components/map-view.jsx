import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'

import MapLegend from 'app/components/map-legend'

import { setInitialLegend } from 'app/actions/map-legend-actions'

import Map from "esri/Map"
import SceneView from "esri/views/SceneView"
import MapImageLayer from "esri/layers/MapImageLayer"
import watchUtils from 'esri/core/watchUtils'

const mapStateToProps = (state) => {
    return { }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setInitialLegend: (view, mapId) => {
            dispatch(setInitialLegend(view, mapId))
        }
    }
}

class MapUi extends Component {
       
    componentDidMount() {

        const { mapId, setInitialLegend } = this.props

        const infraLyr = new MapImageLayer({
            url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/Energy/Infrastructure/MapServer"
        })

        const map = new Map({
            basemap: "dark-gray",
            layers: [infraLyr]
        })

        const view = new SceneView({
            container: ReactDOM.findDOMNode(this.refs.mapView),
            map: map
        })

        infraLyr.then(function() {
            view.goTo(infraLyr.fullExtent);
        })

        view.then(function() {

            for (let lyr in view.map.layers.items) {

                watchUtils.once(view.map.layers.items[lyr], 'loaded', function (value) {

                    let allLoaded = view.map.layers.items
                        .map((a) => a.loaded)
                        .reduce((prev, curr) => prev && curr)

                    if (allLoaded) {
                        setInitialLegend(view, mapId)
                    }
                })
            }
        })
    }

    render() {

        const { mapId } = this.props

        const mapStyle = {
            width: '100%',
            height: '100%'
        }

        return (
            <div style={mapStyle} mapId={mapId} ref='mapView'><MapLegend mapId={mapId} /></div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MapUi)
