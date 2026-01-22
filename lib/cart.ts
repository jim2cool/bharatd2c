type CartItem = {
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

export function addToCart(item: CartItem) {
  saveCart([item]); // still single-item cart
}

export function updateQty(qty: number) {
  const cart = loadCart();
  if (!cart.length) return;

  cart[0].qty = Math.max(1, qty);
  saveCart(cart);
}

export function removeFromCart() {
  saveCart([]);
}

export function clearCart() {
  saveCart([]);
}
