// components
export const MapLegend = require('./components/map-legend').default;

// reducers
export const reducer = require('./reducers/map-legend').default;

// actions
export const setInitialLegend = require('./actions/map-legend').setInitialLegend;
export const reverseLayerOrder = require('./actions/map-legend').reverseLayerOrder;
export const showLayersNotVisibleForScale = require('./actions/map-legend').showLayersNotVisibleForScale;