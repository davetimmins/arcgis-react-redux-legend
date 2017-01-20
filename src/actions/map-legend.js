﻿import * as esriLoader from "esri-loader";

export const SET_CURRENT_SCALE = "map-legend/SET_CURRENT_SCALE";
export const TOGGLE_LEGEND_NODE_VISIBLE = "map-legend/TOGGLE_LEGEND_NODE_VISIBLE";
export const RESET_LEGEND_IS_FETCHING = "map-legend/RESET_LEGEND_IS_FETCHING";
export const REQUEST_LEGEND_DATA = "map-legend/REQUEST_LEGEND_DATA";
export const RECEIVE_LEGEND_DATA = "map-legend/RECEIVE_LEGEND_DATA";
export const SET_INITIAL_LEGEND_DATA = "map-legend/SET_INITIAL_LEGEND_DATA";
export const TOGGLE_LEGEND_NODE_EXPANDED = "map-legend/TOGGLE_LEGEND_NODE_EXPANDED";
export const SET_LEGEND_DOM_DATA = "map-legend/SET_LEGEND_DOM_DATA";

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
      callback(result);
      return result;
    };
  }

export const setInitialLegend = (view, mapId) => {

  return function(dispatch) {

    esriLoader.dojoRequire(
      ["esri/core/watchUtils", "esri/widgets/Legend"], 
      (watchUtils, Legend) => {
      
      view.then(() => {

        view.map.layers.forEach((lyr) => {

          watchUtils.once(lyr, "loaded", (value) => {

            const allLoaded = view.map.layers.items
              .map(a => a.loaded || a.loadError)
              .reduce((prev, curr) => prev && curr);

            if (allLoaded) {
              dispatch({
                type: SET_INITIAL_LEGEND_DATA, 
                payload: { view, mapId } 
              });

              const layerInfos = view.map.layers
                .filter(lyr => 
                  lyr.type 
                  && (lyr.type.toLowerCase() === 'feature' || lyr.type.toLowerCase() === 'graphics'))
                .map((lyr, idx) => {
                  
                  return {
                    layer: lyr
                  }
                });

              if (layerInfos && layerInfos.length > 0) { 
                
                let legend = new Legend({
                  view: view,
                  layerInfos
                });

                hookLegend(legend, (legendDOMForLayer) => {
                  
                  setTimeout(() => {

                    dispatch({
                      type: SET_LEGEND_DOM_DATA, 
                      payload: { legendDOMForLayer, mapId } 
                    });
                  }, 1000);                
                });
              }
            }
          });
        });

        view.watch("scale", (newScale) => {
          dispatch({
            type: SET_CURRENT_SCALE, 
            payload: { scale: newScale, mapId }
          });
        });
      });
    });
  };
};