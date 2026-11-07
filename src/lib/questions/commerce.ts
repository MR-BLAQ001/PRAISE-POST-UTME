import { makeQuestions, type SeedRow } from "@/lib/questions/helpers";

const rows: SeedRow[] = [
  // Trade
  ["Trade", "easy", "Trade is the exchange of goods and services for ___.", ["money or other goods", "nothing", "government favours only", "land only"], "A", "Trade involves buying and selling, often using money or barter."],
  ["Trade", "easy", "Home trade refers to trade carried out ___.", ["within a country", "between countries", "only in rural areas", "only online"], "A", "Home (domestic) trade is conducted within a country's borders."],
  ["Trade", "easy", "Foreign trade is trade between ___.", ["different countries", "two individuals in one market", "two local governments", "two companies in one city"], "A", "Foreign or international trade crosses national borders."],
  ["Trade", "easy", "Goods brought into a country from abroad are called ___.", ["imports", "exports", "entrepôt goods", "barter goods"], "A", "Imports are purchased from other countries."],
  ["Trade", "easy", "Goods sold to other countries are called ___.", ["exports", "imports", "reserves", "deficits"], "A", "Exports are sold abroad."],
  ["Trade", "medium", "Entrepôt trade involves ___.", ["importing goods for re-export", "selling only locally", "producing goods for export", "bartering without money"], "A", "Entrepôt trade imports goods and re-exports them, often after processing."],
  ["Trade", "medium", "Visible trade refers to trade in ___.", ["tangible goods", "services", "shares", "insurance"], "A", "Visible trade involves physical goods; invisible trade involves services."],
  ["Trade", "medium", "Invisible trade involves the exchange of ___.", ["services", "physical goods", "land", "minerals"], "A", "Services such as shipping, banking and tourism constitute invisible trade."],
  ["Trade", "medium", "The balance of trade compares the value of a country's ___.", ["visible exports and imports", "total exports and services", "assets and liabilities", "savings and investment"], "A", "Balance of trade deals with merchandise (visible) imports and exports."],
  ["Trade", "medium", "The balance of payments is a record of a country's ___ with the rest of the world.", ["all economic transactions", "only imports", "only government borrowing", "only tourism"], "A", "It records trade, investment and financial flows."],
  ["Trade", "easy", "A retailer sells goods ___.", ["in small quantities to consumers", "only to wholesalers", "only to manufacturers", "in bulk to government"], "A", "Retailers sell directly to final consumers."],
  ["Trade", "easy", "A wholesaler buys in bulk and sells ___.", ["to retailers", "only to consumers", "only to foreign buyers", "only to manufacturers"], "A", "Wholesalers act as intermediaries between producers and retailers."],
  ["Trade", "medium", "One advantage of division of labour is ___.", ["increased productivity", "total unemployment", "higher production costs", "less specialisation"], "A", "Specialisation allows workers to become more efficient."],

  // Business Organisations
  ["Business Organisations", "easy", "A business owned by one person is a ___.", ["sole proprietorship", "partnership", "public company", "cooperative"], "A", "A sole proprietorship is owned and controlled by one individual."],
  ["Business Organisations", "easy", "A partnership is owned by ___.", ["two or more people", "one person", "the government", "shareholders only"], "A", "Partners contribute capital and share profits and risks."],
  ["Business Organisations", "easy", "A company has ___ liability.", ["limited", "unlimited always", "no", "unclear"], "A", "Shareholders' liability is limited to the amount they invested."],
  ["Business Organisations", "medium", "A cooperative is owned and controlled by its ___.", ["members", "foreign investors", "government", "competitors"], "A", "Cooperatives are democratic organisations owned by members."],
  ["Business Organisations", "medium", "A public corporation is owned by ___.", ["the government", "private shareholders only", "foreign companies", "cooperative members"], "A", "Public corporations are state-owned enterprises."],
  ["Business Organisations", "medium", "A private limited company has the abbreviation ___.", ["Ltd", "Plc", "Inc", "NGO"], "A", "Private limited companies use 'Ltd' in their names."],
  ["Business Organisations", "medium", "A public limited company is quoted on the stock exchange and uses ___.", ["Plc", "Ltd", "Sole", "Coop"], "A", "Plc companies can offer shares to the public."],
  ["Business Organisations", "medium", "The memorandum of association states a company's ___.", ["main objectives and external relations", "daily sales", "employee salaries", "customer lists"], "A", "It sets out the company's name, objects and capital structure."],
  ["Business Organisations", "medium", "The articles of association contain rules governing ___.", ["internal management", "foreign trade only", "income tax", "customs duties"], "A", "Articles regulate internal affairs and the conduct of company business."],
  ["Business Organisations", "medium", "A prospectus is issued to ___.", ["invite the public to subscribe for shares", "announce staff transfers", "register a business name", "collect taxes"], "A", "A prospectus provides information to prospective investors."],
  ["Business Organisations", "medium", "A merger occurs when two companies ___.", ["combine into one", "close down separately", "compete in court", "change their names only"], "A", "A merger combines two or more business entities."],
  ["Business Organisations", "medium", "A franchise allows a person to ___ under another company's brand.", ["operate a business", "close a business", "avoid all taxes", "change the law"], "A", "The franchisee uses the franchisor's brand and system for a fee."],

  // Finance
  ["Finance", "easy", "Capital is the money used to ___ a business.", ["start and operate", "tax", "close", "advertise only"], "A", "Capital funds the establishment and running of a business."],
  ["Finance", "medium", "Working capital is the difference between ___.", ["current assets and current liabilities", "fixed assets and profit", "sales and tax", "capital and drawings"], "A", "Working capital measures short-term liquidity."],
  ["Finance", "easy", "A share represents ___ in a company.", ["part ownership", "a loan to government", "a tax", "an insurance policy"], "A", "Shareholders own a portion of the company."],
  ["Finance", "medium", "A debenture is a ___ instrument.", ["loan", "share", "tax", "dividend"], "A", "Debentures are long-term loans to a company, paid interest rather than dividends."],
  ["Finance", "easy", "A dividend is a share of a company's ___ paid to shareholders.", ["profit", "debt", "tax", "assets"], "A", "Dividends distribute profits to shareholders."],
  ["Finance", "easy", "A bank overdraft allows an account holder to ___.", ["withdraw more than the account balance within a limit", "print money", "avoid repayment", "own the bank"], "A", "An overdraft is a short-term borrowing facility."],
  ["Finance", "medium", "Insurance protects a business against ___.", ["financial loss from specified risks", "all competition", "tax audits", "customer complaints only"], "A", "Insurance transfers specified risks to an insurer in exchange for premiums."],
  ["Finance", "medium", "A bank draft is a cheque ___.", ["drawn by a bank on itself", "written by a customer without funds", "used only for taxes", "that cannot be cashed"], "A", "A bank draft is a guaranteed payment instrument issued by a bank."],
  ["Finance", "easy", "A cheque is an order to a bank to ___.", ["pay a stated sum from the drawer's account", "lend money without limit", "open a new country", "print currency"], "A", "The drawer instructs the bank to pay the payee."],
  ["Finance", "medium", "A bill of exchange is a written order requiring the addressee to pay ___.", ["a specified sum at a stated time", "all debts immediately", "tax to government only", "in kind only"], "A", "It is a negotiable instrument used in trade finance."],
  ["Finance", "easy", "A budget is a plan of expected ___ and ___.", ["income; expenditure", "imports; exports", "assets; liabilities", "shares; debentures"], "A", "Budgets forecast revenue and spending over a period."],
  ["Finance", "medium", "Trade credit allows a buyer to ___.", ["pay for goods at a later date", "avoid paying entirely", "sell goods on behalf of the seller", "become a shareholder"], "A", "Suppliers extend credit with payment due after an agreed period."],
  ["Finance", "medium", "Which financial statement shows a business's assets, liabilities and capital at a particular date?", ["Balance sheet", "Trading account", "Invoice", "Receipt"], "A", "A balance sheet presents assets, liabilities and capital at a specific point in time."],

  // Marketing
  ["Marketing", "easy", "Marketing is best defined as ___.", ["identifying and satisfying customer needs profitably", "only advertising", "only selling", "storing goods"], "A", "Marketing encompasses research, product, price, promotion and distribution."],
  ["Marketing", "easy", "The four Ps of marketing are product, price, place and ___.", ["promotion", "people", "profit", "packaging"], "A", "The marketing mix comprises product, price, place and promotion."],
  ["Marketing", "medium", "Market segmentation is the division of a market into ___.", ["distinct groups of buyers", "equal profit shares", "government agencies", "product categories only"], "A", "Segmentation groups customers with similar needs or characteristics."],
  ["Marketing", "easy", "Advertising is a paid form of ___.", ["non-personal communication to promote goods", "personal selling only", "price control", "tax collection"], "A", "Advertising communicates promotional messages through media."],
  ["Marketing", "easy", "A brand is a ___ that identifies a product and distinguishes it from competitors.", ["name, symbol or design", "type of tax", "government licence", "distribution route"], "A", "Branding creates identity and customer recognition."],
  ["Marketing", "medium", "Packaging helps to ___.", ["protect and promote a product", "increase taxes", "reduce quality", "hide the brand"], "A", "Packaging protects goods, provides information and supports promotion."],
  ["Marketing", "medium", "A distribution channel is the route through which goods move from ___.", ["producers to consumers", "banks to government", "consumers to producers", "tax offices to firms"], "A", "Channels involve intermediaries that move products to final users."],
  ["Marketing", "medium", "After-sales service is important because it ___.", ["builds customer loyalty and satisfaction", "increases customer complaints", "ends the relationship with buyers", "replaces the product"], "A", "Support after purchase enhances satisfaction and repeat business."],
  ["Marketing", "easy", "Market research is conducted to ___.", ["gather information about customers and markets", "increase production costs", "set arbitrary prices", "avoid customers"], "A", "Research informs decisions about products, pricing and promotion."],
  ["Marketing", "medium", "E-commerce refers to buying and selling ___.", ["over electronic networks such as the internet", "only in physical shops", "only through banks", "only by government"], "A", "E-commerce uses digital platforms to transact."],
  ["Marketing", "medium", "Sales promotion includes short-term incentives such as ___.", ["discounts and coupons", "annual audits", "staff recruitment", "tax filing"], "A", "Promotions stimulate immediate purchases through incentives."],
  ["Marketing", "hard", "A market niche is a ___ segment of a market.", ["small, specialised", "very large, undifferentiated", "government-owned", "non-profitable by definition"], "A", "A niche is a narrowly defined group with specific needs."]
];

export const commerceQuestions = makeQuestions("commerce", "com", rows);
