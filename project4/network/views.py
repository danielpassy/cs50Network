from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django.db.models import Q
from django.views.decorators.csrf import csrf_exempt
import os 
from os.path import join
from project4 import settings

from rest_framework import generics, viewsets, mixins, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import api_view, permission_classes

from .models import User, Post as PostModel, Comment
from .serializers import (
    UserSerializer,
    PostSerializer,
    CommentSerializer,
    UserProfileSerializer,
)
from .permissions import IsAuthor, IsNotHimself

from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token



class AuthTokenAndID(ObtainAuthToken):
    """
    Custom Auth Token View that returns also the ID of the user
    """

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        token, created = Token.objects.get_or_create(user=user)
        return Response({"token": token.key, "id": user.id})


class PostPKView(generics.RetrieveUpdateDestroyAPIView):
    """
    Interactions with the POST Model that requires PK
    Post deletion, updating or single retrieve
    """

    queryset = PostModel.objects.all().order_by("-create_at")
    serializer_class = PostSerializer
    permission_classes = (IsAuthenticated, IsAuthor)  # TODO: it should be it`s owner


class UserPostView(generics.ListAPIView):
    """
    Retrieving all POST from a user
    """

    serializer_class = PostSerializer
    permission_classes = (IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    def get_queryset(self):
        queryset = PostModel.objects.filter(author=self.kwargs["pk"]).order_by(
            "-create_at"
        )
        return queryset


class FriendsPostView(generics.ListAPIView):
    """
    List all ur friends Post (feed)
    """

    serializer_class = PostSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        queryset = PostModel.objects.filter(
            Q(author=self.request.user)
            | Q(author__in=self.request.user.following.all())
        ).order_by("-create_at")
        return queryset

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)


class PostView(generics.ListCreateAPIView):
    """
    Interactions with the POST Model that does not require PK
    List all Posts, Create a new Post
    """

    queryset = PostModel.objects.all().order_by("-create_at")
    serializer_class = PostSerializer
    permission_classes = (IsAuthenticated,)


class PostCommentsView(mixins.CreateModelMixin, generics.ListAPIView):
    """
    Interactions with the Comment Model that  does not rquire the comment PK
    however it does require a POST PK
    List all Comment, Create a new Comment on attached to post
    """

    serializer_class = CommentSerializer
    permission_classes = (IsAuthenticated,)
    lookup_url_field = 'posts'
    pagination_class = None

    def get_queryset(self):
        return Comment.objects.filter(posts=self.kwargs['pk']).order_by("-create_at")
  
    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class CommentPKView(generics.RetrieveUpdateDestroyAPIView):
    """
    Interactions with the Comment Model that requires the comment PK
    Comment deletion, updation or single retrieve
    """

    queryset = Comment.objects.all().order_by("-create_at")
    serializer_class = CommentSerializer
    permission_classes = (IsAuthenticated, IsAuthor)  # TODO: it should be it`s owner


class UserInformation(generics.RetrieveAPIView):
    """
    Get user information
    """

    permission_classes = (IsAuthenticated,)
    queryset = User.objects.all()
    serializer_class = UserProfileSerializer


class LikeDislikePost(generics.RetrieveAPIView):
    """
    Like/Dislike Post
    """

    permission_classes = (IsAuthenticated,)
    queryset = PostModel.objects.all().order_by("-create_at")
    serializer_class = PostSerializer

    def get(self, request, *args, **kwargs):

        instance = self.get_object()
        lookup = "like" if kwargs["method"] == "like" else "dislike"
        oppositeLookup = "dislike" if kwargs["method"] == "like" else "like"

        # flip the state, like/unlike
        if request.user in getattr(instance, lookup).all():
            getattr(instance, lookup).remove(request.user)
        else:
            getattr(instance, lookup).add(request.user)
            getattr(instance, oppositeLookup).remove(request.user)
            instance.save()

        serializer = self.get_serializer(instance)
        return Response(serializer.data, status=status.HTTP_200_OK)


class LikeDislikeComment(generics.RetrieveAPIView):
    """
    Like/Dislike Comment
    """

    serializer_class = CommentSerializer
    permission_classes = (IsAuthenticated,)
    queryset = Comment.objects.all().order_by("-create_at")

    def get(self, request, *args, **kwargs):

        instance = self.get_object()

        lookup = "like" if kwargs["method"] == "like" else "dislike"
        oppositeLookup = "dislike" if kwargs["method"] == "like" else "like"

        # flip the state, like/unlike
        if request.user in getattr(instance, lookup).all():
            getattr(instance, lookup).remove(request.user)
        else:
            getattr(instance, lookup).add(request.user)
            getattr(instance, oppositeLookup).remove(request.user)
            instance.save()

        serializer = self.get_serializer(instance)
        return Response(serializer.data, status=status.HTTP_200_OK)


class FollowUnfollowUser(generics.RetrieveAPIView):
    """
    Follow/Unfollow User
    """

    serializer_class = UserProfileSerializer
    permission_classes = (IsAuthenticated, IsNotHimself)
    queryset = User.objects.all()

    def get(self, request, *args, **kwargs):
        instance = self.get_object()

        # flip the state, like/unlike
        if request.user in instance.followers.all():
            instance.followers.remove(request.user)
        else:
            instance.followers.add(request.user)
            instance.save()
        serializer = self.get_serializer(instance)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UserCreate(generics.CreateAPIView):
    """
    Registration, user creating view
    """

    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (AllowAny,)


class Logout(APIView):
    """
    Logout the current logged in user
    """

    permission_classes = (IsAuthenticated,)

    def get(self, request, format=None):
        # simply delete the token to force a login
        request.user.auth_token.delete()
        return Response(status=status.HTTP_200_OK)

@csrf_exempt
def index(request):
    """
    View to return the static front-end code
    Entry point to the webapp
    """
    try:
        with open(join(settings.REACT_APP_DIR, "index.html")) as f:
            return HttpResponse(f.read())
    except FileNotFoundError:
        a ='s'
        return HttpResponse(
            a,
            status=501,
        )
