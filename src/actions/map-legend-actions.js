import esriRequest from 'esri/request'

export const RESET_LEGEND_IS_FETCHING = 'RESET_LEGEND_IS_FETCHING'
function resetLegendIsFetching() {
    return {
        type: RESET_LEGEND_IS_FETCHING
    }
}

export const REQUEST_LEGEND_DATA = 'REQUEST_LEGEND_DATA'
function requestLegendData(url, mapId) {
    return {
        type: REQUEST_LEGEND_DATA,
        url,
        mapId
    }
}

export const RECEIVE_LEGEND_DATA = 'RECEIVE_LEGEND_DATA'
function receiveLegendData(json, url, mapId) {    
    return {
        type: RECEIVE_LEGEND_DATA,
        layers: json.layers,
        url,
        mapId
    }
}

export function fetchLegend(url, mapId) {
  
    return function (dispatch) {
        return esriRequest(url + '/legend?f=json')
            .then(function(response){
                dispatch(receiveLegendData(response.data, url, mapId))
            }, function(error){ 
                console.error(error)
                dispatch(resetLegendIsFetching()) 
            })        
    }
}

export const SET_INITIAL_LEGEND_DATA = 'SET_INITIAL_LEGEND_DATA'
export function setInitialLegend(view, mapId) {    
    return {
        type: SET_INITIAL_LEGEND_DATA,
        view,
        mapId
    }
}

export const TOGGLE_LEGEND_NODE_EXPANDED = 'TOGGLE_LEGEND_NODE_EXPANDED'
export function toggleNodeExpanded(nodeId, mapId) {
    return {
        type: TOGGLE_LEGEND_NODE_EXPANDED,
        nodeId,
        mapId
    }
}

export const TOGGLE_LEGEND_NODE_VISIBLE = 'TOGGLE_LEGEND_NODE_VISIBLE'
export function toggleNodeVisible(nodeId, mapId) {
    return {
        type: TOGGLE_LEGEND_NODE_VISIBLE,
        nodeId,
        mapId
    }
}