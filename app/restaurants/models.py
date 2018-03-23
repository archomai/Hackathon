from django.db import models
from django.db.models import Avg


class Restaurant(models.Model):
    name = models.CharField(max_length=200)
    lat = models.FloatField(blank=True, null=True)
    lng = models.FloatField(blank=True, null=True)
    restaurant_rate = models.DecimalField(max_digits=2, decimal_places=1, blank=True, null=True)

    def __str__(self):
        return self.name

    def avg_restaurant_rate(self):
        ratings = Rating.objects.filter(restaurant=self)
        avg = ratings.aggregate(Avg('menu_rate'))
        return avg['menu_rate__avg']

    class Meta:
        ordering = ['restaurant_rate']


class MenuList(models.Model):
    menu = models.CharField(max_length=100)
    restaurant = models.ForeignKey(
        Restaurant,
        related_name='menulist',
        on_delete=models.CASCADE,
    )

    def __str__(self):
        return f'{self.restaurant.name} | {self.menu}'


class MenuCombo(models.Model):
    menu_combo = models.CharField(max_length=300)
    menu_combo_rate = models.DecimalField(max_digits=2, decimal_places=1, blank=True, null=True)
    restaurant = models.ForeignKey(
        Restaurant,
        related_name='menucombo',
        on_delete=models.CASCADE,
    )

    def __str__(self):
        return f'{self.restaurant.name} | {self.menu_combo}'

    # def avg_menucombo_rate(self):
    #     ratings = Rating.objects.filter(menucombo=self.menucombo)
    #     avg = ratings.aggregate(Avg('menu_rate'))
    #     return avg['menu_rate__avg']


class Rating(models.Model):
    RATING_CHOICES = (
        (1, 1),
        (2, 2),
        (3, 3),
        (4, 4),
        (5, 5),
    )
    menu_rate = models.IntegerField(choices=RATING_CHOICES)
    comment = models.CharField(max_length=500, blank=True)
    menucombo = models.ForeignKey(
        MenuCombo,
        related_name='rating',
        on_delete=models.CASCADE,
    )
    restaurant = models.ForeignKey(
        Restaurant,
        related_name='restaurant',
        on_delete=models.CASCADE,
    )

    def __str__(self):
        return f'{self.restaurant.name} | {self.menucombo.menu_combo} | {self.menu_rate}'

    def save(self, *args, **kwargs):
        ratings = Rating.objects.filter(menucombo=self.menucombo)
        avg = ratings.aggregate(Avg('menu_rate'))
        self.menucombo.menu_combo_rate = avg['menu_rate__avg']
        super(Rating, self).save(*args, **kwargs)
        print('done')
