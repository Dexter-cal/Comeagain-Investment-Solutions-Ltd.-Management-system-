from django.urls import path, include
from rest_framework import routers
from .views import DashboardStatsView, CustomerViewSet, index, customers

router = routers.DefaultRouter()
router.register(r'customers', CustomerViewSet)

urlpatterns = [
    path('', index, name='index'),
    path('customers/', customers, name='customers'),
    path('api/', include(router.urls)),
    path('api/dashboard-stats/', DashboardStatsView.as_view(), name='dashboard-stats'),
]
