import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

// Replace Hero Section
content = content.replace("Kore Town • West Arsi Zone", "{t('heroLocation')}");
content = content.replace("Digitizing Ethiopia's<br/>", "{t('heroTitleLine1')}<br/>");
content = content.replace("Tech Frontier.", "{t('heroTitleLine2')}");
content = content.replace("Expert maintenance, professional printing, and premium IT training. Your hub for digital excellence in the Oromia Region.", "{t('heroSubtitle')}");
content = content.replace(">Book a Service<", ">{t('bookService')}<");
content = content.replace(">Explore Products<", ">{t('exploreProducts')}<");
content = content.replace(">Quick Categories<", ">{t('quickCategories')}<");
content = content.replace(">Hardware Diagnostics<", ">{t('hardwareDiag')}<");
content = content.replace(">Office Suite Course<", ">{t('officeSuite')}<");
content = content.replace(">Document Printing<", ">{t('docPrinting')}<");
content = content.replace(">Genuine Leather<", ">{t('genuineLeather')}<");
content = content.replace(">Latest Announcements<", ">{t('latestAnnouncements')}<");
content = content.replace("No recent announcements. Check back later!", "{t('noAnnouncements')}");
content = content.replace(">Recent Additions<", ">{t('recentAdditions')}<");
content = content.replace("Sample Design Works", "{t('sampleWorks')}");
content = content.replace("Save Image", "{t('saveImage')}");

fs.writeFileSync('src/App.tsx', content);
