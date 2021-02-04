from rest_framework import serializers
from .models import Post, User, Comment
from django.contrib.auth import get_user_model
from rest_framework.authtoken.serializers import AuthTokenSerializer


class UserSerializer(serializers.ModelSerializer):
    """
    This serializer manipulate sensitive data,
    it shouldn't be used to display user info.
    """

    class Meta:
        model = User
        fields = ("username", "password", "email", "followers", "pk", "avatar")
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        """
        create the user account
        """
        user = get_user_model().objects.create(
            username=validated_data["username"], email=validated_data["email"]
        )
        user.set_password(validated_data["password"])
        user.save()
        return user


class UserCardSerializer(serializers.ModelSerializer):
    """
    This serializer display only basic information of user,
    It should be used in fields of other serializers
    """

    class Meta:
        model = User
        fields = (
            "username",
            "id",
            "avatar",
        )


class UserProfileSerializer(serializers.ModelSerializer):
    """
    This serializer is the public user serializer,
    It should be use in most cases to anyone accessing this user profile
    """

    num_followers = serializers.SerializerMethodField()
    num_following = serializers.SerializerMethodField()
    followers = UserSerializer(read_only=True, many=True)

    class Meta:
        model = User
        fields = (
            "username",
            "num_followers",
            "following",
            "followers",
            "id",
            "avatar",
            "num_following",
        )

    def get_num_followers(self, obj):
        """
        Return the number of followers
        """
        return obj.followers.count()

    def get_num_following(self, obj):
        """
        Return the number of followers
        """
        return obj.following.count()


class CommentSerializer(serializers.ModelSerializer):
    """"""

    author = UserCardSerializer(required=False)
    authorDisliked = serializers.SerializerMethodField()
    authorLiked = serializers.SerializerMethodField()
    dislikeCount = serializers.SerializerMethodField()
    dislike = UserCardSerializer(many=True, read_only=True)
    likeCount = serializers.SerializerMethodField()
    like = UserCardSerializer(many=True, read_only=True)
    

    class Meta:
        model = Comment
        fields = (
            "author",
            "authorLiked",
            "authorDisliked",
            "create_at",
            "content",
            "dislikeCount",
            "dislike",
            "id",
            "like",
            "likeCount",
            "posts",
            "updated_at",
        )
        extra_kwargs = {
            "author": {"read_only": True},
            "create_at": {"read_only": True},
        }

    def get_authorLiked(self, obj):
        """
        Check if the user has liked this comment
        """
        try:
            if self.context["request"].user:
                if obj.like.all().filter(pk=self.context["request"].user.pk):
                    return True
                return False
        except:
            return False

    def get_authorDisliked(self, obj):
        """
        Check if the user has disliked this comment
        """
        try:
            if self.context["request"].user:
                if obj.dislike.all().filter(pk=self.context["request"].user.pk):
                    return True
                return False
        except:
            return False

    def get_likeCount(self, obj):
        """
        Return the like counts for the post instance
        """
        return obj.like.count()

    def get_dislikeCount(self, obj):
        """
        Return the dislike counts for the post instance
        """
        return obj.dislike.count()

    def save(self, **kwargs):
        """
        create a comment
        """
        self.validated_data["author"] = self.context["request"].user
        super().save()


class PostSerializer(serializers.ModelSerializer):
    """"""

    author = UserCardSerializer(read_only=True)
    authorLiked = serializers.SerializerMethodField()
    authorDisliked = serializers.SerializerMethodField()
    comments = serializers.SerializerMethodField()
    comment_count = serializers.SerializerMethodField()
    dislike = UserCardSerializer(many=True, read_only=True)
    dislikeCount = serializers.SerializerMethodField()
    like = UserCardSerializer(many=True, read_only=True)
    likeCount = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = (
            "authorLiked",
            "authorDisliked",
            "author",
            "comments",
            "comment_count",
            "content",
            "create_at",
            "dislike",
            "dislikeCount",
            "id",
            "like",
            "likeCount",
            "updated_at",
        )
        extra_kwargs = {
            "author": {"read_only": True},
            "create_at": {"read_only": True},
        }

    def save(self, **kwargs):
        """
        create a post
        """
        self.validated_data["author"] = self.context["request"].user
        super().save()

    def get_authorLiked(self, obj):
        """
        Check if the user has liked this comment
        """
        if self.context["request"].user:
            if obj.like.all().filter(pk=self.context["request"].user.pk):
                return True
        return False

    def get_authorDisliked(self, obj):
        """
        Check if the user has disliked this comment
        """
        try:
            if self.context["request"].user:
                if obj.dislike.all().filter(pk=self.context["request"].user.pk):
                    return True
                return False
        except:
            return False

    def get_comments(self, obj):
        """
        Retrieve the newest 2 posts by date of
        """
        comments = obj.comment.all().order_by("create_at")[:1]
        serializer = CommentSerializer(comments, many=True)
        return serializer.data

    def get_likeCount(self, obj):
        """
        Return the like counts for the post instance
        """
        return obj.like.count()

    def get_dislikeCount(self, obj):
        """
        Return the dislike counts for the post instance
        """
        return obj.dislike.count()

    def get_comment_count(self, obj):
        """
        Return the comment counts for the post instance
        """
        return obj.comment.count()
