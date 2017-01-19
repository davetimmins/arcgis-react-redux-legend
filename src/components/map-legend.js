import React from "react";
import {connect} from "react-redux";
import {
  fetchLegend,
  toggleNodeExpanded,
  toggleNodeVisible
} from "../actions/map-legend";

class MapLegend extends React.Component {
  initialise = () => {
    const {legends, mapId, fetchLegend} = this.props;
    const legend = legends[mapId];

    if (!legend) {
      return;
    }

    legend.items.forEach((lyr) => {

      if (lyr.url && lyr.alreadyLoaded === false) {
        fetchLegend(lyr.url, mapId);
      }
    });
  };

  componentDidMount() {
    this.initialise();
  }

  componentDidUpdate(prevProps, prevState) {
    this.initialise();
  }

  renderSubNodeLegendData = item => {
    const imageStyle = {
      width: item.imageWidth + 8,
      height: item.imageHeight,
      backgroundImage: "url(data:image/png;base64," + item.image + ")",
      backgroundRepeat: "no-repeat",
      display: "inline-block"
    };

    const textStyle = {
      display: "inline-block",
      verticalAlign: "bottom",
      fontWeight: 500
    };

    const marginStyle = {marginLeft: 16};

    return (
      <div key={item.id} style={marginStyle}>
        <div style={imageStyle}></div><label style={textStyle}>
        {item.label}
      </label>
      </div>
    );
  };

  renderSubNodes = item => {
    const {
      mapId,
      scales,
      toggleNodeExpanded,
      toggleNodeVisible
    } = this.props;

    const currentScale = scales[mapId];

    let marginStyle = {marginLeft: 8, marginTop: 8};

    let subLayerLegendData = item.expanded && item.subLayerLegendData
      ? item.subLayerLegendData.map(this.renderSubNodeLegendData)
      : "";

    if (currentScale && item.subLayerScaleRestricted &&
        (item.subLayerMinScale < currentScale || item.subLayerMaxScale > currentScale)) {
      marginStyle.color = "#dcdcdc";
    }

    let subNodeExpander = !item.subLayerLegendData
      ? ""
      : item.expanded
        ? (
          <div onClick={() => toggleNodeExpanded(item.id, mapId)}
            className="click-legend-node">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 32 32" className="svg-icon">
              <path d="M28 9v5L16 26 4 14V9l12 12L28 9z"/>
            </svg>
          </div>
        )
        : (
          <div onClick={() => toggleNodeExpanded(item.id, mapId)}
            className="click-legend-node">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 32 32" className="svg-icon">
              <path d="M7 4h5l12 12-12 12H7l12-12L7 4z"/>
            </svg>
          </div>
        );

    let subNodeCheckbox = item.visible
      ? (
        <div className="inline-block-display">
          <label className='legend-checkbox-label'>	    
            <input type="checkbox" className='legend-checkbox' onChange={() => toggleNodeVisible(item.id, mapId)} checked />
             {item.subLayerName}
          </label> 
        </div>
      )
      : (
        <div className="inline-block-display">
          <label className='legend-checkbox-label'>	    
            <input type="checkbox" className='legend-checkbox' onChange={() => toggleNodeVisible(item.id, mapId)} />
             {item.subLayerName}
          </label> 
        </div>
      );

    return (
      <div key={item.id} style={marginStyle}>
        {subNodeExpander}{subNodeCheckbox}{subLayerLegendData}
      </div>
    );
  };

  renderNodes = item => {
    const {mapId, toggleNodeExpanded, toggleNodeVisible} = this.props;

    const marginStyle = {marginLeft: 4};

    let sublayers = item.expanded && item.legendLayers
      ? item.legendLayers.map(this.renderSubNodes)
      : "";

    let topNodeExpander = !item.legendLayers
      ? ""
      : item.expanded
        ? (
          <div onClick={() => toggleNodeExpanded(item.id, mapId)}
            className="click-legend-node">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 32 32" className="svg-icon">
              <path d="M28 9v5L16 26 4 14V9l12 12L28 9z"/>
            </svg>
          </div>
        )
        : (
          <div onClick={() => toggleNodeExpanded(item.id, mapId)}
            className="click-legend-node">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 32 32" className="svg-icon">
              <path d="M7 4h5l12 12-12 12H7l12-12L7 4z"/>
            </svg>
          </div>
        );

    let nodeCheckbox = item.visible
      ? (
        <div className="inline-block-display">
          <label className='legend-checkbox-label'>	    
            <input type="checkbox" className='legend-checkbox' onChange={() => toggleNodeVisible(item.id, mapId)} checked />
             {item.layerName}
          </label>          
        </div>
      )
      : (
        <div className="inline-block-display">         
          <label className='legend-checkbox-label'>	    
            <input type="checkbox" className='legend-checkbox' onChange={() => toggleNodeVisible(item.id, mapId)} />
             {item.layerName}
          </label> 
        </div>
      );

    return (
      <div key={item.id} style={marginStyle}>
        {topNodeExpander}{nodeCheckbox}{sublayers}
      </div>
    );
  };

  render() {
    const {legends, mapId} = this.props;
    const legend = legends[mapId];

    if (!legend) {
      return null;
    }

    return (
      <div id="legend">
        <div>
          <h5 className="legend-map">{mapId.replace("-", " - ")}</h5>
        </div>
        <div>
          {legend.items.map(this.renderNodes)}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    legends: state.mapLegendConfig.legends,
    scales: state.mapLegendConfig.scales
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchLegend: (url, mapId) => {
      dispatch(fetchLegend(url, mapId));
    },
    toggleNodeExpanded: (id, mapId) => {
      dispatch(toggleNodeExpanded(id, mapId));
    },
    toggleNodeVisible: (id, mapId) => {
      dispatch(toggleNodeVisible(id, mapId));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MapLegend)
