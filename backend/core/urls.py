from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from procurement.views import PurchaseRequestViewSet
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions
from users.views import UserViewSet

# Swagger Documentation Setup
schema_view = get_schema_view(
   openapi.Info(
      title="Procurement API",
      default_version='v1',
      description="API for IST Technical Assessment",
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
)

# Router Setup
router = DefaultRouter()
router.register(r'requests', PurchaseRequestViewSet)
router.register(r'users', UserViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    # Login endpoints provided by DRF
    path('api-auth/', include('rest_framework.urls')),
    # Swagger URLs
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
]