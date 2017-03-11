import * as esriLoader from "esri-loader";

export const SET_CURRENT_SCALE = "map-legend/SET_CURRENT_SCALE";
export const TOGGLE_LEGEND_NODE_VISIBLE = "map-legend/TOGGLE_LEGEND_NODE_VISIBLE";
export const RESET_LEGEND_IS_FETCHING = "map-legend/RESET_LEGEND_IS_FETCHING";
export const REQUEST_LEGEND_DATA = "map-legend/REQUEST_LEGEND_DATA";
export const RECEIVE_LEGEND_DATA = "map-legend/RECEIVE_LEGEND_DATA";
export const TOGGLE_LEGEND_NODE_EXPANDED = "map-legend/TOGGLE_LEGEND_NODE_EXPANDED";
export const SET_LEGEND_DOM_DATA = "map-legend/SET_LEGEND_DOM_DATA";
export const TOGGLE_SHOW_SETTINGS = "map-legend/TOGGLE_SHOW_SETTINGS";
export const REVERSE_LAYER_ORDER = "map-legend/REVERSE_LAYER_ORDER";
export const SHOW_LAYERS_NOT_VISIBLE_FOR_SCALE = "map-legend/SHOW_LAYERS_NOT_VISIBLE_FOR_SCALE";
export const INIT_MAP_OPTIONS = 'map-legend/INIT_MAP_OPTIONS';
export const SET_INITIAL_LEGEND_MAPIMAGELAYER_DATA = 'map-legend/SET_INITIAL_LEGEND_MAPIMAGELAYER_DATA';
export const SET_INITIAL_LEGEND_GRAPHICSLAYER_DATA = 'map-legend/SET_INITIAL_LEGEND_GRAPHICSLAYER_DATA';
export const TOGGLE_LEGEND_EXPANDED = 'map-legend/TOGGLE_LEGEND_EXPANDED';

export const toggleExpanded = (mapId, expanded) => {
  return {
    type: TOGGLE_LEGEND_EXPANDED, 
    payload: { mapId, expanded } 
  };
};

export const toggleNodeExpanded = (nodeId, mapId) => {
  return {
    type: TOGGLE_LEGEND_NODE_EXPANDED, 
    payload: { nodeId, mapId } 
  };
};

export const toggleNodeVisible = (nodeId, mapId) => {
  return {
    type: TOGGLE_LEGEND_NODE_VISIBLE, 
    payload: { nodeId, mapId } 
  };
};

export const toggleShowSettings = (mapId) => {
  return {
    type: TOGGLE_SHOW_SETTINGS, 
    payload: { mapId } 
  };
};

export const reverseLayerOrder = (mapId) => {
  return {
    type: REVERSE_LAYER_ORDER, 
    payload: { mapId } 
  };
};

export const showLayersNotVisibleForScale = (mapId, show) => {
  return {
    type: SHOW_LAYERS_NOT_VISIBLE_FOR_SCALE, 
    payload: { mapId, show } 
  };
};

export const fetchLegend = (url, mapId) => {

  return function(dispatch) {

    dispatch({
      type: REQUEST_LEGEND_DATA, 
      payload: { url, mapId } 
    });

    esriLoader.dojoRequire(
      ["esri/request", "esri/config"], 
      (esriRequest, esriConfig) =>
      {
        esriConfig.request.corsDetection = false;

        return esriRequest(url + "/legend", {
          query: {f: "json"},
          responseType: "json"
        })
        .then(
          response => {
            dispatch({
              type: RECEIVE_LEGEND_DATA, 
              payload: { layers: response.data.layers, url, mapId } 
            });
          },
          error => {
            console.error(error);
            dispatch({
              type: RESET_LEGEND_IS_FETCHING
            });
          }
        );
      });
  };
};

const hookLegend = (legend, callback) => {

  var original = legend._buildLegendDOMForLayer;

  legend._buildLegendDOMForLayer = (a, b) => {

    var result = original.call(legend, a, b);
    callback(result, legend);
    return result;
  };
}

const debounce = (func, wait, immediate) => {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

const dispatchScaleChange = debounce(function(dispatch, newScale, mapId) {
	
  dispatch({
    type: SET_CURRENT_SCALE, 
    payload: { scale: newScale, mapId }
  });
}, 250);

const createLayerLegend = (view, mapId, layer, dispatch) => {

  esriLoader.dojoRequire(
    ["esri/widgets/Legend"], 
    (Legend) => {

    hookLegend(new Legend({ view, layerInfos: [{ layer }] }), (legendDOMForLayer, legend) => {
      
      setTimeout(() => {

        if (legendDOMForLayer && legendDOMForLayer.widget) {
          dispatch({
            type: SET_LEGEND_DOM_DATA, 
            payload: { legendWidget: legendDOMForLayer.widget, mapId } 
          });
        }

        if (legend && legend.destroy) {
          legend.destroy();
        }
      }, 250);       
    });
  });    
}

export const setInitialLegend = (view, mapId) => {

  return function(dispatch) {

    view.then(() => {

      dispatch({
        type: INIT_MAP_OPTIONS, 
        payload: { mapId } 
      });

      dispatchScaleChange(dispatch, view.scale, mapId);

      view.watch("scale", (newScale) => {
        dispatchScaleChange(dispatch, newScale, mapId);
      });

      let i = 1;
      
      view.map.layers.forEach((lyr) => {

        lyr.__index = i;
        i++;

        lyr.then(
          loadedLayer => {

            if (loadedLayer.loaded 
              && loadedLayer.type 
              && (['map-image'].indexOf(loadedLayer.type.toLowerCase()) > -1)
              && loadedLayer.allSublayers 
              && loadedLayer.legendEnabled) {

              dispatch({
                type: SET_INITIAL_LEGEND_MAPIMAGELAYER_DATA, 
                payload: { view, mapId, layer: loadedLayer } 
              });
            }

            if (loadedLayer.loaded
              && loadedLayer.type 
              && (['csv', 'feature', 'graphics', 'scene', 'stream'].indexOf(loadedLayer.type.toLowerCase()) > -1)
              && (lyr.url || lyr.source)
              && loadedLayer.legendEnabled) {

              dispatch({
                type: SET_INITIAL_LEGEND_GRAPHICSLAYER_DATA, 
                payload: { view, mapId, layer: loadedLayer } 
              });

              createLayerLegend(view, mapId, loadedLayer, dispatch);
            }
          },
          error => {
            console.error('Failed to load a layer for use with the legend control.', error);
          });
      });
    });
  };
};