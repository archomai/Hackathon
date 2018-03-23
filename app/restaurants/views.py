from django.shortcuts import render

from .models import Restaurant


def restaurant_list(request):
    restaurants = Restaurant.objects.all()
    context = {
        'restaurants': restaurants
    }
    return render(request, 'index.html', context)
