# # # users/views.py
# # from rest_framework import generics
# # from rest_framework.views import APIView
# # from rest_framework.response import Response
# # from rest_framework import status
# # from rest_framework.authtoken.models import Token
# # from .models import CustomUser, Artist, Event, Artwork,Category,EventOrganizer,EventDetail,TicketType,TicketCategory
# # from .serializers import  LoginSerializer, ArtistSerializer, EventSerializer, ArtworkSerializer,CategorySerializer,EventOrganizerSerializer,EventDetailSerializer,TicketTypeSerializer,TicketCategorySerializer,UserRegisterSerializer,ArtistRegisterSerializer
# # from rest_framework.exceptions import ValidationError
# # from rest_framework_simplejwt.tokens import RefreshToken
# # from django.contrib.auth import authenticate

# # def get_tokens_for_user(user):
# #     refresh = RefreshToken.for_user(user)
# #     return {
# #         'refresh': str(refresh),
# #         'access': str(refresh.access_token),
# #     }
# # class LoginView(APIView):
# #     def post(self, request):
# #         serializer = LoginSerializer(data=request.data)
# #         if serializer.is_valid():
# #             user = serializer.validated_data
# #             token, created = Token.objects.get_or_create(user=user)
# #             return Response({
# #                 "token": token.key,
# #                 "username": user.username
# #             })
# #         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# # # class RegisterView(generics.CreateAPIView):
# # #     queryset = CustomUser.objects.all()
# # #     serializer_class = RegisterSerializer

# # # class UserRegisterView(APIView):
# # #     def post(self, request):
# # #         serializer = UserRegisterSerializer(data=request.data)
# # #         if serializer.is_valid():
# # #             user = serializer.save()
# # #             return Response({"message": "User registered successfully"})
# # #         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# # # # Артист бүртгэл
# # # class ArtistRegisterView(APIView):
# # #     def post(self, request):
# # #         serializer = ArtistRegisterSerializer(data=request.data)
# # #         if serializer.is_valid():
# # #             user = serializer.save()
# # #             return Response({"message": "Artist registered successfully"})
# # #         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# # # # Хэрэглэгч логин
# # # class UserLoginView(APIView):
# # #     def post(self, request):
# # #         serializer = UserLoginSerializer(data=request.data)
# # #         if serializer.is_valid():
# # #             return Response({"message": "User logged in"})
# # #         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# # # # Артист логин
# # # class ArtistLoginView(APIView):
# # #     def post(self, request):
# # #         serializer = ArtistLoginSerializer(data=request.data)
# # #         if serializer.is_valid():
# # #             return Response({"message": "Artist logged in"})
# # #         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
# # class UserRegisterView(APIView):
# #     def post(self, request):
# #         serializer = UserRegisterSerializer(data=request.data)
# #         if serializer.is_valid():
# #             user = serializer.save()
# #             return Response(get_tokens_for_user(user), status=status.HTTP_201_CREATED)
# #         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# # class ArtistRegisterView(APIView):
# #     def post(self, request):
# #         serializer = ArtistRegisterSerializer(data=request.data)
# #         if serializer.is_valid():
# #             user = serializer.save()
# #             return Response(get_tokens_for_user(user), status=status.HTTP_201_CREATED)
# #         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# # class UserLoginView(APIView):
# #     def post(self, request):
# #         serializer = LoginSerializer(data=request.data)
# #         if serializer.is_valid():
# #             user = authenticate(email=serializer.validated_data['email'],
# #                                 password=serializer.validated_data['password'])
# #             if user and not user.is_artist:
# #                 return Response(get_tokens_for_user(user))
# #             return Response({'error': 'Invalid credentials or not a user'}, status=401)
# #         return Response(serializer.errors, status=400)

# # class ArtistLoginView(APIView):
# #     def post(self, request):
# #         serializer = LoginSerializer(data=request.data)
# #         if serializer.is_valid():
# #             user = authenticate(email=serializer.validated_data['email'],
# #                                 password=serializer.validated_data['password'])
# #             if user and user.is_artist:
# #                 return Response(get_tokens_for_user(user))
# #             return Response({'error': 'Invalid credentials or not an artist'}, status=401)
# #         return Response(serializer.errors, status=400)
# # class ArtistList(APIView):
# #     """
# #     Уран бүтээлчдийн жагсаалтыг авах API.
# #     """
# #     def get(self, request):
# #         artists = Artist.objects.all()
# #         serializer = ArtistSerializer(artists, many=True)
# #         return Response(serializer.data)

# #     def post(self, request):
# #         serializer = ArtistSerializer(data=request.data)
# #         if serializer.is_valid():
# #             serializer.save()
# #             return Response(serializer.data, status=status.HTTP_201_CREATED)
# #         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
# # class ArtistCreateView(APIView):
# #     def post(self, request):
# #         print("Request Data:", request.data)  # Log the data to see the exact structure
# #         serializer = ArtistSerializer(data=request.data)
# #         if serializer.is_valid():
# #             serializer.save()
# #             return Response(serializer.data, status=status.HTTP_201_CREATED)
# #         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




# # class ArtistDetail(APIView):
# #     """
# #     Тухайн уран бүтээлчийн дэлгэрэнгүй мэдээллийг авах, засварлах.
# #     """
# #     def get_object(self, pk):
# #         return Artist.objects.filter(pk=pk).first()

# #     def get(self, request, pk):
# #         artist = self.get_object(pk)
# #         if artist is None:
# #             return Response({'detail': 'Уран бүтээлч олдсонгүй.'}, status=status.HTTP_404_NOT_FOUND)
# #         serializer = ArtistSerializer(artist)
# #         return Response(serializer.data)

# #     def put(self, request, pk):
# #         artist = self.get_object(pk)
# #         if artist is None:
# #             return Response({'detail': 'Уран бүтээлч олдсонгүй.'}, status=status.HTTP_404_NOT_FOUND)
# #         serializer = ArtistSerializer(artist, data=request.data)
# #         if serializer.is_valid():
# #             serializer.save()
# #             return Response(serializer.data)
# #         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# #     def delete(self, request, pk):
# #         artist = self.get_object(pk)
# #         if artist is None:
# #             return Response({'detail': 'Уран бүтээлч олдсонгүй.'}, status=status.HTTP_404_NOT_FOUND)
# #         artist.delete()
# #         return Response(status=status.HTTP_204_NO_CONTENT)

# # class ArtworkList(APIView):
# #     """
# #     Бүх уран бүтээлийн жагсаалтыг авах, шинэ бүтээл нэмэх API.
# #     """
# #     def get(self, request):
# #         artist_id = request.query_params.get("artist")
# #         artworks = Artwork.objects.all()

# #         if artist_id:
# #             artworks = artworks.filter(artist_id=artist_id)

# #         serializer = ArtworkSerializer(artworks, many=True)
# #         return Response(serializer.data)

# #     def post(self, request):
# #         serializer = ArtworkSerializer(data=request.data)
# #         if serializer.is_valid():
# #             serializer.save()
# #             return Response(serializer.data, status=status.HTTP_201_CREATED)
# #         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
# # class ArtworkDetail(APIView):
# #     """
# #     Тухайн уран бүтээлийн дэлгэрэнгүй мэдээллийг авах, засварлах.
# #     """
# #     def get_object(self, pk):
# #         return Artwork.objects.filter(pk=pk).first()

# #     def get(self, request, pk):
# #         artwork = self.get_object(pk)
# #         if artwork is None:
# #             return Response({'detail': 'Бүтээл олдсонгүй.'}, status=status.HTTP_404_NOT_FOUND)
# #         serializer = ArtworkSerializer(artwork)
# #         return Response(serializer.data)

# #     def put(self, request, pk):
# #         artwork = self.get_object(pk)
# #         if artwork is None:
# #             return Response({'detail': 'Бүтээл олдсонгүй.'}, status=status.HTTP_404_NOT_FOUND)
# #         serializer = ArtworkSerializer(artwork, data=request.data)
# #         if serializer.is_valid():
# #             serializer.save()
# #             return Response(serializer.data)
# #         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# #     def delete(self, request, pk):
# #         artwork = self.get_object(pk)
# #         if artwork is None:
# #             return Response({'detail': 'Бүтээл олдсонгүй.'}, status=status.HTTP_404_NOT_FOUND)
# #         artwork.delete()
# #         return Response(status=status.HTTP_204_NO_CONTENT)

# # # Event APIView
# # class EventListCreateAPIView(APIView):
# #     def get(self, request):
# #         events = Event.objects.all()
# #         serializer = EventSerializer(events, many=True)
# #         return Response(serializer.data)

# #     def post(self, request):
# #         serializer = EventSerializer(data=request.data)
# #         if serializer.is_valid():
# #             serializer.save()
# #             return Response(serializer.data, status=status.HTTP_201_CREATED)
# #         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# # class EventCreateView(APIView):
# #     def post(self, request, format=None):
# #         serializer = EventSerializer(data=request.data)
# #         if serializer.is_valid():
# #             serializer.save()
# #             return Response(serializer.data, status=status.HTTP_201_CREATED)
# #         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
# # class EventRetrieveUpdateDestroyAPIView(APIView):
# #     def get(self, request, pk):
# #         event = Event.objects.get(pk=pk)
# #         serializer = EventSerializer(event)
# #         return Response(serializer.data)

# #     def put(self, request, pk):
# #         event = Event.objects.get(pk=pk)
# #         serializer = EventSerializer(event, data=request.data)
# #         if serializer.is_valid():
# #             serializer.save()
# #             return Response(serializer.data)
# #         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# #     def delete(self, request, pk):
# #         event = Event.objects.get(pk=pk)
# #         event.delete()
# #         return Response(status=status.HTTP_204_NO_CONTENT)


# # # EventOrganizer APIView
# # class EventOrganizerListCreateAPIView(APIView):
# #     def get(self, request):
# #         organizers = EventOrganizer.objects.all()
# #         serializer = EventOrganizerSerializer(organizers, many=True)
# #         return Response(serializer.data)

# #     def post(self, request):
# #         serializer = EventOrganizerSerializer(data=request.data)
# #         if serializer.is_valid():
# #             serializer.save()
# #             return Response(serializer.data, status=status.HTTP_201_CREATED)
# #         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# # class EventOrganizerRetrieveUpdateDestroyAPIView(APIView):
# #     def get(self, request, pk):
# #         organizer = EventOrganizer.objects.get(pk=pk)
# #         serializer = EventOrganizerSerializer(organizer)
# #         return Response(serializer.data)

# #     def put(self, request, pk):
# #         organizer = EventOrganizer.objects.get(pk=pk)
# #         serializer = EventOrganizerSerializer(organizer, data=request.data)
# #         if serializer.is_valid():
# #             serializer.save()
# #             return Response(serializer.data)
# #         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# #     def delete(self, request, pk):
# #         organizer = EventOrganizer.objects.get(pk=pk)
# #         organizer.delete()
# #         return Response(status=status.HTTP_204_NO_CONTENT)


# # # EventDetail APIView
# # class EventDetailListCreateAPIView(APIView):
# #     def get(self, request):
# #         event = request.query_params.get('event', None)
# #         if event:
# #             event_details = EventDetail.objects.filter(event=event)
# #         else:
# #             event_details = EventDetail.objects.all()
# #         serializer = EventDetailSerializer(event_details, many=True)
# #         return Response(serializer.data)

# #     def post(self, request):
# #         serializer = EventDetailSerializer(data=request.data)
# #         if serializer.is_valid():
# #             serializer.save()
# #             return Response(serializer.data, status=status.HTTP_201_CREATED)
# #         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# # class EventDetailRetrieveUpdateDestroyAPIView(APIView):
# #     def get(self, request, pk):
# #         event_detail = EventDetail.objects.get(pk=pk)
# #         serializer = EventDetailSerializer(event_detail)
# #         return Response(serializer.data)

# #     def put(self, request, pk):
# #         event_detail = EventDetail.objects.get(pk=pk)
# #         serializer = EventDetailSerializer(event_detail, data=request.data)
# #         if serializer.is_valid():
# #             serializer.save()
# #             return Response(serializer.data)
# #         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# #     def delete(self, request, pk):
# #         event_detail = EventDetail.objects.get(pk=pk)
# #         event_detail.delete()
# #         return Response(status=status.HTTP_204_NO_CONTENT)
# # class CategoryList(APIView):
# #     """
# #     Бүх ангиллын жагсаалтыг авах.
# #     """
# #     def get(self, request):
# #         categories = Category.objects.all()
# #         serializer = CategorySerializer(categories, many=True)
# #         return Response(serializer.data)

# #     def post(self, request):
# #         serializer = CategorySerializer(data=request.data)
# #         if serializer.is_valid():
# #             serializer.save()
# #             return Response(serializer.data, status=status.HTTP_201_CREATED)
# #         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# # class CategoryDetail(APIView):
# #     """
# #     Тухайн ангиллын дэлгэрэнгүй мэдээллийг авах, засварлах.
# #     """
# #     def get_object(self, pk):
# #         return Category.objects.filter(pk=pk).first()

# #     def get(self, request, pk):
# #         category = self.get_object(pk)
# #         if category is None:
# #             return Response({'detail': 'Ангилал олдсонгүй.'}, status=status.HTTP_404_NOT_FOUND)
# #         serializer = CategorySerializer(category)
# #         return Response(serializer.data)

# #     def put(self, request, pk):
# #         category = self.get_object(pk)
# #         if category is None:
# #             return Response({'detail': 'Ангилал олдсонгүй.'}, status=status.HTTP_404_NOT_FOUND)
# #         serializer = CategorySerializer(category, data=request.data)
# #         if serializer.is_valid():
# #             serializer.save()
# #             return Response(serializer.data)
# #         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# #     def delete(self, request, pk):
# #         category = self.get_object(pk)
# #         if category is None:
# #             return Response({'detail': 'Ангилал олдсонгүй.'}, status=status.HTTP_404_NOT_FOUND)
# #         category.delete()
# #         return Response(status=status.HTTP_204_NO_CONTENT)
    
# # # TicketType APIView - Improved
# # class TicketTypeAPIView(APIView):
# #     """
# #     API for listing and creating ticket types.
# #     """
# #     def get(self, request):
# #         """
# #         Get a list of all ticket types.
# #         """
# #         try:
# #             ticket_types = TicketType.objects.all()
# #             serializer = TicketTypeSerializer(ticket_types, many=True)
# #             return Response({
# #                 "message": "Ticket types retrieved successfully",
# #                 "data": serializer.data
# #             }, status=status.HTTP_200_OK)
# #         except Exception as e:
# #             return Response({
# #                 "detail": f"Error retrieving ticket types: {str(e)}"
# #             }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# #     def post(self, request):
# #         """
# #         Create a new ticket type.
# #         """
# #         serializer = TicketTypeSerializer(data=request.data)

# #         if serializer.is_valid():
# #             try:
# #                 ticket_type = serializer.save()
# #                 return Response({
# #                     "message": "Ticket type created successfully",
# #                     "data": TicketTypeSerializer(ticket_type).data
# #                 }, status=status.HTTP_201_CREATED)
# #             except Exception as e:
# #                 return Response({
# #                     "detail": f"Error creating ticket type: {str(e)}"
# #                 }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# #         return Response({
# #             "detail": "Validation failed",
# #             "errors": serializer.errors
# #         }, status=status.HTTP_400_BAD_REQUEST)

# # class TicketTypeDetailAPIView(APIView):
# #     """
# #     Retrieve, update, or delete a ticket type by ID.
# #     """
# #     def get(self, request, pk):
# #         try:
# #             ticket_type = TicketType.objects.get(pk=pk)
# #             serializer = TicketTypeSerializer(ticket_type)
# #             return Response({
# #                 "message": "Ticket type retrieved successfully",
# #                 "data": serializer.data
# #             }, status=status.HTTP_200_OK)
# #         except TicketType.DoesNotExist:
# #             return Response({"detail": "Ticket type not found"}, status=status.HTTP_404_NOT_FOUND)

# #     def put(self, request, pk):
# #         try:
# #             ticket_type = TicketType.objects.get(pk=pk)
# #             serializer = TicketTypeSerializer(ticket_type, data=request.data)
# #             if serializer.is_valid():
# #                 serializer.save()
# #                 return Response({"message": "Updated successfully", "data": serializer.data}, status=200)
# #             return Response(serializer.errors, status=400)
# #         except TicketType.DoesNotExist:
# #             return Response({"detail": "Ticket type not found"}, status=404)

# #     def delete(self, request, pk):
# #         try:
# #             ticket_type = TicketType.objects.get(pk=pk)
# #             ticket_type.delete()
# #             return Response({"message": "Deleted successfully"}, status=204)
# #         except TicketType.DoesNotExist:
# #             return Response({"detail": "Ticket type not found"}, status=404)

# # class TicketTypeByCategoryAPIView(APIView):
# #     """
# #     API for listing ticket types by category ID.
# #     """
# #     def get(self, request, category_id):
# #         ticket_types = TicketType.objects.filter(category__id=category_id)
# #         serializer = TicketTypeSerializer(ticket_types, many=True)
# #         return Response({
# #             "message": "Ticket types filtered by category",
# #             "data": serializer.data
# #         }, status=status.HTTP_200_OK)

# # class TicketCategoryList(APIView):
# #     """
# #     API to list all ticket categories.
# #     """
# #     def get(self, request):
# #         ticket_categories = TicketCategory.objects.all()
# #         serializer = TicketCategorySerializer(ticket_categories, many=True)
# #         return Response({
# #             "message": "Ticket categories retrieved successfully",
# #             "data": serializer.data
# #         }, status=status.HTTP_200_OK)


# from rest_framework import generics, permissions, filters
# from django_filters.rest_framework import DjangoFilterBackend
# from .models import *
# from .serializers import *

# # 🖼️ Зөвхөн өөрийн Artwork-уудыг авах
# class MyArtworkListCreateAPIView(generics.ListCreateAPIView):
#     serializer_class = ArtworkSerializer
#     permission_classes = [permissions.IsAuthenticated]

#     def get_queryset(self):
#         # Зөвхөн өөрийн уран бүтээлчийн artwork-уудыг авах
#         return Artwork.objects.filter(artist__customuser=self.request.user)

#     def perform_create(self, serializer):
#         # Зөвхөн хэрэглэгчийн уран бүтээлчээр хадгалах
#         serializer.save(artist=self.request.user.artist)

# # 🖼️ Нийт Artwork-ууд (filter, search)
# class ArtworkListCreateAPIView(generics.ListCreateAPIView):
#     queryset = Artwork.objects.all()
#     serializer_class = ArtworkSerializer
#     filter_backends = [DjangoFilterBackend, filters.SearchFilter]
#     filterset_fields = ['artist__id', 'artist__name', 'price']
#     search_fields = ['title', 'description', 'artist__name', 'artist__bio']

# # 📅 Нийт Event-ууд (status-р шүүх, хайлт)
# class EventListCreateAPIView(generics.ListCreateAPIView):
#     queryset = Event.objects.all()
#     serializer_class = EventSerializer
#     filter_backends = [DjangoFilterBackend, filters.SearchFilter]
#     filterset_fields = ['status', 'category']
#     search_fields = ['title', 'description', 'location']

# # 🌟 Зөвхөн өөрийн Event Review-ууд
# class MyEventReviewsAPIView(generics.ListAPIView):
#     serializer_class = EventReviewSerializer
#     permission_classes = [permissions.IsAuthenticated]

#     def get_queryset(self):
#         # Зөвхөн хэрэглэгчийн хийсэн event review-уудыг авах
#         return EventReview.objects.filter(user=self.request.user)

# # 🌟 Нийт Event Review-ууд (event-р шүүх, хайлт)
# class EventReviewListAPIView(generics.ListCreateAPIView):
#     queryset = EventReview.objects.all()
#     serializer_class = EventReviewSerializer
#     filter_backends = [DjangoFilterBackend, filters.SearchFilter]
#     filterset_fields = ['event']
#     search_fields = ['review_text', 'event__title']

# # 🌟 Зөвхөн өөрийн Artist Review-ууд
# class MyArtistReviewsAPIView(generics.ListAPIView):
#     serializer_class = ArtistReviewSerializer
#     permission_classes = [permissions.IsAuthenticated]

#     def get_queryset(self):
#         # Зөвхөн хэрэглэгчийн хийсэн artist review-уудыг авах
#         return ArtistReview.objects.filter(user=self.request.user)

# # 🎨 Category-р Artist filter
# class ArtistListFilteredAPIView(generics.ListAPIView):
#     serializer_class = ArtistSerializer
#     filter_backends = [DjangoFilterBackend, filters.SearchFilter]
#     filterset_fields = ['category']
#     search_fields = ['name', 'bio']

#     def get_queryset(self):
#         # Категоригоор уран бүтээлчдийг шүүх
#         return Artist.objects.all() 
    
# class LoginView(APIView):
#     def post(self, request, *args, **kwargs):
#         email = request.data.get("email")
#         password = request.data.get("password")
        
#         try:
#             user = CustomUser.objects.get(email=email)
#         except CustomUser.DoesNotExist:
#             return Response({"message": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        
#         if not user.check_password(password):
#             return Response({"message": "Incorrect password"}, status=status.HTTP_400_BAD_REQUEST)

#         refresh = RefreshToken.for_user(user)
        
#         # Хэрэглэгчийн төрөл шалгах
#         if user.user_type == "artist":
#             return Response({
#                 "message": "Login successful, redirecting to artist dashboard",
#                 "access": str(refresh.access_token),
#                 "user_type": "artist"
#             })
#         else:
#             return Response({
#                 "message": "Login successful, redirecting to regular user dashboard",
#                 "access": str(refresh.access_token),
#                 "user_type": "regular"
#             })

# from rest_framework import status, permissions
# from django.contrib.auth import authenticate, login, logout
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import viewsets
# from django.contrib.auth.tokens import default_token_generator
# from django.core.mail import send_mail
# from django.contrib.auth import get_user_model
# from django.contrib.auth.models import User
# from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
# from django.utils.encoding import force_bytes
# from django.conf import settings
# from django.urls import reverse
# from django.core.mail import send_mail
# from .serializers import *

# class CustomUserView(APIView):
#     def get(self, request, user_id=None, *args, **kwargs):
#         if user_id:
#             try:
#                 user = CustomUser.objects.get(id=user_id)
#                 serializer = CustomUserSerializer(user)
#                 return Response(serializer.data, status=status.HTTP_200_OK)
#             except CustomUser.DoesNotExist:
#                 return Response({"message": "User not found"}, status=status.HTTP_404_NOT_FOUND)
#         else:
#             users = CustomUser.objects.all()
#             serializer = CustomUserSerializer(users, many=True)
#             return Response(serializer.data, status=status.HTTP_200_OK)

#     def post(self, request, *args, **kwargs):
#         serializer = CustomUserSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#     def patch(self, request, user_id, *args, **kwargs):
#         try:
#             user = CustomUser.objects.get(id=user_id)
#             serializer = CustomUserSerializer(user, data=request.data, partial=True)
#             if serializer.is_valid():
#                 serializer.save()
#                 return Response(serializer.data, status=status.HTTP_200_OK)
#             return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
#         except CustomUser.DoesNotExist:
#             return Response({"message": "User not found"}, status=status.HTTP_404_NOT_FOUND)

#     def delete(self, request, user_id, *args, **kwargs):
#         try:
#             user = CustomUser.objects.get(id=user_id)
#             user.delete()
#             return Response({"message": "User deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
#         except CustomUser.DoesNotExist:
#             return Response({"message": "User not found"}, status=status.HTTP_404_NOT_FOUND)
# class CreateUserView(APIView):
#     def post(self, request, *args, **kwargs):
#         serializer = CustomUserSignUpSerializer(data=request.data)
#         if serializer.is_valid():
#             user = serializer.save()
#             return Response({
#                 "message": "User created successfully",
#                 "user": serializer.data
#             }, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
# class GetUserView(APIView):
#     def get(self, request, *args, **kwargs):
#         user = request.user  # Authenticated user
#         serializer = CustomUserSerializer(user)
#         return Response(serializer.data, status=status.HTTP_200_OK)
    
# class UpdateUserView(APIView):
#     def patch(self, request, *args, **kwargs):
#         user = request.user
#         serializer = CustomUserSerializer(user, data=request.data, partial=True)
#         if serializer.is_valid():
#             serializer.save()
#             return Response({
#                 "message": "User updated successfully",
#                 "user": serializer.data
#             }, status=status.HTTP_200_OK)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
# class DeleteUserView(APIView):
#     def delete(self, request, *args, **kwargs):
#         user = request.user
#         user.delete()
#         return Response({"message": "User deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    
# class CategoryView(APIView):
#     def get(self, request, category_id=None, *args, **kwargs):
#         if category_id:
#             try:
#                 category = Category.objects.get(id=category_id)
#                 serializer = CategorySerializer(category)
#                 return Response(serializer.data, status=status.HTTP_200_OK)
#             except Category.DoesNotExist:
#                 return Response({"message": "Category not found"}, status=status.HTTP_404_NOT_FOUND)
#         else:
#             categories = Category.objects.all()
#             serializer = CategorySerializer(categories, many=True)
#             return Response(serializer.data, status=status.HTTP_200_OK)

#     def post(self, request, *args, **kwargs):
#         serializer = CategorySerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#     def patch(self, request, category_id, *args, **kwargs):
#         try:
#             category = Category.objects.get(id=category_id)
#             serializer = CategorySerializer(category, data=request.data, partial=True)
#             if serializer.is_valid():
#                 serializer.save()
#                 return Response(serializer.data, status=status.HTTP_200_OK)
#             return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
#         except Category.DoesNotExist:
#             return Response({"message": "Category not found"}, status=status.HTTP_404_NOT_FOUND)

#     def delete(self, request, category_id, *args, **kwargs):
#         try:
#             category = Category.objects.get(id=category_id)
#             category.delete()
#             return Response({"message": "Category deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
#         except Category.DoesNotExist:
#             return Response({"message": "Category not found"}, status=status.HTTP_404_NOT_FOUND)

# class CreateArtistView(APIView):
#     def post(self, request, *args, **kwargs):
#         serializer = ArtistSerializer(data=request.data)
#         if serializer.is_valid():
#             artist = serializer.save()
#             return Response({
#                 "message": "Artist created successfully",
#                 "artist": serializer.data
#             }, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# class ArtistListView(APIView):
#     def get(self, request, *args, **kwargs):
#         artists = Artist.objects.all()
#         serializer = ArtistSerializer(artists, many=True)
#         return Response(serializer.data, status=status.HTTP_200_OK)

# class UpdateArtistView(APIView):
#     def patch(self, request, *args, **kwargs):
#         artist_id = kwargs.get('artist_id')
#         try:
#             artist = Artist.objects.get(id=artist_id)
#             serializer = ArtistSerializer(artist, data=request.data, partial=True)
#             if serializer.is_valid():
#                 serializer.save()
#                 return Response({
#                     "message": "Artist updated successfully",
#                     "artist": serializer.data
#                 }, status=status.HTTP_200_OK)
#             return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
#         except Artist.DoesNotExist:
#             return Response({"message": "Artist not found"}, status=status.HTTP_404_NOT_FOUND)

# class DeleteArtistView(APIView):
#     def delete(self, request, *args, **kwargs):
#         artist_id = kwargs.get('artist_id')
#         try:
#             artist = Artist.objects.get(id=artist_id)
#             artist.delete()
#             return Response({"message": "Artist deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
#         except Artist.DoesNotExist:
#             return Response({"message": "Artist not found"}, status=status.HTTP_404_NOT_FOUND)

# class CreateArtworkView(APIView):
#     def post(self, request, *args, **kwargs):
#         serializer = ArtworkSerializer(data=request.data)
#         if serializer.is_valid():
#             artwork = serializer.save()
#             return Response({
#                 "message": "Artwork created successfully",
#                 "artwork": serializer.data
#             }, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# class ArtworkListView(APIView):
#     def get(self, request, *args, **kwargs):
#         artworks = Artwork.objects.all()
#         serializer = ArtworkSerializer(artworks, many=True)
#         return Response(serializer.data, status=status.HTTP_200_OK)

# class UpdateArtworkView(APIView):
#     def patch(self, request, *args, **kwargs):
#         artwork_id = kwargs.get('artwork_id')
#         try:
#             artwork = Artwork.objects.get(id=artwork_id)
#             serializer = ArtworkSerializer(artwork, data=request.data, partial=True)
#             if serializer.is_valid():
#                 serializer.save()
#                 return Response({
#                     "message": "Artwork updated successfully",
#                     "artwork": serializer.data
#                 }, status=status.HTTP_200_OK)
#             return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
#         except Artwork.DoesNotExist:
#             return Response({"message": "Artwork not found"}, status=status.HTTP_404_NOT_FOUND)

# class DeleteArtworkView(APIView):
#     def delete(self, request, *args, **kwargs):
#         artwork_id = kwargs.get('artwork_id')
#         try:
#             artwork = Artwork.objects.get(id=artwork_id)
#             artwork.delete()
#             return Response({"message": "Artwork deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
#         except Artwork.DoesNotExist:
#             return Response({"message": "Artwork not found"}, status=status.HTTP_404_NOT_FOUND)

# class CreateEventView(APIView):
#     def post(self, request, *args, **kwargs):
#         serializer = EventSerializer(data=request.data)
#         if serializer.is_valid():
#             event = serializer.save()
#             return Response({
#                 "message": "Event created successfully",
#                 "event": serializer.data
#             }, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
# class EventListView(APIView):
#     def get(self, request, *args, **kwargs):
#         events = Event.objects.all()
#         serializer = EventSerializer(events, many=True)
#         return Response(serializer.data, status=status.HTTP_200_OK)

# class EventDetailView(APIView):
#     def get(self, request, *args, **kwargs):
#         event_id = kwargs.get('event_id')
#         try:
#             event = Event.objects.get(id=event_id)
#             serializer = EventSerializer(event)
#             return Response(serializer.data, status=status.HTTP_200_OK)
#         except Event.DoesNotExist:
#             return Response({"message": "Event not found"}, status=status.HTTP_404_NOT_FOUND)

# class DeleteEventView(APIView):
#     def delete(self, request, *args, **kwargs):
#         event_id = kwargs.get('event_id')
#         try:
#             event = Event.objects.get(id=event_id)
#             event.delete()
#             return Response({"message": "Event deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
#         except Event.DoesNotExist:
#             return Response({"message": "Event not found"}, status=status.HTTP_404_NOT_FOUND)

# class LoginView(APIView):
#     def post(self, request):
#         username = request.data.get("username")
#         password = request.data.get("password")
#         user = authenticate(request, username=username, password=password)
#         if user:
#             login(request, user)
#             return Response({"message": "Login successful"}, status=status.HTTP_200_OK)
#         return Response({"message": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

# class LogoutView(APIView):
#     permission_classes = [permissions.IsAuthenticated]

#     def post(self, request):
#         logout(request)
#         return Response({"message": "Logout successful"}, status=status.HTTP_200_OK)

# class PasswordResetRequestView(APIView):
#     def post(self, request):
#         email = request.data.get("email")
#         try:
#             user = User.objects.get(email=email)
#             uid = urlsafe_base64_encode(force_bytes(user.pk))
#             token = default_token_generator.make_token(user)
#             # Send email (mock or actual)
#             reset_link = f"http://yourfrontend.com/reset-password/{uid}/{token}/"
#             send_mail("Reset Password", f"Click here to reset: {reset_link}", "admin@site.com", [email])
#             return Response({"message": "Password reset email sent"}, status=status.HTTP_200_OK)
#         except User.DoesNotExist:
#             return Response({"message": "User not found"}, status=status.HTTP_404_NOT_FOUND)

# class UserViewSet(viewsets.ModelViewSet):
#     queryset = CustomUser.objects.all()
#     serializer_class = CustomUserSerializer

# class CategoryViewSet(viewsets.ModelViewSet):
#     queryset = Category.objects.all()
#     serializer_class = CategorySerializer

# class ArtistViewSet(viewsets.ModelViewSet):
#     queryset = Artist.objects.all()
#     serializer_class = ArtistSerializer

# class ArtworkViewSet(viewsets.ModelViewSet):
#     queryset = Artwork.objects.all()
#     serializer_class = ArtworkSerializer

# class EventViewSet(viewsets.ModelViewSet):
#     queryset = Event.objects.all()
#     serializer_class = EventSerializer

# User = get_user_model()

# # Энэ хэсгийг нэгтгээрэй
# class PasswordResetRequestView(APIView):
#     def post(self, request):
#         serializer = PasswordResetSerializer(data=request.data)
#         if serializer.is_valid():
#             email = serializer.validated_data['email']
#             user = User.objects.get(email=email)
#             uid = urlsafe_base64_encode(force_bytes(user.pk))
#             token = default_token_generator.make_token(user)

#             reset_url = request.build_absolute_uri(
#                 reverse('password_reset_confirm')  # Энэ URL конфигурац дээр заавал тохируулсан байх ёстой
#             ) + f"?uid={uid}&token={token}"

#             send_mail(
#                 subject='Password Reset Request',
#                 message=f'Hi {user.username},\n\nUse the link below to reset your password:\n{reset_url}',
#                 from_email=settings.DEFAULT_FROM_EMAIL,
#                 recipient_list=[email],
#                 fail_silently=False,
#             )

#             return Response({"message": "Password reset email sent."}, status=status.HTTP_200_OK)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# class PasswordResetConfirmView(APIView):
#     def post(self, request):
#         uidb64 = request.data.get("uid")
#         token = request.data.get("token")
#         new_password = request.data.get("new_password")

#         try:
#             uid = urlsafe_base64_decode(uidb64).decode()
#             user = User.objects.get(pk=uid)
#         except (TypeError, ValueError, OverflowError, User.DoesNotExist):
#             return Response({"message": "Invalid link"}, status=status.HTTP_400_BAD_REQUEST)

#         if default_token_generator.check_token(user, token):
#             user.set_password(new_password)
#             user.save()
#             return Response({"message": "Password has been reset."}, status=status.HTTP_200_OK)
#         return Response({"message": "Invalid or expired token"}, status=status.HTTP_400_BAD_REQUEST)

# class PasswordChangeView(APIView):
#     permission_classes = [permissions.IsAuthenticated]

#     def post(self, request):
#         serializer = PasswordChangeSerializer(data=request.data, context={'request': request})
#         if serializer.is_valid():
#             serializer.save()
#             return Response({"message": "Password changed successfully"}, status=status.HTTP_200_OK)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

from rest_framework import status, permissions
from django.contrib.auth import authenticate, login, logout, get_user_model
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import viewsets
from django.contrib.auth.tokens import default_token_generator
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.mail import send_mail
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.urls import reverse
from .serializers import *
from django.utils.crypto import get_random_string
from django.contrib.auth.hashers import make_password
from rest_framework.permissions import IsAuthenticated

User = get_user_model()

# User views
class CustomUserView(APIView):
    def get(self, request, user_id=None, *args, **kwargs):
        if user_id:
            try:
                user = CustomUser.objects.get(id=user_id)
                serializer = CustomUserSerializer(user)
                return Response(serializer.data)
            except CustomUser.DoesNotExist:
                return Response({"message": "User not found"}, status=404)
        users = CustomUser.objects.all()
        serializer = CustomUserSerializer(users, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = CustomUserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

    def patch(self, request, user_id):
        try:
            user = CustomUser.objects.get(id=user_id)
        except CustomUser.DoesNotExist:
            return Response({"message": "User not found"}, status=404)
        serializer = CustomUserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def delete(self, request, user_id):
        try:
            user = CustomUser.objects.get(id=user_id)
            user.delete()
            return Response({"message": "User deleted"}, status=204)
        except CustomUser.DoesNotExist:
            return Response({"message": "User not found"}, status=404)

class CreateUserView(APIView):
    def post(self, request):
        serializer = CustomUserSignUpSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User created", "user": serializer.data}, status=201)
        return Response(serializer.errors, status=400)

class GetUserView(APIView):
    def get(self, request):
        serializer = CustomUserSerializer(request.user)
        return Response(serializer.data)

class UpdateUserView(APIView):
    def patch(self, request):
        serializer = CustomUserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User updated", "user": serializer.data})
        return Response(serializer.errors, status=400)

class DeleteUserView(APIView):
    def delete(self, request):
        request.user.delete()
        return Response({"message": "User deleted"}, status=204)

# Category views
class CategoryView(APIView):
    def get(self, request, category_id=None):
        if category_id:
            try:
                category = Category.objects.get(id=category_id)
                serializer = CategorySerializer(category)
                return Response(serializer.data)
            except Category.DoesNotExist:
                return Response({"message": "Category not found"}, status=404)
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

    def patch(self, request, category_id):
        try:
            category = Category.objects.get(id=category_id)
        except Category.DoesNotExist:
            return Response({"message": "Category not found"}, status=404)
        serializer = CategorySerializer(category, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def delete(self, request, category_id):
        try:
            category = Category.objects.get(id=category_id)
            category.delete()
            return Response({"message": "Category deleted"}, status=204)
        except Category.DoesNotExist:
            return Response({"message": "Category not found"}, status=404)

# Artist views
class CreateArtistView(APIView):
    def post(self, request):
        serializer = ArtistSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Artist created", "artist": serializer.data}, status=201)
        return Response(serializer.errors, status=400)

class ArtistListView(APIView):
    def get(self, request):
        artists = Artist.objects.all()
        serializer = ArtistSerializer(artists, many=True)
        return Response(serializer.data)

class UpdateArtistView(APIView):
    def patch(self, request, artist_id):
        try:
            artist = Artist.objects.get(id=artist_id)
        except Artist.DoesNotExist:
            return Response({"message": "Artist not found"}, status=404)
        serializer = ArtistSerializer(artist, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Artist updated", "artist": serializer.data})
        return Response(serializer.errors, status=400)

class DeleteArtistView(APIView):
    def delete(self, request, artist_id):
        try:
            artist = Artist.objects.get(id=artist_id)
            artist.delete()
            return Response({"message": "Artist deleted"}, status=204)
        except Artist.DoesNotExist:
            return Response({"message": "Artist not found"}, status=404)


class LoginView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            return Response({
                'access': access_token,
                'refresh': str(refresh),
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LogoutView(APIView):
    def post(self, request, *args, **kwargs):
        try:
            # Хэрэглэгчийн refresh token-ыг устгах
            refresh_token = request.data.get('refresh')
            token = RefreshToken(refresh_token)
            token.blacklist()  # JWT token-ийг blacklist хийх

            return Response({"detail": "Амжилттай гарлаа."}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"detail": "Гарах явцад алдаа гарлаа."}, status=status.HTTP_400_BAD_REQUEST)
        
class PasswordResetRequestView(APIView):
    def post(self, request, *args, **kwargs):
        email = request.data.get('email')

        # Имэйл хаяг зөв оруулсан эсэхийг шалгах
        if not email:
            return Response({"detail": "Имэйл хаяг заавал байх ёстой."}, status=status.HTTP_400_BAD_REQUEST)

        # Хэрэглэгчийн имэйлтэй тохирох хэрэглэгчийг хайх
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"detail": "Имэйл хаягтай хэрэглэгч олдсонгүй."}, status=status.HTTP_404_NOT_FOUND)

        # Нууц үг сэргээх temporary token үүсгэх
        token = get_random_string(length=32)  # Жишээ: temporary token үүсгэх

        # Нууц үг сэргээх холбоос үүсгэх
        reset_link = f'http://yourfrontend.com/reset-password/{token}'

        # Имэйл илгээх
        send_mail(
            'Нууц үг сэргээх хүсэлт',
            f'Таны нууц үгийг сэргээх холбоос: {reset_link}',
            'from@example.com',  # Таны имэйл
            [email],
            fail_silently=False,
        )

        return Response({"detail": "Нууц үг сэргээх холбоос имэйлийн хаягаар илгээгдлээ."}, status=status.HTTP_200_OK)
    
class PasswordResetConfirmView(APIView):
    def post(self, request, *args, **kwargs):
        token = request.data.get('token')
        new_password = request.data.get('new_password')

        # Хэрэглэгчийн token-ийг шалгах
        if not token:
            return Response({"detail": "Token заавал байх ёстой."}, status=status.HTTP_400_BAD_REQUEST)
        if not new_password:
            return Response({"detail": "Шинэ нууц үг заавал байх ёстой."}, status=status.HTTP_400_BAD_REQUEST)

        # Token-ийг баталгаажуулах (энэ нь жишээ токен баталгаажуулалттай бол)
        try:
            user = User.objects.get(reset_token=token)
        except User.DoesNotExist:
            return Response({"detail": "Токен буруу байна."}, status=status.HTTP_400_BAD_REQUEST)

        # Нууц үгийг шинэчилж, хадгалах
        user.password = make_password(new_password)
        user.reset_token = None  # Токеныг устгах (эсвэл энэ хэсэг илүү нарийвчилж тохируулж болно)
        user.save()

        return Response({"detail": "Нууц үг амжилттай шинэчлэгдлээ."}, status=status.HTTP_200_OK)
    
class PasswordChangeView(APIView):
    permission_classes = [IsAuthenticated]  # Хэрэглэгч нэвтэрсэн байх ёстой

    def post(self, request, *args, **kwargs):
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')

        if not old_password:
            return Response({"detail": "Хуучин нууц үг заавал байх ёстой."}, status=status.HTTP_400_BAD_REQUEST)
        if not new_password:
            return Response({"detail": "Шинэ нууц үг заавал байх ёстой."}, status=status.HTTP_400_BAD_REQUEST)

        # Хэрэглэгчийг аутентификатлах
        user = authenticate(request, username=request.user.username, password=old_password)

        if user is None:
            return Response({"detail": "Хуучин нууц үг буруу байна."}, status=status.HTTP_400_BAD_REQUEST)

        # Нууц үгийг шинэчлэх
        user.password = make_password(new_password)
        user.save()

        return Response({"detail": "Нууц үг амжилттай өөрчлөгдлөө."}, status=status.HTTP_200_OK)
# Similar implementation for artworks, events, login/logout, password reset, etc.
from rest_framework import viewsets, permissions
from .models import *
from .serializers import (
    CustomUserSerializer, ArtistSerializer,
    EventSerializer, ArtworkSerializer,
    TicketTypeSerializer
)
from rest_framework.parsers import MultiPartParser, FormParser

# User ViewSet
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [permissions.AllowAny]

# Artist ViewSet
class ArtistViewSet(viewsets.ModelViewSet):
    queryset = Artist.objects.all()
    serializer_class = ArtistSerializer
    permission_classes = [permissions.IsAuthenticated]

# Event ViewSet
class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticated]

# Artwork ViewSet
class ArtworkViewSet(viewsets.ModelViewSet):
    queryset = Artwork.objects.all()
    serializer_class = ArtworkSerializer
    permission_classes = [permissions.IsAuthenticated]

# TicketType ViewSet
class TicketTypeViewSet(viewsets.ModelViewSet):
    queryset = TicketType.objects.all()
    serializer_class = TicketTypeSerializer
    permission_classes = [permissions.IsAuthenticated]

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer