import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace("import { motion, AnimatePresence } from 'motion/react';",
  "import { motion, AnimatePresence } from 'motion/react';\nimport { useLanguage } from './LanguageContext';");

content = content.replace("export default function App() {",
  "export default function App() {\n  const { t } = useLanguage();");

// Category pills translation
content = content.replace("label: 'All Services'", "label: t('allServices')");
content = content.replace("label: 'Maintenance'", "label: t('maintenance')");
content = content.replace("label: 'Print & Publish'", "label: t('printPublish')");
content = content.replace("label: 'Training'", "label: t('training')");
content = content.replace("label: 'Sales'", "label: t('sales')");

// Search & Sort placeholder/options
content = content.replace("placeholder=\"Search services, courses, or products...\"", "placeholder={t('searchPlaceholder')}");
content = content.replace(">Sort by: Default<", ">{t('sortBy')}<");
content = content.replace(">Price: Low to High<", ">{t('priceLowHigh')}<");
content = content.replace(">Price: High to Low<", ">{t('priceHighLow')}<");
content = content.replace(">Reset<", ">{t('reset')}<");

fs.writeFileSync('src/App.tsx', content);
