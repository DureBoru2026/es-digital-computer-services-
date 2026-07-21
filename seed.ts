import { db } from './src/lib/firebase.js';
import { doc, setDoc } from 'firebase/firestore';

const products = [
  {
    id: 'prod_maint_1',
    title: 'Computer Hardware Diagnostics & Software Troubleshooting',
    category: 'maintenance',
    type: 'service',
    description: 'Comprehensive hardware diagnostic check and full operating system optimization, including driver updates and system security patch installation.',
    price: 350,
    imageUrl: 'https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=600&q=80',
    stock: null,
  },
  {
    id: 'prod_maint_2',
    title: 'Operating System Installation & Driver Setup',
    category: 'maintenance',
    type: 'service',
    description: 'Fresh installation of Windows 10/11 or Ubuntu Linux, fully activated with official drivers, essential utility software, and office suite apps pre-installed.',
    price: 500,
    imageUrl: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=600&q=80',
    stock: null,
  },
  {
    id: 'prod_maint_3',
    title: 'Laptop Hardware Repair & Dust Cleaning',
    category: 'maintenance',
    type: 'service',
    description: 'Professional cleaning of cooling fans, replacement of thermal paste to reduce overheating, keyboard swaps, and screen replacement for major brands.',
    price: 800,
    imageUrl: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=600&q=80',
    stock: null,
  },
  // 2. Print & Publish
  {
    id: 'prod_print_1',
    title: 'Professional High-Speed Document Printing & Copying',
    category: 'print_publish',
    type: 'service',
    description: 'High-quality monochrome or color document printing, duplex copying, and binding (spiral/hardcover) for books, reports, or research papers.',
    price: 3, // Per page
    imageUrl: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=600&q=80',
    stock: null,
  },
  {
    id: 'prod_print_2',
    title: 'Custom Graphic Design & Corporate Logo Creation',
    category: 'print_publish',
    type: 'service',
    description: 'Stunning brand identities, modern business logos, banners, flyers, and publication layouts created by our skilled designer team.',
    price: 1200,
    imageUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=600&q=80',
    stock: null,
  },
  // 3. Short Basic Training
  {
    id: 'prod_train_1',
    title: 'Introduction to Computers & Windows (1-Week)',
    category: 'training',
    type: 'service',
    description: 'An introductory practical course for absolute beginners. Teaches file management, system configuration, typing skills, and fundamental operating system usage.',
    price: 750,
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80',
    stock: null,
  },
  {
    id: 'prod_train_2',
    title: 'Microsoft Office Suite Mastery (2-Weeks)',
    category: 'training',
    type: 'service',
    description: 'In-depth practical training on Word formatting, Excel spreadsheets (formulas, charts, pivot tables), and highly professional PowerPoint presentations.',
    price: 1500,
    imageUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80',
    stock: null,
  },
  // 4. Sales Section (Hardware, Digital, Premium Leather)
  {
    id: 'prod_sales_1',
    title: 'Premium Refurbished HP EliteBook 840 G5',
    category: 'sales',
    type: 'physical',
    description: 'High-performance professional laptop. Intel Core i5 8th Gen, 8GB DDR4 RAM, 256GB SSD, 14-inch Full HD display. Comes with windows 11 pre-installed and 3-month store warranty.',
    price: 24500,
    imageUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80',
    stock: 5,
    specifications: 'Intel Core i5-8350U | 8GB RAM | 256GB NVMe SSD | Backlit Keyboard | Fingerprint Sensor | 3 Months Warranty',
  },
  {
    id: 'prod_sales_2',
    title: 'Handmade Genuine Leather Wallet (Tan Brown)',
    category: 'sales',
    type: 'physical',
    description: 'Exquisite, full-grain genuine Ethiopian leather bi-fold wallet. Crafted by local artisans, featuring 6 card slots, a spacious cash compartment, and beautiful hand-stitched detailing. Developing a rich, personalized patina over time.',
    price: 1250,
    imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80',
    stock: 12,
    specifications: '100% Full-Grain Ethiopian Leather | Heavy-Duty Waxed Thread | Bi-Fold Design | 6 Card Pockets | Dimension: 11cm x 9cm',
  },
  {
    id: 'prod_sales_3',
    title: 'Premium Leather Laptop Sleeve (14-inch)',
    category: 'sales',
    type: 'physical',
    description: 'Custom-designed heavy-duty genuine leather laptop sleeve. Lined with soft felt lining to prevent scratches. Fastened with elegant brass snaps. Perfect companion for HP EliteBook or MacBook Air.',
    price: 2800,
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
    stock: 8,
    specifications: 'Thick Genuine Cowhide Leather | Shockproof Soft Felt Interior | Brass Secure Snap Closures | Fits 13" - 14" Laptops',
  },
  {
    id: 'prod_sales_4',
    title: 'Professional Resume & Cover Letter Template',
    category: 'sales',
    type: 'digital',
    description: 'Minimalist, highly effective ATS-friendly Microsoft Word resume and cover letter template, proven to convert job applications into interviews.',
    price: 150,
    imageUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=600&q=80',
    stock: null,
  },
  {
    id: 'prod_sales_5',
    title: 'Mobile Air Time Card (Ethio telecom)',
    category: 'sales',
    type: 'digital',
    description: 'Digital voucher code for Ethio telecom mobile airtime top-up. Instantly delivered to your phone number.',
    price: 100,
    imageUrl: 'https://images.unsplash.com/photo-1580927752452-89d86da3fa0a?auto=format&fit=crop&w=600&q=80',
    stock: 50,
  },
  {
    id: 'prod_sales_6',
    title: 'Mobile Air Time Card (Safaricom)',
    category: 'sales',
    type: 'digital',
    description: 'Digital voucher code for Safaricom Ethiopia mobile airtime top-up. Fast and reliable delivery.',
    price: 100,
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
    stock: 50,
  }
];

const announcements = [
  {
    id: 'ann_1',
    title: 'Grand Launch of ES Digital CSC Online Platform!',
    content: 'We are excited to launch our fully digitalized platform for Kore Town residents. Customers can now browse hardware catalogs, book repair appointments, purchase genuine Ethiopian leather accessories, and log transaction references online with telebirr and CBE Birr. Visit us at our physical location in Kore Woreda!',
    date: '2026-07-15T10:00:00.000Z',
    author: 'Jemal Ireso (Manager)',
  },
  {
    id: 'ann_2',
    title: 'New Stock Alert: Premium Genuine Leather Accessories Available',
    content: 'We have received a gorgeous shipment of locally hand-crafted, premium-grade genuine leather wallets and laptop sleeves in tan and chestnut brown. These accessories exhibit incredible tactile durability and look elegant alongside computers. Special discounts available for student buyers this week!',
    date: '2026-07-16T14:30:00.000Z',
    author: 'Management Team',
  },
];

async function seed() {
  for (const p of products) {
    await setDoc(doc(db, 'products', p.id), p);
  }
  for (const a of announcements) {
    await setDoc(doc(db, 'announcements', a.id), a);
  }
  console.log("Seeding complete!");
}

seed().catch(console.error);
