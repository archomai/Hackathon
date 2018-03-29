from django.db.models import Avg
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import RestaurantSerializer, MenuListSerializer, MenuComboSerializer, RatingSerializer
from .models import Restaurant, MenuList, MenuCombo, Rating


class RestaurantView(generics.ListCreateAPIView):
    queryset = Restaurant.objects.all()
    serializer_class = RestaurantSerializer


class MenuListView(generics.ListCreateAPIView):
    queryset = MenuList.objects.all()
    serializer_class = MenuListSerializer


class MenuComboView(generics.ListCreateAPIView):
    queryset = MenuCombo.objects.all()
    serializer_class = MenuComboSerializer


class RatingView(APIView):
    def get(self, request, format=None):
        ratings = Rating.objects.all()
        serializer = RatingSerializer(ratings, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        menu_rate = request.data['menu_rate']
        menucombo = request.data['menucombo']
        restaurant = request.data['restaurant']

        r, _ = Restaurant.objects.get_or_create(name=restaurant)

        menu_list = sorted(menucombo.split(', '))
        for menu in menu_list:
            me, _ = MenuList.objects.get_or_create(
                menu=menu,
                restaurant=r,
            )
        menucombo = ', '.join(menu_list)

        m, _ = MenuCombo.objects.get_or_create(
            menu_combo=menucombo,
            restaurant=r,
        )
        Rating.objects.create(
            restaurant=r,
            menucombo=m,
            menu_rate=menu_rate,
        )

        # menu_combo 평가 평균 계산
        rate = Rating.objects.filter(restaurant=r, menucombo__menu_combo__contains=menucombo)
        avg = rate.aggregate(Avg('menu_rate'))
        m.menu_combo_rate = avg['menu_rate__avg']
        m.save()

        # restaurant 평가 평균 계산
        rate_res = Rating.objects.filter(restaurant=r)
        avg_res = rate_res.aggregate(Avg('menucombo__menu_combo_rate'))
        r.restaurant_rate = avg_res['menucombo__menu_combo_rate__avg']
        r.save()

        request.data['menucombo'] = m.pk
        request.data['restaurant'] = r.pk

        serializer = RatingSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
