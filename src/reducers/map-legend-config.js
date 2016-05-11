import { RESET_LEGEND_IS_FETCHING, REQUEST_LEGEND_DATA, RECEIVE_LEGEND_DATA, SET_INITIAL_LEGEND_DATA, TOGGLE_LEGEND_NODE_EXPANDED, TOGGLE_LEGEND_NODE_VISIBLE } from 'app/actions/map-legend-actions'

export default function mapLegendConfig (state = {
    isFetching: false,
    legends: {},
    views: {}
}, action) {
    switch (action.type) {
        
        case RESET_LEGEND_IS_FETCHING:
            return Object.assign({}, state, { 
                isFetching: false 
            }) 

        case REQUEST_LEGEND_DATA:
            return Object.assign({}, state, { 
                isFetching: true 
            }) 

        case RECEIVE_LEGEND_DATA:

            let legendsForReceive = Object.assign({}, state.legends)
            let legendForReceive = legendsForReceive[action.mapId]

            const legendItemsForReceive = legendForReceive.items.map(function (leg, idx) {

                if (leg.url === action.url) {

                    leg.legendLayers = action.layers.map(function (lyr) {
            
                        const legendData = lyr.legend.map(function (leg) {
                
                            return {
                                label: leg.label,
                                image: leg.imageData,
                                imageHeight: leg.height,
                                imageWidth: leg.width,
                                id: guid()
                            }
                        })

                        return {
                            subLayerId: lyr.layerId,
                            subLayerName: lyr.layerName,
                            subLayerMinScale: lyr.minScale,
                            subLayerMaxScale: lyr.maxScale,
                            subLayerScaleRestricted: lyr.minScale !== 0 && lyr.maxScale !== 0,
                            subLayerLegendData: legendData,
                            visible: leg.subLayersVisible && leg.subLayersVisible != undefined ? leg.subLayersVisible.indexOf(lyr.layerId) > -1 : true,
                            expanded: true,
                            id: guid()
                        }
                    })
                }
                leg.alreadyLoaded = true
                leg.expanded = true
                return leg
            })
            
            legendForReceive.items = legendItemsForReceive
            legendsForReceive[action.mapId] = legendForReceive

            return Object.assign({}, state, { 
                isFetching: false,
                legends: legendsForReceive
            }) 

        case SET_INITIAL_LEGEND_DATA:

            let viewsForInitialData = Object.assign({}, state.views)
            viewsForInitialData[action.mapId] = action.view

            const layerLegendForInitialData = action.view.map.layers                
                .map(function (initLyr, idx) {    

                    const subLayersVisibleForInitialData = []
                    for (let subInitLayer in initLyr.allSublayers) {
                        let sl = initLyr.allSublayers[subInitLayer]
                        if (sl.visible) {
                            subLayersVisibleForInitialData.push(sl.id)
                        }
                    }
                    
                    return {
                        layerId: idx,
                        layerName: initLyr.title || initLyr.id,
                        minScale: initLyr.minScale,
                        maxScale: initLyr.maxScale,
                        scaleRestricted: initLyr.minScale !== 0 && initLyr.maxScale !== 0,
                        visible: true, // initLyr.visible === null || initLyr.visible == undefined ? true : initLyr.visible,
                        subLayersVisible: subLayersVisibleForInitialData,
                        url: initLyr.url,
                        legendLayers: null,
                        alreadyLoaded: false,
                        expanded: false,
                        id: guid()
                    }
                })
                        
            let legendsForInitialData = Object.assign({}, state.legends)
            legendsForInitialData[action.mapId] = layerLegendForInitialData

            return Object.assign({}, state, { 
                legends: legendsForInitialData,
                views: viewsForInitialData
            }) 

        case TOGGLE_LEGEND_NODE_EXPANDED:

            let legendsForToggleNodeExpanded = Object.assign({}, state.legends)
            let legendForToggleNodeExpanded = legendsForToggleNodeExpanded[action.mapId]

            const legendItemsForToggleNodeExpanded = legendForToggleNodeExpanded.items.map(function (leg, idx) {

                if (leg.id === action.nodeId) {

                    leg.expanded = !leg.expanded
                }
                else if (leg.legendLayers) {

                    const legendLayersForToggleNodeExpanded = leg.legendLayers.map(function (lyr) {
            
                        if (lyr.id === action.nodeId) {

                            lyr.expanded = !lyr.expanded
                        }
                        return lyr
                    })

                    leg.legendLayers = legendLayersForToggleNodeExpanded                    
                }
                return leg
            })
            
            legendForToggleNodeExpanded.items = legendItemsForToggleNodeExpanded
            legendsForToggleNodeExpanded[action.mapId] = legendForToggleNodeExpanded

            return Object.assign({}, state, { 
                legends: legendsForToggleNodeExpanded
            }) 

        case TOGGLE_LEGEND_NODE_VISIBLE:

            let legendsForToggleNodeVisible = Object.assign({}, state.legends)
            let legendForToggleNodeVisible = legendsForToggleNodeVisible[action.mapId]

            const legendItemsForToggleNodeVisible = legendForToggleNodeVisible.items.map(function (leg, idx) {

                if (leg.id === action.nodeId) {

                    leg.visible = !leg.visible
                }
                else if (leg.legendLayers) {

                    const legendLayersForToggleNodeVisible = leg.legendLayers.map(function (lyr) {
            
                        if (lyr.id === action.nodeId) {

                            lyr.visible = !lyr.visible
                        }
                        return lyr
                    })

                    const subLayersVisibleForToggleNodeVisible = []
                    for (let sl in leg.legendLayers) {

                        if (leg.legendLayers[sl].visible) {
                            subLayersVisibleForToggleNodeVisible.push(leg.legendLayers[sl].subLayerId)
                        }
                    }

                    leg.subLayersVisible = subLayersVisibleForToggleNodeVisible
                    leg.legendLayers = legendLayersForToggleNodeVisible                    
                }
                return leg
            })
            
            legendForToggleNodeVisible.items = legendItemsForToggleNodeVisible
            legendsForToggleNodeVisible[action.mapId] = legendForToggleNodeVisible

            updateLayers(state.views[action.mapId], legendForToggleNodeVisible)
            
            return Object.assign({}, state, { 
                legends: legendsForToggleNodeVisible
            }) 

        default:
            return state
    }
}

function guid() {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4()
}

function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1)
}

function updateLayers(view, legend) {

    for (let lyr in legend.items) {
    
        const legendLyr = legend.items[lyr]

        if (legendLyr.alreadyLoaded === true) {

            const layerFind = view.map.layers.filter(function(lyr) {
                return lyr.title === legendLyr.layerName || lyr.id === legendLyr.layerName
            })

            if (layerFind && layerFind.items && layerFind.items.length !== 1) return null

            const matchedLayer = layerFind.items[0]

            if (legendLyr.visible && legendLyr.subLayersVisible && legendLyr.subLayersVisible != undefined && matchedLayer.sublayers && matchedLayer.sublayers != undefined) {

                if (matchedLayer.sublayers && matchedLayer.sublayers != undefined) {
                    matchedLayer.sublayers = matchedLayer.sublayers.map(function (subLyr) {

                        const subLayerFind = legendLyr.subLayersVisible.filter(function(subId) {
                            return subLyr.id === subId
                        })

                        subLyr.visible = (subLayerFind && subLayerFind.length === 1)
                        return subLyr
                    })
                }
            }

            if (matchedLayer.visible !== legendLyr.visible) {
                    
                matchedLayer.visible = legendLyr.visible
            }
        }
    }
}

