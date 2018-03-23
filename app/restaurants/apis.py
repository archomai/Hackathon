from rest_framework import generics
from rest_framework.response import Response

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


class RatingView(generics.ListCreateAPIView):
    queryset = Rating.objects.all()
    serializer_class = RatingSerializer
