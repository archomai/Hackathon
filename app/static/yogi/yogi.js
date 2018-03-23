
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


    // 현재위치 마커 추가
//    var marker = new google.maps.Marker({
//        position: currentLocation,
//        map: map
//    });

    // 구글 맵 geolocation 현재 위치
    var infoWindow = new google.maps.InfoWindow({map: map});
    infoWindow.setPosition(currentLocation);
    infoWindow.setContent('대기빌딩');

//    if (navigator.geolocation) {
//        navigator.geolocation.getCurrentPosition(function(position) {
//            var pos = {
//                lat: position.coords.latitude,
//                lng: position.coords.longitude
//            };
//
//            infoWindow.setPosition(pos);
//            infoWindow.setContent('현재위치');
//            map.setCenter(pos);
//        });
//    }

    // 마커 클러스터 추가
    var locations = [
        {name: '식당1', lat: 37.516782, lng: 127.022506},
        {name: '식당2', lat: 37.517883, lng: 127.023607},
        {name: '식당3', lat: 37.518984, lng: 127.024708}
    ]
    var markers = locations.map(function(location, i) {
      return new google.maps.Marker({
        position: {lat: location.lat, lng: location.lng},
        label: location.name
      });
    });
    var markerCluster = new MarkerClusterer(map, markers,
            {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});

}