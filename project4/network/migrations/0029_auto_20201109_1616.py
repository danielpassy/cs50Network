# Generated by Django 3.1 on 2020-11-09 19:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0028_comment_updated_at'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='email',
            field=models.EmailField(max_length=254, verbose_name='email address'),
        ),
    ]