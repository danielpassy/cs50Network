# Generated by Django 3.1 on 2020-11-11 21:32

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0033_auto_20201109_2345'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='follower',
        ),
        migrations.AddField(
            model_name='user',
            name='followers',
            field=models.ManyToManyField(blank=True, related_name='following', to=settings.AUTH_USER_MODEL),
        ),
    ]