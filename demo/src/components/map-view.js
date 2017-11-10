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

  render() {
    const { mapId, initLegend, options } = this.props;
    const { title } = this.state;
    return (
      <EsriLoaderReact 
        mapContainerClassName='fullSize'
        options={options} 
        modulesToLoad={[
          'esri/Map',
          isWebGLEnabled() && !isMobile() ? 'esri/views/SceneView' : 'esri/views/MapView',
          'esri/WebMap',
          'esri/layers/MapImageLayer',
        ]}    
        onReady={({loadedModules: [Map, View, WebMap, MapImageLayer], containerNode}) => {
          
          const webMapId = this.getUrlParameter('webmap');
          
          if (webMapId) {
            
            const view = new View({
              container: containerNode,
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
          else {
            
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
              container: containerNode,
              map: map,
              padding: { right: 280 }
            });
  
            // calling this initialises the legend control
            initLegend(view, mapId);
  
            layer3.then(function(lyr) {
              view.goTo(lyr.fullExtent);
            });                
          }
        }}
        onError={error => console.error(error)}
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
