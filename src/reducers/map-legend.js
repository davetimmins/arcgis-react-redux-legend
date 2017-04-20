import {
  SET_CURRENT_SCALE,
  TOGGLE_SHOW_SETTINGS,
  REVERSE_LAYER_ORDER,
  SHOW_LAYERS_NOT_VISIBLE_FOR_SCALE,
  RESET_LEGEND_IS_FETCHING,
  REQUEST_LEGEND_DATA,
  RECEIVE_LEGEND_DATA,
  TOGGLE_LEGEND_NODE_EXPANDED,
  TOGGLE_LEGEND_NODE_VISIBLE,
  SET_LEGEND_DOM_DATA,
  SET_INITIAL_LEGEND_MAPIMAGELAYER_DATA,
  SET_INITIAL_LEGEND_GRAPHICSLAYER_DATA,
  INIT_MAP_OPTIONS,
  TOGGLE_LEGEND_EXPANDED
} from '../actions/map-legend';

const s4 = () => {
  return Math.floor((1 + Math.random()) * 65536).toString(16).substring(1);
};

const guid = () => {
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
};

const sortLayers = (a, b) => {
  return a.mapIndex - b.mapIndex;
};

const sortLayersBackwards = (a, b) => {
  return b.mapIndex - a.mapIndex;
};

const updateLayers = (view, legend) => {
  legend.forEach(legendLyr => {
    if (legendLyr.alreadyLoaded === true) {
      const matchedLayer = view.map.layers.find(lyr => lyr.uid === legendLyr.uid);

      if (!matchedLayer) {
        return null;
      }

      if (legendLyr.visible && legendLyr.subLayersVisible && matchedLayer.sublayers) {
        matchedLayer.sublayers = matchedLayer.sublayers.map(subLyr => {
          const subLayerFind = legendLyr.subLayersVisible.filter(subId => {
            return subLyr.id === subId;
          });

          subLyr.visible = subLayerFind && subLayerFind.length === 1;
          return subLyr;
        });
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
  scales: {},
  options: {}
};

const createReducer = (initialState, reducerMap) => {
  return (state = initialState, action) => {
    const reducer = reducerMap[action.type];

    return reducer ? reducer(state, action.payload) : state;
  };
};

export default createReducer(initialState, {
  [SET_CURRENT_SCALE]: (state, payload) => {
    let scales = Object.assign({}, state.scales);
    scales[payload.mapId] = payload.scale;

    return Object.assign({}, state, { scales: scales });
  },

  [RESET_LEGEND_IS_FETCHING]: (state, payload) => {
    return Object.assign({}, state, { isFetching: false });
  },

  [TOGGLE_SHOW_SETTINGS]: (state, payload) => {
    let options = Object.assign({}, state.options);
    options[payload.mapId].showOptions = !options[payload.mapId].showOptions;

    return Object.assign({}, state, { options: options });
  },

  [REVERSE_LAYER_ORDER]: (state, payload) => {
    let legends = Object.assign({}, state.legends);
    let legend = legends[payload.mapId];

    let options = Object.assign({}, state.options);
    options[payload.mapId].reverseLayerOrder = !options[payload.mapId].reverseLayerOrder;

    legends[payload.mapId] = legend.sort(
      options[payload.mapId].reverseLayerOrder ? sortLayersBackwards : sortLayers
    );

    return Object.assign({}, state, {
      legends: legends,
      options: options
    });
  },

  [SHOW_LAYERS_NOT_VISIBLE_FOR_SCALE]: (state, payload) => {
    let options = Object.assign({}, state.options);
    options[payload.mapId].showLayersNotVisibleForScale = payload.show;

    return Object.assign({}, state, { options: options });
  },

  [REQUEST_LEGEND_DATA]: (state, payload) => {
    let legends = Object.assign({}, state.legends);
    let legend = legends[payload.mapId];

    const legendItems = legend.map((leg, idx) => {
      if (leg.url === payload.url) {
        leg.isFetching = true;
      }

      return leg;
    });

    legends[payload.mapId] = legendItems;

    return Object.assign({}, state, {
      isFetching: true,
      legends: legends
    });
  },

  [RECEIVE_LEGEND_DATA]: (state, payload) => {
    let legends = Object.assign({}, state.legends);
    let legend = legends[payload.mapId];

    const legendItems = legend.map((leg, idx) => {
      if (leg.url === payload.url) {
        leg.legendLayers = payload.layers.map(lyr => {
          const legendData = lyr.legend.map(subnode => {
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
            visible: leg.subLayersVisible ? leg.subLayersVisible.indexOf(lyr.layerId) > -1 : true,
            expanded: true,
            id: guid()
          };
        });

        leg.alreadyLoaded = true;
        leg.expanded = true;
      }

      return leg;
    });

    legends[payload.mapId] = legendItems;

    return Object.assign({}, state, {
      isFetching: false,
      legends: legends
    });
  },

  [INIT_MAP_OPTIONS]: (state, payload) => {
    let options = Object.assign({}, state.options);
    options[payload.mapId] = {
      reverseLayerOrder: false,
      showLayersNotVisibleForScale: true,
      showOptions: false
    };

    return Object.assign({}, state, { options: options });
  },

  [SET_INITIAL_LEGEND_MAPIMAGELAYER_DATA]: (state, payload) => {
    let views = Object.assign({}, state.views);
    views[payload.mapId] = payload.view;

    let initLyr = payload.layer;
    let subLayersVisible = [];

    initLyr.allSublayers.items.forEach(sl => {
      if (sl.visible) {
        subLayersVisible.push(sl.id);
      }
    });

    let layer = [
      {
        layerId: initLyr.id,
        layerName: initLyr.title || initLyr.id,
        minScale: initLyr.minScale,
        maxScale: initLyr.maxScale,
        scaleRestricted: initLyr.minScale !== 0 || initLyr.maxScale !== 0,
        visible: initLyr.visible,
        subLayersVisible: subLayersVisible,
        url: initLyr.url.replace(/\/+$/, ''),
        legendLayers: null,
        hasDomNode: false,
        alreadyLoaded: false,
        isFetching: false,
        expanded: false,
        id: guid(),
        uid: initLyr.uid,
        mapIndex: initLyr.__index,
        reverseLayerOrder: false,
        showLayersNotVisibleForScale: true
      }
    ];

    let legends = Object.assign({}, state.legends);
    legends[payload.mapId] = legends[payload.mapId] && legends[payload.mapId].length
      ? legends[payload.mapId].concat(layer)
      : layer;

    legends[payload.mapId].sort(sortLayers);

    return Object.assign({}, state, {
      legends: legends,
      views: views
    });
  },

  [SET_INITIAL_LEGEND_GRAPHICSLAYER_DATA]: (state, payload) => {
    let views = Object.assign({}, state.views);
    views[payload.mapId] = payload.view;

    let initLyr = payload.layer;

    let layer = [
      {
        layerId: initLyr.id,
        layerName: initLyr.title || initLyr.id,
        minScale: initLyr.minScale,
        maxScale: initLyr.maxScale,
        scaleRestricted: initLyr.minScale !== 0 || initLyr.maxScale !== 0,
        visible: initLyr.visible,
        legendLayers: null,
        hasDomNode: false,
        alreadyLoaded: false,
        isFetching: false,
        expanded: false,
        id: guid(),
        uid: initLyr.uid,
        mapIndex: initLyr.__index,
        reverseLayerOrder: false,
        showLayersNotVisibleForScale: true
      }
    ];

    let legends = Object.assign({}, state.legends);
    legends[payload.mapId] = legends[payload.mapId] && legends[payload.mapId].length
      ? legends[payload.mapId].concat(layer)
      : layer;

    legends[payload.mapId].sort(sortLayers);

    return Object.assign({}, state, {
      legends: legends,
      views: views
    });
  },

  [SET_LEGEND_DOM_DATA]: (state, payload) => {
    let legends = Object.assign({}, state.legends);

    legends[payload.mapId] = legends[payload.mapId].map((leg, idx) => {
      if (
        payload.legendWidget &&
        payload.legendWidget.children &&
        payload.legendWidget.children.length > 0
      ) {
        let legendDOMForLayer = null;
        for (let i = 0; i < payload.legendWidget.children.length; i++) {
          let child = payload.legendWidget.children[i];
          if (child.id.split('_').pop() === leg.uid) {
            legendDOMForLayer = child;
            break;
          }
        }

        if (
          leg.hasDomNode === false &&
          legendDOMForLayer &&
          legendDOMForLayer.children &&
          legendDOMForLayer.children.length > 1
        ) {
          leg.alreadyLoaded = true;
          leg.hasDomNode = true;
          leg.domNode = legendDOMForLayer.children[1].outerHTML;
          leg.expanded = true;
        }
      }

      return leg;
    });

    return Object.assign({}, state, {
      legends: legends
    });
  },

  [TOGGLE_LEGEND_NODE_EXPANDED]: (state, payload) => {
    let legends = Object.assign({}, state.legends);
    let legend = legends[payload.mapId];

    const legendItems = legend.map((leg, idx) => {
      if (leg.id === payload.nodeId) {
        leg.expanded = !leg.expanded;
      } else if (leg.legendLayers) {
        const legendLayers = leg.legendLayers.map(lyr => {
          if (lyr.id === payload.nodeId) {
            lyr.expanded = !lyr.expanded;
          }
          return lyr;
        });

        leg.legendLayers = legendLayers;
      }
      return leg;
    });

    legends[payload.mapId] = legendItems;

    return Object.assign({}, state, { legends: legends });
  },

  [TOGGLE_LEGEND_NODE_VISIBLE]: (state, payload) => {
    let legends = Object.assign({}, state.legends);
    let legend = legends[payload.mapId];

    const legendItems = legend.map((leg, idx) => {
      if (leg.id === payload.nodeId) {
        leg.visible = !leg.visible;
      } else if (leg.legendLayers) {
        const legendLayers = leg.legendLayers.map(lyr => {
          if (lyr.id === payload.nodeId) {
            lyr.visible = !lyr.visible;
          }

          return lyr;
        });

        let subLayersVisible = [];

        leg.legendLayers.forEach(layer => {
          if (layer.visible) {
            subLayersVisible.push(layer.subLayerId);
          }
        });

        leg.subLayersVisible = subLayersVisible;
        leg.legendLayers = legendLayers;
      }

      return leg;
    });

    legends[payload.mapId] = legendItems;

    updateLayers(state.views[payload.mapId], legend);

    return Object.assign({}, state, { legends: legends });
  },

  [TOGGLE_LEGEND_EXPANDED]: (state, payload) => {
    let legends = Object.assign({}, state.legends);
    let legend = legends[payload.mapId];

    const legendItems = legend.map((leg, idx) => {
      leg.expanded = payload.expanded;

      if (leg.legendLayers) {
        const legendLayers = leg.legendLayers.map(lyr => {
          lyr.expanded = payload.expanded;
          return lyr;
        });

        leg.legendLayers = legendLayers;
      }
      return leg;
    });

    legends[payload.mapId] = legendItems;

    return Object.assign({}, state, { legends: legends });
  }
});
