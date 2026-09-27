import { Router } from 'express';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

const router = Router();

// POST /api/admin/login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Simple hardcoded demo authentication for prospective clients
  if (
    (username === 'admin' && (password === 'admin' || password === 'admin123')) ||
    (username === 'demo' && password === 'demo123')
  ) {
    return res.json({
      success: true,
      token: 'demo-jwt-noir-men-session-token',
      user: {
        username: username || 'admin',
        name: 'Store Manager',
        role: 'Admin'
      }
    });
  }

  return res.status(401).json({
    success: false,
    message: 'Invalid credentials. For demo, use username: admin and password: admin123'
  });
});

// GET /api/admin/stats - 4 clean summary cards
router.get('/stats', async (req, res) => {
  try {
    const [totalProducts, totalOrders, pendingOrders, deliveredOrders, processingOrders, confirmedOrders] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      Order.countDocuments({ status: 'Pending' }),
      Order.countDocuments({ status: 'Delivered' }),
      Order.countDocuments({ status: 'Processing' }),
      Order.countDocuments({ status: 'Confirmed' })
    ]);

    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5);

    return res.json({
      success: true,
      stats: {
        totalProducts,
        totalOrders,
        pendingOrders,
        deliveredOrders,
        processingOrders,
        confirmedOrders
      },
      recentOrders
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch admin stats', error: error.message });
  }
});

export default router;
