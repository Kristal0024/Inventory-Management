from django.urls import path
from .views import create_product, create_order, get_products, delete_product,low_stock_count,get_orders

urlpatterns = [
    path('product/create/', create_product, name='create_product'),
    path('order/create/', create_order, name='create_order'),
    path('products/', get_products, name='products'),
    path('product/delete/<str:product_id>/', delete_product, name='delete_product'),
    path("low-stock/", low_stock_count, name="low_stock_count"),
    path("orders/",get_orders, name="get_products")
]