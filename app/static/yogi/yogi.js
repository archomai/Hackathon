var map = '';
var infoWindow = '';
var yogi = {
    defaultLocation: {
        label: '대기빌딩',
        lat: 37.515782,
        lng: 127.021506
    },
    restaurants: '',
    userMarker: ''
}


function initMap() {

    // 구글맵 시작
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 17,
        center: yogi.defaultLocation
    });

    // 구글 맵 기본위치 표시
    infoWindow = new google.maps.InfoWindow({map: map});
    infoWindow.setPosition(yogi.defaultLocation);
    infoWindow.setContent(yogi.defaultLocation.label);

    map.addListener('click', function(e) {
        if(yogi.userMarker){
            yogi.userMarker.setMap(null);
        }
        var marker = new google.maps.Marker({
            position: e.latLng,
            map: map,
            draggable: true,
            raiseOnDrag: true,
            label: '요기요?'
        });
        $("#restaurant-add").show();
        yogi.userMarker = marker;
    });

    loadRestaurants();
}

function loadRestaurants(){

    $.ajax({
        url: "http://localhost:8000/api/restaurant/",
        success: function (result) {
            yogi.restaurants = result.map(function(restaurant){
                return {
                    label: restaurant.name,
                    position: {lat: restaurant.lat, lng: restaurant.lng},
                    restaurantPk: restaurant.id,
                    rating: restaurant._restaurant_rate
                }
            });
        },
        async: false
    });

    var restaurantList = $("#restaurants");

    // 사용자 추가 위치 리스트 아이템 클릭 이벤트
    $("#restaurant-add").on('click', currentLocationSelect);

    // 음식점 리스트 추가 및 마커 클러스터 추가
    var markers = yogi.restaurants.map(function(restaurant, i) {
        // 리스트 추가
        var listItem = $("#restaurant-template").clone();
        listItem.attr('id', 'restaurant_'+restaurant.restaurantPk);
        listItem.find('.restaurant-name').text(restaurant.label);
        listItem.find('.restaurant-rating').text(restaurant.rating);
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

function currentLocationSelect() {
    // 구글맵 이동
    map.setCenter(yogi.userMarker.getPosition());

    // 리스트 아이템 클래스 변경
    $('#restaurants > li.active').removeClass('active');
    $(this).addClass('active');
}
function restaurantSelect() {
    var pk = this.id.split('_')[1];

    // 구글맵 이동
    restaurant = yogi.restaurants.find(function(restaurant){
        return restaurant.restaurantPk == pk
    });
    map.setCenter(restaurant.marker.getPosition());

    // 리스트 아이템 클래스 변경
    $('#restaurants > li.active').removeClass('active');
    $('#restaurant_'+pk).addClass('active');
}