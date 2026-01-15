from rest_framework import serializers
from .models import PickupRequest, UserLogin


class UserLoginSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserLogin
        fields = ['email', 'password']


class PickupSerializer(serializers.ModelSerializer):
    class Meta:
        model = PickupRequest
        fields = '__all__'
