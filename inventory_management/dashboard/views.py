from django.shortcuts import render

# Create your views here.
from django.http import JsonResponse
from core.mongo import product_collection, order_collection
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def dashboard_stats(request):
    total_products = product_collection.count_documents({})
    low_stock = product_collection.count_documents({"stock": {"$lt": 10}})
    recent_sales = order_collection.count_documents({})
    
    revenue = order_collection.aggregate([
    {"$group": {"_id": None, "total": {"$sum": "$total_price"}}}
    ])
    total_revenue = next(revenue, {"total": 0})["total"]

    return JsonResponse({
        "total_products": total_products,
        "low_stock": low_stock,
        "recent_sales": recent_sales,
        "total_revenue": total_revenue
    })