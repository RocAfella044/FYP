"""
WSGI config for fanaticbooks project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'fanaticbooks.settings')

application = get_wsgi_application()

# settings.py
# Redefining these for clarity and to avoid duplication
KHALTI_API_KEY = '05bf95cc57244045b8df5fad06748dab'  # Sandbox secret key
KHALTI_API_URL = 'https://dev.khalti.com/api/v2/'  # Sandbox API endpoint
KHALTI_RETURN_URL = 'http://localhost:8000/payment/callback/'  # Callback URL
KHALTI_WEBSITE_URL = 'http://localhost:8000/'  # Merchant website URL