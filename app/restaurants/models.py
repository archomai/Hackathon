from django.db import models


class Restaurant(models.Model):
    name = models.CharField(max_length=200)
    address = models.CharField(max_length=200, blank=True)

    def __str__(self):
        return self.name


class Menu(models.Model):
    menu = models.CharField(max_length=100)
    restaurant = models.ForeignKey(
        'restaurant',
        on_delete=models.CASCADE,
        verbose_name='식당'
    )

    def __str__(self):
        return f'{self.restaurant.name} | {self.menu}'
