
function initMap() {
    var currentLocation = {
        label: '기본위치',
        lat: 37.515782,
        lng: 127.021506
    }

    // 구글맵 시작
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 17,
        center: currentLocation
    });

    // 구글 맵 geolocation 현재 위치
    var infoWindow = new google.maps.InfoWindow({map: map});
    infoWindow.setPosition(currentLocation);
    infoWindow.setContent('대기빌딩');

    // 마커 클러스터 추가
    var locations = [
        {label: '식당1', position: {lat: 37.516782, lng: 127.022506}, customNum: 1},
        {label: '식당2', position: {lat: 37.517883, lng: 127.023607}, customNum: 2},
        {label: '식당3', position: {lat: 37.518984, lng: 127.024708}, customNum: 3}
    ]
    var markers = locations.map(function(location, i) {
        var marker = new google.maps.Marker(location);
        marker.addListener('click', function(event) {
            map.setCenter(marker.getPosition());
            console.log(event);
            console.log(marker);
            changeDom(marker.customNum);
        });
        return marker
    });
    var markerCluster = new MarkerClusterer(map, markers,
            {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});

}

function changeDom(i) {
    $('ul > li:nth-child('+i+')').text('selected');
}

function loadRestaurants(){
}