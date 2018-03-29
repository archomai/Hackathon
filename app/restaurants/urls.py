from django.urls import path

from restaurants import apis
from restaurants.views import rating_add, rating_list

app_name = 'restaurants'
urlpatterns = [
    path('restaurant/', apis.RestaurantView.as_view(), name='restaurant'),
    path('menulist/', apis.MenuListView.as_view()),
    path('menucombo/', apis.MenuComboView.as_view()),
    path('rating/', apis.RatingView.as_view()),
    path('ratingadd/', rating_add, name='rating-add'),
    path('ratinglist/', rating_list, name='rating-list'),
]
