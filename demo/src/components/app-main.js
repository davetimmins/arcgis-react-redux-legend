import React from 'react';
import EsriLoader from 'esri-loader-react';

import MapUi from './map-view';

class AppMain extends React.PureComponent {
  initialState = {
    dojoRequire: null
  };
  state = this.initialState;

  onEsriApiLoaded = (error, dojoRequire) => {
    if (!error) {
      this.setState({ dojoRequire });
    }
  };

  render() {
    const options = {
      url: 'https://js.arcgis.com/4.5/'
    };

    return (
      <div>
        <EsriLoader options={options} ready={this.onEsriApiLoaded} />
        {this.state.dojoRequire ? <MapUi mapId={'Legend example'} dojoRequire={this.state.dojoRequire} /> : null}
      </div>
    );
  }
}

export default AppMain;
