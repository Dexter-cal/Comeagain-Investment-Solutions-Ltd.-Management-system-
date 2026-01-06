from django.db import models


class Customer(models.Model):
    CATEGORY_CHOICES = (
        ('new', 'New'),
        ('regular', 'Regular'),
        ('vip', 'VIP'),
    )

    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    image = models.ImageField(
        upload_to='customer_images/', blank=True, null=True
    )
    phone = models.CharField(max_length=20)
    address = models.TextField()
    category = models.CharField(
        max_length=10, choices=CATEGORY_CHOICES, default='new'
    )

    def __str__(self):
        return self.name


class Message(models.Model):
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Message({self.id})'


class Supplier(models.Model):
    name = models.CharField(max_length=255)
    contact_person = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=20)

    def __str__(self):
        return self.name


class Stock(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    quantity = models.IntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE)

    def __str__(self):
        return self.name
