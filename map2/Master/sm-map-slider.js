// CODE WORKS HOWEVER RUNS SLOWLY DUE TO NEW MAP EVERY CHANGE ON SLIDER
const urlPrezTest = '../static/data/csv/president.csv';

function presidentialUp( url, year ) {
  const formt = d3.format( ',' );
  const formatDecimal = d3.format( '.4' );
  var map = null;
  d3.csv( url, ( error, data ) => {
    if ( error ) {
      console.error( error );
    } else {
      // ------------ 
      const colors = {
        republican: "red",
        democrat: "blue",
        "democratic-farmer-labor": "blue"
      };

      let winners = {};

      const nested = d3.nest()
        .key( function ( d ) {
          return d.state;
        } )
        .key( function ( d ) {
          return d.party;
        } )
        .rollup( function ( v ) {
          return d3.max( v, function ( d ) {
            return d.candidatevotes;
          } );
        } )
        .entries( data.filter( d => d[ "year" ] == year ) );

      nested.forEach( d => {
        winners[ d.key ] = d.values[ 0 ].key;
      } );

      // console.log( 'winners :>> ', winners );

      statesData.features.forEach( d => {
        const nameState = d.properties.name;
        d.properties[ "winner" ] = winners[ nameState ];
        d.properties[ "color" ] = colors[ winners[ nameState ] ];
        // console.log('d :>> ', d.properties);
      } );

      let totalByYear = d3.nest()
        .key( d => d.year )
        .key( d => d.party )
        .rollup( function ( v ) {
          return d3.max( v, function ( d ) {
            return d.candidatevotes;
          } );
        } )
        .entries( data );
      // console.log('presidentialUp|set up map for selected year :', year);  
      // // console.log('totalByYear :>> ', totalByYear);
      // -------------------------------


      var mapboxAccessToken = "pk.eyJ1IjoiYXR0aWxhNTIiLCJhIjoiY2thOTE3N3l0MDZmczJxcjl6dzZoNDJsbiJ9.bzXjw1xzQcsIhjB_YoAuEw";

      var container = L.DomUtil.get( 'map' );

      if ( container != null ) {
        container._leaflet_id = null;
      }

      map = L.map( 'map' ).setView( [ 37.8, -96 ], 4 );

      L.tileLayer( 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' + mapboxAccessToken, {
        id: 'mapbox/dark-v10',
        attribution: '<a href="https://github.com/attila5287/electiondataviz"> @attila5287 </a> <a href="https://www.openstreetmap.org/">OpenStreetMap</a> ' +
          ' ' + '<a href="https://www.mapbox.com/">Mapbox</a>',
        tileSize: 512,
        zoomOffset: 0
      } ).addTo( map );

      map.createPane( 'labels' );
      map.getPane( 'labels' ).style.zIndex = 650;
      map.getPane( 'labels' ).style.pointerEvents = 'none';

      var positronLabels = L.tileLayer( 'https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png', {
        attribution: ' ©CartoDB',
        pane: 'labels'
      } ).addTo( map );

      function style( feature ) {
        return {
          fillColor: getColor( feature.properties.winner ),
          weight: 2,
          opacity: 1,
          color: 'white',
          dashArray: '3',
          fillOpacity: 0.7
        };
      }

      function highlightFeature( e ) {
        var layer = e.target;

        layer.setStyle( {
          weight: 5,
          color: '#2aa198',
          dashArray: '',
          fillOpacity: 0.7
        } );

        info.update( layer.feature.properties );
      }

      function zoomToFeature( e ) {
        map.fitBounds( e.target.getBounds() );
      }

      function resetHighlight( e ) {
        geojson.resetStyle( e.target );
        info.update();
      }

      function onEachFeature( feature, layer ) {
        layer.on( {
          mouseover: highlightFeature,
          mouseout: resetHighlight,
          click: zoomToFeature
        } );
      }

      var info = L.control();

      info.onAdd = function ( map ) {
        this._div = L.DomUtil.create( 'div', 'info' ); // create a div with a class "info"
        this.update();
        return this._div;
      };

      // method that we will use to update the control based on 
      // feature properties passed
      info.update = function ( props ) {
        const bgColors = {
          republican: "bg-danger",
          democrat: "bg-info"
        };

        const btnColors = {
          republican: "btn-danger",
          democrat: "btn-info"
        };

        const textColors = {
          republican: "text-danger",
          democrat: "text-primary"
        };

        const partyAbbr = {
          "republican": "(R)",
          "democrat": "(D)",
        };
        this._div.innerHTML = '<a class="btn btn-warning text-onerem text-balo text-center shadow-after text-light rounded-2xl py-2 px-3  mb-2 ">US Presidential </a>' + ( props ?
          '<br><a class="btn btn-lg shadow-after text-balo text-onerem text-nowrap text-center text-light py-1 px-3 rounded-2xl mt-2 ' +
          btnColors[ props.winner ] +
          '">' +
          props.name +
          ' ' +
          partyAbbr[ props.winner ] +
          '</a>' :
          '<br><strong class="text-balo text-secondary">Hover over a state</strong>'
        );
      };

      info.addTo( map );

      var legend = L.control( {
        position: 'bottomright'
      } );

      legend.onAdd = function ( map ) {
        var div = L.DomUtil.create( 'div', 'legend' ),
          partyNames = [ "republican", "democrat" ],
          colors = [
            "#d73027",
            "#4575b4",
          ];

        // loop through our deaths intervals and generate a label with a colored square for each interval
        for ( var i = 0; i < partyNames.length; i++ ) {
          div.innerHTML +=
            '<h4 class="text-light text-balo text-center rounded-2xl px-2 py-1 mb-2" style="background:' + colors[ i ] +
            ';">' +
            partyNames[ i ] +
            '</h4> ';
        }

        return div;

      };

      legend.addTo( map );

      geojson = L.geoJson( statesData, {
        style: style,
        onEachFeature: onEachFeature
      } ).addTo( map );

      function getColor( d ) {
        const partyColor = {
          republican: "#d73027",
          democrat: "#4575b4",
          "democratic-farmer-labor": "#4575b4"
        }; // console.log( 'colors[d] :>> ', partyColor[ d ] );
        return partyColor[ d ];
      }

      function onlyColorUp( selectedYear ) {
        // console.log( 'onlyColorUp|modify map layer for selected year :>> ', selectedYear );
        const colors = {
          republican: "red",
          democrat: "blue"
        };
        let winners = {};
        const nested = d3.nest()
          .key( function ( d ) {
            return d.state;
          } )
          .key( function ( d ) {
            return d.party;
          } )
          .rollup( function ( v ) {
            return d3.max( v, function ( d ) {
              return d.candidatevotes;
            } );
          } )
          .entries( data.filter( d => d[ "year" ] == selectedYear ) );


        nested.forEach( d => {
          winners[ d.key ] = d.values[ 0 ].key;
        } );

        // console.log( 'winners :>> ', winners );

        statesData.features.forEach( d => {
          const nameState = d.properties.name;
          d.properties[ "winner" ] = winners[ nameState ];
          d.properties[ "color" ] = colors[ winners[ nameState ] ];
          // console.log('d :>> ', d.properties);
        } );
        geojson = L.geoJson( statesData, {
          style: style,
          onEachFeature: onEachFeature
        } ).addTo( map );
      }

      function dataPrepRows( data ) { // data into rows
        const colors = {
          republican: "red",
          democrat: "blue",
          "democratic-farmer-labor": "blue"
        };

        let winners = {};

        const nested = d3.nest()
          .key( function ( d ) {
            return d.state;
          } )
          .key( function ( d ) {
            return d.party;
          } )
          .rollup( function ( v ) {
            return d3.max( v, function ( d ) {
              return d.candidatevotes;
            } );
          } )
          .entries( data.filter( d => d[ "year" ] == year ) );

        nested.forEach( d => {
          winners[ d.key ] = d.values[ 0 ].key;
        } );

        // console.log( 'winners :>> ', winners );
        statesData.features.forEach( d => {
          const nameState = d.properties.name;
          d.properties[ "winner" ] = winners[ nameState ];
          d.properties[ "color" ] = colors[ winners[ nameState ] ];
          // console.log('d :>> ', d.properties);
        } );

        let filteredStateTotals = d3.nest()
          .key( d => d.year )
          .key( d => d.state_po )
          .key( d => d.party )
          .rollup( function ( v ) {
            return d3.sum( v, function ( d ) {
              return d.candidatevotes;
            } );
          } )
          .entries( data )
          .filter( d => d.key == year )[ 0 ].values;

        console.log( 'year filtered :>> ', year );
        // console.log('filteredStateTotals :>> ', filteredStateTotals);
        let r0ws = [];
        filteredStateTotals.forEach( d => {
          let sumEach = 0;
          let row = {};
          // console.log('d :>> ', d.key);
          // console.log('all parties  :>> ', d.values);
          d.values.forEach( z => {
            // console.log('z :>> ', z);
            sumEach = sumEach + z.value;
          } );
          // console.log('sumEach :>> ', sumEach);
          // will use below keys as Table Headers
          row[ "Flag" ] = nameByStatePO[ d.key ];
          row[ "StateName" ] = nameByStatePO[ d.key ];
          row[ "Republican" ] = d.values.filter( z => z.key == "republican" )[ 0 ].value / sumEach * 100;
          row[ "Democrat" ] = d.values.filter( z => z.key == "democrat" )[ 0 ].value / sumEach * 100;
          row[ "Others" ] = 100 - row[ "Republican" ] - row[ "Democrat" ];
          row[ "NumOfSeats" ] = seatByStatePO[ d.key ];
          row[ "PO" ] = d.key;
          // console.log('row :>> ', row);
          r0ws.push( row );
        } );

        // console.log( 'rows test for Colorado :>> ', r0ws[5] );
        return r0ws;
      }

      function slideMyYears( slider ) {
        // adjust the text on the range slider
        d3.select( "#sliderValue" ).text( slider );
        d3.select( "#slider" ).property( "value", slider );
      }

      slideMyYears( year );


      // --------------------- SLIDER ----------------
      d3.select( "#slider" ).on( "change", function () {
        slideMyYears( +this.value );
        // console.log('test d3-slider: +this.value :>> ', +this.value);
        // console.log('urlPrezT3st :>> ', urlPrezT3st);
        prezTableUp( urlPrezT3st, +this.value );
        onlyColorUp( +this.value );
        candsVotesUp( +this.value );
        // dropDownUp( +this.value );
      } );
    }
  } );

}

presidentialUp( urlPrezTest, 2016 );
prezWinnersUp( 2016 );

function prezWinnersUp( year ) {
  const urlPrezWTest = '../static/data/csv/prezWinners.csv';
  d3.csv( urlPrezWTest,
    ( error, data ) => {
      if ( error ) {
        console.error( error );
      } else {
        function slideWinner( data, sliderYear ) {
          // console.log('slideWinner|prez img name etc :>> ', sliderYear);

          const d = data.filter( d => d[ "year" ] == sliderYear )[ 0 ];
          // [ "year", "president", "party", "prior" ]
          d3.select( '#prez-name' ).text( d.president );

          const imgPrez = '../static/img/prez/' + sliderYear + '.jpg';
          const imgParty = '../static/img/party/' + d.party + '.png';
          d3.select( '#prez-img' ).attr( "src", imgPrez );
          d3.select( '#party-img' ).attr( "src", imgParty );

          d3.select( '#party-name' ).text( d.party );
        }
        // --------------------- SLIDER ----------------
        d3.select( "#slider" ).on( "input", function () {
          slideWinner( data, +this.value );

        } );

      }
    } );
}
