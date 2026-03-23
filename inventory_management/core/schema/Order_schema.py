from pydantic import BaseModel,Field
from datetime import datetime
from typing import List


class OrderItem(BaseModel):
    product_name:str
    quantity:int
    
class OrderSchema(BaseModel):
    customer_name:str
    items:List[OrderItem]
    created_at:datetime=Field(default_factory=datetime.utcnow)