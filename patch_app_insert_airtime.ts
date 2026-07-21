import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

if (!content.includes('import MobileAirtimePurchase')) {
  content = content.replace("import AdminShare from './components/AdminShare';", "import AdminShare from './components/AdminShare';\nimport MobileAirtimePurchase from './components/MobileAirtimePurchase';");
}

const salesMarker = `{/* Category 4: Sales Section (Hardware, Digital, Premium Leather) */}`;
const airtimeInsertion = `
                {/* Mobile Airtime Purchase Widget */}
                {selectedCategory === 'all' || selectedCategory === 'sales' ? (
                  <div className="mb-10">
                    <MobileAirtimePurchase onSubmitTransaction={handleTransactionSubmit} />
                  </div>
                ) : null}
`;

if (!content.includes('MobileAirtimePurchase onSubmitTransaction')) {
  content = content.replace(salesMarker, airtimeInsertion + '\\n                ' + salesMarker);
}

fs.writeFileSync('src/App.tsx', content);
