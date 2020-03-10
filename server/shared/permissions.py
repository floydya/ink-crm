from rest_framework import permissions


class IsMeOrReadOnly(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS or not obj:
            return True
        return obj == request.user
