import { makeQuestions, type SeedRow } from "@/lib/questions/helpers";

const rows: SeedRow[] = [
  // Microeconomics
  ["Microeconomics", "easy", "The fundamental economic problem is ___.", ["scarcity of resources relative to wants", "excess supply of money", "unlimited resources", "the absence of trade"], "A", "Resources are limited while human wants are unlimited, creating the need to choose."],
  ["Microeconomics", "easy", "Opportunity cost is the ___.", ["money paid for a good", "value of the next best alternative forgone", "total cost of production", "price of an imported good"], "B", "Choosing one option means giving up the value of the best alternative."],
  ["Microeconomics", "easy", "According to the law of demand, as price rises, quantity demanded ___.", ["rises", "falls", "stays constant", "becomes zero"], "B", "Price and quantity demanded are inversely related, all else equal."],
  ["Microeconomics", "easy", "The law of supply states that as price rises, quantity supplied ___.", ["falls", "rises", "remains constant", "becomes negative"], "B", "Producers are willing to supply more at higher prices."],
  ["Microeconomics", "medium", "Equilibrium in a market occurs where ___.", ["demand exceeds supply", "supply exceeds demand", "quantity demanded equals quantity supplied", "price is zero"], "C", "Market equilibrium is where the demand and supply curves intersect."],
  ["Microeconomics", "medium", "Price elasticity of demand measures the responsiveness of quantity demanded to a change in ___.", ["income", "price", "population", "taste"], "B", "Price elasticity measures how much demand changes when price changes."],
  ["Microeconomics", "easy", "Which of the following is a factor of production?", ["Money", "Labour", "Profit", "Demand"], "B", "The factors of production are land, labour, capital and entrepreneurship."],
  ["Microeconomics", "medium", "A market with only one seller is called a ___.", ["monopoly", "duopoly", "perfect competition", "oligopoly"], "A", "A monopoly has a single seller with significant market power."],
  ["Microeconomics", "medium", "A price ceiling set below the equilibrium price will likely cause ___.", ["a surplus", "a shortage", "market equilibrium", "lower demand"], "B", "At a price below equilibrium, quantity demanded exceeds quantity supplied."],
  ["Microeconomics", "hard", "Goods that are consumed together, such as bread and butter, are called ___.", ["substitute goods", "complementary goods", "inferior goods", "free goods"], "B", "Complementary goods are used jointly, so demand for one affects demand for the other."],

  // Macroeconomics
  ["Macroeconomics", "easy", "Gross Domestic Product measures the total value of ___ produced within a country in a period.", ["final goods and services", "imports only", "money supply", "government debt"], "A", "GDP is the market value of all final goods and services produced domestically."],
  ["Macroeconomics", "easy", "Inflation is a sustained rise in the general ___.", ["level of employment", "price level", "exchange rate", "tax rate"], "B", "Inflation is a persistent increase in the general price level."],
  ["Macroeconomics", "medium", "Unemployment in which workers lack skills demanded by employers is called ___.", ["frictional unemployment", "structural unemployment", "seasonal unemployment", "cyclical unemployment"], "B", "Structural unemployment arises from a mismatch between skills and available jobs."],
  ["Macroeconomics", "medium", "Fiscal policy involves the use of ___ to influence the economy.", ["government spending and taxation", "interest rates only", "exchange rates", "import quotas"], "A", "Fiscal policy is government's use of spending and taxation."],
  ["Macroeconomics", "medium", "Monetary policy is mainly carried out by the ___.", ["central bank", "ministry of agriculture", "stock exchange", "labour union"], "A", "The central bank controls money supply, interest rates and credit conditions."],
  ["Macroeconomics", "easy", "A recession is generally defined as a period of ___.", ["falling output and employment", "rapid economic growth", "falling prices only", "rising exports only"], "A", "A recession involves a significant decline in economic activity."],
  ["Macroeconomics", "medium", "A budget deficit occurs when government ___.", ["spending exceeds revenue", "revenue exceeds spending", "borrows nothing", "cuts all taxes"], "A", "Deficits occur when expenditure is greater than revenue."],
  ["Macroeconomics", "medium", "Aggregate demand is the total demand for ___.", ["goods and services in an economy", "imports only", "government bonds", "foreign currency"], "A", "Aggregate demand sums consumption, investment, government spending and net exports."],
  ["Macroeconomics", "medium", "The exchange rate is the price of one currency expressed in ___.", ["another currency", "gold only", "goods", "labour hours"], "A", "Exchange rates express the value of one currency in terms of another."],
  ["Macroeconomics", "easy", "Economic growth is usually measured by the increase in ___.", ["real GDP", "population only", "tax rates", "money printed"], "A", "Real GDP growth is the standard measure of economic growth."],

  // Money & Banking
  ["Money & Banking", "easy", "Which of the following is a primary function of money?", ["Medium of exchange", "Production of goods", "Provision of healthcare", "Collection of taxes"], "A", "Money serves as a medium of exchange, store of value and unit of account."],
  ["Money & Banking", "easy", "The apex bank in Nigeria is the ___.", ["Central Bank of Nigeria", "Bank of Industry", "Nigerian Stock Exchange", "Federal Mortgage Bank"], "A", "The CBN is Nigeria's central bank and monetary authority."],
  ["Money & Banking", "easy", "Commercial banks make profit mainly by ___.", ["lending at higher interest than they pay depositors", "printing currency", "collecting taxes", "issuing passports"], "A", "The interest spread between lending and deposit rates generates profit."],
  ["Money & Banking", "medium", "Inflation reduces the ___ of money.", ["portability", "purchasing power", "acceptability", "divisibility"], "B", "As prices rise, a given amount of money buys fewer goods and services."],
  ["Money & Banking", "medium", "M1 money supply consists mainly of ___.", ["currency in circulation and demand deposits", "government bonds only", "fixed deposits only", "foreign reserves"], "A", "M1 includes currency and highly liquid demand deposits."],
  ["Money & Banking", "medium", "The process by which commercial banks create credit through lending is called ___.", ["credit creation", "nationalisation", "devaluation", "privatisation"], "A", "Banks create deposits when they lend, expanding the money supply."],
  ["Money & Banking", "easy", "The interest rate is the ___.", ["cost of borrowing money", "price of goods", "tax on income", "exchange rate"], "A", "Interest is the price paid for the use of borrowed money."],
  ["Money & Banking", "medium", "The Nigerian Stock Exchange facilitates the buying and selling of ___.", ["shares and securities", "agricultural produce", "passports", "electricity"], "A", "Stock exchanges provide a market for shares, bonds and other securities."],
  ["Money & Banking", "medium", "Insurance is a system of ___.", ["sharing risk among many people", "printing money", "tax collection", "lending to government"], "A", "Pooled premiums allow insurers to compensate members for covered losses."],
  ["Money & Banking", "medium", "A development bank provides long-term finance mainly for ___.", ["development projects", "consumer loans", "imported luxury goods", "daily trading"], "A", "Development banks support infrastructure, industry and long-term projects."],

  // International Trade
  ["International Trade", "easy", "International trade is the exchange of goods and services between ___.", ["countries", "individuals in one village", "banks only", "governments only"], "A", "It involves cross-border exchange between countries."],
  ["International Trade", "medium", "The principle of comparative advantage argues that countries should specialise in goods where they have the ___.", ["lowest opportunity cost", "highest price", "largest population", "most imports"], "A", "Comparative advantage is based on lower opportunity cost of production."],
  ["International Trade", "easy", "The balance of trade is the difference between the value of a country's ___ and ___.", ["exports; imports", "savings; investment", "revenue; expenditure", "assets; liabilities"], "A", "Balance of trade compares merchandise exports and imports."],
  ["International Trade", "medium", "A tariff is a tax imposed on ___.", ["imported goods", "domestic savings", "income", "land"], "A", "Tariffs raise the price of imports and protect domestic producers."],
  ["International Trade", "medium", "Devaluation of a currency makes exports ___.", ["cheaper and imports more expensive", "more expensive and imports cheaper", "unaffected", "illegal"], "A", "A weaker currency lowers export prices abroad and raises import prices at home."],
  ["International Trade", "easy", "ECOWAS is an organisation promoting economic integration in ___.", ["West Africa", "East Africa", "Southern Africa", "North Africa"], "A", "The Economic Community of West African States promotes regional integration."],
  ["International Trade", "easy", "OPEC mainly influences the price of ___.", ["petroleum", "cocoa", "gold", "wheat"], "A", "OPEC coordinates oil production and pricing policies."],
  ["International Trade", "medium", "Foreign exchange reserves are held by a country to ___.", ["settle international transactions", "pay domestic salaries only", "buy local goods", "print currency"], "A", "Reserves support imports, debt payments and exchange-rate stability."],
  ["International Trade", "easy", "A country's exports are goods and services it ___.", ["sells abroad", "buys abroad", "produces for home use only", "imports"], "A", "Exports are sold to other countries."],
  ["International Trade", "easy", "Imports are goods and services a country ___.", ["buys from abroad", "sells abroad", "produces and consumes locally", "donates"], "A", "Imports are purchased from other countries."],

  // Nigerian Economy
  ["Nigerian Economy", "easy", "Nigeria's major export commodity is ___.", ["crude oil", "cocoa", "groundnut", "palm oil"], "A", "Petroleum accounts for the largest share of Nigeria's export earnings."],
  ["Nigerian Economy", "medium", "Before oil became dominant, Nigeria's economy depended heavily on ___.", ["agriculture", "aircraft manufacturing", "tourism", "software"], "A", "Agricultural exports such as cocoa, palm oil and groundnuts dominated earnings."],
  ["Nigerian Economy", "easy", "The currency of Nigeria is the ___.", ["naira", "cedi", "dollar", "franc"], "A", "The naira is Nigeria's legal tender."],
  ["Nigerian Economy", "easy", "The Central Bank of Nigeria is responsible for ___.", ["monetary policy", "importing goods", "building roads", "running schools"], "A", "The CBN manages monetary policy and currency stability."],
  ["Nigerian Economy", "medium", "Privatisation is the transfer of state-owned enterprises to ___.", ["private ownership", "foreign governments", "traditional rulers", "local councils"], "A", "Privatisation sells public assets or management to private investors."],
  ["Nigerian Economy", "medium", "A subsidy is a government payment that ___.", ["lowers the cost of a good or service", "increases taxes", "restricts imports", "reduces the money supply"], "A", "Subsidies reduce production or consumption costs to support affordability."],
  ["Nigerian Economy", "medium", "The informal sector includes activities that are ___.", ["unregistered and largely unregulated", "fully taxed", "owned by government", "operated by foreign firms only"], "A", "Informal enterprises operate outside formal registration and regulation."],
  ["Nigerian Economy", "medium", "Economic diversification means ___.", ["expanding beyond dependence on one sector", "relying only on oil", "closing all industries", "increasing imports"], "A", "Diversification broadens the productive base beyond oil."],
  ["Nigerian Economy", "medium", "Nigeria's largest city by population is generally considered to be ___.", ["Lagos", "Kano", "Ibadan", "Abuja"], "A", "Lagos is Nigeria's largest urban agglomeration."],
  ["Nigerian Economy", "hard", "A major challenge of Nigeria's oil-dependent economy is ___.", ["vulnerability to oil price shocks", "the absence of imports", "too little currency", "the decline of telecommunications"], "A", "Falling oil prices reduce government revenue and foreign exchange earnings."]
];

export const economicsQuestions = makeQuestions("economics", "eco", rows);
