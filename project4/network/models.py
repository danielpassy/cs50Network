from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _


class AutoDateTimeField(models.DateTimeField):
    """
    This is a solution for auto_add_now being buggy
    """

    def pre_save(self, model_instance, add):
        return timezone.now()


class User(AbstractUser):
    email = models.EmailField(_('email address'), unique=True)
    avatar = models.FileField(upload_to='static/', blank=True, default='/static/user.png')
    followers = models.ManyToManyField(
        'User', related_name='following', blank=True)


class Post(models.Model):
    content = models.CharField(max_length=256)
    author = models.ForeignKey(
        'User', on_delete=models.CASCADE, related_name='published_posts')
    create_at = models.DateTimeField(default=timezone.now)
    updated_at = AutoDateTimeField(default=timezone.now)
    like = models.ManyToManyField(
        'User', related_name='likes_posts', blank=True)
    dislike = models.ManyToManyField(
        'User', related_name='dislikes_post', blank=True)

    def __str__(self):
        return "the author is %s who writed %s" % (self.author, self.content)


class Comment(models.Model):

    create_at = models.DateTimeField(default=timezone.now)
    updated_at = AutoDateTimeField(default=timezone.now)
    content = models.CharField(max_length=256)
    author = models.ForeignKey(
        'User', on_delete=models.CASCADE, related_name='comment')
    posts = models.ForeignKey(
        'Post', on_delete=models.CASCADE, related_name='comment')
    like = models.ManyToManyField(
        'User', related_name='likes_comments', blank=True)
    dislike = models.ManyToManyField(
        'User', related_name='dislikes_comments', blank=True)
