type OrderItem = {
  product_id: number;
  name: string;
  quantity: number;
  price: string;
  image?: string;
};

type Order = {
  order_id: number;
  total_amount: string;
  payment_method: string;
  payment_status: string;
  order_status: string;
  created_at: string;
  items: OrderItem[];
};

export { Order, OrderItem };
