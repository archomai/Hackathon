from django.db.models import Avg, Q
from django.http import HttpResponse
from django.shortcuts import render, redirect

from .models import Restaurant, MenuCombo, Rating, MenuList


def restaurant_list(request):
    restaurants = Restaurant.objects.all()
    context = {
        'restaurants': restaurants
    }
    return render(request, 'index.html', context)


def rating_list(request):
    if request.method == "POST":
        menu_rate = request.POST['menu_rate']
        menucombo = request.POST['menucombo']
        restaurant = request.POST['restaurant']

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

        return redirect('restaurants:rating-list')
    rates = Rating.objects.all()
    menu_list = MenuList.objects.all()
    context = {
        'rates': rates,
        'menu_list': menu_list,
    }
    return render(request, 'restaurants/list.html', context)


def rating_add(request):
    if request.method == "POST":
        menu_rate = request.POST['menu_rate']
        menucombo = request.POST['menucombo']
        restaurant = request.POST['restaurant']
        r, _ = Restaurant.objects.get_or_create(name=restaurant)
        m, _ = MenuCombo.objects.get_or_create(menucobo=menucombo)
        Rating.objects.create(
            restaurant=r,
            menucombo=m,
            menu_rate=menu_rate,
        )
        return redirect(request, 'restaurant/list.html')
