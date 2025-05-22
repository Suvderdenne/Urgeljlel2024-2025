from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('accounts.urls')),
]

# For Reset Password Implementation - Additional code needed in production
"""
# accounts/models.py - Add this model
class PasswordResetToken(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    token = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    used = models.BooleanField(default=False)
    
    def is_valid(self):
        # Token valid for 24 hours
        from django.utils import timezone
        return not self.used and (timezone.now() - self.created_at).total_seconds() < 86400
"""

# To handle actual password reset (complete implementation)
"""
# accounts/views.py - Add these views
class PasswordResetConfirmView(APIView):
    def post(self, request):
        token = request.data.get('token')
        new_password = request.data.get('new_password')
        
        if not token or not new_password:
            return Response({'error': 'Token and new password are required'}, 
                            status=status.HTTP_400_BAD_REQUEST)
        
        try:
            reset_token = PasswordResetToken.objects.get(token=token, used=False)
            if not reset_token.is_valid():
                return Response({'error': 'Token has expired'}, 
                                status=status.HTTP_400_BAD_REQUEST)
            
            user = reset_token.user
            user.set_password(new_password)
            user.save()
            
            # Mark token as used
            reset_token.used = True
            reset_token.save()
            
            return Response({'message': 'Password has been reset successfully'})
            
        except PasswordResetToken.DoesNotExist:
            return Response({'error': 'Invalid token'}, 
                            status=status.HTTP_400_BAD_REQUEST)
"""

# SMS Implementation (if needed)
"""
# You would use a third-party SMS service like Twilio
def send_sms(phone_number, message):
    # Example with Twilio
    from twilio.rest import Client
    
    account_sid = settings.TWILIO_ACCOUNT_SID
    auth_token = settings.TWILIO_AUTH_TOKEN
    
    client = Client(account_sid, auth_token)
    
    message = client.messages.create(
        body=message,
        from_=settings.TWILIO_PHONE_NUMBER,
        to=phone_number
    )
    
    return message.sid
"""