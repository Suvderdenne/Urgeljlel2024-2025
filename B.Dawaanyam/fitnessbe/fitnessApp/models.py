from django.db import models
from django.contrib.auth.models import User

# ------------------------------
# UserProfile
# ------------------------------
class UserProfile(models.Model):
    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other'),
    ]

    ACTIVITY_LEVEL_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    age = models.PositiveIntegerField()
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES)
    height_cm = models.FloatField()
    weight_kg = models.FloatField()
    goal_weight_kg = models.FloatField(null=True, blank=True)
    activity_level = models.CharField(max_length=10, choices=ACTIVITY_LEVEL_CHOICES, default='medium')

    def __str__(self):
        return f"{self.user.username}'s Profile"

    @property
    def bmi(self):
        height_m = self.height_cm / 100
        return round(self.weight_kg / (height_m ** 2), 2)


# ------------------------------
# WorkoutPlan
# ------------------------------
class WorkoutPlan(models.Model):
    DIFFICULTY_CHOICES = [
        ('easy', 'Easy'),
        ('medium', 'Medium'),
        ('hard', 'Hard'),
    ]

    GENDER_FILTER = [
        ('M', 'Male'),
        ('F', 'Female'),
        ('A', 'All'),
    ]

    title = models.CharField(max_length=255)
    description = models.TextField()
    difficulty = models.CharField(max_length=10, choices=DIFFICULTY_CHOICES)
    target_gender = models.CharField(max_length=1, choices=GENDER_FILTER, default='A')
    min_age = models.PositiveIntegerField(default=0)
    max_age = models.PositiveIntegerField(default=120)
    min_bmi = models.FloatField(default=0.0)
    max_bmi = models.FloatField(default=100.0)

    def __str__(self):
        return self.title


# ------------------------------
# MealPlan
# ------------------------------
class MealPlan(models.Model):
    GENDER_FILTER = [
        ('M', 'Male'),
        ('F', 'Female'),
        ('A', 'All'),
    ]

    title = models.CharField(max_length=255)
    description = models.TextField()
    calories = models.FloatField()
    target_gender = models.CharField(max_length=1, choices=GENDER_FILTER, default='A')
    min_age = models.PositiveIntegerField(default=0)
    max_age = models.PositiveIntegerField(default=120)
    min_bmi = models.FloatField(default=0.0)
    max_bmi = models.FloatField(default=100.0)

    def __str__(self):
        return self.title


# ------------------------------
# WeightLog
# ------------------------------
class WeightLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='weight_logs')
    date = models.DateField(auto_now_add=True)
    weight_kg = models.FloatField()

    def __str__(self):
        return f"{self.user.username} - {self.date} - {self.weight_kg} kg"


# ------------------------------
# ProjectedWeightLoss
# ------------------------------
class ProjectedWeightLoss(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='projections')
    start_date = models.DateField()
    end_date = models.DateField()
    projected_loss_kg = models.FloatField()
    actual_loss_kg = models.FloatField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.username} - {self.start_date} to {self.end_date}"

    def calculate_actual_loss(self):
        logs = self.user.weight_logs.filter(date__range=(self.start_date, self.end_date)).order_by('date')
        if logs.count() >= 2:
            start_weight = logs.first().weight_kg
            end_weight = logs.last().weight_kg
            self.actual_loss_kg = round(start_weight - end_weight, 2)
            self.save()
        return self.actual_loss_kg


# ------------------------------
# Food
# ------------------------------
class Food(models.Model):
    MEAL_TYPE_CHOICES = [
        ('Breakfast', 'Breakfast'),
        ('Lunch', 'Lunch'),
        ('Dinner', 'Dinner'),
        ('Snack', 'Snack'),
    ]

    UNIT_CHOICES = [
        ('g', 'Grams'),
        ('piece', 'Piece'),
        ('cup', 'Cup'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='foods')
    name = models.CharField(max_length=255)
    quantity = models.FloatField()
    unit = models.CharField(max_length=10, choices=UNIT_CHOICES)
    calories = models.IntegerField()
    meal_type = models.CharField(max_length=20, choices=MEAL_TYPE_CHOICES)
    date_added = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.calories} kcal)"

    class Meta:
        ordering = ['-date_added']


# ------------------------------
# DailyCalories
# ------------------------------
class DailyCalories(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='daily_calories')
    date = models.DateField(auto_now_add=True)
    total_calories = models.IntegerField(default=0)
    calorie_goal = models.IntegerField(default=2000)

    def __str__(self):
        return f"{self.user.username} - {self.date} - {self.total_calories}/{self.calorie_goal} kcal"

    class Meta:
        unique_together = ['user', 'date']
        ordering = ['-date']
