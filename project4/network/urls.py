
from django.urls import path, include, re_path
from rest_framework.authtoken.views import obtain_auth_token
from . import views 
from rest_framework.routers import DefaultRouter
# from rest_framework.routers import DefaultRouter


urlpatterns = [


    # browsable
    path("", views.index, name="index"),
    # path("", views.index, name="index"),


    # api register
    path("api/logout/", views.Logout.as_view(), name="logout_api"),
    path("api/register/", views.UserCreate.as_view(), name="register_api"),
    path("api/api-token-auth/", views.AuthTokenAndID.as_view(), name='api_token_auth'),
    path('api/api-auth/', include('rest_framework.urls')),


    # functionalities
    path("api/post/", views.PostView.as_view(), name="PostView"),
    path("api/post/friends/", views.FriendsPostView.as_view(), name="FriendsPostView"),
    path("api/post/<int:pk>/", views.PostPKView.as_view(), name="PostPKView"),
    path("api/post/comment/<int:pk>/", views.PostCommentsView.as_view(), name="PostCommentsView"),
    re_path(r"api/post/(?P<method>like|dislike)/(?P<pk>[0-9]+)/", views.LikeDislikePost.as_view(), name="LikeDislikePost"),
    
    path("api/comment/<int:pk>/", views.CommentPKView.as_view(), name="CommentPKView"),
    re_path(r"api/comment/(?P<method>like|dislike)/(?P<pk>[0-9]+)/", views.LikeDislikeComment.as_view(), name="LikeDislikeComment"),
    
    path('api/user/<int:pk>/', views.UserInformation.as_view(), name="UserInformation"),
    path("api/user/post/<int:pk>/", views.UserPostView.as_view(), name="UserPostView"),
    path("api/user/follow/<int:pk>/", views.FollowUnfollowUser.as_view(), name="FollowUnfollowUser"),

    # route anything to the main index in case it doesn't exist
    re_path(r'^(?:.*)/$', views.index, name="indexMatching"),
] #+ router.urls
