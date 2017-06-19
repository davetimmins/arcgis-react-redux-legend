# ArcGIS JS API V4 Legend

[![npm](https://img.shields.io/npm/v/arcgis-react-redux-legend.svg)](https://www.npmjs.com/package/arcgis-react-redux-legend)
 
Combined legend and layer list control for the ArcGIS JS API V4 that uses React and Redux
 
![legend gif](legend.gif)

### Run locally

grab this repo (fork / download) then run `npm install` wait a while and then get running with `npm start` then go to `http://localhost:8811/docs`. You can also append a webmap query paramter to load a webmap from ArcGIS Online `http://localhost:8811/docs?webmap=ad5759bf407c4554b748356ebe1886e5`. 

### Usage

**If you are using 4.3 or lower of the ArcGIS JS API then make sure you use version 1.x of this control, v2 is for the ArcGIS API v4.4 or higher.**

To add to your site first make sure you have the dependencies installed, we assume you are using React, Redux and Esri Loader. For the full list refer to the [package.json](https://github.com/davetimmins/arcgis-react-redux-legend/blob/master/package.json) peerDependencies.

Now add the reducer

```js
import {combineReducers} from 'redux';
import {reducer as mapLegendReducer} from "arcgis-react-redux-legend";

const reducer = combineReducers(
  {    
    mapLegendConfig: mapLegendReducer
  }
);
```

then where you are creating your map control you need to add the MapLegend component and initialise it 

```js
import {MapLegend,setInitialLegend} from "arcgis-react-redux-legend";

// bootstrap the Esri API using esri-loader and create your view
// mapId should be the unique name / id to identify the map. 
// You can add multiple maps and legends so long as the mapId is unique
this.props.dispatch(setInitialLegend(view, mapId));
```

```html
// in your render function, use the ref to pass to the Esri JS API when creating the map and view
<div ref={node => (this.mapView = node)}>
  <MapLegend mapId={mapId} title='My awesome legend' />
</div>
```

`setInitialLegend` will listen for your view being ready and also watch the scale changing so that the legend scale dependency updates accordingly.

For a complete example check out the source in the docs folder for [map-view](https://github.com/davetimmins/arcgis-react-redux-legend/blob/master/docs/src/components/map-view.js)

Currently supports MapImageLayers, FeatureLayers, GraphicsLayers, StreamLayers and SceneLayers.