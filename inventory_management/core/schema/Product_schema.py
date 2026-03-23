from pydantic import BaseModel,EmailStr
from datetime import datetime

class ProductSchema(BaseModel):
    name:str
    category:str
    quantity:int
    price:float
    created_at:datetime=datetime.utcnow()