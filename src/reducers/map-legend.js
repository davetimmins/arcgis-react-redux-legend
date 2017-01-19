import {
  SET_CURRENT_SCALE,
  RESET_LEGEND_IS_FETCHING,
  REQUEST_LEGEND_DATA,
  RECEIVE_LEGEND_DATA,
  SET_INITIAL_LEGEND_DATA,
  TOGGLE_LEGEND_NODE_EXPANDED,
  TOGGLE_LEGEND_NODE_VISIBLE
} from "../actions/map-legend";

const s4 = () => {
  return Math.floor((1 + Math.random()) * 65536).toString(16).substring(1);
};

const guid = () => {
  return s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4();
};

const updateLayers = (view, legend) => {

  legend.items.forEach((legendLyr) => {
  
    if (legendLyr.alreadyLoaded === true) {
      const layerFind = view.map.layers.filter((lyr) => {
        return lyr.title === legendLyr.layerName ||
          lyr.id === legendLyr.layerName;
      });

      if (layerFind && layerFind.items && layerFind.items.length !== 1) {
        return null;
      }

      const matchedLayer = layerFind.items[0];

      if (legendLyr.visible && legendLyr.subLayersVisible && matchedLayer.sublayers) {
        if (matchedLayer.sublayers) {
          matchedLayer.sublayers = matchedLayer.sublayers.map((subLyr) => {
            const subLayerFind = legendLyr.subLayersVisible.filter((subId) => {
              return subLyr.id === subId;
            });

            subLyr.visible = subLayerFind && subLayerFind.length === 1;
            return subLyr;
          });
        }
      }

      if (matchedLayer.visible !== legendLyr.visible) {
        matchedLayer.visible = legendLyr.visible;
      }
    }    
  });
};

const initialState = {
  isFetching: false,
  legends: {},
  views: {},
  scales: {}
};

const createReducer = (initialState, reducerMap) => {
  return (state = initialState, action) => {
    const reducer = reducerMap[action.type];

    return reducer
      ? reducer(state, action.payload)
      : state;
  };
}

export default createReducer(initialState, {

  [SET_CURRENT_SCALE]: (state, payload) => {

    let scales = Object.assign({}, state.scales);
    scales[payload.mapId] = payload.scale;

    return Object.assign({}, state, {'scales': scales});
  },

  [RESET_LEGEND_IS_FETCHING]: (state, payload) => {

    return Object.assign({}, state, {'isFetching': false});
  },

  [REQUEST_LEGEND_DATA]: (state, payload) => {

    return Object.assign({}, state, {'isFetching': true});
  },

  [RECEIVE_LEGEND_DATA]: (state, payload) => {
  
    let legends = Object.assign({}, state.legends);
    let legend = legends[payload.mapId];

    const legendItems = legend.items.map((leg, idx) => {
      if (leg.url === payload.url) {
        leg.legendLayers = payload.layers.map((lyr) => {
          const legendData = lyr.legend.map((subnode) => {
            return {
              label: subnode.label,
              image: subnode.imageData,
              imageHeight: subnode.height,
              imageWidth: subnode.width,
              id: guid()
            };
          });

          return {
            subLayerId: lyr.layerId,
            subLayerName: lyr.layerName,
            subLayerMinScale: lyr.minScale,
            subLayerMaxScale: lyr.maxScale,
            subLayerScaleRestricted: lyr.minScale !== 0 || lyr.maxScale !== 0,
            subLayerLegendData: legendData,
            visible: leg.subLayersVisible
              ? leg.subLayersVisible.indexOf(lyr.layerId) > -1
              : true,
            expanded: true,
            id: guid()
          };
        });
      }

      leg.alreadyLoaded = true;
      leg.expanded = true;
      return leg;
    });

    legend.items = legendItems;
    legends[payload.mapId] = legend;

    return Object.assign({}, state, {
      'isFetching': false,
      'legends': legends
    });
  },

  [SET_INITIAL_LEGEND_DATA]: (state, payload) => {

    let views = Object.assign({}, state.views);
    views[payload.mapId] = payload.view;

    const legend = payload.view.map.layers
      .filter(lyr => lyr.allSublayers)
      .map((initLyr, idx) => {
        
        let subLayersVisible = [];

        initLyr.allSublayers.items.forEach((sl) => {

          if (sl.visible) {
            subLayersVisible.push(sl.id);
          }
        });

        return {
          layerId: idx,
          layerName: initLyr.title || initLyr.id,
          minScale: initLyr.minScale,
          maxScale: initLyr.maxScale,
          scaleRestricted: initLyr.minScale !== 0 && initLyr.maxScale !== 0,
          visible: true,
          // initLyr.visible === null || initLyr.visible == undefined ? true : initLyr.visible,
          subLayersVisible: subLayersVisible,
          url: initLyr.url,
          legendLayers: null,
          alreadyLoaded: false,
          expanded: false,
          id: guid()
        };
      });

    let legends = Object.assign({}, state.legends);
    legends[payload.mapId] = legend;

    return Object.assign({}, state, {
      'legends': legends,
      'views': views
    });
  },

  [TOGGLE_LEGEND_NODE_EXPANDED]: (state, payload) => {

    let legends = Object.assign({}, state.legends);
    let legend = legends[payload.mapId];

    const legendItems = legend.items.map((leg, idx) => {

        if (leg.id === payload.nodeId) {
          leg.expanded = !leg.expanded;
        } 
        else if (leg.legendLayers) {
          const legendLayers = leg.legendLayers.map((lyr) => {
              if (lyr.id === payload.nodeId) {
                lyr.expanded = !lyr.expanded;
              }
              return lyr;
            }
          );

          leg.legendLayers = legendLayers;
        }
        return leg;
      }
    );

    legend.items = legendItems;
    legends[payload.mapId] = legend;

    return Object.assign({}, state, {'legends': legends});
  },
      
  [TOGGLE_LEGEND_NODE_VISIBLE]: (state, payload) => {

    let legends = Object.assign({}, state.legends);
    let legend = legends[payload.mapId];

    const legendItems = legend.items.map((leg, idx) => {
        if (leg.id === payload.nodeId) {
          leg.visible = !leg.visible;
        } 
        else if (leg.legendLayers) {
          const legendLayers = leg.legendLayers.map((lyr) => {
              if (lyr.id === payload.nodeId) {
                lyr.visible = !lyr.visible;
              }

              return lyr;
            }
          );

          let subLayersVisible = [];

          leg.legendLayers.forEach((layer) => {

            if (layer.visible) {
              subLayersVisible.push(layer.subLayerId);
            }
          });

          leg.subLayersVisible = subLayersVisible;
          leg.legendLayers = legendLayers;
        }

        return leg;
      }
    );

    legend.items = legendItems;
    legends[payload.mapId] = legend;

    updateLayers(state.views[payload.mapId], legend);

    return Object.assign({}, state, {'legends': legends});
  }
});
