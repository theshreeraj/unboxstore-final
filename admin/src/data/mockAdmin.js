export const CATEGORIES = [
  { id: 'c1', name: 'Trousers', products: 4, status: 'Active' },
  { id: 'c2', name: 'Sweaters and Cardigans', products: 4, status: 'Active' },
  { id: 'c3', name: 'Shirts', products: 4, status: 'Active' },
  { id: 'c4', name: 'Jackets', products: 4, status: 'Active' },
  { id: 'c5', name: 'Trench Coats', products: 3, status: 'Active' },
  { id: 'c6', name: 'Jeans', products: 4, status: 'Active' },
  { id: 'c7', name: 'Blazers', products: 3, status: 'Active' },
  { id: 'c8', name: 'Sweatshirts', products: 3, status: 'Active' },
  { id: 'c9', name: 'Polos', products: 3, status: 'Hidden' },
  { id: 'c10', name: 'T-Shirts', products: 3, status: 'Active' },
  { id: 'c11', name: 'Overshirts', products: 3, status: 'Active' },
  { id: 'c12', name: 'Coats', products: 3, status: 'Active' },
  { id: 'c13', name: 'Shorts', products: 3, status: 'Hidden' },
  { id: 'c14', name: 'Linen', products: 3, status: 'Active' },
  { id: 'c15', name: 'Swimwear', products: 3, status: 'Hidden' },
  { id: 'c16', name: 'Underwear', products: 3, status: 'Active' },
  { id: 'c17', name: 'Pyjamas', products: 3, status: 'Active' },
]

export const PRODUCTS = [
  { id: 'p1', name: 'Cable-Knit Cardigan', category: 'Sweaters and Cardigans', price: 250, stock: 18, status: 'In Stock', sold: 142 },
  { id: 'p2', name: 'Merino Wool Sweater', category: 'Sweaters and Cardigans', price: 210, stock: 0, status: 'Out of Stock', sold: 98 },
  { id: 'p3', name: 'Classic Trench Coat', category: 'Trench Coats', price: 320, stock: 7, status: 'Low Stock', sold: 76 },
  { id: 'p4', name: 'Bomber Jacket', category: 'Jackets', price: 195, stock: 24, status: 'In Stock', sold: 210 },
  { id: 'p5', name: 'Tailored Trousers', category: 'Trousers', price: 140, stock: 31, status: 'In Stock', sold: 165 },
  { id: 'p6', name: 'Slim Fit Jeans', category: 'Jeans', price: 175, stock: 12, status: 'In Stock', sold: 188 },
  { id: 'p7', name: 'Oxford Shirt', category: 'Shirts', price: 95, stock: 4, status: 'Low Stock', sold: 121 },
  { id: 'p8', name: 'Unstructured Blazer', category: 'Blazers', price: 280, stock: 9, status: 'In Stock', sold: 54 },
  { id: 'p9', name: 'Essential T-Shirt', category: 'T-Shirts', price: 45, stock: 60, status: 'In Stock', sold: 302 },
  { id: 'p10', name: 'Wool Overcoat', category: 'Coats', price: 410, stock: 0, status: 'Out of Stock', sold: 41 },
]

export const ORDERS = [
  { id: 'ORD-100231', customer: 'Aarav Mehta', date: '2026-09-10', items: 2, total: 415, status: 'Delivered', payment: 'Paid' },
  { id: 'ORD-100230', customer: 'Priya Nair', date: '2026-09-10', items: 1, total: 95, status: 'Processing', payment: 'Paid' },
  { id: 'ORD-100229', customer: 'Kabir Singh', date: '2026-09-09', items: 3, total: 560, status: 'Shipped', payment: 'Paid' },
  { id: 'ORD-100228', customer: 'Ananya Rao', date: '2026-09-09', items: 1, total: 210, status: 'Delivered', payment: 'Paid' },
  { id: 'ORD-100227', customer: 'Rohan Kapoor', date: '2026-09-08', items: 2, total: 335, status: 'Cancelled', payment: 'Refunded' },
  { id: 'ORD-100226', customer: 'Ishita Verma', date: '2026-09-08', items: 4, total: 720, status: 'Delivered', payment: 'Paid' },
  { id: 'ORD-100225', customer: 'Vikram Chatterjee', date: '2026-09-07', items: 1, total: 140, status: 'Processing', payment: 'Pending' },
  { id: 'ORD-100224', customer: 'Sanya Malhotra', date: '2026-09-06', items: 2, total: 285, status: 'Shipped', payment: 'Paid' },
]

export const INVOICES = ORDERS.slice(0, 6).map((o, i) => ({
  id: `INV-${9000 + i}`,
  orderId: o.id,
  customer: o.customer,
  date: o.date,
  amount: o.total,
  status: o.payment === 'Refunded' ? 'Refunded' : o.payment === 'Pending' ? 'Unpaid' : 'Paid',
}))

export const USERS = [
  { id: 'u1', name: 'Aarav Mehta', email: 'aarav.mehta@example.com', joined: '2026-02-14', orders: 6, role: 'Customer', status: 'Active' },
  { id: 'u2', name: 'Priya Nair', email: 'priya.nair@example.com', joined: '2026-03-02', orders: 3, role: 'Customer', status: 'Active' },
  { id: 'u3', name: 'Kabir Singh', email: 'kabir.singh@example.com', joined: '2026-01-20', orders: 11, role: 'Customer', status: 'Active' },
  { id: 'u4', name: 'Ananya Rao', email: 'ananya.rao@example.com', joined: '2026-04-11', orders: 2, role: 'Customer', status: 'Suspended' },
  { id: 'u5', name: 'Dev Malhotra', email: 'dev.malhotra@example.com', joined: '2025-11-30', orders: 0, role: 'Staff', status: 'Active' },
  { id: 'u6', name: 'Sanya Malhotra', email: 'sanya.malhotra@example.com', joined: '2026-05-09', orders: 4, role: 'Customer', status: 'Active' },
]

export const PROMO_CODES = [
  { id: 'pr1', code: 'WELCOME10', type: 'Percent', value: '10%', uses: 342, limit: 1000, status: 'Active', expires: '2026-12-31' },
  { id: 'pr2', code: 'FREESHIP', type: 'Shipping', value: 'Free shipping', uses: 128, limit: 500, status: 'Active', expires: '2026-10-31' },
  { id: 'pr3', code: 'FLASH25', type: 'Percent', value: '25%', uses: 980, limit: 1000, status: 'Expiring', expires: '2026-09-15' },
  { id: 'pr4', code: 'SUMMER20', type: 'Percent', value: '20%', uses: 500, limit: 500, status: 'Expired', expires: '2026-07-01' },
]

export const BANNERS = [
  { id: 'b1', title: 'Outerwear built for the long haul', placement: 'Home Hero — Slide 1', status: 'Live' },
  { id: 'b2', title: 'Linen, lightened for warm days', placement: 'Home Hero — Slide 2', status: 'Live' },
  { id: 'b3', title: 'The wardrobe foundations, refined', placement: 'Home Hero — Slide 3', status: 'Live' },
  { id: 'b4', title: 'Trench Coats — Seasonal Edit', placement: 'Editorial Panel', status: 'Draft' },
  { id: 'b5', title: 'Blazers — Tailoring', placement: 'Editorial Panel', status: 'Live' },
]

export const FLASH_SALES = [
  { id: 'f1', name: 'End of Season Flash', discount: '30% off', starts: '2026-09-12 00:00', ends: '2026-09-14 23:59', status: 'Scheduled', products: 24 },
  { id: 'f2', name: 'Weekend Denim Drop', discount: '20% off Jeans', starts: '2026-09-06 00:00', ends: '2026-09-08 23:59', status: 'Ended', products: 4 },
  { id: 'f3', name: 'Outerwear Flash', discount: '15% off Jackets & Coats', starts: '2026-09-01 00:00', ends: '2026-09-03 23:59', status: 'Ended', products: 7 },
]

export const SUPPORT_TICKETS = [
  { id: 't1', subject: 'Order not delivered', customer: 'Rohan Kapoor', date: '2026-09-10', priority: 'High', status: 'Open' },
  { id: 't2', subject: 'Wrong size received', customer: 'Ishita Verma', date: '2026-09-09', priority: 'Medium', status: 'Open' },
  { id: 't3', subject: 'Refund not processed', customer: 'Vikram Chatterjee', date: '2026-09-08', priority: 'High', status: 'In Progress' },
  { id: 't4', subject: 'Promo code not applying', customer: 'Sanya Malhotra', date: '2026-09-06', priority: 'Low', status: 'Resolved' },
  { id: 't5', subject: 'Change delivery address', customer: 'Priya Nair', date: '2026-09-05', priority: 'Medium', status: 'Resolved' },
]

export const UPDATES = [
  { id: 'up1', title: 'Flash Sales module launched', date: '2026-09-05', tag: 'Feature' },
  { id: 'up2', title: 'Fixed promo code stacking bug', date: '2026-09-02', tag: 'Fix' },
  { id: 'up3', title: 'Faster checkout — reduced steps from 3 to 1', date: '2026-08-27', tag: 'Improvement' },
  { id: 'up4', title: 'Added Shiprocket order tracking', date: '2026-08-19', tag: 'Feature' },
  { id: 'up5', title: 'Dashboard revenue chart added', date: '2026-08-10', tag: 'Feature' },
]

export const BEST_SELLERS = [...PRODUCTS].sort((a, b) => b.sold - a.sold)

export const FEATURED = PRODUCTS.map((p, i) => ({ ...p, featured: i % 3 !== 1 }))

export const DASHBOARD_STATS = {
  revenue: 284650,
  revenueChange: 12.4,
  orders: 1284,
  ordersChange: 8.1,
  customers: 5321,
  customersChange: 4.6,
  aov: 2218,
  aovChange: -1.2,
}

export const REVENUE_TREND = [42, 55, 48, 62, 58, 70, 66, 78, 74, 88, 82, 95]
