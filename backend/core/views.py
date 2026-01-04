from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Customer, Stock
from django.db.models import Sum

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
