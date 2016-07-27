import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'

import MapLegend from 'app/components/map-legend'

import { setCurrentScale, setInitialLegend } from 'app/actions/map-legend-actions'

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
        },
        setCurrentScale: (currentScale) => {
            dispatch(setCurrentScale(currentScale))
        }
    }
}

class MapUi extends Component {
       
    componentDidMount() {

        const { mapId, setCurrentScale, setInitialLegend } = this.props

        const imageLyr = new MapImageLayer({
            url: "https://tmservices1.esri.com/arcgis/rest/services/LiveFeeds/Hurricane_Active/MapServer"
        })

        const map = new Map({
            basemap: "topo",
            layers: [imageLyr]
        })

        const view = new SceneView({
            container: ReactDOM.findDOMNode(this.refs.mapView),
            map: map,
            padding: { right: 280 }            
        })

        imageLyr.then(function() {
            view.goTo({
                center: [130, 0]
            })
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

            view.watch('scale', function(newScale) {
                setCurrentScale(newScale)
            })
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
