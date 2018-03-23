from rest_framework import generics

from .serializers import RestaurantSerializer, MenuListSerializer, MenuComboSerializer, RatingSerializer
from .models import Restaurant, MenuList, MenuCombo, Rating


class RestaurantView(generics.ListCreateAPIView):
    queryset = Restaurant.objects.all()
    serializer_class = RestaurantSerializer

    def get(self, request, *args, **kwargs):
        print(request.data)
        return super().get(request, *args, **kwargs)


class MenuListView(generics.ListCreateAPIView):
    queryset = MenuList.objects.all()
    serializer_class = MenuListSerializer


class MenuComboView(generics.ListCreateAPIView):
    queryset = MenuCombo.objects.all()
    serializer_class = MenuComboSerializer


class RatingView(generics.ListCreateAPIView):
    queryset = Rating.objects.all()
    serializer_class = RatingSerializer
