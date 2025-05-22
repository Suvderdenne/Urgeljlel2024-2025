from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics
from rest_framework import status
from .models import CustomUser
from django.shortcuts import get_object_or_404
from rest_framework.permissions import AllowAny
from .serializers import *
from rest_framework.permissions import IsAuthenticated
from django.core.exceptions import PermissionDenied
from django.contrib.auth import get_user_model
class CustomUserListCreateAPIView(APIView):
    def get(self, request, *args, **kwargs):
        users = CustomUser.objects.all()
        serializer = CustomUserSerializer(users, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        serializer = CustomUserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CustomUserDetailAPIView(APIView):
    def get(self, request, pk, *args, **kwargs):
        user = CustomUser.objects.get(pk=pk)
        serializer = CustomUserSerializer(user)
        return Response(serializer.data)

    def put(self, request, pk, *args, **kwargs):
        user = CustomUser.objects.get(pk=pk)
        serializer = CustomUserSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, *args, **kwargs):
        user = CustomUser.objects.get(pk=pk)
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)



class ArtistListCreateAPIView(APIView):
    permission_classes = [IsAuthenticated]  # Add this line to restrict access to authenticated users

    def get(self, request, *args, **kwargs):
        artists = Artist.objects.all()
        serializer = ArtistSerializer(artists, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        serializer = ArtistSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
class ArtistDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]  # Restrict access to authenticated users

    def get(self, request, pk, *args, **kwargs):
        try:
            artist = Artist.objects.get(pk=pk)  # Retrieve artist by ID
            serializer = ArtistSerializer(artist)  # Serialize artist data
            return Response(serializer.data)  # Return serialized data
        except Artist.DoesNotExist:
            return Response({"error": "Artist not found"}, status=status.HTTP_404_NOT_FOUND)  # Handle not found error

    def put(self, request, pk, *args, **kwargs):
        try:
            artist = Artist.objects.get(pk=pk)  # Retrieve artist by ID
            serializer = ArtistSerializer(artist, data=request.data)  # Serialize the data
            if serializer.is_valid():  # Validate the data
                serializer.save()  # Save the updated data
                return Response(serializer.data)  # Return the updated data
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  # Return errors if invalid
        except Artist.DoesNotExist:
            return Response({"error": "Artist not found"}, status=status.HTTP_404_NOT_FOUND)  # Handle not found error

    def delete(self, request, pk, *args, **kwargs):
        try:
            artist = Artist.objects.get(pk=pk)  # Retrieve artist by ID
            artist.delete()  # Delete the artist
            return Response(status=status.HTTP_204_NO_CONTENT)  # Return no content response
        except Artist.DoesNotExist:
            return Response({"error": "Artist not found"}, status=status.HTTP_404_NOT_FOUND)  # Handle not found error
class ArtworkListCreateAPIView(APIView):
    def get(self, request, *args, **kwargs):
        artworks = Artwork.objects.all()
        serializer = ArtworkSerializer(artworks, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        serializer = ArtworkSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ArtworkDetailAPIView(APIView):
    def get(self, request, pk, *args, **kwargs):
        artwork = Artwork.objects.get(pk=pk)
        serializer = ArtworkSerializer(artwork)
        return Response(serializer.data)

    def put(self, request, pk, *args, **kwargs):
        artwork = Artwork.objects.get(pk=pk)
        serializer = ArtworkSerializer(artwork, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, *args, **kwargs):
        artwork = Artwork.objects.get(pk=pk)
        artwork.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class TicketCategoryListCreateAPIView(APIView):
    def get(self, request, *args, **kwargs):
        ticket_categories = TicketCategory.objects.all()
        serializer = TicketCategorySerializer(ticket_categories, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        serializer = TicketCategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TicketCategoryDetailAPIView(APIView):
    def get(self, request, pk, *args, **kwargs):
        ticket_category = TicketCategory.objects.get(pk=pk)
        serializer = TicketCategorySerializer(ticket_category)
        return Response(serializer.data)

    def put(self, request, pk, *args, **kwargs):
        ticket_category = TicketCategory.objects.get(pk=pk)
        serializer = TicketCategorySerializer(ticket_category, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, *args, **kwargs):
        ticket_category = TicketCategory.objects.get(pk=pk)
        ticket_category.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class EventListCreateAPIView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, *args, **kwargs):
        events = Event.objects.all()
        serializer = EventSerializer(events, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        serializer = EventSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class EventDetailAPIView(APIView):
    def get(self, request, pk, *args, **kwargs):
        event = Event.objects.get(pk=pk)
        serializer = EventSerializer(event)
        return Response(serializer.data)

    def put(self, request, pk, *args, **kwargs):
        event = Event.objects.get(pk=pk)
        serializer = EventSerializer(event, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, *args, **kwargs):
        event = Event.objects.get(pk=pk)
        event.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class EventOrganizerListCreateAPIView(APIView):
    def get(self, request, *args, **kwargs):
        organizers = EventOrganizer.objects.all()
        serializer = EventOrganizerSerializer(organizers, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        serializer = EventOrganizerSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ArtistReviewListCreateAPIView(APIView):
    def get(self, request, artist_id, *args, **kwargs):
        reviews = ArtistReview.objects.filter(artist_id=artist_id)
        serializer = ArtistReviewSerializer(reviews, many=True)
        return Response(serializer.data)

    def post(self, request, artist_id, *args, **kwargs):
        serializer = ArtistReviewSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(artist_id=artist_id)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class EventReviewListCreateAPIView(APIView):
    def get(self, request, event_id, *args, **kwargs):
        reviews = EventReview.objects.filter(event_id=event_id)
        serializer = EventReviewSerializer(reviews, many=True)
        return Response(serializer.data)

    def post(self, request, event_id, *args, **kwargs):
        serializer = EventReviewSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(event_id=event_id)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class GenericReviewAPIView(APIView):
    def get(self, request):
        reviews = GenericReview.objects.all()
        serializer = GenericReviewSerializer(reviews, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = GenericReviewSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class TicketTypeListCreateAPIView(APIView):
    def get(self, request):
        ticket_types = TicketType.objects.all()
        serializer = TicketTypeSerializer(ticket_types, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = TicketTypeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TicketTypeListAPIView(APIView):
    serializer_class = TicketTypeSerializer

    def get_queryset(self):
        queryset = TicketType.objects.all()
        event_id = self.request.query_params.get('event')
        if event_id:
            queryset = queryset.filter(event_id=event_id)
        return queryset

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response({"data": serializer.data}, status=status.HTTP_200_OK)
# Retrieve, update, or delete a specific ticket type
class TicketTypeDetailAPIView(APIView):
    def get_object(self, pk):
        return get_object_or_404(TicketType, pk=pk)

    def get(self, request, pk):
        ticket_type = self.get_object(pk)
        serializer = TicketTypeSerializer(ticket_type)
        return Response(serializer.data)

    def put(self, request, pk):
        ticket_type = self.get_object(pk)
        serializer = TicketTypeSerializer(ticket_type, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        ticket_type = self.get_object(pk)
        ticket_type.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class GenericReviewListCreateAPIView(APIView):
    def get(self, request):
        reviews = GenericReview.objects.all()
        serializer = GenericReviewSerializer(reviews, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = GenericReviewSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class CategoryListCreateAPIView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]

    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class RegisterView(APIView):
    permission_classes = [AllowAny]  # ← Энэ заавал байх ёстой

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Амжилттай бүртгэгдлээ"}, status=status.HTTP_201_CREATED)
        print(serializer.errors) 
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
# class BookingAPIView(APIView):
#     """
#     API View for Booking operations (Create, List, Retrieve, Update, Delete).
#     Allows only authenticated users to interact with their own bookings.
#     POST: Create a new booking (/bookings/)
#     GET: Retrieve a single booking by ID (/bookings/{id}/)
#     PUT: Update a booking by ID (full update) (/bookings/{id}/)
#     PATCH: Update a booking by ID (partial update) (/bookings/{id}/)
#     DELETE: Delete a booking by ID (/bookings/{id}/)
#     """
#     permission_classes = [IsAuthenticated] # Ensure user is authenticated

#     def get_object(self, pk):
#         """
#         Helper method to retrieve a booking object by primary key,
#         ensuring the request user owns it, or raises 404/403.
#         """
#         # Try to get the booking object by primary key
#         booking = get_object_or_404(Booking, pk=pk)

#         # Check if the authenticated user is the owner of the booking
#         if booking.user != self.request.user:
#             # If not the owner, raise PermissionDenied (DRF converts to 403 Forbidden)
#             # Or you could raise Http404("Booking not found") to not reveal the booking exists
#              raise PermissionDenied("You do not have permission to access this booking.") # More explicit


#         return booking

#     # Handle POST request (Create Booking) - Same as before
#     def post(self, request, *args, **kwargs):
#         """
#         Create a new Booking.
#         """
#         serializer = BookingSerializer(data=request.data, context={'request': request})

#         if serializer.is_valid():
#             booking = serializer.save() # User is automatically set in serializer's create

#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         else:
#             return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#     # Handle GET request (Retrieve single Booking by ID)
#     def get(self, request, pk):
#         """
#         Retrieve a single Booking instance by primary key (pk).
#         Ensures the user can only retrieve their own booking.
#         """
#         # Use the helper method to get the booking and check ownership
#         booking = self.get_object(pk)

#         # Serialize the booking object
#         serializer = BookingSerializer(booking)

#         # Return the serialized data
#         return Response(serializer.data) # Default status is 200 OK

#     # Handle PUT request (Full Update of a Booking by ID)
#     def put(self, request, pk):
#         """
#         Update a Booking instance by primary key (pk).
#         Ensures the user can only update their own booking.
#         Requires all fields for a full update.
#         """
#         # Use the helper method to get the booking and check ownership
#         booking = self.get_object(pk)

#         # Initialize serializer with the instance to update and the incoming data
#         # Pass context for potential use in serializer update method if needed (less common than create)
#         serializer = BookingSerializer(booking, data=request.data, context={'request': request})

#         # Validate the incoming data
#         if serializer.is_valid():
#             # Save the updated booking instance
#             serializer.save()

#             # Return the updated serialized data
#             return Response(serializer.data) # Default status is 200 OK
#         else:
#             # Return errors if data is invalid
#             return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#     # Handle PATCH request (Partial Update of a Booking by ID)
#     def patch(self, request, pk):
#         """
#         Partially update a Booking instance by primary key (pk).
#         Ensures the user can only partially update their own booking.
#         Only requires fields that need updating.
#         """
#         # Use the helper method to get the booking and check ownership
#         booking = self.get_object(pk)

#         # Initialize serializer with the instance to update and the incoming data
#         # Use partial=True to allow updating only a subset of fields
#         # Pass context if needed
#         serializer = BookingSerializer(booking, data=request.data, partial=True, context={'request': request})

#         # Validate the incoming data
#         if serializer.is_valid():
#             # Save the partially updated booking instance
#             serializer.save()

#             # Return the updated serialized data
#             return Response(serializer.data) # Default status is 200 OK
#         else:
#             # Return errors if data is invalid
#             return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#     # Handle DELETE request (Delete a Booking by ID)
#     def delete(self, request, pk):
#         """
#         Delete a Booking instance by primary key (pk).
#         Ensures the user can only delete their own booking.
#         """
#         # Use the helper method to get the booking and check ownership
#         booking = self.get_object(pk)

#         # Delete the booking instance
#         booking.delete()

#         # Return a success response (typically 204 No Content for successful deletion)
#         return Response(status=status.HTTP_204_NO_CONTENT)

class BookingAPIView(APIView):
    """
    API View for Booking operations (Create, List, Retrieve, Update, Delete).
    Allows only authenticated users to interact with their own bookings.
    POST: Create a new booking (/bookings/)
    GET: Retrieve a list of bookings for the authenticated user (/bookings/)
    GET: Retrieve a single booking by ID (/bookings/{id}/)
    PUT: Update a booking by ID (full update) (/bookings/{id}/)
    PATCH: Update a booking by ID (partial update) (/bookings/{id}/)
    DELETE: Delete a booking by ID (/bookings/{id}/)
    """
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        """
        Helper method to retrieve a booking object by primary key,
        ensuring the request user owns it, or raises 404/403.
        Used for Retrieve, Update, Delete methods.
        """
        try:
            # Attempt to get the booking by PK and filter by the requesting user
            booking = Booking.objects.get(pk=pk, user=self.request.user)
            return booking
        except Booking.DoesNotExist:
            # If not found for this user/PK combination, raise 404
            raise status.HTTP_404_NOT_FOUND # Use DRF status code for Response

    # Handle POST request (Create Booking) - Keep as is
    def post(self, request, *args, **kwargs):
        """
        Create a new Booking.
        """
        serializer = BookingSerializer(data=request.data, context={'request': request})

        if serializer.is_valid():
            booking = serializer.save() # User is automatically set in serializer's create

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Handle GET request (Retrieve single Booking by ID) - Keep as is
    # This method needs a 'pk' parameter in the URLconf
    def get(self, request, pk=None): # Make pk optional to handle both list and detail
         """
         Retrieve a list of bookings for the authenticated user (if no pk)
         or a single Booking instance by primary key (if pk is provided).
         """
         if pk:
             # Retrieve single booking by ID
             booking = self.get_object(pk) # This checks ownership
             serializer = BookingSerializer(booking)
             return Response(serializer.data)
         else:
             # Retrieve a list of bookings for the authenticated user
             # Filter bookings to only include those belonging to the current user
             my_bookings = Booking.objects.filter(user=request.user)

             # Serialize the queryset (list of booking objects)
             # Use many=True because we are serializing a list of objects
             serializer = BookingSerializer(my_bookings, many=True)

             # Return the serialized list data
             return Response(serializer.data) # Default status is 200 OK


    # Handle PUT request (Full Update of a Booking by ID) - Keep as is, uses get_object(pk)
    def put(self, request, pk):
        """
        Update a Booking instance by primary key (pk).
        Ensures the user can only update their own booking.
        Requires all fields for a full update.
        """
        booking = self.get_object(pk) # This checks ownership
        serializer = BookingSerializer(booking, data=request.data, context={'request': request})

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Handle PATCH request (Partial Update of a Booking by ID) - Keep as is, uses get_object(pk)
    def patch(self, request, pk):
        """
        Partially update a Booking instance by primary key (pk).
        Ensures the user can only partially update their own booking.
        """
        booking = self.get_object(pk) # This checks ownership
        serializer = BookingSerializer(booking, data=request.data, partial=True, context={'request': request})

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    # Handle DELETE request (Delete a Booking by ID) - Keep as is, uses get_object(pk)
    def delete(self, request, pk):
        """
        Delete a Booking instance by primary key (pk).
        Ensures the user can only delete their own booking.
        """
        booking = self.get_object(pk) # This checks ownership
        booking.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# urls.py remains the same, the single APIView handles both paths /bookings/ and /bookings/{id}/
# thanks to the optional pk parameter in the get method and Django URL matching.

from .serializers import UserProfileSerializer # Дээр үүсгэсэн Serializer-ээ импортлоно

User = get_user_model() # settings.py дахь AUTH_USER_MODEL-г авах

class UserProfileView(generics.RetrieveUpdateAPIView):
    """
    API View to retrieve and update the authenticated user's profile.
    Uses the CustomUser model.
    GET: Retrieve authenticated user's details.
    PATCH/PUT: Update authenticated user's details.
    Endpoint: /api/users/me/ or /api/profile/
    """
    serializer_class = UserProfileSerializer # CustomUser-тэй ажиллах Serializer
    permission_classes = [IsAuthenticated] # Зөвхөн нэвтэрсэн хэрэглэгч хандана

    # get_object method-г override хийж зөвхөн request хийж буй хэрэглэгчийг буцаана.
    # queryset нь RetrieveUpdateAPIView-д заавал байх ёстой тул placeholder маягаар орууллаа
    # Гэхдээ манай get_object method үүнийг үл тооцно.
    queryset = User.objects.all()

    def get_object(self):
        """
        Return the authenticated user instance (CustomUser).
        """
        # RetrieveUpdateAPIView нь update хийхдээ get_object-өөр олдсон обьектийг шинэчилдэг.
        return self.request.user
