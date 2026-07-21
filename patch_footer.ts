import fs from 'fs';

let content = fs.readFileSync('src/components/Footer.tsx', 'utf8');

content = content.replace("import { ActiveTab } from '../types';", 
  "import { ActiveTab } from '../types';\nimport { useLanguage } from '../LanguageContext';");

content = content.replace("export default function Footer({ setActiveTab }: FooterProps) {",
  "export default function Footer({ setActiveTab }: FooterProps) {\n  const { t } = useLanguage();");

content = content.replace("We empower Kore Town residents with expert computer maintenance, professional printing & publishing work, basic IT literacy courses, and high-quality electronics sales.", "{t('footerAbout')}");
content = content.replace("Our Location & Contact", "{t('locationTitle')}");
content = content.replace("Quick Navigation", "{t('quickNavTitle')}");
content = content.replace(">Home<", ">{t('home')}<");
content = content.replace(">About Us<", ">{t('aboutUs')}<");
content = content.replace(">Services<", ">{t('services')}<");
content = content.replace(">Announcements<", ">{t('news')}<");
content = content.replace(">Contact Us<", ">{t('contact')}<");
content = content.replace(">Staff Login<", ">{t('staffLogin')}<");
content = content.replace("Newsletter Sign-Up", "{t('newsletterTitle')}");
content = content.replace("Subscribe to get notified about fresh product drops, premium genuine leather accessory sales, and computer tips.", "{t('newsletterDesc')}");
content = content.replace("Thank you! Subscribed successfully.", "{t('subscribeThanks')}");
content = content.replace('placeholder="Your email address"', 'placeholder={t("yourEmail")}');
content = content.replace("Digitalizing Kore Town, West Arsi", "{t('footerLocTag')}");
content = content.replace("Ethiopian Payment Gateways Integrated", "{t('footerPayTag')}");

fs.writeFileSync('src/components/Footer.tsx', content);
