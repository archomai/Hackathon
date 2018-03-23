from django.urls import path

from restaurants import apis

app_name = 'restaurants'
urlpatterns = [
    path('restaurant/', apis.RestaurantView.as_view(), name='restaurant'),
    path('menulist/', apis.MenuListView.as_view()),
    path('menucombo/', apis.MenuComboView.as_view()),
    path('rating/', apis.RatingView.as_view()),
]
