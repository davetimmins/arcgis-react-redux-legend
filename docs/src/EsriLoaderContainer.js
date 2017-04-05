import React from 'react';
import { bootstrap, isLoaded } from 'esri-loader';

class EsriLoaderContainer extends React.PureComponent {

  componentDidMount () {

    if (!isLoaded()) {
      
      bootstrap((error) => {
        
        if (this.props.ready) {
          this.props.ready(error);
        }
      }, this.props.options)
    }
    else {
      
      if (this.props.ready) {
        this.props.ready();
      }
    }
  }

  render () {
    return null;
  }
}

EsriLoaderContainer.propTypes = {
  options: React.PropTypes.object,
  ready: React.PropTypes.func
};

export default EsriLoaderContainer;