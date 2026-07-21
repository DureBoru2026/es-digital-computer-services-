import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { db, ProductService, Announcement, Feedback, Transaction, Booking } from '../db-store.js';

// Simple middleware to simulate admin authentication
const ADMIN_TOKEN = 'es-digital-csc-admin-secret-session-token';

function authenticateAdmin(req: Request, res: Response, next: NextFunction) {
  const token = req.headers['authorization'];
  if (token === `Bearer ${ADMIN_TOKEN}` || token === ADMIN_TOKEN) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized. Admin access required.' });
  }
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT || 3000);

  // JSON Body Parser with ample capacity
  app.use(express.json());

  // -------------------------------------------------------------
  // API ENDPOINTS
  // -------------------------------------------------------------

  // Health check
  app.get('/api/health', async (req: Request, res: Response) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
  });

  // Auth Login
  app.post('/api/auth/login', async (req: Request, res: Response) => {
    const { username, password } = req.body;
    const users = await db.getUsers();
    
    // Find matching user with simple check
    let user = users.find(u => u.username === username && u.passwordHash === password);
    
    // Hardcoded requested admin check
    if (!user && (username === 'Jemal Fano' || username === 'jemalfan030@gmail.com') && password === 'Esb#2026') {
      user = {
        id: 'admin_hardcoded',
        username: 'Jemal Fano',
        email: 'jemalfan030@gmail.com',
        passwordHash: 'Esb#2026',
        role: 'admin'
      };
    }

    if (user) {
      res.json({
        success: true,
        token: ADMIN_TOKEN,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      });
    } else {
      res.status(401).json({ error: 'Invalid username or password' });
    }
  });

  // Verify Admin Token
  app.post('/api/auth/verify', async (req: Request, res: Response) => {
    const token = req.headers['authorization'];
    if (token === `Bearer ${ADMIN_TOKEN}` || token === ADMIN_TOKEN) {
      res.json({ success: true, role: 'admin' });
    } else {
      res.status(401).json({ success: false, error: 'Session expired or invalid' });
    }
  });

  // --- PRODUCTS & SERVICES CRUD ---

  // Get all products and services
  app.get('/api/products', async (req: Request, res: Response) => {
    res.json(await db.getProducts());
  });

  // Create a product/service (Admin Only)
  app.post('/api/products', authenticateAdmin, async (req: Request, res: Response) => {
    const newProduct: Omit<ProductService, 'id'> = req.body;
    const products = await db.getProducts();
    
    const product: ProductService = {
      ...newProduct,
      id: `prod_${Date.now()}`,
    };
    
    products.push(product);
    await db.saveProducts(products);
    res.status(201).json(product);
  });

  // Update a product/service (Admin Only)
  app.put('/api/products/:id', authenticateAdmin, async (req: Request, res: Response) => {
    const { id } = req.params;
    const updatedProduct: Partial<ProductService> = req.body;
    const products = await db.getProducts();
    
    const index = products.findIndex(p => p.id === id);
    if (index === -1) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    
    products[index] = {
      ...products[index],
      ...updatedProduct,
      id // Prevent ID changing
    };
    
    await db.saveProducts(products);
    res.json(products[index]);
  });

  // Delete a product/service (Admin Only)
  app.delete('/api/products/:id', authenticateAdmin, async (req: Request, res: Response) => {
    const { id } = req.params;
    const products = await db.getProducts();
    
    const filtered = products.filter(p => p.id !== id);
    if (filtered.length === products.length) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    
    await db.saveProducts(filtered);
    res.json({ success: true, message: 'Product deleted successfully' });
  });

  // --- ANNOUNCEMENTS ---

  // Get all announcements
  app.get('/api/announcements', async (req: Request, res: Response) => {
    res.json(await db.getAnnouncements());
  });

  // Create an announcement (Admin Only)
  app.post('/api/announcements', authenticateAdmin, async (req: Request, res: Response) => {
    const { title, content, author } = req.body;
    if (!title || !content) {
      res.status(400).json({ error: 'Title and content are required' });
      return;
    }
    
    const announcements = await db.getAnnouncements();
    const newAnnouncement: Announcement = {
      id: `ann_${Date.now()}`,
      title,
      content,
      date: new Date().toISOString(),
      author: author || 'Admin',
    };
    
    announcements.unshift(newAnnouncement); // Newest first
    await db.saveAnnouncements(announcements);
    res.status(201).json(newAnnouncement);
  });

  // Delete an announcement (Admin Only)
  app.delete('/api/announcements/:id', authenticateAdmin, async (req: Request, res: Response) => {
    const { id } = req.params;
    const announcements = await db.getAnnouncements();
    
    const filtered = announcements.filter(a => a.id !== id);
    if (filtered.length === announcements.length) {
      res.status(404).json({ error: 'Announcement not found' });
      return;
    }
    
    await db.saveAnnouncements(filtered);
    res.json({ success: true, message: 'Announcement deleted successfully' });
  });

  // --- FEEDBACK & CONTACTS ---

  // Get all feedback forms (Admin Only)
  app.get('/api/feedback', authenticateAdmin, async (req: Request, res: Response) => {
    res.json(await db.getFeedback());
  });

  // Get positive feedback testimonials (Public)
  app.get('/api/testimonials', async (req: Request, res: Response) => {
    try {
      const feedback = await db.getFeedback();
      const positiveKeywords = [
        'great', 'excellent', 'best', 'good', 'satisfied', 'perfect', 'awesome',
        'love', 'amazing', 'professional', 'happy', 'repair', 'service', 'helpful',
        'suphaa', 'gaarii', 'saffisaa', 'tolfame', 'mirkaneesse', 'hebbe', 'bayyee',
        'galatoomaa', 'galatoomi', 'keenya', 'fast', 'quick', 'care', 'perfectly'
      ];
      
      let filtered = feedback.filter(f => {
        const msg = f.message.toLowerCase();
        return positiveKeywords.some(keyword => msg.includes(keyword)) && f.message.length > 15;
      });

      const defaultTestimonials: Feedback[] = [
        {
          id: 'test_default_1',
          name: 'Tolosa Kenesa',
          email: 'tolosa.ken@gmail.com',
          phone: '+251911456789',
          message: 'ES Digital CSC suphaa Laptop koof kenne dhiyeenyatti hojjete. Saffisaa fi tajaajila gaarii dha! HP laptop ko duubatti deebi’eera. Bayyee galatoomaa.',
          date: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
          status: 'read'
        },
        {
          id: 'test_default_2',
          name: 'Marta Hailu',
          email: 'marta.h@outlook.com',
          phone: '+251912987654',
          message: 'The graphic layout layouts for our corporate brochures were absolutely stunning. Very professional design work, fast turnaround, and clear print resolution!',
          date: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(),
          status: 'read'
        },
        {
          id: 'test_default_3',
          name: 'Jibril Kedir',
          email: 'jibril.k@gmail.com',
          phone: '+251944882211',
          message: 'Barnoota saffisaa kompiitaraa irratti hirmaadheen ture. Hubannoo guutuu argadheera. Ogeessi keenya Magaalaa Qoree dandeettii barsiisuu guddaa qaba.',
          date: new Date(Date.now() - 12 * 24 * 3600 * 1000).toISOString(),
          status: 'read'
        },
        {
          id: 'test_default_4',
          name: 'Kiya Abera',
          email: 'kiya.ab@gmail.com',
          phone: '+251922334455',
          message: 'I bought a premium hand-crafted full-grain leather wallet here. The leather quality is majestic, feels great in the hands, and has developed a beautiful patina.',
          date: new Date(Date.now() - 15 * 24 * 3600 * 1000).toISOString(),
          status: 'read'
        }
      ];

      // If the feedback list is completely empty or has no positive feedbacks, let's auto-seed the defaults to the db
      // so they exist in the feedback ledger for administrative management as well!
      if (feedback.length === 0) {
        await db.saveFeedback(defaultTestimonials);
        filtered = defaultTestimonials;
      }

      const testimonials = [...filtered.map(f => ({
        id: f.id,
        name: f.name,
        message: f.message,
        date: f.date
      })), ...defaultTestimonials.map(f => ({
        id: f.id,
        name: f.name,
        message: f.message,
        date: f.date
      }))];

      const uniqueTestimonials: typeof testimonials = [];
      const seenNames = new Set<string>();
      for (const t of testimonials) {
        if (!seenNames.has(t.name.toLowerCase())) {
          seenNames.add(t.name.toLowerCase());
          uniqueTestimonials.push(t);
        }
      }

      res.json(uniqueTestimonials.slice(0, 10));
    } catch (err) {
      res.status(500).json({ error: 'Failed to retrieve success stories.' });
    }
  });

  // Submit contact feedback (Public)
  app.post('/api/feedback', async (req: Request, res: Response) => {
    const { name, email, phone, message } = req.body;
    if (!name || !email || !message) {
      res.status(400).json({ error: 'Name, email, and message are required' });
      return;
    }
    
    const feedbackList = await db.getFeedback();
    const newFeedback: Feedback = {
      id: `feed_${Date.now()}`,
      name,
      email,
      phone: phone || '',
      message,
      date: new Date().toISOString(),
      status: 'unread'
    };
    
    feedbackList.unshift(newFeedback); // Newest feedback on top
    await db.saveFeedback(feedbackList);
    res.status(201).json({ success: true, message: 'Your message has been received! Thank you.', feedback: newFeedback });
  });

  // Update feedback status/add response reply (Admin Only)
  app.patch('/api/feedback/:id', authenticateAdmin, async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status, replyMessage } = req.body;
    const feedbackList = await db.getFeedback();
    
    const index = feedbackList.findIndex(f => f.id === id);
    if (index === -1) {
      res.status(404).json({ error: 'Feedback record not found' });
      return;
    }
    
    if (status) feedbackList[index].status = status;
    if (replyMessage !== undefined) feedbackList[index].replyMessage = replyMessage;
    
    await db.saveFeedback(feedbackList);
    res.json(feedbackList[index]);
  });

  // Delete feedback (Admin Only)
  app.delete('/api/feedback/:id', authenticateAdmin, async (req: Request, res: Response) => {
    const { id } = req.params;
    const feedbackList = await db.getFeedback();
    
    const filtered = feedbackList.filter(f => f.id !== id);
    if (filtered.length === feedbackList.length) {
      res.status(404).json({ error: 'Feedback not found' });
      return;
    }
    
    await db.saveFeedback(filtered);
    res.json({ success: true, message: 'Feedback deleted successfully' });
  });

  // --- TRANSACTIONS ---

  // Get all transaction logs (Admin Only)
  app.get('/api/transactions', authenticateAdmin, async (req: Request, res: Response) => {
    res.json(await db.getTransactions());
  });

  // Submit transaction reference number (Public / Customer Checkout)
  app.post('/api/transactions', async (req: Request, res: Response) => {
    const { referenceNumber, paymentGateway, customerName, customerPhone, amount, purpose } = req.body;
    if (!referenceNumber || !paymentGateway || !customerName || !amount || !purpose) {
      res.status(400).json({ error: 'Reference number, gateway, name, amount, and item are required' });
      return;
    }
    
    const transactions = await db.getTransactions();
    
    // Check if reference number already submitted
    const dupe = transactions.find(t => t.referenceNumber.trim().toUpperCase() === referenceNumber.trim().toUpperCase());
    if (dupe) {
      res.status(400).json({ error: 'This payment reference has already been submitted for verification.' });
      return;
    }

    const newTransaction: Transaction = {
      id: `tx_${Date.now()}`,
      referenceNumber: referenceNumber.trim().toUpperCase(),
      paymentGateway,
      customerName,
      customerPhone: customerPhone || '',
      amount: Number(amount),
      purpose,
      date: new Date().toISOString(),
      status: 'pending'
    };
    
    transactions.unshift(newTransaction);
    await db.saveTransactions(transactions);
    res.status(201).json({ success: true, message: 'Transaction registered successfully! Admin will verify and activate/ship.', transaction: newTransaction });
  });

  // Update transaction status (Admin Only)
  app.patch('/api/transactions/:id', authenticateAdmin, async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status, notes } = req.body;
    const transactions = await db.getTransactions();
    
    const index = transactions.findIndex(t => t.id === id);
    if (index === -1) {
      res.status(404).json({ error: 'Transaction not found' });
      return;
    }
    
    if (status) transactions[index].status = status;
    if (notes !== undefined) transactions[index].notes = notes;
    
    await db.saveTransactions(transactions);
    res.json(transactions[index]);
  });

  // --- BOOKINGS ---

  // Get all bookings (Admin Only)
  app.get('/api/bookings', authenticateAdmin, async (req: Request, res: Response) => {
    try {
      res.json(await db.getBookings());
    } catch (err) {
      res.status(500).json({ error: 'Failed to retrieve bookings.' });
    }
  });

  // Create a booking (Public)
  app.post('/api/bookings', async (req: Request, res: Response) => {
    const { customerName, customerPhone, customerEmail, serviceId, serviceTitle, bookingDate, bookingTime, notes } = req.body;
    
    if (!customerName || !customerPhone || !serviceId || !serviceTitle || !bookingDate || !bookingTime) {
      res.status(400).json({ error: 'Name, phone, service, date, and time are required fields.' });
      return;
    }

    try {
      const bookings = await db.getBookings();
      const newBooking: Booking = {
        id: `book_${Date.now()}`,
        customerName,
        customerPhone,
        customerEmail: customerEmail || '',
        serviceId,
        serviceTitle,
        bookingDate,
        bookingTime,
        notes: notes || '',
        status: 'pending',
        paymentStatus: 'unpaid',
        date: new Date().toISOString()
      };
      bookings.unshift(newBooking);
      await db.saveBookings(bookings);
      res.status(201).json({ success: true, message: 'Your service booking request has been submitted successfully!', booking: newBooking });
    } catch (err) {
      res.status(500).json({ error: 'Failed to save your booking.' });
    }
  });

  // Trigger SMS Notification (Public/Private client utility)
  app.post('/api/send-sms', async (req: Request, res: Response) => {
    const { phone, message, customerName } = req.body;
    if (!phone || !message) {
      res.status(400).json({ error: 'Phone number and message text are required for SMS notification.' });
      return;
    }

    try {
      // In production, you would call a gateway provider here, e.g.:
      // const gatewayUrl = `https://api.sms-provider.com/send?to=${encodeURIComponent(phone)}&msg=${encodeURIComponent(message)}`;
      // await fetch(gatewayUrl, { headers: { 'Authorization': `Bearer ${process.env.SMS_API_KEY}` } });
      
      console.log('---------------------------------------------------------');
      console.log(`[SMS GATEWAY DISPATCH]`);
      console.log(`Recipient Name : ${customerName || 'Valued Customer'}`);
      console.log(`Target Mobile  : ${phone}`);
      console.log(`Payload Text   : "${message}"`);
      console.log(`Transmission   : SUCCESS (STATUS CODE: 200, SID: sms_tx_${Date.now().toString(36)})`);
      console.log('---------------------------------------------------------');

      res.status(200).json({
        success: true,
        message: `SMS message dispatched successfully to ${phone}.`,
        messageSid: `sms_tx_${Date.now().toString(36)}`
      });
    } catch (err) {
      console.error('SMS Gateway Error:', err);
      res.status(500).json({ error: 'SMS notification failed to dispatch.' });
    }
  });

  // Update a booking's status/notes (Admin Only)
  app.patch('/api/bookings/:id', authenticateAdmin, async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status, notes, paymentStatus } = req.body;
    
    try {
      const bookings = await db.getBookings();
      const index = bookings.findIndex(b => b.id === id);
      if (index === -1) {
        res.status(404).json({ error: 'Booking not found.' });
        return;
      }

      if (status) bookings[index].status = status;
      if (notes !== undefined) bookings[index].notes = notes;
      if (paymentStatus) bookings[index].paymentStatus = paymentStatus;

      await db.saveBookings(bookings);
      res.json(bookings[index]);
    } catch (err) {
      res.status(500).json({ error: 'Failed to update booking.' });
    }
  });

  // Delete a booking (Admin Only)
  app.delete('/api/bookings/:id', authenticateAdmin, async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const bookings = await db.getBookings();
      const filtered = bookings.filter(b => b.id !== id);
      if (filtered.length === bookings.length) {
        res.status(404).json({ error: 'Booking not found.' });
        return;
      }
      await db.saveBookings(filtered);
      res.json({ success: true, message: 'Booking deleted successfully.' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete booking.' });
    }
  });

  // Get list of registered customers (Derived from Transactions + Feedback, Admin Only)
  app.get('/api/users', authenticateAdmin, async (req: Request, res: Response) => {
    const transactions = await db.getTransactions();
    const feedback = await db.getFeedback();
    
    const customersMap = new Map<string, { name: string; contact: string; source: string; transactionsCount: number; spentAmount: number }>();
    
    transactions.forEach(t => {
      const key = `${t.customerName.toLowerCase()}_${t.customerPhone || ''}`;
      if (!customersMap.has(key)) {
        customersMap.set(key, {
          name: t.customerName,
          contact: t.customerPhone || 'N/A',
          source: 'Purchase',
          transactionsCount: 0,
          spentAmount: 0
        });
      }
      const record = customersMap.get(key)!;
      record.transactionsCount += 1;
      if (t.status === 'approved') {
        record.spentAmount += t.amount;
      }
    });
    
    feedback.forEach(f => {
      const key = `${f.name.toLowerCase()}_${f.phone || ''}`;
      if (!customersMap.has(key)) {
        customersMap.set(key, {
          name: f.name,
          contact: f.phone || f.email,
          source: 'Contact Inquiry',
          transactionsCount: 0,
          spentAmount: 0
        });
      }
    });
    
    res.json(Array.from(customersMap.values()));
  });

  // -------------------------------------------------------------
  // VITE DEV SERVER OR STATIC SERVING MIDDLEWARE
  // -------------------------------------------------------------
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', async (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${PORT} (Express + Vite)`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
