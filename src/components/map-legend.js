import React from "react";
import {connect} from "react-redux";
import {
  fetchLegend,
  toggleNodeExpanded,
  toggleNodeVisible
} from "../actions/map-legend";

const styles = {  
  clickLegendNode: {
      cursor: 'pointer',
      marginRight: 6,
      display: 'inline-block'
  },
  inlineBlockDisplay: {
      display: 'inline-block',
      marginTop: 8,
      marginBottom: 0
  },
  legendMap: {
      paddingTop: 10,
      paddingRight: 6,
      paddingBottom: 10,
      paddingLeft: 6,
      backgroundColor: '#ebebeb',
      fontWeight: 'bold'
  },
  legendCheckbox: {
      cursor: 'pointer',
      marginRight: 8
  },
  legendCheckboxLabel: {
      fontWeight: 400,
      cursor: 'pointer'
  },
  textStyle: {
    display: "inline-block",
    verticalAlign: "bottom",
    fontWeight: 500
  }
}

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
      display: 'inline-block'
    };

    const marginStyle = {marginLeft: 16, marginTop: 6};

    return (
      <div key={item.id} style={marginStyle}>
        <div style={imageStyle} />
        <label style={styles.textStyle}>{item.label}</label>
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

    let marginStyle = {marginLeft: 8};

    let subLayerLegendData = item.expanded && item.subLayerLegendData
      ? item.subLayerLegendData.map(this.renderSubNodeLegendData)
      : "";

    if (currentScale && item.subLayerScaleRestricted &&
      (item.subLayerMinScale !== 0 && (item.subLayerMinScale < currentScale) 
      || item.subLayerMaxScale !== 0 && (item.subLayerMaxScale > currentScale))) {
      marginStyle.color = "#dcdcdc";
    }

    let subNodeExpander = !item.subLayerLegendData
      ? ""
      : <div onClick={() => toggleNodeExpanded(item.id, mapId)} style={styles.clickLegendNode}>          
          {item.expanded
            ? <span className='esri-icon-down' />
            : <span className='esri-icon-right' />}          
        </div>;

    let subNodeCheckbox = 
      <div style={styles.inlineBlockDisplay}>        
        <div style={styles.inlineBlockDisplay}>
          <span style={styles.legendCheckbox} onClick={() => toggleNodeVisible(item.id, mapId)} className={item.visible ? 'esri-icon-visible' : 'esri-icon-non-visible'} />
          <label style={styles.legendCheckboxLabel} onClick={() => toggleNodeVisible(item.id, mapId)}>{item.subLayerName}</label>             
        </div>
      </div>;

    return (
      <div key={item.id} style={marginStyle}>
        {subNodeExpander}{subNodeCheckbox}{subLayerLegendData}
      </div>
    );
  };

  renderNodes = item => {

    if (!item.alreadyLoaded) {
      return '';
    }

    const {mapId, scales, toggleNodeExpanded, toggleNodeVisible} = this.props;

    const currentScale = scales[mapId];

    const marginStyle = {marginLeft: 4, marginTop: 8};
    const subMarginStyle = {marginLeft: 8};

    let sublayers = item.expanded && (item.legendLayers || item.hasDomNode)
      ? item.legendLayers 
        ? item.legendLayers.map(this.renderSubNodes)
        : item.hasDomNode 
          ? <div style={subMarginStyle} dangerouslySetInnerHTML={{__html: item.domNode}}></div>
          : ""
      : "";

    if (currentScale && item.scaleRestricted &&
      (item.minScale !== 0 && (item.minScale < currentScale) || item.maxScale !== 0 && (item.maxScale > currentScale))) {
      marginStyle.color = "#dcdcdc";
    }

    let topNodeExpander = !item.legendLayers && !item.hasDomNode
      ? ""
      : <div onClick={() => toggleNodeExpanded(item.id, mapId)} style={styles.clickLegendNode}>
          {item.expanded
            ? <span className='esri-icon-down' />
            : <span className='esri-icon-right' />}    
        </div>;
        
    let nodeCheckbox = 
      <div style={styles.inlineBlockDisplay}>
        <span style={styles.legendCheckbox} onClick={() => toggleNodeVisible(item.id, mapId)} className={item.visible ? 'esri-icon-visible' : 'esri-icon-non-visible'} />
        <label style={styles.legendCheckboxLabel} onClick={() => toggleNodeVisible(item.id, mapId)}>{item.layerName}</label>             
      </div>;

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
          <h5 style={styles.legendMap}>{mapId.split("-").join(" - ")}</h5>
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
