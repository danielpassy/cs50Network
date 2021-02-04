from django.urls import reverse
from django.contrib.auth import get_user_model
from django.test import RequestFactory
from rest_framework.test import APITestCase, force_authenticate
from rest_framework import status
from rest_framework.authtoken.models import Token

from model_bakery import baker
import json

from .models import *
from .serializers import *
from .views import *


class AccountTesting(APITestCase):

    def setUp(self):
        self.factory = RequestFactory()
        """
        Create User example
        """
        self.user = User.objects.create_user(
            username="teste",
            email="email@teste.com",
            password="teste")
        self.client.force_authenticate(self.user)
        retrieve = get_user_model().objects.get(pk=1)

    def test_usercreating(self):

        # fail
        data = {
            "username": "teste",
            "email": "email@teste.com",
            "password": "email"}

        response = self.client.post(reverse("register_api"), data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # success
        data = {
            "email": "username@tASDeste.com",
            "username": "usernamASDe",
            "password": "emASDail"}

        response = self.client.post(reverse("register_api"), data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_authentication(self):
        """
        Check that login returns a token 
        """
        data = {
            "username": "teste",
            "password": "teste"
        }
        response = self.client.post(reverse("api_token_auth"), data)
        self.assertIn("token", response.data)

        self.assertTrue(True)
        pass

    def test_2wer(self):
        """
        check that like returns a true and 
        """
        self.assertTrue(True)
        pass


class PostTesting(APITestCase):

    def setUp(self):
        self.factory = RequestFactory()
        """
        Create User 
        """
        self.user = User.objects.create_user(
            username="teste",
            email="email@teste.com",
            password="teste")
        ## generate the token
        Token.objects.get_or_create(user=self.user)

        """
        Create Post 
        """
        self.post = Post.objects.create(
            content="hi my name is Daniel I love this",
            author=self.user
        )
        # twice
        self.post2 = Post.objects.create(
            content="123",
            author=self.user
        )

        """
        Create Comment 
        """
        self.comment = Comments.objects.create(
            content="this is the first comment",
            author=self.user,
            posts=self.post
        )
        # twice
        self.comment2 = Comments.objects.create(
            content="this is the second comment",
            author=self.user,
            posts=self.post2)

    def test_1(self):
        """
        Testing get PostPKView (delete, patch, put, retrieve) 
        """
        request = self.factory.get(reverse("PostPKView", kwargs={'pk': '1'}))
        request.user = self.user
        force_authenticate(request, user=self.user, token=self.user.auth_token)
        response = PostPKView.as_view()(request, pk=1)
        self.assertEqual(response.status_code, 200)

    def test_POSTPKVIEW_PATCH(self):
        """
        Testing patch PostPKView (delete, patch, put, retrieve) 
        only content should be modifiably
        """

        # Bake all fields in Serializer

        data = ({'content': 'random_Text',
                'like': '1230',
                'author':1231231,
                'create_at':12,
                'update_at':12,
                'comments':10,
                'like_count':123,
                'comment_count':23})
        datajson = json.dumps(data)
        request = self.factory.patch(reverse("PostPKView", kwargs={'pk': '1'}), datajson, content_type='application/json')
        request.user = self.user
        force_authenticate(request, user=self.user, token=self.user.auth_token)
        response = PostPKView.as_view()(request, pk=1)
        self.assertEqual(response.status_code, 200)

        data.pop('content')
        for key in data:
            self.assertIn(response.data, field)


    def test_POSTPKVIEW_GET(self):
        """
        Testing get PostPKView (delete, patch, put, retrieve) 
        """
        request = self.factory.get(reverse("PostPKView", kwargs={'pk': '1'}))
        request.user = self.user
        force_authenticate(request, user=self.user, token=self.user.auth_token)
        response = PostPKView.as_view()(request, pk=1)
        self.assertEqual(response.status_code, 200)


    def test_2(self):
        """
        create a Post and see if it matches. 
        """
        # data = {"content": "hi my name is Daniel I love this",
        #         "author": self.user.pk}
        # response = self.client.post(reverse("post"), data=data)
        # self.assertEqual(response.status, status.HTTP_201_CREATED)
