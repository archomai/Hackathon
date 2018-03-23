from django.contrib import admin

from .models import Restaurant, Menu, Rating

admin.site.register(Restaurant)
admin.site.register(Menu)
admin.site.register(Rating)


