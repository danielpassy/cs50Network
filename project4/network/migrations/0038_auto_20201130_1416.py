# Generated by Django 3.1 on 2020-11-30 17:16

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0037_auto_20201113_0024'),
    ]

    operations = [
        migrations.AddField(
            model_name='comment',
            name='dislike',
            field=models.ManyToManyField(blank=True, related_name='dislikes_comments', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='post',
            name='dislike',
            field=models.ManyToManyField(blank=True, related_name='dislikes_post', to=settings.AUTH_USER_MODEL),
        ),
    ]
