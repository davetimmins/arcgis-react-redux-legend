// components
export const MapLegend = require('./components/map-legend').default;

// reducers
export const reducer = require('./reducers/map-legend').default;

// actions
export const setInitialLegend = require('./actions/map-legend').setInitialLegend;
export const reverseLayerOrder = require('./actions/map-legend').reverseLayerOrder;
export const showLayersNotVisibleForScale = require('./actions/map-legend').showLayersNotVisibleForScale;
export const toggleExpanded = require('./actions/map-legend').toggleExpanded;
export const toggleNodeExpanded = require('./actions/map-legend').toggleNodeExpanded;
export const toggleNodeVisible = require('./actions/map-legend').toggleNodeVisible;
export const toggleShowSettings = require('./actions/map-legend').toggleShowSettings;