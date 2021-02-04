# Generated by Django 3.1 on 2020-10-26 18:58

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0011_remove_comments_posts'),
    ]

    operations = [
        migrations.AddField(
            model_name='comments',
            name='posts',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='comments', to='network.post'),
            preserve_default=False,
        ),
    ]