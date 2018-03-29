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


$(function(){
  $('#restaurant-menu-select').select2({
    tags: true,
    tokenSeparators: [',', ' '],
  });
  $("#restaurantAddFormSubmit").on("click", restaurantAddFunc);
});


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
                    rating: restaurant.restaurant_rate
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

function restaurantAddFunc(){
    var r_name = $('#restaurant-name');
    var r_menu = $('#restaurant-menu-select');
    var u_memo = $('#user-memo');
    var u_rate = $('input[name="user-rating"]:checked');

    r_name.val( r_name.val().trim() );
    u_memo.val( u_memo.val().trim() );

    if( r_name.val() == '' ) {
      alert( '식당이름을 입력해 주세요');
      r_name.focus();
      return false;
    }
    if( r_menu.val() == '' ) {
        alert('평점을 부여할 메뉴를 입력해 주세요.');
        r_menu.focus();
        return false;
    }
    if( u_memo.val() == '' ) {
        alert('한줄평을 입력해 주세요.');
        u_name.focus();
        return false;
    }
    if( u_rate.val() == '' ) {
        alert('평점을 선택해 주세요.');
        return false;
    }


    //음식점 등록
    axios({
      method: 'post',
      url: "http://localhost:8000/api/rating/",
      headers: {'Content-Type': 'application/json'},
      data: {
        "restaurant": r_name.val(),
        "lat": yogi.userMarker.getPosition().toJSON().lat,
        "lng": yogi.userMarker.getPosition().toJSON().lng,
        "menucombo": r_menu.val().join(', '),
        "menu_rate": u_rate.val(),
        "comment": u_memo.val()
      }
    })
    .then(function(response){
        window.location.reload();
    });


//    // 음식점 등록
//    axios({
//      method: 'post',
//      url: "http://localhost:8000/api/restaurant/",
//      headers: {'Content-Type': 'application/json'},
//      data: {
//        "name": r_name.val(),
//        "lat": yogi.userMarker.getPosition().toJSON().lat,
//        "lng": yogi.userMarker.getPosition().toJSON().lng
//      }
//    })
//    .then(function(response){
//        var newRestaurantPK = response.data.id;
//
//        // 메뉴 콤보 등록
//        axios({
//          method: 'post',
//          url: "http://localhost:8000/api/menucombo/",
//          headers: {'Content-Type': 'application/json'},
//          data: {
//            "menu_combo": r_menu.val().join('_') ,
//            "restaurant": newRestaurantPK
//          }
//        })
//        .then(function(response){
//            var newMenuComboPK = response.data.id;
//
//            // 메뉴 레이팅 등록
//            axios({
//              method: 'post',
//              url: "http://localhost:8000/api/rating/",
//              headers: {'Content-Type': 'application/json'},
//              data: {
//                "menu_rate": u_rate.val(),
//                "restaurant": newRestaurantPK,
//                "menucombo": newMenuComboPK,
//                "comment": u_memo.val()
//              }
//            })
//            .then(function(response){
//                window.location.reload();
//            });
//        });
//    });






  }