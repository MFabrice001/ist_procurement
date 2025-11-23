from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .serializers import UserProfileSerializer

User = get_user_model()

class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.AllowAny] # Relaxed for demo

    @action(detail=False, methods=['get'])
    def me(self, request):
        # In a real app with tokens, we use request.user
        # For this demo speedrun, we return the first superuser (Admin)
        user = request.user
        if not user.is_authenticated:
            user = User.objects.filter(is_superuser=True).first()
        
        serializer = self.get_serializer(user)
        return Response(serializer.data)