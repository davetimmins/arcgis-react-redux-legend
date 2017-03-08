import React from "react";
import ReactDOM from "react-dom";
import {connect} from "react-redux";
import * as esriLoader from "esri-loader";
import {MapLegend, setInitialLegend, reverseLayerOrder, showLayersNotVisibleForScale} from "../../../src/";
import isWebGLEnabled from 'is-webgl-enabled';
import isMobile from 'is-mobile';

class MapUi extends React.Component {

  initialState = {
    reverseOrder: false,
    showLayers: true
  }
  state = this.initialState;

  createMap = (webMapId) => {

    const {mapId, initLegend} = this.props;
    
    if (webMapId) {

      esriLoader.dojoRequire(
        ["esri/Map", isWebGLEnabled() && !isMobile() ? "esri/views/SceneView" : "esri/views/MapView", "esri/WebMap"],
        (Map, View, WebMap) => {
          const view = new View({
            container: ReactDOM.findDOMNode(this.refs.mapView),
            map: new WebMap({
              portalItem: {
                id: webMapId
              }
            }),
            padding: {right: 280}
          });

          // calling this initialises the legend control
          initLegend(view, mapId);
        }
      );
    }
    else {
      esriLoader.dojoRequire(
          ["esri/Map", isWebGLEnabled() && !isMobile() ? "esri/views/SceneView" : "esri/views/MapView", "esri/layers/MapImageLayer"],
          (Map, View, MapImageLayer) => {

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

            const view = new View({
              container: ReactDOM.findDOMNode(this.refs.mapView),
              map: map,
              padding: {right: 280}
            });

            // calling this initialises the legend control
            initLegend(view, mapId);

            layer3.then(function(lyr) {
              view.goTo(lyr.fullExtent);
            });  
          }
        );
      }      
  }

  getUrlParameter = (name) => {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' '));
  }

  componentDidMount() {  

    const webmapId = this.getUrlParameter('webmap');

    if (!esriLoader.isLoaded()) {
      // lazy load the ArcGIS API
      esriLoader.bootstrap(err => {
        if (err) {
          console.error(err);
          return;
        }

        this.createMap(webmapId);
      }, {
        url: 'https://js.arcgis.com/4.3/'
      });
    } else {
      this.createMap(webmapId);
    }
  }

  render() {
    const {mapId, reverseLayerOrder, showLayersNotVisibleForScale} = this.props;
    const {reverseOrder, showLayers} = this.state;

    return (
      <div style={{width: "100%", height: "100%"}} ref="mapView">
        <MapLegend style={{width: "30%", height: "100%"}} mapId={mapId} /> 
        <div id='options'>
          <label>
            <input 
              type="checkbox" 
              checked={reverseOrder} 
              onClick={() => { reverseLayerOrder(mapId); this.setState({reverseOrder: !reverseOrder}); }} 
            />
            Reverse order
          </label>
          <br />
          <label>
            <input 
              type="checkbox" 
              checked={showLayers} 
              onClick={() => { showLayersNotVisibleForScale(mapId, !showLayers); this.setState({showLayers: !showLayers}); }} 
            />
            Show layers not visible for scale
          </label>          
        </div> 
      </div>   
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    initLegend: (view, mapId) => {
      dispatch(setInitialLegend(view, mapId));
    },
    reverseLayerOrder: (mapId) => {
      dispatch(reverseLayerOrder(mapId));
    },
    showLayersNotVisibleForScale: (mapId, show) => {
      dispatch(showLayersNotVisibleForScale(mapId, show));
    }
  };
};

export default connect(null, mapDispatchToProps)(MapUi);
