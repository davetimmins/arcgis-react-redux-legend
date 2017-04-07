import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchLegend, toggleExpanded, toggleNodeExpanded, toggleNodeVisible, toggleShowSettings, reverseLayerOrder, showLayersNotVisibleForScale } from '../actions/map-legend';

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
  marginTop: {
    marginTop: 8
  },
  titleContainer: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 12,
    backgroundColor: '#ebebeb',
    margin: 0
  },
  titleControls: {
    float: 'right',
    cursor: 'pointer',
    marginRight: 12,
    marginLeft: 12
  },
  options: {
    opacity: 0.5
  }, 
  optionsOn: {
    opacity: 1
  },  
  settingsPanel: {
    position: 'absolute',
    top: 30,
    right: 8,
    backgroundColor: 'whitesmoke',
    zIndex: 101,
    width: '90%',
    border: 'solid 1px rgba(0,0,0,0.2)'
  },  
  legendPadding: {
    paddingRight: 12,
    paddingBottom: 10,
    paddingLeft: 12
  },
  legendCheckbox: {
    cursor: 'pointer',
    marginRight: 8,
    color: '#EF5350'
  },
  legendCheckboxSelected: {
    cursor: 'pointer',
    marginRight: 8
  },
  legendCheckboxLabel: {
    fontWeight: 400,
    cursor: 'pointer'
  },
  textStyle: {
    display: 'inline-block',
    verticalAlign: 'bottom',
    fontWeight: 500
  },
  iconMargin: {
    marginRight: 4
  }
};

const renderSubNodeLegendData = item => {
  const imageStyle = {
    width: item.imageWidth + 8,
    height: item.imageHeight,
    backgroundImage: 'url(data:image/png;base64,' + item.image + ')',
    backgroundRepeat: 'no-repeat',
    display: 'inline-block'
  };

  const marginStyle = { marginLeft: 16, marginTop: 6 };

  return (
    <div key={item.id} style={marginStyle}>
      <div style={imageStyle} />
      <label style={styles.textStyle}>{item.label}</label>
    </div>
  );
};

const renderSubNodes = (item, mapId, scale, toggleNodeExpanded, toggleNodeVisible) => {

  let marginStyle = { marginLeft: 8, opacity: 1 };

  let subLayerLegendData = item.expanded && item.subLayerLegendData
    ? item.subLayerLegendData.map(renderSubNodeLegendData)
    : null;

  if (
    scale &&
    item.subLayerScaleRestricted &&
    ((item.subLayerMinScale !== 0 && item.subLayerMinScale < scale) ||
      (item.subLayerMaxScale !== 0 && item.subLayerMaxScale > scale))
  ) {
    marginStyle.opacity = 0.5;
  }

  let subNodeExpander = !item.subLayerLegendData
    ? null
    : <div onClick={() => toggleNodeExpanded(item.id, mapId)} style={styles.clickLegendNode}>
        {item.expanded
          ? <span className="esri-icon-down" />
          : <span className="esri-icon-right" />}
      </div>;

  let subNodeCheckbox = (
    <div style={styles.inlineBlockDisplay}>
      <div style={styles.inlineBlockDisplay}>
        <span
          style={item.visible ? styles.legendCheckboxSelected : styles.legendCheckbox}
          onClick={() => toggleNodeVisible(item.id, mapId)}
          className={item.visible ? 'esri-icon-visible' : 'esri-icon-non-visible'}
        />
        <label
          style={styles.legendCheckboxLabel}
          onClick={() => toggleNodeVisible(item.id, mapId)}>
          {item.subLayerName}
        </label>
      </div>
    </div>
  );

  return (
    <div key={item.id} style={marginStyle}>
      {subNodeExpander}{subNodeCheckbox}{subLayerLegendData}
    </div>
  );
};

const renderNodes = (item, mapId, scale, toggleNodeExpanded, toggleNodeVisible, optionsShowLayersNotVisibleForScale) => {

  if (!item.alreadyLoaded) {
    return null;
  }

  const marginStyle = { marginLeft: 4, marginTop: 8, opacity: 1 };
  const subMarginStyle = { marginLeft: 8 };

  if (
    scale &&
    item.scaleRestricted &&
    ((item.minScale !== 0 && item.minScale < scale) ||
      (item.maxScale !== 0 && item.maxScale > scale))
  ) {
    if (optionsShowLayersNotVisibleForScale === false) {
      return null;
    }
    marginStyle.opacity = 0.4;
  }

  let sublayers = item.expanded && (item.legendLayers || item.hasDomNode)
    ? item.legendLayers
        ? item.legendLayers.map((item, index) => renderSubNodes(item, mapId, scale, toggleNodeExpanded, toggleNodeVisible))
        : item.hasDomNode
            ? <div style={subMarginStyle} dangerouslySetInnerHTML={{ __html: item.domNode }} />
            : null
    : null;   

  let topNodeExpander = !item.legendLayers && !item.hasDomNode
    ? null
    : <div onClick={() => toggleNodeExpanded(item.id, mapId)} style={styles.clickLegendNode}>
        {item.expanded
          ? <span className="esri-icon-down" />
          : <span className="esri-icon-right" />}
      </div>;

  let nodeCheckbox = (
    <div style={styles.inlineBlockDisplay}>
      <span
        style={item.visible ? styles.legendCheckboxSelected : styles.legendCheckbox}
        onClick={() => toggleNodeVisible(item.id, mapId)}
        className={item.visible ? 'esri-icon-visible' : 'esri-icon-non-visible'}
      />
      <label style={styles.legendCheckboxLabel} onClick={() => toggleNodeVisible(item.id, mapId)}>
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

class MapLegend extends React.PureComponent {
  initialise = (legend) => {
    const { mapId, fetchLegend } = this.props;
  
    if (!legend) {
      return;
    }

    legend.forEach(lyr => {
      if (!lyr.alreadyLoaded && lyr.url && !lyr.isFetching) {
        fetchLegend(lyr.url, mapId);
      }
    });
  };

  componentDidMount() {
    this.initialise(this.props.legend);
  }

  componentWillReceiveProps(nextProps) {

    if (this.props.legend && nextProps.legend && this.props.legend.length !== nextProps.legend.length) {
      this.initialise(nextProps.legend);
    }
  }

  render() {
    const { 
      legend, mapId, title, scale, 
      optionsShowOptions, optionsShowLayersNotVisibleForScale, optionsReverseLayerOrder,
      toggleExpanded, reverseLayerOrder, showLayersNotVisibleForScale, toggleShowSettings,
      toggleNodeExpanded, toggleNodeVisible } = this.props;
    
    if (!legend) {
      return null;
    }

    return (
      <div className="arcgis-legend">
        <div>
          <div style={styles.titleContainer}>
            <label>{title ? title : mapId}</label>      
            <div style={styles.titleControls}>
              <span 
                title='Expand all' 
                className="esri-icon-down-arrow" 
                style={styles.iconMargin}
                onClick={() => toggleExpanded(mapId, true)} />
              <span 
                title='Collapse all' 
                className="esri-icon-right-triangle-arrow" 
                style={styles.iconMargin}
                onClick={() => toggleExpanded(mapId, false)} />
              <span 
                title='Options' 
                style={optionsShowOptions ? styles.optionsOn : styles.options} 
                className="esri-icon-settings" 
                onClick={() => toggleShowSettings(mapId)} />
            </div>              
          </div>
          {
            optionsShowOptions
            ? <div style={styles.settingsPanel}>
                <div style={styles.titleContainer}>
                  <label>Options</label>
                </div>
                <div style={styles.legendPadding}>
                  <div style={styles.marginTop}>
                    <span
                      style={styles.legendCheckboxSelected}
                      onClick={() => reverseLayerOrder(mapId)}
                      className={optionsReverseLayerOrder ? 'esri-icon-checkbox-checked' : 'esri-icon-checkbox-unchecked'}
                    />
                    <label
                      style={styles.legendCheckboxLabel}
                      onClick={() => reverseLayerOrder(mapId)}>
                      Reverse order
                    </label>
                  </div>
                  <div style={styles.marginTop}>
                    <span
                      style={styles.legendCheckboxSelected}
                      onClick={() => showLayersNotVisibleForScale(mapId, !optionsShowLayersNotVisibleForScale)}
                      className={optionsShowLayersNotVisibleForScale ? 'esri-icon-checkbox-checked' : 'esri-icon-checkbox-unchecked'}
                    />
                    <label
                      style={styles.legendCheckboxLabel}
                      onClick={() => showLayersNotVisibleForScale(mapId, !optionsShowLayersNotVisibleForScale)}>
                      Show layers not visible for current scale
                    </label>
                  </div>
                </div>
              </div> 
            :null
          }          
        </div>
        <div style={styles.legendPadding}>
          {legend.map((item, index) => renderNodes(item, mapId, scale, toggleNodeExpanded, toggleNodeVisible, optionsShowLayersNotVisibleForScale))}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  const legend = state.mapLegendConfig.legends[props.mapId];
  const option = state.mapLegendConfig.options[props.mapId];
  const scale = state.mapLegendConfig.scales[props.mapId];
  return {
    legend,
    optionsShowOptions: option ? option.showOptions : false,
    optionsReverseLayerOrder: option ? option.reverseLayerOrder : false,
    optionsShowLayersNotVisibleForScale: option ? option.showLayersNotVisibleForScale : true,
    scale
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchLegend: (url, mapId) => {
      dispatch(fetchLegend(url, mapId));
    },
    toggleExpanded: (mapId, expanded) => {
      dispatch(toggleExpanded(mapId, expanded));
    },
    toggleNodeExpanded: (id, mapId) => {
      dispatch(toggleNodeExpanded(id, mapId));
    },
    toggleNodeVisible: (id, mapId) => {
      dispatch(toggleNodeVisible(id, mapId));
    },
    toggleShowSettings: (mapId) => {
      dispatch(toggleShowSettings(mapId));
    },
    reverseLayerOrder: (mapId) => {
      dispatch(reverseLayerOrder(mapId));
    },
    showLayersNotVisibleForScale: (mapId, show) => {
      dispatch(showLayersNotVisibleForScale(mapId, show));
    }
  };
};

MapLegend.propTypes = {
  mapId: PropTypes.string.isRequired,
  title: PropTypes.string
};

export default connect(mapStateToProps, mapDispatchToProps)(MapLegend);
