import React from "react";
import {connect} from "react-redux";
import {
  fetchLegend,
  toggleNodeExpanded,
  toggleNodeVisible
} from "../actions/map-legend";
import {Checkbox,Glyphicon} from "react-bootstrap";

class MapLegend extends React.Component {
  initialise = () => {
    const {legends, mapId, fetchLegend} = this.props;
    const legend = legends[mapId];

    if (!legend) {
      return;
    }

    for (let lyr in legend.items) {
      if (legend.items.hasOwnProperty(lyr)) {
        const url = legend.items[lyr].url;

        if (url && legend.items[lyr].alreadyLoaded === false) {
          fetchLegend(url, mapId);
        }
      }
    }
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
      currentScale,
      toggleNodeExpanded,
      toggleNodeVisible
    } = this.props;

    let marginStyle = {marginLeft: 8, marginTop: 8};

    let subLayerLegendData = item.expanded && item.subLayerLegendData
      ? item.subLayerLegendData.map(this.renderSubNodeLegendData)
      : "";

    if (
      item.subLayerScaleRestricted &&
        (item.subLayerMinScale < currentScale ||
          item.subLayerMaxScale > currentScale)
    ) {
      marginStyle.color = "#dcdcdc";
    }

    let subNodeExpander = !item.subLayerLegendData
      ? ""
      : item.expanded
        ? (
          <Glyphicon
            glyph="chevron-down"
            onClick={() => toggleNodeExpanded(item.id, mapId)}
            className="click-legend-node"
          />
        )
        : (
          <Glyphicon
            glyph="chevron-right"
            onClick={() => toggleNodeExpanded(item.id, mapId)}
            className="click-legend-node"
          />
        );

    let subNodeCheckbox = item.visible
      ? (
        <div className="inline-block-display">
          <Checkbox onChange={() => toggleNodeVisible(item.id, mapId)} checked>
          {item.subLayerName}
        </Checkbox>
        </div>
      )
      : (
        <div className="inline-block-display">
          <Checkbox onChange={() => toggleNodeVisible(item.id, mapId)}>
          {item.subLayerName}
        </Checkbox>
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
          <Glyphicon
            glyph="chevron-down"
            onClick={() => toggleNodeExpanded(item.id, mapId)}
            className="click-legend-node"
          />
        )
        : (
          <Glyphicon
            glyph="chevron-right"
            onClick={() => toggleNodeExpanded(item.id, mapId)}
            className="click-legend-node"
          />
        );

    let nodeCheckbox = item.visible
      ? (
        <div className="inline-block-display">
          <Checkbox onChange={() => toggleNodeVisible(item.id, mapId)} checked>
          {item.layerName}
        </Checkbox>
        </div>
      )
      : (
        <div className="inline-block-display">
          <Checkbox onChange={() => toggleNodeVisible(item.id, mapId)}>
          {item.layerName}
        </Checkbox>
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
    currentScale: state.mapLegendConfig.currentScale
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
