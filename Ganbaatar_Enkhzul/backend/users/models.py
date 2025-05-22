from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.

class CustomUser(AbstractUser):
        # Хэрэглэгчийн профайл зураг хадгалах талбар
    profile_image = models.ImageField(upload_to='profile_images/', null=True, blank=True)

    def __str__(self):
        return self.username


    @property
    def profile_image_url(self):
        if self.profile_image:
            return self.profile_image.url
        return None
