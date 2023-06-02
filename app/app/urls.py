from django.urls import path
from .views import *

urlpatterns = [
    path('scrape/', scrape_webpage, name='scrape_webpage'),
    path('submit/', submit_info, name='submit_info'),

    path('success/', success_view, name='success'),
]
