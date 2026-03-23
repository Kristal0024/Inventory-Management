import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from core.schema.Product_schema import ProductSchema
from core.schema.Order_schema import OrderSchema
from core.mongo import product_collection,order_collection
from bson import ObjectId
from datetime import datetime


@csrf_exempt
def create_product(request):
    if request.method != "POST":
        return JsonResponse({"error": "Invalid request method"}, status=405)

    try:
        data = json.loads(request.body)
        product = ProductSchema(**data)
        product_dict = product.dict()

        # Check if product with same name (case-insensitive) AND price exists
        existing = product_collection.find_one({
            "name": {"$regex": f"^{product_dict['name']}$", "$options": "i"},
            "price": product_dict["price"]
        })

        if existing:
            # Update quantity
            new_quantity = existing.get("quantity", 0) + product_dict.get("quantity", 0)
            product_collection.update_one(
                {"_id": existing["_id"]},
                {"$set": {"quantity": new_quantity}}
            )
            existing["quantity"] = new_quantity
            existing["_id"] = str(existing["_id"])
            return JsonResponse({
                "message": "Product updated",
                "data": existing
            })
        else:
            # Insert new product
            result = product_collection.insert_one(product_dict)
            product_dict["_id"] = str(result.inserted_id)
            return JsonResponse({
                "message": "Product created",
                "data": product_dict
            })

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)
    
@csrf_exempt
def create_order(request):
    if request.method != "POST":
        return JsonResponse({"error": "Invalid request method"}, status=405)

    try:
        data = json.loads(request.body)
        order = OrderSchema(**data)
        order_dict = order.dict()

        total_price = 0
        products_to_update = []

        # 1️⃣ Validate items and calculate total price
        for item in order_dict["items"]:
            product_name = item["product_name"].strip()

            product = product_collection.find_one({
                "name": {"$regex": f"^{product_name}$", "$options": "i"}
            })

            if not product:
                return JsonResponse(
                    {"error": f"Product '{product_name}' not found"},
                    status=400
                )

            if product["quantity"] < item["quantity"]:
                return JsonResponse(
                    {"error": f"Not enough stock for '{product_name}'"},
                    status=400
                )

            # Save details for stock update
            products_to_update.append({
                "product_id": product["_id"],
                "quantity": item["quantity"]
            })

            # Update item for order
            item["product_id"] = str(product["_id"])
            del item["product_name"]

            total_price += product["price"] * item["quantity"]

        # 2️⃣ Update product stock (atomically)
        for p in products_to_update:
            product_collection.update_one(
                {"_id": p["product_id"], "quantity": {"$gte": p["quantity"]}},
                {"$inc": {"quantity": -p["quantity"]}}
            )

        # 3️⃣ Add order details
        order_dict["total_price"] = total_price
        order_dict["created_at"] = datetime.utcnow()

        # 4️⃣ Save order
        result = order_collection.insert_one(order_dict)
        order_dict["_id"] = str(result.inserted_id)

        return JsonResponse({
            "message": "Order created successfully",
            "data": order_dict
        }, status=201)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
    
def get_products(request):
    products = list(product_collection.find({}))  # Keep _id
    # Convert ObjectId to string so JSON can handle it
    for p in products:
        p["_id"] = str(p["_id"])
    return JsonResponse(products, safe=False)

def get_orders(request):
    orders = list(order_collection.find())

    for order in orders:
        order["_id"] = str(order["_id"])

        for item in order["items"]:
            product = product_collection.find_one(
                {"_id": ObjectId(item["product_id"])}
            )

            if product:
                item["product_name"] = product["name"]

    return JsonResponse(orders, safe=False)


@csrf_exempt
def delete_product(request, product_id):
    if request.method != "DELETE":
        return JsonResponse({"error": "Invalid request method"}, status=405)
    
    try:
        # Convert product_id to ObjectId
        obj_id = ObjectId(product_id)

        result = product_collection.delete_one({"_id": obj_id})

        if result.deleted_count == 0:
            return JsonResponse({"error": "Product not found"}, status=404)

        return JsonResponse({"message": "Product deleted successfully"})

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)



@csrf_exempt
def low_stock_count(request):
    try:
         # For example, low stock threshold is 5
        threshold = 5
        count = product_collection.count_documents({"quantity": {"$lte": threshold}})
        return JsonResponse({"low_stock_count": count})
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)