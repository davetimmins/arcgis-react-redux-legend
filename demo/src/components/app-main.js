import React from 'react';

import MapUi from './map-view';

class AppMain extends React.PureComponent {
  
  render() {
    const options = {
      url: 'https://js.arcgis.com/4.5/'
    };

    return (
      <MapUi mapId={'Legend example'} options={options} />
    );
  }
}

export default AppMain;
