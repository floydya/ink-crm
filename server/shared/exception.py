from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import exception_handler


def custom_exception_handler(exc, context):
    # Call REST framework's default exception handler first,
    # to get the standard error response.
    if isinstance(exc, AssertionError):
        response = Response({'non_field_errors': [str(exc)]}, status=status.HTTP_400_BAD_REQUEST)
    else:
        response = exception_handler(exc, context)
    return response
