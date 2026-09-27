import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Product from './models/Product.js';
import Order from './models/Order.js';
import { SEED_PRODUCTS } from './seedData.js';

let mongod = null;

export async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  let mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    try {
      console.log('Starting in-memory MongoDB server...');
      mongod = await MongoMemoryServer.create();
      mongoUri = mongod.getUri();
      console.log(`In-memory MongoDB started at: ${mongoUri}`);
    } catch (err) {
      console.error('Failed to start MongoMemoryServer, attempting fallback connection:', err.message);
      mongoUri = 'mongodb://127.0.0.1:27017/noir_men_db';
    }
  }

  try {
    await mongoose.connect(mongoUri, {
      dbName: 'noir_men_db'
    });
    console.log('MongoDB connected successfully via Mongoose.');

    // Seed products if collection is empty
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log('Seeding initial 24 NOIR MEN products to MongoDB...');
      await Product.insertMany(SEED_PRODUCTS);
      console.log('Successfully seeded 24 products into MongoDB.');
    } else {
      console.log(`MongoDB already initialized with ${productCount} products.`);
    }

    // Seed demo initial orders if none exist for realistic admin demo
    const orderCount = await Order.countDocuments();
    if (orderCount === 0) {
      console.log('Seeding demo initial orders for Admin demonstration...');
      const demoOrders = [
        {
          orderId: 'NM-20260924-8142',
          customerName: 'Tanvir Ahmed',
          phone: '01711982341',
          email: 'tanvir.ahmed@gmail.com',
          district: 'Dhaka',
          area: 'Gulshan 2, Road 71',
          address: 'House 14, Apartment 4B, Road 71, Gulshan 2, Dhaka',
          notes: 'Please call before delivery.',
          products: [
            {
              id: 'nm-pj-01',
              name: 'The Onyx Signature Silk Panjabi',
              price: 3450,
              quantity: 1,
              size: 'L',
              color: { name: 'Onyx Black', hex: '#111111' },
              image: '/assets/images/category_panjabi_1790217944904.jpg'
            },
            {
              id: 'nm-ts-01',
              name: 'Heavyweight Boxy Drop-Shoulder Tee',
              price: 950,
              quantity: 2,
              size: 'XL',
              color: { name: 'Mineral Black', hex: '#1F1F1F' },
              image: '/assets/images/category_tshirt_1790217958167.jpg'
            }
          ],
          totalQuantity: 3,
          subtotal: 5350,
          deliveryCharge: 0,
          total: 5350,
          paymentMethod: 'Cash on Delivery',
          status: 'Confirmed',
          createdAt: new Date(Date.now() - 2 * 3600 * 1000)
        },
        {
          orderId: 'NM-20260924-4299',
          customerName: 'Shakib Al Hasan',
          phone: '01819234567',
          email: 'shakib.h@outlook.com',
          district: 'Chattogram',
          area: 'Nasirabad Housing Society',
          address: 'Road 3, House 18, Nasirabad, Chattogram',
          notes: 'Leave at front desk with security if unavailable.',
          products: [
            {
              id: 'nm-sh-01',
              name: 'Band Collar Oxford Linen Shirt',
              price: 1650,
              quantity: 1,
              size: 'M',
              color: { name: 'Pure White', hex: '#FFFFFF' },
              image: '/assets/images/category_shirt_1790217968360.jpg'
            },
            {
              id: 'nm-pt-01',
              name: 'Tailored Tech Stretch Chino',
              price: 1950,
              quantity: 1,
              size: '32',
              color: { name: 'Charcoal Gray', hex: '#374151' },
              image: '/assets/images/category_pants_1790217977864.jpg'
            }
          ],
          totalQuantity: 2,
          subtotal: 3600,
          deliveryCharge: 0,
          total: 3600,
          paymentMethod: 'Cash on Delivery',
          status: 'Processing',
          createdAt: new Date(Date.now() - 6 * 3600 * 1000)
        },
        {
          orderId: 'NM-20260923-9031',
          customerName: 'Mahmudur Rahman',
          phone: '01912837465',
          email: 'mahmud.r@gmail.com',
          district: 'Sylhet',
          area: 'Upashahar, Block D',
          address: 'Holding 82, Main Road, Upashahar, Sylhet',
          notes: 'Fragile packing requested.',
          products: [
            {
              id: 'nm-pj-04',
              name: 'Emerald Festive Cotton-Lurex Panjabi',
              price: 2950,
              quantity: 1,
              size: 'XL',
              color: { name: 'Forest Emerald', hex: '#123524' },
              image: '/assets/images/category_panjabi_1790217944904.jpg'
            }
          ],
          totalQuantity: 1,
          subtotal: 2950,
          deliveryCharge: 130,
          total: 3080,
          paymentMethod: 'Cash on Delivery',
          status: 'Delivered',
          createdAt: new Date(Date.now() - 28 * 3600 * 1000)
        },
        {
          orderId: 'NM-20260923-3118',
          customerName: 'Rafiqul Islam',
          phone: '01678129034',
          email: 'rafiqul.islam@yahoo.com',
          district: 'Dhaka',
          area: 'Dhanmondi 27',
          address: 'House 42, Road 27 (Old), Dhanmondi, Dhaka',
          notes: 'Deliver after 5 PM.',
          products: [
            {
              id: 'nm-ts-02',
              name: 'Supima Luxury Cotton Crew Neck',
              price: 850,
              quantity: 2,
              size: 'L',
              color: { name: 'Chalk White', hex: '#FAFAFA' },
              image: '/assets/images/category_tshirt_1790217958167.jpg'
            }
          ],
          totalQuantity: 2,
          subtotal: 1700,
          deliveryCharge: 80,
          total: 1780,
          paymentMethod: 'Cash on Delivery',
          status: 'Pending',
          createdAt: new Date(Date.now() - 35 * 3600 * 1000)
        }
      ];
      await Order.insertMany(demoOrders);
      console.log('Seeded demo initial orders.');
    }
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err;
  }
}

export async function disconnectDB() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  if (mongod) {
    await mongod.stop();
  }
}
