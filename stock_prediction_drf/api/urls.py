from django.urls import path
from .views import StockMLPredictionView

urlpatterns = [
    path('predict/<str:symbol>/', StockMLPredictionView.as_view(), name='stock_ml_prediction'),
]