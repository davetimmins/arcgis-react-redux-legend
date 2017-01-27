import React from "react";
import ReactDOM from "react-dom";
import {connect} from "react-redux";
import * as esriLoader from "esri-loader";
import {MapLegend,setInitialLegend} from "../../../dist/arcgis-react-redux-legend";
import isWebGLEnabled from 'is-webgl-enabled';
import isMobile from 'is-mobile';

class MapUi extends React.Component {
  initialState = {view: null};

  state = this.initialState;

  componentDidMount() {

    const {mapId, setInitialLegend} = this.props;

    if (!esriLoader.isLoaded()) {
      // lazy load the ArcGIS API
      esriLoader.bootstrap(err => {
        if (err) {
          console.error(err);
          return;
        }

        esriLoader.dojoRequire(
          ["esri/Map", isWebGLEnabled() && !isMobile() ? "esri/views/SceneView" : "esri/views/MapView", "esri/layers/MapImageLayer"],
          (Map, View, MapImageLayer) => {
          // ["esri/Map", isWebGLEnabled() && !isMobile() ? "esri/views/SceneView" : "esri/views/MapView", "esri/WebMap"],
          // (Map, View, WebMap) => {

            const layer1 = new MapImageLayer({
              url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/RedlandsEmergencyVehicles/MapServer"
            });

            const layer2 = new MapImageLayer({
              url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer",
              visible: false
            });

            const layer3 = new MapImageLayer({
              url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/Hurricanes/MapServer/'
            });

            const map = new Map({basemap: "topo", layers: [layer1, layer2, layer3]});

            // const view = new SceneView({
            //   container: ReactDOM.findDOMNode(this.refs.mapView),
            //   map: new WebMap({
            //     portalItem: {
            //       id: '8e42e164d4174da09f61fe0d3f206641'
            //     }
            //   }),
            //   padding: {right: 280}
            // });

            //view.map.layers.add(layer3);

            const view = new View({
              container: ReactDOM.findDOMNode(this.refs.mapView),
              map: map,
              padding: {right: 280}
            });

            layer3.then(function(lyr) {
              view.goTo(lyr.fullExtent);
            });

            this.setState({view: view});

            // calling this initialises the legend control
            setInitialLegend(view, mapId);
          }
        );
      });
    }
  }

  render() {
    const {mapId} = this.props;
    const {view} = this.state;

    const mapStyle = {width: "100%", height: "100%"};
    const legend = view ? <MapLegend mapId={mapId} /> : null;

    return (
      <div style={mapStyle} ref="mapView">
        {legend}
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setInitialLegend: (view, mapId) => {
      dispatch(setInitialLegend(view, mapId));
    }
  };
};

export default connect(null, mapDispatchToProps)(MapUi);
