from django.db import models


class Item(models.Model):
    url = models.CharField(max_length=200)
    item_name = models.AutoField(primary_key=True)
    store = models.CharField(max_length=50)
    price = models.CharField(max_length=50)
    rating = models.IntegerField()
    
    class Meta:
        app_label = 'app'
    
    
