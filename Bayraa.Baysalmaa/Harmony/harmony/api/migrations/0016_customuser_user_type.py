# Generated by Django 5.2 on 2025-04-23 13:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0015_artist_is_verified_customuser_artist_event_latitude_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='user_type',
            field=models.CharField(choices=[('regular', 'Regular User'), ('artist', 'Artist')], default='regular', max_length=20),
        ),
    ]
