from django.urls import path
from .views import DashboardStatsView, index

urlpatterns = [
    path('', index, name='index'),
    path('api/dashboard-stats/', DashboardStatsView.as_view(), name='dashboard-stats'),
]
