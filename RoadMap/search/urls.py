from django.urls import path
from . import views

urlpatterns = [
    path('save-search/', views.save_search_query, name='save_search_query'),
    path('search-history/', views.get_search_history, name='search_history'),
]