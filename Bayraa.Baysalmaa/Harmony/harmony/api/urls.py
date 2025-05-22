from django.urls import path
from .views import *
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)


urlpatterns = [
    # Artist URLs
     path('register/', RegisterView.as_view(), name='register'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
      # path('api/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),

    path('categories/', CategoryListCreateAPIView.as_view(), name='categories-list-create'),
    path('artists/', ArtistListCreateAPIView.as_view(), name='artist-list-create'),
    path('artists/<int:pk>/', ArtistDetailAPIView.as_view(), name='artist-detail'),

    # Artwork URLs
    path('artworks/', ArtworkListCreateAPIView.as_view(), name='artwork-list-create'),
    path('artworks/<int:pk>/', ArtworkDetailAPIView.as_view(), name='artwork-detail'),

    # TicketCategory URLs
    path('ticket-categories/', TicketCategoryListCreateAPIView.as_view(), name='ticket-category-list-create'),
    path('ticket-categories/<int:pk>/', TicketCategoryDetailAPIView.as_view(), name='ticket-category-detail'),

    # Event URLs
    path('events/', EventListCreateAPIView.as_view(), name='event-list-create'),
    path('events/<int:pk>/', EventDetailAPIView.as_view(), name='event-detail'),

    # EventOrganizer URLs
    path('event-organizers/', EventOrganizerListCreateAPIView.as_view(), name='event-organizer-list-create'),

    # TicketType URLs
    path('ticket-types/', TicketTypeListCreateAPIView.as_view(), name='ticket-type-list-create'),
    path('ticket-types/<int:pk>/', TicketTypeDetailAPIView.as_view(), name='ticket-type-detail'),
     path('ticket-types/', TicketTypeListAPIView.as_view(), name='ticket-type-list'),

    # Reviews URLs
    path('artist-reviews/', ArtistReviewListCreateAPIView.as_view(), name='artist-review-list-create'),
    path('event-reviews/', EventReviewListCreateAPIView.as_view(), name='event-review-list-create'),
    path('generic-reviews/', GenericReviewListCreateAPIView.as_view(), name='generic-review-list-create'),
    path('bookings/', BookingAPIView.as_view(), name='booking-list-create'), # Name reflects potential for List/Create

   
    path('bookings/<int:pk>/', BookingAPIView.as_view(), name='booking-detail-update-delete'), # Name reflects actions
    path('users/me/', UserProfileView.as_view(), name='user-profile'),
    # эсвэл '/api/profile/' гэж ч болно
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    # Хэрэв та BookingListView, BookingDetailAPIView гэсэн тусдаа View-үүдтэй байсан бол:
    # path('bookings/', BookingListView.as_view(), name='booking-list'),
    # path('bookings/<int:pk>/', BookingDetailAPIView.as_view(), name='booking-detail'),
]
