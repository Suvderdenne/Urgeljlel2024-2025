# users/admin.py
from django.contrib import admin
from .models import CustomUser, Artist, Artwork, EventOrganizer, Event, Category,EventDetail,TicketType,TicketCategory

# CustomUser-ийг admin-д бүртгэх
@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ['username', 'email',  'phone_number']
    search_fields = ['username', 'email']
    list_filter = ['is_active']

# Artist-ийг admin-д бүртгэх
@admin.register(Artist)
class ArtistAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'bio']
    search_fields = ['name', 'category']
    list_filter = ['category']

# Artwork-ийг admin-д бүртгэх
@admin.register(Artwork)
class ArtworkAdmin(admin.ModelAdmin):
    list_display = ['title', 'artist', 'price', 'date_created']
    search_fields = ['title', 'artist__name']
    list_filter = ['artist', 'price']

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'location', 'date', 'created_at', 'category')
    search_fields = ('title', 'location', 'category__name')
    list_filter = ('date', 'category')
    ordering = ('-date',)

# Register EventOrganizer model
@admin.register(EventOrganizer)
class EventOrganizerAdmin(admin.ModelAdmin):
    list_display = ('name', 'event', 'website')
    search_fields = ('name', 'event__title', 'website')
    list_filter = ('event',)

# Register EventDetail model
@admin.register(EventDetail)
class EventDetailAdmin(admin.ModelAdmin):
    list_display = ('ticket_type', 'price', 'event')
    search_fields = ('ticket_type', 'event__title')
    list_filter = ('event','ticket_type')

# Category-ийг admin-д бүртгэх
@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name']
    search_fields = ['name']

@admin.register(TicketType)
class TicketTypeAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'price', 'discount_price', 'discount_until', 'event', 'category')
    list_filter = ('event', 'category', 'discount_until')
    search_fields = ('name', 'subtitle', 'description')
    ordering = ('-id',)
@admin.register(TicketCategory)
class TicketCategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'description')  # Төвдөө ямар талбаруудыг харуулах вэ
    search_fields = ('name',)  # Нэрээр хайлт хийх боломжийг нэмэх
    list_filter = ('name',)  # Нэрээр шүүх боломжийг нэмэх
