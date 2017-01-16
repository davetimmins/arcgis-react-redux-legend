import * as esriLoader from "esri-loader";

export const SET_CURRENT_SCALE = "map-legend/SET_CURRENT_SCALE";
export const setCurrentScale = currentScale => {
  return {type: SET_CURRENT_SCALE, currentScale};
};

export const RESET_LEGEND_IS_FETCHING = "map-legend/RESET_LEGEND_IS_FETCHING";
const resetLegendIsFetching = () => {
  return {type: RESET_LEGEND_IS_FETCHING};
};

export const REQUEST_LEGEND_DATA = "map-legend/REQUEST_LEGEND_DATA";
const requestLegendData = (url, mapId) => {
  return {type: REQUEST_LEGEND_DATA, url, mapId};
};

export const RECEIVE_LEGEND_DATA = "map-legend/RECEIVE_LEGEND_DATA";
const receiveLegendData = (json, url, mapId) => {
  return {type: RECEIVE_LEGEND_DATA, layers: json.layers, url, mapId};
};

export const fetchLegend = (url, mapId) => {
  return function(dispatch) {
    dispatch(requestLegendData(url, mapId));

    esriLoader.dojoRequire(["esri/request", "esri/config"], (
      esriRequest,
      esriConfig
    ) =>
      {
        esriConfig.request.corsDetection = false;

        return esriRequest(url + "/legend", {
          query: {f: "json"},
          responseType: "json"
        }).then(
          response => {
            dispatch(receiveLegendData(response.data, url, mapId));
          },
          error => {
            console.error(error);
            dispatch(resetLegendIsFetching());
          }
        );
      });
  };
};

export const SET_INITIAL_LEGEND_DATA = "map-legend/SET_INITIAL_LEGEND_DATA";
export const setInitialLegend = (view, mapId) => {
  return function(dispatch) {
    esriLoader.dojoRequire(["esri/core/watchUtils"], watchUtils => {
      view.then(function() {
        view.map.layers.forEach(lyr => {
          watchUtils.once(lyr, "loaded", function(value) {
            const allLoaded = view.map.layers.items
              .map(a => a.loaded)
              .reduce((prev, curr) => prev && curr);

            if (allLoaded) {
              dispatch({type: SET_INITIAL_LEGEND_DATA, view, mapId});
            }
          });
        });

        view.watch("scale", function(newScale) {
          dispatch(setCurrentScale(newScale));
        });
      });
    });
  };
};

export const TOGGLE_LEGEND_NODE_EXPANDED = "map-legend/TOGGLE_LEGEND_NODE_EXPANDED";
export const toggleNodeExpanded = (nodeId, mapId) => {
  return {type: TOGGLE_LEGEND_NODE_EXPANDED, nodeId, mapId};
};

export const TOGGLE_LEGEND_NODE_VISIBLE = "map-legend/TOGGLE_LEGEND_NODE_VISIBLE";
export const toggleNodeVisible = (nodeId, mapId) => {
  return {type: TOGGLE_LEGEND_NODE_VISIBLE, nodeId, mapId};
};
