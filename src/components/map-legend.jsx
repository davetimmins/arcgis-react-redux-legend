import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetchLegend, toggleNodeExpanded, toggleNodeVisible } from 'app/actions/map-legend-actions'

import { Checkbox } from 'react-bootstrap'

const mapStateToProps = (state) => {
    return {
        legends: state.mapLegendConfig.legends,
        currentScale: state.mapLegendConfig.currentScale
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchLegend: (url, mapId) => {
            dispatch(fetchLegend(url, mapId))
        },
        toggleNodeExpanded: (id, mapId) => {
            dispatch(toggleNodeExpanded(id, mapId))
        },
        toggleNodeVisible: (id, mapId) => {
            dispatch(toggleNodeVisible(id, mapId))
        }
    }
}

class MapLegend extends Component {

    componentDidMount() {

        const { legends, mapId, fetchLegend } = this.props
        const legend = legends[mapId]

        if (legend === null || legend == undefined) return

        for (let lyr in legend.items) {

            const url = legend.items[lyr].url

            if (url && url != undefined && legend.items[lyr].alreadyLoaded === false) {
                fetchLegend(url, mapId)
            }
        }
    }

    componentDidUpdate(prevProps, prevState) {

        const { legends, mapId, fetchLegend, view } = this.props
        const legend = legends[mapId]

        if (legend === null || legend == undefined) return

        for (let lyr in legend.items) {

            const url = legend.items[lyr].url

            if (url && url != undefined && legend.items[lyr].alreadyLoaded === false) {
                fetchLegend(url, mapId)
            }
        }
    }

    render() {

        const { legends, mapId, currentScale, toggleNodeExpanded, toggleNodeVisible } = this.props
        const legend = legends[mapId]

        let nodes = []
        if (legend !== null && legend !== undefined) {
            nodes = legend.items
        }

        const renderSubNodeLegendData = function(item) {

            const imageStyle = {
                width: item.imageWidth + 8,
                height: item.imageHeight,
                backgroundImage: 'url(data:image/png;base64,' + item.image + ')',
                backgroundRepeat: 'no-repeat',
                display: 'inline-block'
            }

            const textStyle = {
                display: 'inline-block',
                verticalAlign: 'bottom',
                fontWeight: 500
            }

            const marginStyle = { marginLeft: 16 }

            return <div key={item.id} style={marginStyle}><div style={imageStyle}></div><label style={textStyle}>{item.label}</label></div>
        }

        const renderSubNodes = function(item) {

            let marginStyle = { marginLeft: 8, marginTop: 8 }

            let subLayerLegendData = item.expanded === true && item.subLayerLegendData !== null && item.subLayerLegendData !== undefined ? item.subLayerLegendData.map(renderSubNodeLegendData) : ''

            if (item.subLayerScaleRestricted === true && item.subLayerMinScale < currentScale || item.subLayerMaxScale > currentScale) {
                marginStyle.color = '#dcdcdc'
            }

            let subNodeExpander = item.subLayerLegendData === null || item.subLayerLegendData == undefined ? '' : item.expanded ? <i onClick={() => toggleNodeExpanded(item.id, mapId)} className="fa fa-caret-down click-legend-node"></i> : <i onClick={() => toggleNodeExpanded(item.id, mapId)} className="fa fa-caret-right click-legend-node"></i>

            let subNodeCheckbox = item.visible ? <div className='inline-block-display bottom-margin'><Checkbox onChange={() => toggleNodeVisible(item.id, mapId)} checked>{item.subLayerName}</Checkbox></div> : <div className='inline-block-display bottom-margin'><Checkbox onChange={() => toggleNodeVisible(item.id, mapId)}>{item.subLayerName}</Checkbox></div>

            return <div key={item.id} style={marginStyle}>{subNodeExpander}{subNodeCheckbox}{subLayerLegendData}</div>
        }

        const renderNodes = function(item) {

            const marginStyle = { marginLeft: 4 }

            let sublayers = item.expanded === true && item.legendLayers !== null && item.legendLayers !== undefined ? item.legendLayers.map(renderSubNodes) : ''

            let topNodeExpander = item.legendLayers === null || item.legendLayers == undefined ? '' : item.expanded ? <i onClick={() => toggleNodeExpanded(item.id, mapId)} className="fa fa-caret-down click-legend-node"></i> : <i onClick={() => toggleNodeExpanded(item.id, mapId)} className="fa fa-caret-right click-legend-node"></i>

            let nodeCheckbox = item.visible ? <div className='inline-block-display bottom-margin'><Checkbox onChange={() => toggleNodeVisible(item.id, mapId)} checked>{item.layerName}</Checkbox></div> : <div className='inline-block-display bottom-margin'><Checkbox onChange={() => toggleNodeVisible(item.id, mapId)}>{item.layerName}</Checkbox></div>

            return <div key={item.id} style={marginStyle}>{topNodeExpander}{nodeCheckbox}{sublayers}</div>
        }

        return (
            <div id='legend'>
                <div>
                    <h5 className='legend-map'>{mapId.replace('-', ' - ')}</h5>
                </div>
                <div>
                    {nodes.map(renderNodes)}
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MapLegend)