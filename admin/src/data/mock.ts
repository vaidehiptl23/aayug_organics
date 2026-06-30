// ─── Products ─────────────────────────────────────────────────
export const PRODUCTS = [
  { id: "p-1", name: "Premium Himalayan Crystal Salt", category: "Salt",  price: 199, stock: 100, rating: 4.8, reviews: 312, status: "active",  sku: "SAL-HIM-001", badge: "Bestseller" },
  { id: "p-2", name: "Raw Forest Honey",               category: "Honey", price: 549, stock: 75,  rating: 4.9, reviews: 428, status: "active",  sku: "HON-RAW-001", badge: "Organic"    },
  { id: "p-3", name: "Pure Hing (Asafoetida)",          category: "Hing",  price: 299, stock: 18,  rating: 4.7, reviews: 189, status: "active",  sku: "HNG-PUR-001", badge: "New"        },
  { id: "p-4", name: "A2 Gir Cow Ghee",                category: "Ghee",  price: 899, stock: 50,  rating: 4.9, reviews: 567, status: "active",  sku: "GHE-A2G-001", badge: "Bestseller" },
];

// ─── Orders ───────────────────────────────────────────────────
export const ORDERS = [
  { id: "o-1", orderNumber: "AYG-M8X4K-001", customer: "Rahul Sharma",  email: "rahul@example.com",  date: "2024-11-20", status: "delivered",  total: 3200, items: 3, payment: "UPI",  city: "Ahmedabad" },
  { id: "o-2", orderNumber: "AYG-N9Y5L-002", customer: "Priya Mehta",   email: "priya@example.com",   date: "2024-12-05", status: "shipped",    total: 1648, items: 2, payment: "Card", city: "Mumbai"    },
  { id: "o-3", orderNumber: "AYG-P2Z6M-003", customer: "Arjun Patel",   email: "arjun@example.com",   date: "2024-12-18", status: "processing", total: 1040, items: 1, payment: "COD",  city: "Surat"     },
  { id: "o-4", orderNumber: "AYG-Q3A7N-004", customer: "Sneha Nair",    email: "sneha@example.com",   date: "2024-12-20", status: "pending",    total: 2196, items: 2, payment: "UPI",  city: "Pune"      },
  { id: "o-5", orderNumber: "AYG-R4B8O-005", customer: "Rohit Gupta",   email: "rohit@example.com",   date: "2024-12-22", status: "confirmed",  total: 899,  items: 1, payment: "Card", city: "Delhi"     },
  { id: "o-6", orderNumber: "AYG-S5C9P-006", customer: "Anita Singh",   email: "anita@example.com",   date: "2024-12-23", status: "delivered",  total: 4200, items: 4, payment: "UPI",  city: "Bangalore" },
];

// ─── Customers ────────────────────────────────────────────────
export const CUSTOMERS = [
  { id: "c-1", name: "Rahul Sharma",  email: "rahul@example.com",  phone: "9876543210", orders: 3, spent: 4200, joined: "2024-01-15", verified: true  },
  { id: "c-2", name: "Priya Mehta",   email: "priya@example.com",   phone: "9823456780", orders: 7, spent: 8900, joined: "2024-02-20", verified: true  },
  { id: "c-3", name: "Arjun Patel",   email: "arjun@example.com",   phone: "9812345678", orders: 2, spent: 1800, joined: "2024-03-05", verified: true  },
  { id: "c-4", name: "Sneha Nair",    email: "sneha@example.com",   phone: "9765432109", orders: 5, spent: 6500, joined: "2024-04-10", verified: false },
  { id: "c-5", name: "Rohit Gupta",   email: "rohit@example.com",   phone: "9754321098", orders: 1, spent: 899,  joined: "2024-05-15", verified: true  },
  { id: "c-6", name: "Anita Singh",   email: "anita@example.com",   phone: "9743210987", orders: 4, spent: 3600, joined: "2024-06-01", verified: true  },
];

// ─── Analytics ────────────────────────────────────────────────
export const MONTHLY_REVENUE = [
  { month: "Jan", revenue: 12400, orders: 42 },
  { month: "Feb", revenue: 18200, orders: 61 },
  { month: "Mar", revenue: 15800, orders: 53 },
  { month: "Apr", revenue: 22100, orders: 74 },
  { month: "May", revenue: 19600, orders: 66 },
  { month: "Jun", revenue: 28400, orders: 95 },
  { month: "Jul", revenue: 31200, orders: 104 },
  { month: "Aug", revenue: 26800, orders: 89 },
  { month: "Sep", revenue: 34500, orders: 115 },
  { month: "Oct", revenue: 41200, orders: 137 },
  { month: "Nov", revenue: 38900, orders: 129 },
  { month: "Dec", revenue: 52300, orders: 174 },
];

export const CATEGORY_SALES = [
  { name: "Ghee",  value: 45, color: "#1b4332" },
  { name: "Honey", value: 28, color: "#d4a373" },
  { name: "Salt",  value: 18, color: "#6366f1" },
  { name: "Hing",  value: 9,  color: "#f59e0b" },
];
