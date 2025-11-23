from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import PurchaseRequest
from .serializers import PurchaseRequestSerializer
from django.contrib.auth import get_user_model

# Import the AI script we created earlier
from .ai_utils import extract_from_file

User = get_user_model()

class PurchaseRequestViewSet(viewsets.ModelViewSet):
    queryset = PurchaseRequest.objects.all()
    serializer_class = PurchaseRequestSerializer
    # RELAXED SECURITY: Allows the frontend to work without tokens for the demo
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        # 1. SPEEDRUN FIX: Handle User
        # If no user is logged in (Anonymous), assign the first Admin user found.
        user = self.request.user
        if not user.is_authenticated:
            user = User.objects.filter(is_superuser=True).first() or User.objects.first()
        
        # 2. Save the instance to disk first (so the file exists)
        instance = serializer.save(requester=user)

        # 3. Trigger AI Extraction if a file was uploaded
        if instance.proforma_file:
            print(f"--- AI Processing Started for {instance.proforma_file.name} ---")
            try:
                # Call our helper function
                data = extract_from_file(instance.proforma_file)
                
                if data:
                    print(f"AI Extracted Data: {data}")
                    
                    # Logic: Only overwrite amount if the user left it empty
                    # (This allows the AI to "Auto-fill" the price)
                    if not instance.amount and 'amount' in data:
                        instance.amount = data['amount']
                        # We could also extract 'vendor_name' if we added that field to the model
                        instance.save()
                        print("Database updated with AI Amount.")
            except Exception as e:
                print(f"AI Logic Error: {e}")

    @action(detail=True, methods=['patch'])
    def approve(self, request, pk=None):
        purchase_request = self.get_object()
        purchase_request.status = 'APPROVED'
        purchase_request.save()
        return Response({'status': 'Approved', 'id': purchase_request.id})

    @action(detail=True, methods=['patch'])
    def reject(self, request, pk=None):
        purchase_request = self.get_object()
        purchase_request.status = 'REJECTED'
        purchase_request.save()
        return Response({'status': 'Rejected'})