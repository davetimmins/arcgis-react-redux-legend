// components
export const MapLegend = require('./components/map-legend').default;
export const reducer = require('./reducers/map-legend').default;

// constants
export const SET_CURRENT_SCALE = require('./actions/map-legend').SET_CURRENT_SCALE;
export const RESET_LEGEND_IS_FETCHING = require('./actions/map-legend').RESET_LEGEND_IS_FETCHING;
export const REQUEST_LEGEND_DATA = require('./actions/map-legend').REQUEST_LEGEND_DATA;
export const RECEIVE_LEGEND_DATA = require('./actions/map-legend').RECEIVE_LEGEND_DATA;
export const SET_INITIAL_LEGEND_DATA = require('./actions/map-legend').SET_INITIAL_LEGEND_DATA;
export const TOGGLE_LEGEND_NODE_EXPANDED = require('./actions/map-legend').TOGGLE_LEGEND_NODE_EXPANDED;
export const TOGGLE_LEGEND_NODE_VISIBLE = require('./actions/map-legend').TOGGLE_LEGEND_NODE_VISIBLE;

// actions
export const setCurrentScale = require('./actions/map-legend').setCurrentScale;
export const fetchLegend = require('./actions/map-legend').fetchLegend;
export const setInitialLegend = require('./actions/map-legend').setInitialLegend;
export const toggleNodeExpanded = require('./actions/map-legend').toggleNodeExpanded;
export const toggleNodeVisible = require('./actions/map-legend').toggleNodeVisible;

import '../docs/css/legend.css';