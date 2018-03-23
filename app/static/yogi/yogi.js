var map = ''
var yogi = {
    defaultLocation: {
        label: '대기빌딩',
        lat: 37.515782,
        lng: 127.021506
    },
    restaurants: ''
}


function initMap() {

    // 구글맵 시작
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 17,
        center: yogi.defaultLocation
    });

    // 구글 맵 기본위치 표시
    var infoWindow = new google.maps.InfoWindow({map: map});
    infoWindow.setPosition(yogi.defaultLocation);
    infoWindow.setContent(yogi.defaultLocation.label);

    loadRestaurants();
}

function loadRestaurants(){
    yogi.restaurants = [
        {label: '행복밥상', position: {lat: 37.516782, lng: 127.02256}, restaurantPk: 1},
        {label: '이태리부대찌개', position: {lat: 37.517883, lng: 127.023607}, restaurantPk: 2},
        {label: '카', position: {lat: 37.518984, lng: 127.024708}, restaurantPk: 3}
    ]

    var restaurantList = $("#restaurants");

    // 음식점 리스트 추가 및 마커 클러스터 추가
    var markers = yogi.restaurants.map(function(restaurant, i) {
        // 리스트 추가
        var listItem = $("#restaurant-template").clone();
        listItem.attr('id', 'restaurant_'+restaurant.restaurantPk);
        listItem.find('.restaurant-name').text(restaurant.label);
        listItem.on("click", restaurantSelect);
        restaurantList.append(listItem);

        // 마커생성
        var marker = new google.maps.Marker(restaurant);
        restaurant.marker = marker; // 마커를 참조하기 위해 할당한다.
        marker.addListener('click', function(event) {
            map.setCenter(marker.getPosition());
            restaurantActive(marker.restaurantPk);
        });
        return marker
    });
    var markerCluster = new MarkerClusterer(map, markers,
            {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});

}


function restaurantSelect() {
    var pk = this.id.split('_')[1];
    restaurantActive(pk);

    restaurant = yogi.restaurants.find(function(restaurant){
        return restaurant.restaurantPk == pk
    });
    map.setCenter(restaurant.marker.getPosition());
}
function restaurantActive(pk) {
    $('#restaurants > li.active').removeClass('active');
    $('#restaurant_'+pk).addClass('active');
}