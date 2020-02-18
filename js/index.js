// initialize the map on the "map" div with a given center and zoom
var map = L.map('map', {
    center: [25.052362, 121.520685],
    zoom: 16
});

// L.marker([25.052362, 121.520685]).addTo(map)
//     .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
//     .openPopup();

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

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

var markers = new L.MarkerClusterGroup().addTo(map);;

var xhr = new XMLHttpRequest();
xhr.open("get", "https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json");
xhr.send();

xhr.onload = function() {
	var data = JSON.parse(xhr.responseText).features
 
	for( let i = 0; data.length > i; i++ ) {
		var mask;
		
		if ( data[i].properties.mask_adult == 0 ) {
			mask = redIcon;
		} else {
			mask = greenIcon;
		}
		
		markers.addLayer( 
			L.marker([
				data[i].geometry.coordinates[1], 
				data[i].geometry.coordinates[0]
			], {icon: mask})
			.bindPopup( 
                '<h3 class="pharmacy__name">' + data[i].properties.name + '</h3>' + 
                '<div class="pharmacy__info">' + 
                    '<a href="tel:' + data[i].properties.phone + '" ' + ' class="pharmacy__phone">' + data[i].properties.phone + '</a>' + 
                    '<a href="https://www.google.com.tw/maps/search/' + data[i].properties.address + '" ' + ' target="_blank" class="pharmacy__address">' + data[i].properties.address + '</a>' + 
                '</div>' + 
                '<div class="mask__container">' + 
                    '<p class="mask__adult">成人口罩 ' + data[i].properties.mask_adult + '</p>' + 
                    '<p class="mask__child">兒童口罩 ' + data[i].properties.mask_child + '</p>' + 
                '</div>' 
            )
		);
	}
	map.addLayer(markers);
}

// '<p class="pharmacy__phone">' + data[i].properties.phone + '</p>' + 