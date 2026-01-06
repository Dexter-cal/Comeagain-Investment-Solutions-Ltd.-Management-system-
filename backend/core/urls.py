from django.urls import path, include
from rest_framework import routers
from .views import (
    DashboardStatsView, CustomerViewSet, StockViewSet, SupplierViewSet,
    MessageViewSet, LatestMessageView, index, customers, stock
)

router = routers.DefaultRouter()
router.register(r'customers', CustomerViewSet)
router.register(r'stock', StockViewSet)
router.register(r'suppliers', SupplierViewSet)
router.register(r'messages', MessageViewSet)

urlpatterns = [
    path('', index, name='index'),
    path('customers/', customers, name='customers'),
    path('stock/', stock, name='stock'),
    path('api/', include(router.urls)),
    path('api/dashboard-stats/', DashboardStatsView.as_view(),
         name='dashboard-stats'),
    path('api/latest-message/', LatestMessageView.as_view(),
         name='latest-message'),
]
