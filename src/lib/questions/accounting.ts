import { makeQuestions, type SeedRow } from "@/lib/questions/helpers";

const rows: SeedRow[] = [
  // Principles
  ["Principles", "easy", "Accounting is best described as the process of ___.", ["identifying, recording and communicating financial information", "selling goods only", "hiring employees", "manufacturing products"], "A", "Accounting records, classifies and communicates financial information to users."],
  ["Principles", "medium", "The going concern concept assumes that a business will ___.", ["continue operating for the foreseeable future", "close down within a year", "never make a profit", "avoid all liabilities"], "A", "Financial statements are prepared on the assumption that the entity will continue in operation."],
  ["Principles", "medium", "The accrual concept recognises revenue when it is ___ and expenses when they are ___.", ["earned; incurred", "received; paid", "received; incurred", "earned; paid"], "A", "Accrual accounting matches revenue earned with expenses incurred, regardless of cash movement."],
  ["Principles", "medium", "The consistency concept requires a business to ___.", ["apply the same accounting methods from period to period", "change methods every year", "ignore all standards", "record only cash transactions"], "A", "Consistent methods make financial statements comparable over time."],
  ["Principles", "easy", "The business entity concept treats the owner and the business as ___.", ["separate entities", "the same person", "partners in law", "government agencies"], "A", "Business transactions are kept separate from the owner's personal affairs."],
  ["Principles", "medium", "Prudence in accounting means ___.", ["exercising caution when making estimates", "recording only profits", "overstating assets", "ignoring liabilities"], "A", "Prudence avoids overstating income or assets and understating expenses or liabilities."],
  ["Principles", "easy", "The double entry principle states that every transaction has ___.", ["two aspects: a debit and a credit", "one entry only", "three entries", "no effect on accounts"], "A", "Each transaction is recorded in at least two accounts, with debits equalling credits."],
  ["Principles", "easy", "In accounting, the left side of an account is the ___ side.", ["debit", "credit", "balance", "capital"], "A", "Debit is conventionally the left side; credit is the right side."],
  ["Principles", "medium", "A trial balance is prepared to check the ___.", ["arithmetic accuracy of the ledger", "profit for the year", "market value of assets", "creditworthiness of customers"], "A", "It tests whether total debits equal total credits."],
  ["Principles", "easy", "The book in which transactions are first recorded is the ___.", ["journal", "ledger", "trial balance", "balance sheet"], "A", "The journal is the book of original entry; postings go to the ledger."],

  // Double Entry
  ["Double Entry", "easy", "An increase in an asset is recorded as a ___.", ["debit", "credit", "contra", "liability"], "A", "Assets increase on the debit side."],
  ["Double Entry", "easy", "An increase in a liability is recorded as a ___.", ["debit", "credit", "expense", "asset"], "B", "Liabilities and capital increase on the credit side."],
  ["Double Entry", "easy", "Capital introduced by the owner is recorded as a ___.", ["credit to capital", "debit to capital", "debit to sales", "credit to purchases"], "A", "The business owes the owner capital, so capital is credited."],
  ["Double Entry", "easy", "An increase in an expense is recorded as a ___.", ["debit", "credit", "liability", "income"], "A", "Expenses increase on the debit side."],
  ["Double Entry", "easy", "Revenue earned is recorded as a ___.", ["debit", "credit", "asset", "drawing"], "B", "Income and revenue increase on the credit side."],
  ["Double Entry", "medium", "Goods bought for cash are recorded as ___.", ["debit purchases; credit cash", "debit cash; credit purchases", "debit sales; credit cash", "debit cash; credit sales"], "A", "Purchases increase (debit) and cash decreases (credit)."],
  ["Double Entry", "medium", "Goods sold for cash are recorded as ___.", ["debit cash; credit sales", "debit sales; credit cash", "debit purchases; credit cash", "debit capital; credit sales"], "A", "Cash increases (debit) and sales income increases (credit)."],
  ["Double Entry", "medium", "Owner's drawings are recorded as ___.", ["debit drawings; credit cash", "debit cash; credit drawings", "debit capital; credit cash", "debit expenses; credit sales"], "A", "Drawings reduce capital and are debited, while cash is credited."],
  ["Double Entry", "medium", "A prepaid expense is treated as a ___.", ["current asset", "current liability", "fixed asset", "capital"], "A", "Payment made in advance represents a future benefit, hence an asset."],
  ["Double Entry", "medium", "An accrued expense is treated as a ___.", ["current liability", "current asset", "fixed asset", "revenue"], "A", "An expense incurred but not yet paid is owed, hence a liability."],

  // Final Accounts
  ["Final Accounts", "easy", "The trading account is prepared to determine ___.", ["gross profit or loss", "net profit only", "cash balance", "capital"], "A", "The trading account matches sales with cost of goods sold to find gross profit."],
  ["Final Accounts", "easy", "The profit and loss account determines ___.", ["net profit or loss", "gross profit only", "stock value", "bank balance"], "A", "It deducts operating expenses and adds other income to gross profit."],
  ["Final Accounts", "easy", "The balance sheet shows a business's ___.", ["financial position at a date", "profit over a period", "sales only", "cash receipts only"], "A", "It lists assets, liabilities and capital at a specific date."],
  ["Final Accounts", "medium", "Depreciation is the ___.", ["allocation of the cost of an asset over its useful life", "increase in asset value", "payment of a liability", "cash purchase of stock"], "A", "Depreciation spreads an asset's cost over its expected useful life."],
  ["Final Accounts", "easy", "Closing stock is classified as a ___.", ["current asset", "current liability", "fixed asset", "capital"], "A", "Unsold goods at year end are a current asset."],
  ["Final Accounts", "medium", "Cost of goods sold is calculated as ___.", ["opening stock + purchases − closing stock", "opening stock − purchases + closing stock", "sales − expenses", "closing stock + sales"], "A", "COGS = opening stock + purchases − closing stock."],
  ["Final Accounts", "medium", "If sales are ₦100,000 and cost of goods sold is ₦60,000, gross profit is ___.", ["₦40,000", "₦60,000", "₦160,000", "₦100,000"], "A", "Gross profit = sales − cost of goods sold = 100,000 − 60,000 = ₦40,000."],
  ["Final Accounts", "medium", "If gross profit is ₦40,000 and expenses are ₦15,000, net profit is ___.", ["₦15,000", "₦25,000", "₦40,000", "₦55,000"], "B", "Net profit = gross profit − expenses = 40,000 − 15,000 = ₦25,000."],
  ["Final Accounts", "easy", "The accounting equation is ___.", ["assets = capital + liabilities", "assets = capital − liabilities", "capital = assets + liabilities", "liabilities = assets + capital"], "A", "Resources (assets) are financed by owners' capital and liabilities."],
  ["Final Accounts", "medium", "A bad debt is a debt that ___.", ["is unlikely to be recovered", "has been paid early", "is owed to a supplier", "is a fixed asset"], "A", "Bad debts are receivables that have become irrecoverable and are written off."],

  // Ratios
  ["Ratios", "easy", "The current ratio is calculated as ___.", ["current assets ÷ current liabilities", "current liabilities ÷ current assets", "total assets ÷ capital", "profit ÷ sales"], "A", "It measures short-term liquidity."],
  ["Ratios", "medium", "The acid test ratio excludes ___ from current assets.", ["stock", "cash", "debtors", "bank balance"], "A", "The quick ratio removes inventory, the least liquid current asset."],
  ["Ratios", "medium", "Gross profit margin is ___.", ["gross profit ÷ sales × 100", "sales ÷ gross profit × 100", "net profit ÷ capital × 100", "expenses ÷ sales × 100"], "A", "It expresses gross profit as a percentage of sales."],
  ["Ratios", "medium", "Net profit margin is ___.", ["net profit ÷ sales × 100", "gross profit ÷ sales × 100", "sales ÷ net profit × 100", "assets ÷ profit × 100"], "A", "It shows how much of each naira of sales remains as net profit."],
  ["Ratios", "medium", "Return on capital employed is ___.", ["net profit ÷ capital employed × 100", "sales ÷ capital × 100", "gross profit ÷ expenses × 100", "assets ÷ liabilities"], "A", "It measures the profit generated relative to capital invested."],
  ["Ratios", "medium", "Stock turnover is calculated as ___.", ["cost of goods sold ÷ average stock", "average stock ÷ cost of goods sold", "sales ÷ capital", "stock ÷ debtors"], "A", "It indicates how many times stock is sold and replaced in a period."],
  ["Ratios", "medium", "The debtors' collection period measures the average time taken to ___.", ["collect money from credit customers", "pay suppliers", "sell stock", "pay dividends"], "A", "It estimates how long receivables remain outstanding."],
  ["Ratios", "hard", "Gearing measures the proportion of a company's capital that is ___.", ["debt", "ordinary share capital", "retained earnings", "fixed assets"], "A", "Gearing compares debt to total capital employed."],
  ["Ratios", "medium", "Earnings per share is calculated as ___.", ["profit after tax ÷ number of ordinary shares", "dividend ÷ share price", "sales ÷ assets", "net profit ÷ sales"], "A", "EPS shows profit attributable to each ordinary share."],
  ["Ratios", "easy", "Working capital equals ___.", ["current assets − current liabilities", "current liabilities − current assets", "fixed assets + current liabilities", "capital + liabilities"], "A", "It measures funds available for day-to-day operations."],

  // Cost Accounting
  ["Cost Accounting", "easy", "Cost accounting is mainly concerned with ___.", ["recording and controlling costs of production", "preparing tax returns only", "recording cash receipts", "auditing banks"], "A", "It gathers cost information for planning, control and decision-making."],
  ["Cost Accounting", "medium", "Prime cost consists of ___.", ["direct materials + direct labour + direct expenses", "all fixed costs", "selling and distribution costs", "administration expenses only"], "A", "Prime cost is the sum of direct production costs."],
  ["Cost Accounting", "easy", "Direct materials are materials that ___.", ["become part of the finished product", "are used in the office", "are sold as scrap only", "cannot be traced to a product"], "A", "Direct materials can be identified with a specific product."],
  ["Cost Accounting", "medium", "Factory overhead includes ___.", ["indirect production costs", "direct materials only", "direct labour only", "sales revenue"], "A", "Overheads are indirect costs such as factory rent and supervision."],
  ["Cost Accounting", "easy", "A fixed cost is one that ___.", ["does not change with output in the short run", "changes directly with output", "is always zero", "is paid only once"], "A", "Fixed costs, like rent, remain constant over a relevant output range."],
  ["Cost Accounting", "easy", "A variable cost is one that ___.", ["varies directly with the level of output", "never changes", "is always a loss", "is paid to shareholders"], "A", "Variable costs change in proportion to activity."],
  ["Cost Accounting", "medium", "Break-even point occurs where ___.", ["total revenue equals total cost", "revenue is zero", "profit is maximum", "fixed cost is zero"], "A", "At break-even, there is neither profit nor loss."],
  ["Cost Accounting", "medium", "If fixed costs are ₦100,000 and contribution per unit is ₦20, the break-even quantity is ___ units.", ["2,000", "5,000", "10,000", "20,000"], "B", "Break-even units = fixed costs ÷ contribution per unit = 100,000 ÷ 20 = 5,000."],
  ["Cost Accounting", "medium", "Marginal costing focuses on ___ costs.", ["variable", "fixed", "sunk", "opportunity"], "A", "Marginal costing separates variable costs from fixed costs."],
  ["Cost Accounting", "medium", "Standard costing compares actual costs with ___.", ["predetermined standard costs", "last year's profit only", "market prices only", "share prices"], "A", "Variances between actual and standard costs guide control."]
];

export const accountingQuestions = makeQuestions("accounting", "acc", rows);
