from django.contrib import admin
from .models import Customer, Supplier, Stock

admin.site.register(Customer)
admin.site.register(Supplier)
admin.site.register(Stock)
