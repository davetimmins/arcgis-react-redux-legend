# ArcGIS JS API V4 Legend

[![npm](https://img.shields.io/npm/v/arcgis-react-redux-legend.svg)](https://www.npmjs.com/package/arcgis-react-redux-legend)
 
Combined legend and layer list control for the ArcGIS JS API V4 that uses React and Redux
 
![legend gif](legend.gif)

### Run locally

grab this repo (fork / download) then run `npm install` wait a while and then get running with `npm start` then go to `http://localhost:3000`. You can also append a webmap query paramter to load a webmap from ArcGIS Online `http://localhost:3000?webmap=8e42e164d4174da09f61fe0d3f206641`. 

### Usage

> **If you are using 4.3 or lower of the ArcGIS JS API then make sure you use version 1.x of this control, version 2.x is for the ArcGIS API v4.4 to v4.6., version 3.x is for v4.6 and version 4.x is for 4.11 or higher**

> **You can now achieve similar functionality using the base ArcGIS JS API with this [example](https://developers.arcgis.com/javascript/latest/sample-code/widgets-layerlist-legend/index.html) so consider that as an alternative to this component**

To add to your site first make sure you have the dependencies installed, we assume you are using React, Redux and Esri Loader. For the full list refer to the [package.json](https://github.com/davetimmins/arcgis-react-redux-legend/blob/master/package.json) peerDependencies.

`yarn add arcgis-react-redux-legend`

Now add the reducer

```js
import {combineReducers} from 'redux';
import {reducer as mapLegendReducer} from 'arcgis-react-redux-legend';

const reducer = combineReducers(
  {    
    mapLegendConfig: mapLegendReducer
  }
);
```

then where you are creating your map control you need to add the MapLegend component and initialise it 

```js
import {MapLegend,setInitialLegend} from 'arcgis-react-redux-legend';

// bootstrap the Esri API using esri-loader and create your view
// mapId should be the unique name / id to identify the map. 
// You can add multiple maps and legends so long as the mapId is unique
this.props.dispatch(setInitialLegend(view, mapId));
```

```html
// in your render function, use the ref to pass to the Esri JS API when creating the map and view
<div ref={node => (this.mapView = node)}>
  <MapLegend mapId={mapId} title='My legend' />
</div>
```

`setInitialLegend` will listen for your view being ready and also watch the scale changing so that the legend scale dependency updates accordingly.

For a complete example check out the source in the docs folder for [map-view](https://github.com/davetimmins/arcgis-react-redux-legend/blob/master/demo/src/components/map-view.js)