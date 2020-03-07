window.onload = function() {
    var popup = L.popup();
    // var geolocationMap = L.map('map', {
    //     layers: MQ.mapLayer(),
    //     center: [40.731701, -73.993411],
    //     zoom: 12
    // });

    // L.mapquest.key = 'xbC1ee3904qPCSmJzBKZ0TuA39aBKbed';

    var maskMap = L.map('map', {
        // center: [25.052362, 121.520685],
        // layers: MQ.mapLayer(),
        // layers: L.mapquest.tileLayer('map'),
        zoom: 16
    });

    // L.mapquest.key = 'lYrP4vF3Uk5zgTiGGuEzQGwGIVDGuy24';

    // var maskMap = L.mapquest.map('map', {
    //   center: [37.7749, -122.4194],
    //   layers: L.mapquest.tileLayer('dark'),
    //   zoom: 12
    // });

    // maskMap.addControl(L.mapquest.control());

    function geolocationErrorOccurred(geolocationSupported, popup, latLng) {
        popup.setLatLng(latLng);
        popup.setContent(geolocationSupported ?
                '<b>Error:</b> The Geolocation service failed.' :
                '<b>Error:</b> This browser doesn\'t support geolocation.');
        popup.openOn(maskMap);
    }

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var latLng = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            // popup.setLatLng(latLng);
            // popup.setContent('This is your current location');
            // popup.openOn(maskMap);

            var yourLocation = L.divIcon({
                className: 'yourLocation',
                // html: "<div></div>",
                iconSize: [25, 25]
            });

            L.marker(latLng, {
                icon: yourLocation
            }).addTo(maskMap);

            maskMap.setView(latLng);
        }, function() {
            geolocationErrorOccurred(true, popup, maskMap.getCenter());
        });
    } else {
        //No browser support geolocation service
        geolocationErrorOccurred(false, popup, maskMap.getCenter());
    }

    // L.tileLayer('https://maps.omniscale.net/v2/private-johnny-chu-9fee754f/style.grayscale/map').addTo(maskMap);

    var host = 'https://maps.omniscale.net/v2/omniscale-f1c579ee/style.grayscale/{z}/{x}/{y}.png';

    var attribution = '&copy; 2020 &middot; <a href="https://maps.omniscale.com/">Omniscale</a> ' + '&middot; Map data: <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

    L.tileLayer(host, {
        crossOrigin: 'true',
        attribution: attribution
    }).addTo(maskMap);
/*
    var greenIcon = new L.Icon({
        iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });
    
    var redIcon = new L.Icon({
        iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });
*/
    var maskIcon = new L.Icon({
        iconUrl: './img/faceMask.png',
        iconSize: [80, 80],
        // iconAnchor: [40, 15],
        popupAnchor: [0, -20]
    });

    var maskIconGray = new L.Icon({
        iconUrl: './img/faceMask-gray.png',
        iconSize: [80, 80],
        // iconAnchor: [40, 15],
        popupAnchor: [0, -20]
    });

    var markers = new L.MarkerClusterGroup().addTo(maskMap);;
    
    var xhr = new XMLHttpRequest();
    xhr.open("get", "https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json");
    xhr.send();
    
    xhr.onload = function() {
        var data = JSON.parse(xhr.responseText).features
     
        for( let i = 0; i < data.length; i++ ) {
            var mask;
            
            if ( data[i].properties.mask_adult == 0 ) {
                mask = maskIconGray;
            } else {
                mask = maskIcon;
            }
            
            markers.addLayer( 
                L.marker([
                    data[i].geometry.coordinates[1], 
                    data[i].geometry.coordinates[0]
                ], {icon: mask})
                .bindPopup(`
                    <a href="https://www.google.com.tw/maps/search/${data[i].properties.name}" target="_blank" rel="noopener noreferrer">
                        <h3 class="pharmacy__name"> ${data[i].properties.name} </h3>
                    </a>
                    
                    <div class="pharmacy__info">
                        <a href="tel: ${data[i].properties.phone}" target="_blank" rel="noopener noreferrer" class="pharmacy__phone"> 
                            ${data[i].properties.phone} 
                        </a>

                        <a href="https://www.google.com.tw/maps/search/${data[i].properties.address}" target="_blank" rel="noopener noreferrer" class="pharmacy__address">
                            ${data[i].properties.address}
                        </a>
                    
                        <div class="pharmacy__note">
                            <p>${data[i].properties.note}</p>
                            <p>${data[i].properties.custom_note}</p>
                        </div>
                    </div>
                    
                    <div class="mask__container">
                        <p class="mask__adult">成人口罩 ${data[i].properties.mask_adult} </p>
                        <p class="mask__child">孩童口罩 ${data[i].properties.mask_child} </p>
                    </div>
                `)
            );
        }
        maskMap.addLayer(markers);
    }
}

// <a href="https://www.google.com/maps/dir/25.0032999,121.5540404/25.063669,121.521567" class="customPopup__google" target="_blank"></a>

// initialize the map on the "map" div with a given center and zoom
// var map = L.map('map', {
//     center: [25.052362, 121.520685],
//     zoom: 16
// });

// L.marker([25.052362, 121.520685]).addTo(map)
//     .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
//     .openPopup();