from django.contrib import admin

from .models import Restaurant, MenuList, Rating, MenuCombo

admin.site.register(Restaurant)
admin.site.register(MenuList)
admin.site.register(MenuCombo)
admin.site.register(Rating)


