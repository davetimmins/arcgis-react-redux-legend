import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { dojoRequire } from 'esri-loader';
import { MapLegend, setInitialLegend } from '../../../src/';
import isWebGLEnabled from 'is-webgl-enabled';
import isMobile from 'is-mobile';

const styles = {
  fullSize: {
    width: '100%',
    height: '100%'
  },
  thirtyPercent: {
    width: '30%',
    height: '100%'
  }
};

class MapUi extends React.PureComponent {
  initialState = {
    title: null
  };
  state = this.initialState;

  createMap = webMapId => {
    const { mapId, initLegend } = this.props;

    if (webMapId) {
      dojoRequire(
        [
          'esri/Map',
          isWebGLEnabled() && !isMobile() ? 'esri/views/SceneView' : 'esri/views/MapView',
          'esri/WebMap'
        ],
        (Map, View, WebMap) => {
          const view = new View({
            container: ReactDOM.findDOMNode(this.mapContainer),
            map: new WebMap({
              portalItem: {
                id: webMapId
              }
            }),
            padding: { right: 280 }
          });

          view.map.portalItem.then(() => {
            this.setState({ title: view.map.portalItem.title });
          });

          // calling this initialises the legend control
          initLegend(view, mapId);
        }
      );
    } else {
      dojoRequire(
        [
          'esri/Map',
          isWebGLEnabled() && !isMobile() ? 'esri/views/SceneView' : 'esri/views/MapView',
          'esri/layers/MapImageLayer'
        ],
        (Map, View, MapImageLayer) => {
          const layer1 = new MapImageLayer({
            url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/RedlandsEmergencyVehicles/MapServer'
          });

          const layer2 = new MapImageLayer({
            url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer',
            visible: false
          });

          const layer3 = new MapImageLayer({
            url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/Hurricanes/MapServer/'
          });

          const map = new Map({
            basemap: 'topo',
            layers: [layer1, layer2, layer3]
          });

          const view = new View({
            container: ReactDOM.findDOMNode(this.mapContainer),
            map: map,
            padding: { right: 280 }
          });

          // calling this initialises the legend control
          initLegend(view, mapId);

          layer3.then(function(lyr) {
            view.goTo(lyr.fullExtent);
          });
        }
      );
    }
  };

  getUrlParameter = name => {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' '));
  };

  componentDidMount() {
    const webmapId = this.getUrlParameter('webmap');

    this.createMap(webmapId);
  }

  render() {
    const { mapId } = this.props;
    const { title } = this.state;
    return (
      <div style={styles.fullSize} ref={node => (this.mapContainer = node)}>
        <MapLegend style={styles.thirtyPercent} mapId={mapId} title={title} />
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    initLegend: (view, mapId) => {
      dispatch(setInitialLegend(view, mapId));
    }
  };
};

export default connect(null, mapDispatchToProps)(MapUi);
