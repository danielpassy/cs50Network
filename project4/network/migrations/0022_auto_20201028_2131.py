# Generated by Django 3.1 on 2020-10-29 00:31

from django.db import migrations, models
import network.models


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0021_auto_20201028_2035'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='timestamp',
            field=network.models.AutoDateTimeField(),
        ),
        migrations.AlterField(
            model_name='user',
            name='avatar',
            field=models.FileField(blank=True, upload_to='static/'),
        ),
    ]
