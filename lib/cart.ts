export type CartItem = {
  product_id: string;
  title: string;
  image: string;
  price: number;
  qty: number;
};

const CART_KEY = "d2c_cart";

function notifyCartUpdate() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("cart-updated"));
  }
}

function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCart(cart: CartItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  notifyCartUpdate();
}

export function getCart(): CartItem[] {
  return loadCart();
}

export function addToCart(item: any) {
  const cart = loadCart();

  // 🔒 Normalize product id once
  const pid = item.product_id || item.id;
  if (!pid) return;

  const index = cart.findIndex(
    c => c.product_id === pid
  );

  if (index >= 0) {
    cart[index].qty += item.qty || 1;
  } else {
    cart.push({
      product_id: pid,
      title: item.title,
      image: item.image,
      price: item.price,
      qty: item.qty || 1,
    });
  }

  saveCart(cart);
}

export function updateQty(product_id: string, qty: number) {
  const cart = loadCart();

  const index = cart.findIndex(
    c => c.product_id === product_id
  );

  if (index === -1) return;

  cart[index].qty = Math.max(1, qty);
  saveCart(cart);
}

export function removeFromCart(product_id: string) {
  saveCart(
    loadCart().filter(c => c.product_id !== product_id)
  );
}

export function clearCart() {
  saveCart([]);
}
