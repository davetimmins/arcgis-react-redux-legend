import React from "react";

import EsriLoaderContainer from '../EsriLoaderContainer'
import MapUi from "./map-view";

class AppMain extends React.PureComponent {

  initialState = {
    loaded: false
  };
  state = this.initialState;

  onEsriApiLoaded = (error) => {

    if (!error) {
      this.setState({loaded: true});
    }
  }

  render() {
    const options = {
      url: 'https://js.arcgis.com/4.3/'
    };

    return (
      <div>
        <EsriLoaderContainer options={options} ready={this.onEsriApiLoaded} />
        {this.state.loaded ? <MapUi mapId={"Legend example"} /> : null}
      </div>
    );
  }
}

export default AppMain;
