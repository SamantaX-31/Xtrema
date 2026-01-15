from django.db import models


class UserLogin(models.Model):
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.email


class PickupRequest(models.Model):
    address = models.TextField()
    pincode = models.CharField(max_length=10)
    state = models.CharField(max_length=100, default="Not Specified")
    landmark = models.CharField(max_length=255, default="Not Specified")
    pickup_date = models.DateField()

    plastic_kg = models.FloatField(default=0)
    metal_kg = models.FloatField(default=0)
    glass_kg = models.FloatField(default=0)
    wood_kg = models.FloatField(default=0)
    trash_kg = models.FloatField(default=0)

    total_points = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.address} - {self.pincode}"
