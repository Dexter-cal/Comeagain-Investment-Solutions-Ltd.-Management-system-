from django.shortcuts import render
from rest_framework import viewsets, filters
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Customer, Stock
from .serializers import CustomerSerializer
from django.db.models import Sum

class CustomerViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows customers to be viewed or edited.
    """
    queryset = Customer.objects.all().order_by('name')
    serializer_class = CustomerSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'email', 'phone']

class DashboardStatsView(APIView):
    """
    API view to get dashboard statistics.
    """
    def get(self, request, format=None):
        customer_count = Customer.objects.count()
        stock_levels = Stock.objects.aggregate(Sum('quantity'))['quantity__sum'] or 0

        data = {
            'total_customers': customer_count,
            'stock_levels': stock_levels,
            'sales_summary': 0,  # Placeholder for now
            'employee_count': 0, # Placeholder for now
        }
        return Response(data)

def index(request):
    return render(request, 'index.html')

def customers(request):
    return render(request, 'customers.html')
