from django.contrib import admin
from .models import PickupRequest, UserLogin


@admin.register(UserLogin)
class UserLoginAdmin(admin.ModelAdmin):
    list_display = ('email', 'created_at')
    search_fields = ('email',)
    list_filter = ('created_at',)
    readonly_fields = ('created_at',)


@admin.register(PickupRequest)
class PickupRequestAdmin(admin.ModelAdmin):
    list_display = ('address', 'pincode', 'state', 'pickup_date', 'total_points', 'created_at')
    search_fields = ('address', 'pincode', 'state')
    list_filter = ('pickup_date', 'created_at', 'state')
    readonly_fields = ('total_points', 'created_at')
