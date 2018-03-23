from django.db import models


class Restaurant(models.Model):
    name = models.CharField(max_length=200)
    address = models.CharField(max_length=200, blank=True)
    restaurant_rate = models.DecimalField(max_digits=2, decimal_places=1, blank=True, null=True)

    def __str__(self):
        return self.name

    def avg_menu_rate(self, restaurant_pk):
        menu_rates = Rating.objects.all()


class Menu(models.Model):
    menu = models.CharField(max_length=100)
    restaurant = models.ForeignKey(
        'restaurant',
        on_delete=models.CASCADE,
        verbose_name='식당'
    )

    def __str__(self):
        return f'{self.restaurant.name} | {self.menu}'


class Rating(models.Model):
    RATING_CHOICES = (
        (1, 1),
        (2, 2),
        (3, 3),
        (4, 4),
        (5, 5),
    )
    menu_rate = models.DecimalField(choices=RATING_CHOICES, max_digits=2, decimal_places=1)
    menu = models.ForeignKey(
        'menu',
        on_delete=models.CASCADE,
    )

    def __str__(self):
        return f'{self.menu.menu} | {self.menu_rate}'
