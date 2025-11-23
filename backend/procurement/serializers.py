from rest_framework import serializers
from .models import PurchaseRequest
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'role']

class PurchaseRequestSerializer(serializers.ModelSerializer):
    requester = UserSerializer(read_only=True)
    
    class Meta:
        model = PurchaseRequest
        fields = '__all__'
        read_only_fields = ['status', 'requester', 'generated_po']