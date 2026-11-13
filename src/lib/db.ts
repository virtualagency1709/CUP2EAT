// @ts-ignore
import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';
import bcrypt from 'bcryptjs';

let dbInstance: any = null;

export function getDb(): any {
  if (!dbInstance) {
    let targetPath = path.join(process.cwd(), 'cup2eat.db');

    // On Vercel / AWS Lambda, the root deployment directory is read-only.
    // Copy the database file to /tmp (which provides 512MB of writable storage)
    if (process.env.VERCEL) {
      const tmpPath = path.join('/tmp', 'cup2eat.db');
      try {
        if (!fs.existsSync(tmpPath) && fs.existsSync(targetPath)) {
          fs.copyFileSync(targetPath, tmpPath);
        }
        if (fs.existsSync(tmpPath)) {
          targetPath = tmpPath;
        }
      } catch (err) {
        console.warn('Vercel tmp copy notice:', err);
      }
    }

    try {
      dbInstance = new DatabaseSync(targetPath);
      try {
        dbInstance.exec('PRAGMA foreign_keys = ON;');
        dbInstance.exec('PRAGMA journal_mode = WAL;');
      } catch {
        // WAL may not be supported on all filesystems
      }
      try {
        initDatabase(dbInstance);
      } catch (e) {
        // Tables already exist or initialized
      }
    } catch {
      // If opening with write fails, fallback to read-only
      try {
        dbInstance = new DatabaseSync(targetPath, { readOnly: true });
      } catch (err) {
        console.error('Failed to open database:', err);
        throw err;
      }
    }
  }
  return dbInstance;
}

function initDatabase(db: DatabaseSync) {
  // 1. Users
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      phone TEXT,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'CUSTOMER',
      avatar TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 2. Admin Users
  db.exec(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'SUPER_ADMIN',
      permissions TEXT NOT NULL DEFAULT 'all',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 3. Categories
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      description TEXT,
      image TEXT,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 4. Flavours
  db.exec(`
    CREATE TABLE IF NOT EXISTS flavours (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      slug TEXT NOT NULL UNIQUE,
      color TEXT NOT NULL DEFAULT '#FF5E1E',
      description TEXT,
      icon TEXT,
      is_popular INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 5. Products
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      tagline TEXT,
      description TEXT NOT NULL,
      short_description TEXT,
      category_id TEXT NOT NULL,
      base_price REAL NOT NULL,
      sale_price REAL,
      discount_percent INTEGER NOT NULL DEFAULT 0,
      sku TEXT NOT NULL UNIQUE,
      stock INTEGER NOT NULL DEFAULT 50,
      is_available INTEGER NOT NULL DEFAULT 1,
      is_featured INTEGER NOT NULL DEFAULT 0,
      is_best_seller INTEGER NOT NULL DEFAULT 0,
      rating REAL NOT NULL DEFAULT 4.9,
      review_count INTEGER NOT NULL DEFAULT 0,
      pack_size TEXT NOT NULL DEFAULT 'Pack of 4',
      shelf_life TEXT NOT NULL DEFAULT '9 Months',
      temperature TEXT NOT NULL DEFAULT 'Holds hot liquids up to 85°C & cold for 45+ mins',
      ingredients TEXT,
      nutritional_info TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
    );
  `);

  // 6. Product Images
  db.exec(`
    CREATE TABLE IF NOT EXISTS product_images (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL,
      url TEXT NOT NULL,
      alt TEXT,
      is_primary INTEGER NOT NULL DEFAULT 0,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );
  `);

  // 7. Product Variants
  db.exec(`
    CREATE TABLE IF NOT EXISTS product_variants (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL,
      flavour_id TEXT,
      pack_size TEXT NOT NULL,
      price REAL NOT NULL,
      sale_price REAL,
      stock INTEGER NOT NULL DEFAULT 25,
      sku TEXT,
      image TEXT,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
      FOREIGN KEY (flavour_id) REFERENCES flavours(id) ON DELETE SET NULL
    );
  `);

  // 8. Carts
  db.exec(`
    CREATE TABLE IF NOT EXISTS carts (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      session_id TEXT UNIQUE,
      subtotal REAL NOT NULL DEFAULT 0,
      discount REAL NOT NULL DEFAULT 0,
      delivery_charge REAL NOT NULL DEFAULT 0,
      total REAL NOT NULL DEFAULT 0,
      coupon_code TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // 9. Cart Items
  db.exec(`
    CREATE TABLE IF NOT EXISTS cart_items (
      id TEXT PRIMARY KEY,
      cart_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      variant_id TEXT,
      flavour TEXT,
      pack_size TEXT,
      quantity INTEGER NOT NULL DEFAULT 1,
      unit_price REAL NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
      FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE SET NULL
    );
  `);

  // 10. Orders
  db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      order_number TEXT NOT NULL UNIQUE,
      user_id TEXT,
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      address_id TEXT,
      delivery_address TEXT NOT NULL,
      city TEXT NOT NULL,
      state TEXT NOT NULL,
      pin_code TEXT NOT NULL,
      order_notes TEXT,
      subtotal REAL NOT NULL,
      tax_amount REAL NOT NULL DEFAULT 0,
      delivery_charge REAL NOT NULL DEFAULT 0,
      discount_amount REAL NOT NULL DEFAULT 0,
      grand_total REAL NOT NULL,
      payment_method TEXT NOT NULL DEFAULT 'COD',
      payment_status TEXT NOT NULL DEFAULT 'PENDING',
      order_status TEXT NOT NULL DEFAULT 'PENDING',
      tracking_number TEXT,
      courier_name TEXT,
      estimated_delivery TEXT,
      cancelled_reason TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    );
  `);

  // 11. Order Items
  db.exec(`
    CREATE TABLE IF NOT EXISTS order_items (
      id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL,
      product_id TEXT,
      product_name TEXT NOT NULL,
      product_slug TEXT,
      product_image TEXT,
      flavour TEXT,
      pack_size TEXT,
      quantity INTEGER NOT NULL,
      unit_price REAL NOT NULL,
      total_price REAL NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
    );
  `);

  // 12. Payments
  db.exec(`
    CREATE TABLE IF NOT EXISTS payments (
      id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL,
      razorpay_order_id TEXT,
      razorpay_payment_id TEXT,
      razorpay_signature TEXT,
      amount REAL NOT NULL,
      currency TEXT NOT NULL DEFAULT 'INR',
      status TEXT NOT NULL DEFAULT 'PENDING',
      method TEXT NOT NULL DEFAULT 'RAZORPAY',
      raw_response TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
    );
  `);

  // 13. Invoices
  db.exec(`
    CREATE TABLE IF NOT EXISTS invoices (
      id TEXT PRIMARY KEY,
      invoice_number TEXT NOT NULL UNIQUE,
      order_id TEXT NOT NULL,
      invoice_date TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      billing_address TEXT NOT NULL,
      items_json TEXT NOT NULL,
      subtotal REAL NOT NULL,
      tax REAL NOT NULL,
      delivery REAL NOT NULL,
      discount REAL NOT NULL,
      grand_total REAL NOT NULL,
      status TEXT NOT NULL DEFAULT 'GENERATED',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
    );
  `);

  // 14. Addresses
  db.exec(`
    CREATE TABLE IF NOT EXISTS addresses (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      full_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      street_address TEXT NOT NULL,
      landmark TEXT,
      city TEXT NOT NULL,
      state TEXT NOT NULL,
      pin_code TEXT NOT NULL,
      is_default INTEGER NOT NULL DEFAULT 0,
      address_type TEXT NOT NULL DEFAULT 'HOME',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // 15. Coupons
  db.exec(`
    CREATE TABLE IF NOT EXISTS coupons (
      id TEXT PRIMARY KEY,
      code TEXT NOT NULL UNIQUE,
      description TEXT,
      discount_type TEXT NOT NULL DEFAULT 'PERCENT',
      discount_value REAL NOT NULL,
      min_order_value REAL NOT NULL DEFAULT 0,
      max_discount REAL,
      valid_from TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      valid_until TEXT,
      usage_limit INTEGER,
      used_count INTEGER NOT NULL DEFAULT 0,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 16. Coupon Usage
  db.exec(`
    CREATE TABLE IF NOT EXISTS coupon_usage (
      id TEXT PRIMARY KEY,
      coupon_id TEXT NOT NULL,
      user_id TEXT,
      order_id TEXT,
      discount_amount REAL NOT NULL,
      used_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL
    );
  `);

  // 17. Inventory
  db.exec(`
    CREATE TABLE IF NOT EXISTS inventory (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL UNIQUE,
      stock_quantity INTEGER NOT NULL DEFAULT 100,
      safety_stock INTEGER NOT NULL DEFAULT 15,
      reorder_level INTEGER NOT NULL DEFAULT 20,
      status TEXT NOT NULL DEFAULT 'IN_STOCK',
      last_restocked_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );
  `);

  // 18. Inventory Logs
  db.exec(`
    CREATE TABLE IF NOT EXISTS inventory_logs (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL,
      change_type TEXT NOT NULL,
      quantity_changed INTEGER NOT NULL,
      previous_stock INTEGER NOT NULL,
      new_stock INTEGER NOT NULL,
      reason TEXT,
      reference_id TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );
  `);

  // 19. Order Tracking
  db.exec(`
    CREATE TABLE IF NOT EXISTS order_tracking (
      id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL,
      status TEXT NOT NULL,
      description TEXT NOT NULL,
      location TEXT,
      timestamp TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
    );
  `);

  // 20. Reviews
  db.exec(`
    CREATE TABLE IF NOT EXISTS reviews (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL,
      user_id TEXT,
      user_name TEXT NOT NULL,
      user_avatar TEXT,
      rating INTEGER NOT NULL DEFAULT 5,
      title TEXT,
      comment TEXT NOT NULL,
      is_verified_purchase INTEGER NOT NULL DEFAULT 1,
      is_approved INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    );
  `);

  // 21. Wishlists
  db.exec(`
    CREATE TABLE IF NOT EXISTS wishlists (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL UNIQUE,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // 22. Wishlist Items
  db.exec(`
    CREATE TABLE IF NOT EXISTS wishlist_items (
      id TEXT PRIMARY KEY,
      wishlist_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(wishlist_id, product_id),
      FOREIGN KEY (wishlist_id) REFERENCES wishlists(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );
  `);

  // 23. Newsletter Subscribers
  db.exec(`
    CREATE TABLE IF NOT EXISTS newsletter_subscribers (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      status TEXT NOT NULL DEFAULT 'ACTIVE',
      subscribed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 24. Contact Messages
  db.exec(`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      subject TEXT,
      message TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'NEW',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 25. Site Settings
  db.exec(`
    CREATE TABLE IF NOT EXISTS site_settings (
      id TEXT PRIMARY KEY,
      key TEXT NOT NULL UNIQUE,
      value TEXT NOT NULL,
      description TEXT,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Seed default data if needed
  seedInitialData(db);
}

function seedInitialData(db: DatabaseSync) {
  // Check if admin exists
  const existingAdmin = db.prepare('SELECT id FROM admin_users WHERE email = ?').get('admin@cup2eat.com');
  if (!existingAdmin) {
    const adminPass = bcrypt.hashSync('admin123', 10);
    db.prepare(`
      INSERT INTO admin_users (id, name, email, password_hash, role, permissions)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run('admin-1', 'Varun Khera (CUP2EAT Founder)', 'admin@cup2eat.com', adminPass, 'SUPER_ADMIN', 'all');
  }

  // Check if demo customer exists
  const existingCustomer = db.prepare('SELECT id FROM users WHERE email = ?').get('customer@cup2eat.com');
  if (!existingCustomer) {
    const customerPass = bcrypt.hashSync('customer123', 10);
    db.prepare(`
      INSERT INTO users (id, name, email, phone, password_hash, role)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run('cust-1', 'Priya Sharma', 'customer@cup2eat.com', '9818192575', customerPass, 'CUSTOMER');

    // Add demo address for customer
    db.prepare(`
      INSERT INTO addresses (id, user_id, full_name, phone, street_address, landmark, city, state, pin_code, is_default, address_type)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run('addr-1', 'cust-1', 'Priya Sharma', '9818192575', 'Flat 402, Sunshine Heights, Cyber City', 'Near DLF Phase 2', 'Gurugram', 'Haryana', '122002', 1, 'HOME');
  }

  // Seed Categories
  const categoryCount = db.prepare('SELECT COUNT(*) as count FROM categories').get() as { count: number };
  if (categoryCount.count === 0) {
    const categories = [
      { id: 'cat-1', name: 'Edible Cookie Cups', slug: 'edible-cookie-cups', description: 'Crisp, oven-baked cookie cups double-lined with rich cocoa and creams.', image: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=800&q=80' },
      { id: 'cat-2', name: 'Edible Wafer Cups', slug: 'edible-wafer-cups', description: 'Light, crunchy wafer cups lined with subtle vanilla and chocolate.', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80' },
      { id: 'cat-3', name: 'Dessert & Fruit Cups', slug: 'dessert-fruit-cups', description: 'Sweet fruit and berry glazed edible cups crafted for mousses and sundaes.', image: 'https://images.unsplash.com/photo-1541658016709-82535e94bc69?w=800&q=80' },
      { id: 'cat-4', name: 'Gift & Party Packs', slug: 'gift-party-packs', description: 'Assorted gift hampers and party boxes for gatherings, events, and celebrations.', image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&q=80' },
      { id: 'cat-5', name: 'Combo & DIY Kits', slug: 'combo-diy-kits', description: 'Complete kits with hot drinking chocolate, toppings, and edible cups.', image: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=800&q=80' },
      { id: 'cat-6', name: 'Bulk & Café Packs', slug: 'bulk-cafe-packs', description: 'Commercial packages designed for cafés, coffee shops, and catering.', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80' },
    ];
    for (const c of categories) {
      db.prepare('INSERT INTO categories (id, name, slug, description, image) VALUES (?, ?, ?, ?, ?)').run(c.id, c.name, c.slug, c.description, c.image);
    }
  }

  // Seed Flavours
  const flavourCount = db.prepare('SELECT COUNT(*) as count FROM flavours').get() as { count: number };
  if (flavourCount.count === 0) {
    const flavours = [
      { id: 'flav-1', name: 'Belgian Chocolate', slug: 'belgian-chocolate', color: '#4A2511', description: 'Rich 55% cocoa chocolate lining that melts luxuriously into warm beverages.', isPopular: 1 },
      { id: 'flav-2', name: 'Madagascar Vanilla', slug: 'madagascar-vanilla', color: '#D4A373', description: 'Creamy, aromatic vanilla glaze with a crisp buttery crumb finish.', isPopular: 1 },
      { id: 'flav-3', name: 'Hazelnut Mocha', slug: 'hazelnut-mocha', color: '#6F4E37', description: 'Roasted hazelnut paste infused into velvet mocha cocoa coating.', isPopular: 1 },
      { id: 'flav-4', name: 'Berry Strawberry', slug: 'berry-strawberry', color: '#E11D48', description: 'Real strawberry infusion inside white chocolate glaze.', isPopular: 1 },
      { id: 'flav-5', name: 'Lotus Biscoff Crunch', slug: 'lotus-biscoff-crunch', color: '#B45309', description: 'Caramelized spiced speculoos biscuit cream layer.', isPopular: 1 },
      { id: 'flav-6', name: '70% Dark Espresso', slug: 'dark-espresso', color: '#2B170E', description: 'Intense single-origin dark cocoa for sophisticated coffee lovers.', isPopular: 0 },
    ];
    for (const f of flavours) {
      db.prepare('INSERT INTO flavours (id, name, slug, color, description, is_popular) VALUES (?, ?, ?, ?, ?, ?)').run(f.id, f.name, f.slug, f.color, f.description, f.isPopular);
    }
  }

  // Seed Products
  const productCount = db.prepare('SELECT COUNT(*) as count FROM products').get() as { count: number };
  if (productCount.count === 0) {
    const products = [
      {
        id: 'prod-1',
        name: 'Choco Crunch Edible Cookie Cup',
        slug: 'choco-crunch-edible-cup',
        tagline: 'Pour your coffee, sip slowly, and crunch the cup!',
        description: 'Our signature CUP2EAT creation! A baked golden butter-cookie cup lined on the inside with rich Belgian chocolate glaze. Designed with thermo-resistant food tech to keep drinks hot up to 85°C without leaking for over 45 minutes.',
        shortDescription: 'Signature butter-cookie cup lined with rich Belgian chocolate. 100% Edible & Eco-friendly.',
        categoryId: 'cat-1',
        basePrice: 399,
        salePrice: 349,
        discountPercent: 13,
        sku: 'C2E-CHOCO-4P',
        stock: 65,
        isAvailable: 1,
        isFeatured: 1,
        isBestSeller: 1,
        rating: 4.9,
        reviewCount: 148,
        packSize: 'Pack of 4',
        shelfLife: '9 Months',
        temperature: 'Holds liquids up to 85°C & cold drinks for 45+ mins',
        ingredients: 'Wheat Flour, Belgian Cocoa Butter, Cocoa Solids, Butter, Brown Cane Sugar, Natural Vanilla Extract, Soy Lecithin.',
        nutritionalInfo: 'Energy: 135 kcal per cup | Protein: 2.4g | Carbs: 18g | Fats: 6g',
        imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=900&q=80',
        flavourId: 'flav-1'
      },
      {
        id: 'prod-2',
        name: 'Classic Vanilla Wafer Cup',
        slug: 'classic-vanilla-wafer-cup',
        tagline: 'Light, crispy, and infused with Madagascar vanilla.',
        description: 'A light, golden wafer cup lined with silky sweet vanilla glaze. Ideal for creamy cappuccinos, machiatos, and dessert sundaes. Crisp texture remains firm till the very last drop.',
        shortDescription: 'Crispy wafer cup with sweet Madagascar vanilla glaze lining.',
        categoryId: 'cat-2',
        basePrice: 349,
        salePrice: 299,
        discountPercent: 14,
        sku: 'C2E-VAN-6P',
        stock: 80,
        isAvailable: 1,
        isFeatured: 1,
        isBestSeller: 0,
        rating: 4.8,
        reviewCount: 92,
        packSize: 'Pack of 6',
        shelfLife: '9 Months',
        temperature: 'Holds warm liquids up to 80°C for 40+ mins',
        ingredients: 'Refined Wheat Flour, Vegetable Fat, Milk Solids, Natural Madagascar Vanilla, Sea Salt, Emulsifiers.',
        nutritionalInfo: 'Energy: 95 kcal per cup | Protein: 1.8g | Carbs: 14g | Fats: 3.5g',
        imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=900&q=80',
        flavourId: 'flav-2'
      },
      {
        id: 'prod-3',
        name: 'Hazelnut Mocha Glaze Cup',
        slug: 'hazelnut-mocha-glaze-cup',
        tagline: 'Roasted Turkish hazelnuts meets rich cocoa.',
        description: 'Indulge in nutty perfection. Handcrafted edible cookie cups lined with a velvety blend of roasted hazelnuts and dark mocha chocolate. When filled with hot milk or coffee, the aroma is pure heaven.',
        shortDescription: 'Cookie cup coated with roasted hazelnut paste and velvety mocha cocoa.',
        categoryId: 'cat-1',
        basePrice: 449,
        salePrice: 389,
        discountPercent: 13,
        sku: 'C2E-HAZEL-4P',
        stock: 45,
        isAvailable: 1,
        isFeatured: 1,
        isBestSeller: 1,
        rating: 5.0,
        reviewCount: 112,
        packSize: 'Pack of 4',
        shelfLife: '9 Months',
        temperature: 'Holds liquids up to 85°C & cold beverages for 45+ mins',
        ingredients: 'Flour, Roasted Hazelnuts (18%), Cocoa Solids, Pure Butter, Demerara Sugar, Milk Solids.',
        nutritionalInfo: 'Energy: 148 kcal per cup | Protein: 3.1g | Carbs: 16g | Fats: 7.8g',
        imageUrl: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=900&q=80',
        flavourId: 'flav-3'
      },
      {
        id: 'prod-4',
        name: 'Berry Strawberry Swirl Cup',
        slug: 'berry-strawberry-swirl-cup',
        tagline: 'Vibrant strawberry sweetness in every crunchy bite.',
        description: 'Crafted for summer vibes, milkshakes, iced teas, and dessert puddings! Lined with real strawberry puree and white chocolate glaze on a delicate crispy biscuit cup.',
        shortDescription: 'Biscuit cup coated with luscious real strawberry and white chocolate.',
        categoryId: 'cat-3',
        basePrice: 429,
        salePrice: 369,
        discountPercent: 14,
        sku: 'C2E-BERRY-4P',
        stock: 40,
        isAvailable: 1,
        isFeatured: 0,
        isBestSeller: 0,
        rating: 4.7,
        reviewCount: 64,
        packSize: 'Pack of 4',
        shelfLife: '9 Months',
        temperature: 'Holds iced drinks and warm drinks up to 75°C for 45 mins',
        ingredients: 'Flour, Strawberry Powder, White Chocolate (Cocoa Butter, Sugar, Milk Solids), Vegetable Fat, Citric Acid.',
        nutritionalInfo: 'Energy: 128 kcal per cup | Protein: 2.0g | Carbs: 19g | Fats: 5.2g',
        imageUrl: 'https://images.unsplash.com/photo-1541658016709-82535e94bc69?w=900&q=80',
        flavourId: 'flav-4'
      },
      {
        id: 'prod-5',
        name: 'Lotus Biscoff Crunch Cup',
        slug: 'lotus-biscoff-crunch-cup',
        tagline: 'Spiced caramel biscuit perfection. The internet favourite!',
        description: 'The sensational Lotus Biscoff edible cup! Double baked biscuit cup lined with thick creamy speculoos spread and caramelized biscuit bits. Pour your hot latte and watch the flavour elevate.',
        shortDescription: 'Lined with authentic spiced speculoos caramel biscuit spread.',
        categoryId: 'cat-1',
        basePrice: 499,
        salePrice: 429,
        discountPercent: 14,
        sku: 'C2E-BISCOFF-4P',
        stock: 55,
        isAvailable: 1,
        isFeatured: 1,
        isBestSeller: 1,
        rating: 5.0,
        reviewCount: 230,
        packSize: 'Pack of 4',
        shelfLife: '9 Months',
        temperature: 'Holds hot coffee up to 85°C for 45+ mins',
        ingredients: 'Caramelised Biscuits (Wheat Flour, Sugar, Vegetable Oils, Candy Sugar Syrup), Raising Agent, Cinnamon, Soy Flour.',
        nutritionalInfo: 'Energy: 152 kcal per cup | Protein: 2.6g | Carbs: 21g | Fats: 6.9g',
        imageUrl: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=900&q=80',
        flavourId: 'flav-5'
      },
      {
        id: 'prod-6',
        name: 'Dark Espresso Velvet Cup',
        slug: 'dark-espresso-velvet-cup',
        tagline: '70% Dark cocoa for true coffee connoisseurs.',
        description: 'For coffee purists who want no extra sweetness. Our 70% dark cocoa lining offers deep, earthy, bittersweet notes that accentuate single-origin espresso and dark roasts.',
        shortDescription: 'Coated with 70% single-origin dark chocolate. Zero artificial flavours.',
        categoryId: 'cat-1',
        basePrice: 459,
        salePrice: 399,
        discountPercent: 13,
        sku: 'C2E-DARK-4P',
        stock: 35,
        isAvailable: 1,
        isFeatured: 0,
        isBestSeller: 0,
        rating: 4.8,
        reviewCount: 78,
        packSize: 'Pack of 4',
        shelfLife: '9 Months',
        temperature: 'Holds piping hot coffee up to 88°C for 50 mins',
        ingredients: 'Cocoa Mass (70%), Cocoa Butter, Unrefined Sugar, Wheat Flour, Roasted Coffee Extract.',
        nutritionalInfo: 'Energy: 125 kcal per cup | Protein: 3.2g | Carbs: 14g | Fats: 6.5g',
        imageUrl: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=900&q=80',
        flavourId: 'flav-6'
      },
      {
        id: 'prod-7',
        name: 'CUP2EAT Party Starter Assorted Box (12 Cups)',
        slug: 'cup2eat-party-starter-box',
        tagline: 'The ultimate crowd pleaser! 4 flavours in one luxury box.',
        description: 'Host unforgettable tea parties, birthdays, and dinners. Includes 3 cups each of: Belgian Chocolate, Lotus Biscoff, Hazelnut Mocha, and Strawberry Bliss. Packed in an airtight protective gift hamper.',
        shortDescription: '12 assorted edible cups across 4 best-selling flavours in a luxury gift box.',
        categoryId: 'cat-4',
        basePrice: 1199,
        salePrice: 999,
        discountPercent: 17,
        sku: 'C2E-PARTY-12P',
        stock: 50,
        isAvailable: 1,
        isFeatured: 1,
        isBestSeller: 1,
        rating: 4.9,
        reviewCount: 310,
        packSize: 'Pack of 12',
        shelfLife: '9 Months',
        temperature: 'Universal thermo-shield technology for hot & cold',
        ingredients: 'Assorted ingredients across Chocolate, Hazelnut, Strawberry, and Biscoff recipes.',
        nutritionalInfo: 'Average 135 kcal per cup across variants.',
        imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=900&q=80',
        flavourId: 'flav-1'
      },
      {
        id: 'prod-8',
        name: 'DIY Belgian Hot Chocolate & Edible Cup Kit',
        slug: 'diy-hot-chocolate-cup-kit',
        tagline: 'Pour, sip, melt, and eat! The viral chocolate experience.',
        description: 'Complete experiential kit! Comes with 4 Belgian Chocolate Edible Cups, 200g of pure Belgian Drinking Chocolate pellets, mini marshmallows, and a wooden stirring spoon. Great for gifting!',
        shortDescription: '4 Edible Chocolate Cups + 200g Belgian Drinking Chocolate + Marshmallows.',
        categoryId: 'cat-5',
        basePrice: 799,
        salePrice: 649,
        discountPercent: 19,
        sku: 'C2E-DIY-KIT',
        stock: 30,
        isAvailable: 1,
        isFeatured: 1,
        isBestSeller: 0,
        rating: 4.9,
        reviewCount: 88,
        packSize: 'Full Kit (4 Cups + Choco)',
        shelfLife: '9 Months',
        temperature: 'Holds hot milk up to 85°C',
        ingredients: 'Edible cups, Belgian Chocolate Buttons (54% Cocoa), Sugar, Milk Solids, Mini Gelatin Marshmallows.',
        nutritionalInfo: 'Kit total: 780 kcal.',
        imageUrl: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=900&q=80',
        flavourId: 'flav-1'
      },
      {
        id: 'prod-9',
        name: 'CUP2EAT Café Master Commercial Pack (24 Cups)',
        slug: 'cup2eat-cafe-master-pack',
        tagline: 'Zero waste solution for premium cafés and restaurants.',
        description: 'Individually heat-sealed in biodegradable protective sleeves for hospitality hygiene. 12 Chocolate and 12 Vanilla wafer cups. Impress your café guests with edible zero-waste coffee cups.',
        shortDescription: 'Commercial box of 24 individually sealed edible cups for cafés & events.',
        categoryId: 'cat-6',
        basePrice: 2199,
        salePrice: 1849,
        discountPercent: 16,
        sku: 'C2E-CAFE-24P',
        stock: 25,
        isAvailable: 1,
        isFeatured: 0,
        isBestSeller: 0,
        rating: 4.9,
        reviewCount: 42,
        packSize: 'Box of 24',
        shelfLife: '9 Months',
        temperature: 'Heavy-duty café grade for hot & cold',
        ingredients: 'Standard Belgian Choco and Vanilla recipes.',
        nutritionalInfo: 'Standard nutritional values per cup.',
        imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=900&q=80',
        flavourId: 'flav-1'
      }
    ];

    for (const p of products) {
      db.prepare(`
        INSERT INTO products (
          id, name, slug, tagline, description, short_description, category_id,
          base_price, sale_price, discount_percent, sku, stock, is_available,
          is_featured, is_best_seller, rating, review_count, pack_size,
          shelf_life, temperature, ingredients, nutritional_info
        ) VALUES (
          ?, ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?,
          ?, ?, ?, ?
        )
      `).run(
        p.id, p.name, p.slug, p.tagline, p.description, p.shortDescription, p.categoryId,
        p.basePrice, p.salePrice, p.discountPercent, p.sku, p.stock, p.isAvailable,
        p.isFeatured, p.isBestSeller, p.rating, p.reviewCount, p.packSize,
        p.shelfLife, p.temperature, p.ingredients, p.nutritionalInfo
      );

      // Primary Image
      db.prepare(`
        INSERT INTO product_images (id, product_id, url, alt, is_primary, sort_order)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(`img-${p.id}-1`, p.id, p.imageUrl, p.name, 1, 0);

      // Additional Gallery Image
      db.prepare(`
        INSERT INTO product_images (id, product_id, url, alt, is_primary, sort_order)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(`img-${p.id}-2`, p.id, 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=900&q=80', `${p.name} In Use`, 0, 1);

      // Inventory record
      db.prepare(`
        INSERT INTO inventory (id, product_id, stock_quantity, safety_stock, reorder_level, status)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(`inv-${p.id}`, p.id, p.stock, 10, 15, p.stock > 10 ? 'IN_STOCK' : 'LOW_STOCK');

      // Product Variant
      db.prepare(`
        INSERT INTO product_variants (id, product_id, flavour_id, pack_size, price, sale_price, stock, sku)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(`var-${p.id}`, p.id, p.flavourId, p.packSize, p.basePrice, p.salePrice, p.stock, p.sku);
    }
  }

  // Seed Coupons
  const couponCount = db.prepare('SELECT COUNT(*) as count FROM coupons').get() as { count: number };
  if (couponCount.count === 0) {
    const coupons = [
      { id: 'cp-1', code: 'WELCOME10', description: '10% Off on your first order', discountType: 'PERCENT', discountValue: 10, minOrderValue: 299, maxDiscount: 150 },
      { id: 'cp-2', code: 'CUPDELIGHT', description: 'Flat ₹100 Off on orders above ₹599', discountType: 'FIXED', discountValue: 100, minOrderValue: 599, maxDiscount: 100 },
      { id: 'cp-3', code: 'EATYOURDRINK', description: '15% Off for delicious orders over ₹899', discountType: 'PERCENT', discountValue: 15, minOrderValue: 899, maxDiscount: 300 },
      { id: 'cp-4', code: 'FREESHIP', description: 'Free Express Delivery across India', discountType: 'FIXED', discountValue: 50, minOrderValue: 399, maxDiscount: 50 },
    ];
    for (const c of coupons) {
      db.prepare(`
        INSERT INTO coupons (id, code, description, discount_type, discount_value, min_order_value, max_discount, is_active)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(c.id, c.code, c.description, c.discountType, c.discountValue, c.minOrderValue, c.maxDiscount, 1);
    }
  }

  // Seed Reviews
  const reviewCount = db.prepare('SELECT COUNT(*) as count FROM reviews').get() as { count: number };
  if (reviewCount.count === 0) {
    const reviews = [
      {
        id: 'rev-1',
        productId: 'prod-1',
        userName: 'Aakash Verma',
        rating: 5,
        title: 'Mind-blowing experience!',
        comment: 'Poured hot espresso into this cup, took 20 minutes to sip it, and the cup stayed 100% crispy! Eating the warm chocolate biscuit afterwards was pure bliss. 10/10 recommend!'
      },
      {
        id: 'rev-2',
        productId: 'prod-1',
        userName: 'Ritika Sen',
        rating: 5,
        title: 'Zero waste and delicious',
        comment: 'All my friends at brunch were amazed. The chocolate lining doesn’t melt right away; it melts gently and flavours the coffee. Will definitely order the party pack next!'
      },
      {
        id: 'rev-3',
        productId: 'prod-5',
        userName: 'Rohan Mehra',
        rating: 5,
        title: 'Biscoff lovers dream come true',
        comment: 'If you love Biscoff spread, this is legendary. The spiced biscuit taste combined with latte is unbeatable. Packaging was rock-solid, not a single broken cup.'
      },
      {
        id: 'rev-4',
        productId: 'prod-7',
        userName: 'Sneha Kapoor',
        rating: 5,
        title: 'Super hit at our anniversary party!',
        comment: 'We served dessert mousse in these CUP2EAT cups. Guests literally ate their cups! Zero plastic, zero paper waste, and maximum fun.'
      }
    ];
    for (const r of reviews) {
      db.prepare(`
        INSERT INTO reviews (id, product_id, user_name, rating, title, comment, is_verified_purchase, is_approved)
        VALUES (?, ?, ?, ?, ?, ?, 1, 1)
      `).run(r.id, r.productId, r.userName, r.rating, r.title, r.comment);
    }
  }

  // Seed Sample Orders
  const orderCount = db.prepare('SELECT COUNT(*) as count FROM orders').get() as { count: number };
  if (orderCount.count === 0) {
    const sampleOrder = {
      id: 'ord-1001',
      orderNumber: 'C2E-2026-1001',
      userId: 'cust-1',
      customerName: 'Priya Sharma',
      customerEmail: 'customer@cup2eat.com',
      customerPhone: '9818192575',
      deliveryAddress: 'Flat 402, Sunshine Heights, Cyber City',
      city: 'Gurugram',
      state: 'Haryana',
      pinCode: '122002',
      orderNotes: 'Please ring doorbell on delivery.',
      subtotal: 778,
      taxAmount: 38.9,
      deliveryCharge: 0,
      discountAmount: 77.8,
      grandTotal: 739.1,
      paymentMethod: 'UPI',
      paymentStatus: 'PAID',
      orderStatus: 'DELIVERED',
      trackingNumber: 'DELHIVERY-981812903',
      courierName: 'Delhivery Express',
      estimatedDelivery: 'Delivered on Nov 10, 2026'
    };

    db.prepare(`
      INSERT INTO orders (
        id, order_number, user_id, customer_name, customer_email, customer_phone,
        delivery_address, city, state, pin_code, order_notes, subtotal, tax_amount,
        delivery_charge, discount_amount, grand_total, payment_method, payment_status,
        order_status, tracking_number, courier_name, estimated_delivery
      ) VALUES (
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?
      )
    `).run(
      sampleOrder.id, sampleOrder.orderNumber, sampleOrder.userId, sampleOrder.customerName,
      sampleOrder.customerEmail, sampleOrder.customerPhone, sampleOrder.deliveryAddress,
      sampleOrder.city, sampleOrder.state, sampleOrder.pinCode, sampleOrder.orderNotes,
      sampleOrder.subtotal, sampleOrder.taxAmount, sampleOrder.deliveryCharge, sampleOrder.discountAmount,
      sampleOrder.grandTotal, sampleOrder.paymentMethod, sampleOrder.paymentStatus,
      sampleOrder.orderStatus, sampleOrder.trackingNumber, sampleOrder.courierName, sampleOrder.estimatedDelivery
    );

    // Items for order
    db.prepare(`
      INSERT INTO order_items (id, order_id, product_id, product_name, product_slug, product_image, flavour, pack_size, quantity, unit_price, total_price)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run('oi-1', sampleOrder.id, 'prod-1', 'Choco Crunch Edible Cookie Cup', 'choco-crunch-edible-cup', 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=900&q=80', 'Belgian Chocolate', 'Pack of 4', 1, 349, 349);

    db.prepare(`
      INSERT INTO order_items (id, order_id, product_id, product_name, product_slug, product_image, flavour, pack_size, quantity, unit_price, total_price)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run('oi-2', sampleOrder.id, 'prod-5', 'Lotus Biscoff Crunch Cup', 'lotus-biscoff-crunch-cup', 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=900&q=80', 'Lotus Biscoff Crunch', 'Pack of 4', 1, 429, 429);

    // Invoice for order
    const invoiceItems = JSON.stringify([
      { name: 'Choco Crunch Edible Cookie Cup (Pack of 4)', qty: 1, rate: 349, total: 349 },
      { name: 'Lotus Biscoff Crunch Cup (Pack of 4)', qty: 1, rate: 429, total: 429 },
    ]);
    db.prepare(`
      INSERT INTO invoices (id, invoice_number, order_id, customer_name, customer_email, customer_phone, billing_address, items_json, subtotal, tax, delivery, discount, grand_total, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run('inv-1001', 'INV-2026-1001', sampleOrder.id, sampleOrder.customerName, sampleOrder.customerEmail, sampleOrder.customerPhone, `${sampleOrder.deliveryAddress}, ${sampleOrder.city}, ${sampleOrder.state} - ${sampleOrder.pinCode}`, invoiceItems, sampleOrder.subtotal, sampleOrder.taxAmount, sampleOrder.deliveryCharge, sampleOrder.discountAmount, sampleOrder.grandTotal, 'PAID');

    // Tracking events
    const trackingEvents = [
      { status: 'ORDER_PLACED', desc: 'Order received and payment confirmed.', loc: 'CUP2EAT Central Hub, Delhi NCR' },
      { status: 'PROCESSING', desc: 'Fresh edible cups inspected and quality certified.', loc: 'CUP2EAT Bakery & Packing Facility' },
      { status: 'PACKED', desc: 'Packaged in shockproof airtight luxury thermal box.', loc: 'CUP2EAT Fulfilment Centre' },
      { status: 'SHIPPED', desc: 'Dispatched via Delhivery Express (AWB: 981812903).', loc: 'Delhi Sorting Facility' },
      { status: 'OUT_FOR_DELIVERY', desc: 'Courier agent out for delivery.', loc: 'Gurugram Hub' },
      { status: 'DELIVERED', desc: 'Delivered securely to customer with OTP verification.', loc: 'Gurugram, Haryana' },
    ];
    for (const t of trackingEvents) {
      db.prepare(`
        INSERT INTO order_tracking (id, order_id, status, description, location)
        VALUES (?, ?, ?, ?, ?)
      `).run(`track-${Math.random().toString(36).substring(2, 9)}`, sampleOrder.id, t.status, t.desc, t.loc);
    }
  }

  // Seed Site Settings
  const settingCount = db.prepare('SELECT COUNT(*) as count FROM site_settings').get() as { count: number };
  if (settingCount.count === 0) {
    const settings = [
      { key: 'announcement_bar', value: '🎉 Free Express Delivery on orders above ₹499! Use code WELCOME10 for 10% OFF' },
      { key: 'whatsapp_support', value: '9818192575' },
      { key: 'contact_email', value: 'Varunkhera6@gmail.com' },
      { key: 'instagram_url', value: 'https://www.instagram.com/cup2eat/' },
      { key: 'gst_rate', value: '5' },
      { key: 'shipping_flat_rate', value: '50' },
      { key: 'free_shipping_threshold', value: '499' }
    ];
    for (const s of settings) {
      db.prepare('INSERT INTO site_settings (id, key, value) VALUES (?, ?, ?)').run(`set-${s.key}`, s.key, s.value);
    }
  }
}
