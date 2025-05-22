# from django.urls import path, include
# from rest_framework.routers import DefaultRouter
# from rest_framework_simplejwt.views import (
#     TokenObtainPairView,
#     TokenRefreshView,
# )

# from .views import (
#     UserViewSet, ArtistViewSet, EventViewSet, ArtworkViewSet, CategoryViewSet,TicketTypeViewSet,
#     CustomUserView, CreateUserView, GetUserView, UpdateUserView, DeleteUserView,
#     CategoryView, ArtistListView, CreateArtistView, UpdateArtistView, DeleteArtistView,
#     ArtworkListView, CreateArtworkView, UpdateArtworkView, DeleteArtworkView,
#     EventListView, CreateEventView, EventDetailView, DeleteEventView,
#     LoginView, LogoutView,
#     PasswordResetRequestView, PasswordResetConfirmView, PasswordChangeView,
# )

# # Router setup
# router = DefaultRouter()
# router.register(r'users', UserViewSet)
# router.register(r'artists', ArtistViewSet)
# router.register(r'events', EventViewSet)
# router.register(r'artworks', ArtworkViewSet)
# router.register(r'ticket-types', TicketTypeViewSet)
# urlpatterns = [
#     # Router endpoints
#     path('', include(router.urls)),

#     # JWT Auth
#     path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
#     path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

#     # Login/Logout (custom, optional)
#     path('login/', LoginView.as_view(), name='custom-login'),
#     path('logout/', LogoutView.as_view(), name='custom-logout'),

#     # Password Management
#      path('login/', LoginView.as_view(), name='login'),
#     path('logout/', LogoutView.as_view(), name='logout'),
#     path('password-reset/', PasswordResetRequestView.as_view(), name='password-reset'),
#     path('password-reset-confirm/<uidb64>/<token>/', PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
#     path('password-change/', PasswordChangeView.as_view(), name='password-change'),


#     # User Profile Endpoints (non-ViewSet)
#     path('register/', CreateUserView.as_view(), name='user-register'),
#     path('me/', GetUserView.as_view(), name='get-current-user'),
#     path('me/update/', UpdateUserView.as_view(), name='update-current-user'),
#     path('me/delete/', DeleteUserView.as_view(), name='delete-current-user'),

#     # Extra (non-ViewSet) endpoints if needed
#     path('users/<int:user_id>/', CustomUserView.as_view(), name='user-detail'),
#     path('categories/<int:category_id>/', CategoryView.as_view(), name='category-detail'),

#     path('artists/create/', CreateArtistView.as_view(), name='artist-create'),
#     path('artists/<int:artist_id>/update/', UpdateArtistView.as_view(), name='artist-update'),
#     path('artists/<int:artist_id>/delete/', DeleteArtistView.as_view(), name='artist-delete'),

#     path('artworks/create/', CreateArtworkView.as_view(), name='artwork-create'),
#     path('artworks/<int:artwork_id>/update/', UpdateArtworkView.as_view(), name='artwork-update'),
#     path('artworks/<int:artwork_id>/delete/', DeleteArtworkView.as_view(), name='artwork-delete'),

#     path('events/create/', CreateEventView.as_view(), name='event-create'),
#     path('events/<int:event_id>/', EventDetailView.as_view(), name='event-detail'),
#     path('events/<int:event_id>/delete/', DeleteEventView.as_view(), name='event-delete'),
# ]

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from .views import (
    UserViewSet, ArtistViewSet, EventViewSet, ArtworkViewSet,
    CategoryViewSet, TicketTypeViewSet,

    # Custom authentication views
    LoginView, LogoutView,
    PasswordResetRequestView, PasswordResetConfirmView, PasswordChangeView,

    # Custom user views
    CreateUserView, GetUserView, UpdateUserView, DeleteUserView,

    # Optional: individual views if needed
    CustomUserView, CategoryView,
)

# Router setup for ViewSets
router = DefaultRouter()
router.register(r'CustomUser', UserViewSet)
router.register(r'artists', ArtistViewSet)
router.register(r'events', EventViewSet)
router.register(r'artworks', ArtworkViewSet)
router.register(r'ticket-types', TicketTypeViewSet)
router.register(r'categories', CategoryViewSet)

urlpatterns = [
    # ViewSet URLs
    path('', include(router.urls)),

    # JWT token endpoints
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Custom login/logout
    path('login/', LoginView.as_view(), name='custom-login'),
    path('logout/', LogoutView.as_view(), name='custom-logout'),

    # Password reset/change
    path('password-reset/', PasswordResetRequestView.as_view(), name='password-reset'),
    path('password-reset-confirm/<uidb64>/<token>/', PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
    path('password-change/', PasswordChangeView.as_view(), name='password-change'),

    # Profile management
    path('register/', CreateUserView.as_view(), name='user-register'),
    path('me/', GetUserView.as_view(), name='get-current-user'),
    path('me/update/', UpdateUserView.as_view(), name='update-current-user'),
    path('me/delete/', DeleteUserView.as_view(), name='delete-current-user'),

    # Optional detailed views (if not handled by ViewSets)
    path('users/<int:user_id>/', CustomUserView.as_view(), name='user-detail'),
    path('categories/<int:category_id>/', CategoryView.as_view(), name='category-detail'),
]
