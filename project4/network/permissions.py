from rest_framework import permissions


class IsAuthor(permissions.BasePermission):
    """
    Custom permission to only allow author of an object to edit it.
    """

    def has_object_permission(self, request, view, obj):
        
        if request.method in permissions.SAFE_METHODS:
            return True
            
        # Write permissions are only allowed to the owner of the snippet.
        return obj.author == request.user

class IsNotHimself(permissions.BasePermission):
    """
    Custom permission to only other user to interact with users.
    """

    def has_object_permission(self, request, view, obj):
        return not (request.user == obj)