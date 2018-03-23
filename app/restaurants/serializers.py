from rest_framework import serializers

from .models import Restaurant, MenuList, MenuCombo, Rating


class RestaurantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Restaurant
        fields = '__all__'


class MenuListSerializer(serializers.ModelSerializer):
    restaurant = RestaurantSerializer()

    class Meta:
        model = MenuList
        fields = '__all__'


class MenuComboSerializer(serializers.ModelSerializer):
    class Meta:
        model = MenuCombo
        fields = '__all__'


class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = '__all__'
