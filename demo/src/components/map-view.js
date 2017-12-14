import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import EsriLoaderReact from 'esri-loader-react';
import { MapLegend, setInitialLegend } from '../../../src/';
import isWebGLEnabled from 'is-webgl-enabled';
import isMobile from 'is-mobile';

class MapUi extends React.PureComponent {
  initialState = {
    title: null
  };
  state = this.initialState;

  getUrlParameter = name => {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' '));
  };

  loadMap = ({loadedModules: [Map, View, MapImageLayer, FeatureLayer], containerNode}) => {

    const { mapId, initLegend } = this.props;
    
    const layer1 = new MapImageLayer({
      url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/RedlandsEmergencyVehicles/MapServer'
    });

    const layer2 = new MapImageLayer({
      url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer',
      visible: false
    });

    const layer3 = new MapImageLayer({
      url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/Hurricanes/MapServer'
    });

    const layer4 = new FeatureLayer({
      url: 'https://services2.arcgis.com/j80Jz20at6Bi0thr/arcgis/rest/services/HawaiiLavaFlowHazardZones/FeatureServer/0'
    });

    const view = new View({
      container: containerNode,
      map: new Map({
        basemap: 'topo',
        layers: [layer1, layer2, layer3, layer4]
      }),
      padding: { right: 280 }
    });

    // calling this initialises the legend control
    initLegend(view, mapId);

    layer3.when(function(lyr) {
      view.goTo(lyr.fullExtent);
    });  
  }

  loadWebmap = ({loadedModules: [Map, MapView, WebMap], containerNode}) => {

    const { mapId, initLegend } = this.props;

    const view = new MapView({
      container: containerNode,
      map: new WebMap({
        portalItem: {
          id: this.getUrlParameter('webmap')
        }
      }),
      padding: { right: 280 }
    });

    view.map.portalItem.when((portalItem) => {
      this.setState({ title: portalItem.title });
    });

    // calling this initialises the legend control
    initLegend(view, mapId); 
  }

  render() {
    const { mapId, options } = this.props;
    const { title } = this.state;
    
    const webMapId = this.getUrlParameter('webmap');

    const modules = webMapId
      ? [
          'esri/Map',
          'esri/views/MapView',
          'esri/WebMap',
        ]
      : [
          'esri/Map',
          isWebGLEnabled() && !isMobile() ? 'esri/views/SceneView' : 'esri/views/MapView',          
          'esri/layers/MapImageLayer',
          'esri/layers/FeatureLayer',
        ];

    return (
      <EsriLoaderReact 
        mapContainerClassName='fullSize'
        options={options} 
        modulesToLoad={modules}    
        onReady={webMapId ? this.loadWebmap : this.loadMap}
      >
        <MapLegend className='thirtyPercent' mapId={mapId} title={title} />
      </EsriLoaderReact>
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
