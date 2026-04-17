import fs from "node:fs/promises";
import path from "node:path";
import initSqlJs from "sql.js";

const DB_DIR = path.join(process.cwd(), "storage");
const DB_FILE = path.join(DB_DIR, "catalog.sqlite");
const WASM_DIR = path.join(process.cwd(), "node_modules", "sql.js", "dist");
const DEFAULT_POT_COLOR = "#277C78";
const DEFAULT_BUDGET_COLOR = "#277C78";

let sqlPromise;
let dbPromise;

const seedTransactions = [
  { name: "Salary", amount: 7200, date: "2026-04-01", type: "income" },
  { name: "Freelance Project", amount: 1400, date: "2026-04-04", type: "income" },
  { name: "Groceries", amount: 320, date: "2026-04-06", type: "expense" },
  { name: "Rent", amount: 1800, date: "2026-04-08", type: "expense" },
  { name: "Dining Out", amount: 168, date: "2026-04-11", type: "expense" },
];

const seedBudgets = [
  {
    category: "Entertainment",
    amount: 600,
    spent: 420,
    color: "#277C78",
    created_at: "2026-04-01T09:00:00.000Z",
    updated_at: "2026-04-11T09:00:00.000Z",
  },
  {
    category: "Bills",
    amount: 2200,
    spent: 1880,
    color: "#82C9D7",
    created_at: "2026-04-02T09:00:00.000Z",
    updated_at: "2026-04-12T09:00:00.000Z",
  },
  {
    category: "Dining Out",
    amount: 900,
    spent: 520,
    color: "#F2CDAC",
    created_at: "2026-04-03T09:00:00.000Z",
    updated_at: "2026-04-13T09:00:00.000Z",
  },
  {
    category: "Personal Care",
    amount: 450,
    spent: 260,
    color: "#626070",
    created_at: "2026-04-04T09:00:00.000Z",
    updated_at: "2026-04-14T09:00:00.000Z",
  },
];

const seedPots = [
  {
    name: "Emergency Fund",
    target: 20000,
    saved: 8600,
    color: "#277C78",
    created_at: "2026-04-01T09:00:00.000Z",
    updated_at: "2026-04-11T09:00:00.000Z",
  },
  {
    name: "Vacation Fund",
    target: 8000,
    saved: 3100,
    color: "#82C9D7",
    created_at: "2026-04-03T09:00:00.000Z",
    updated_at: "2026-04-12T09:00:00.000Z",
  },
  {
    name: "New Laptop",
    target: 9000,
    saved: 4700,
    color: "#F2CDAC",
    created_at: "2026-04-05T09:00:00.000Z",
    updated_at: "2026-04-13T09:00:00.000Z",
  },
];

const seedRecurringBills = [
  { name: "Rent", amount: 1800, status: "paid" },
  { name: "Internet", amount: 120, status: "upcoming" },
  { name: "Credit Card", amount: 680, status: "due" },
];

async function getSQL() {
  if (!sqlPromise) {
    sqlPromise = initSqlJs({
      locateFile: (file) => path.join(WASM_DIR, file),
    });
  }

  return sqlPromise;
}

function getNowIso() {
  return new Date().toISOString();
}

async function saveDatabase(db) {
  await fs.mkdir(DB_DIR, { recursive: true });
  const data = db.export();
  await fs.writeFile(DB_FILE, Buffer.from(data));
}

function mapRows(result) {
  if (!result.length) return [];

  const [{ columns, values }] = result;
  return values.map((row) => Object.fromEntries(columns.map((column, index) => [column, row[index]])));
}

function execRows(db, query) {
  return mapRows(db.exec(query));
}

function getTableColumns(db, tableName) {
  return execRows(db, `PRAGMA table_info(${tableName})`).map((column) => column.name);
}

function seedTable(db, tableName, rows, columns) {
  const count = Number(execRows(db, `SELECT COUNT(*) AS count FROM ${tableName}`)[0]?.count || 0);
  if (count > 0) return false;

  const placeholders = columns.map(() => "?").join(", ");
  const statement = db.prepare(
    `INSERT INTO ${tableName} (${columns.join(", ")}) VALUES (${placeholders})`,
  );

  for (const row of rows) {
    statement.run(columns.map((column) => row[column]));
  }

  statement.free();
  return true;
}

function ensurePotsSchema(db) {
  const existingColumns = new Set(getTableColumns(db, "pots"));

  if (!existingColumns.has("color")) {
    db.run("ALTER TABLE pots ADD COLUMN color TEXT");
  }

  if (!existingColumns.has("created_at")) {
    db.run("ALTER TABLE pots ADD COLUMN created_at TEXT");
  }

  if (!existingColumns.has("updated_at")) {
    db.run("ALTER TABLE pots ADD COLUMN updated_at TEXT");
  }

  const now = getNowIso();
  db.run(`UPDATE pots SET color = '${DEFAULT_POT_COLOR}' WHERE color IS NULL OR TRIM(color) = ''`);
  db.run(`UPDATE pots SET created_at = '${now}' WHERE created_at IS NULL OR TRIM(created_at) = ''`);
  db.run(`UPDATE pots SET updated_at = created_at WHERE updated_at IS NULL OR TRIM(updated_at) = ''`);
}

function ensureBudgetsSchema(db) {
  const existingColumns = new Set(getTableColumns(db, "budgets"));

  if (!existingColumns.has("color")) {
    db.run("ALTER TABLE budgets ADD COLUMN color TEXT");
  }

  if (!existingColumns.has("created_at")) {
    db.run("ALTER TABLE budgets ADD COLUMN created_at TEXT");
  }

  if (!existingColumns.has("updated_at")) {
    db.run("ALTER TABLE budgets ADD COLUMN updated_at TEXT");
  }

  const now = getNowIso();
  db.run(`UPDATE budgets SET color = '${DEFAULT_BUDGET_COLOR}' WHERE color IS NULL OR TRIM(color) = ''`);
  db.run(`UPDATE budgets SET created_at = '${now}' WHERE created_at IS NULL OR TRIM(created_at) = ''`);
  db.run(`UPDATE budgets SET updated_at = created_at WHERE updated_at IS NULL OR TRIM(updated_at) = ''`);
}

function mapBudgetRow(row) {
  return {
    id: Number(row.id),
    category: row.category,
    amount: Number(row.amount || 0),
    spent: Number(row.spent || 0),
    color: row.color || DEFAULT_BUDGET_COLOR,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

function listBudgetsFromDb(db) {
  return execRows(
    db,
    "SELECT id, category, amount, spent, color, created_at, updated_at FROM budgets ORDER BY datetime(updated_at) DESC, id DESC",
  ).map(mapBudgetRow);
}

function getBudgetByIdFromDb(db, id) {
  return listBudgetsFromDb(db).find((budget) => budget.id === Number(id)) || null;
}

function buildBudgetsSummary(budgets) {
  const totalBudgeted = budgets.reduce((sum, budget) => sum + budget.amount, 0);
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0);
  const totalRemaining = budgets.reduce(
    (sum, budget) => sum + Math.max(budget.amount - budget.spent, 0),
    0,
  );
  const overspentCount = budgets.filter((budget) => budget.spent > budget.amount).length;

  return {
    totalBudgeted,
    totalSpent,
    totalRemaining,
    overspentCount,
    totalCount: budgets.length,
  };
}

function mapPotRow(row) {
  return {
    id: Number(row.id),
    name: row.name,
    target: Number(row.target || 0),
    saved: Number(row.saved || 0),
    color: row.color || DEFAULT_POT_COLOR,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

function listPotsFromDb(db) {
  return execRows(
    db,
    "SELECT id, name, target, saved, color, created_at, updated_at FROM pots ORDER BY datetime(updated_at) DESC, id DESC",
  ).map(mapPotRow);
}

function getPotByIdFromDb(db, id) {
  return listPotsFromDb(db).find((pot) => pot.id === Number(id)) || null;
}

function buildPotsSummary(pots) {
  const totalSaved = pots.reduce((sum, pot) => sum + pot.saved, 0);
  const totalTargets = pots.reduce((sum, pot) => sum + pot.target, 0);
  const completed = pots.filter((pot) => pot.target > 0 && pot.saved >= pot.target).length;

  return {
    totalSaved,
    totalTargets,
    completionRate: pots.length ? (completed / pots.length) * 100 : 0,
    completedCount: completed,
    totalCount: pots.length,
  };
}

function buildFinancialSnapshot({ income, expenses, pots }) {
  const potsSaved = pots.reduce((sum, pot) => sum + pot.saved, 0);
  const balance = income - expenses;
  const currentAvailable = balance - potsSaved;

  return {
    balance,
    currentAvailable,
    potsSaved,
  };
}

function getTransactionTotals(db) {
  const [incomeRow] = execRows(
    db,
    "SELECT COALESCE(SUM(amount), 0) AS total FROM transactions WHERE type = 'income'",
  );
  const [expensesRow] = execRows(
    db,
    "SELECT COALESCE(SUM(amount), 0) AS total FROM transactions WHERE type = 'expense'",
  );

  const income = Number(incomeRow?.total || 0);
  const expenses = Number(expensesRow?.total || 0);

  return {
    income,
    expenses,
    balance: income - expenses,
  };
}

function getAvailableBalanceFromDb(db) {
  const { balance } = getTransactionTotals(db);
  const potsSaved = listPotsFromDb(db).reduce((sum, pot) => sum + pot.saved, 0);

  return balance - potsSaved;
}

async function ensureNonNegativeBalance(db) {
  const totals = getTransactionTotals(db);

  if (totals.balance >= 0) {
    return totals;
  }

  const recoveryAmount = Math.ceil((Math.abs(totals.balance) + 1) / 100) * 100;
  const statement = db.prepare(
    "INSERT INTO transactions (name, amount, date, type) VALUES (?, ?, ?, ?)",
  );

  statement.run(["Freelance Project", recoveryAmount, new Date().toISOString().slice(0, 10), "income"]);
  statement.free();

  await saveDatabase(db);
  return getTransactionTotals(db);
}

function normalizeColor(color) {
  return typeof color === "string" && color.trim() ? color.trim() : DEFAULT_POT_COLOR;
}

function normalizeBudgetColor(color) {
  return typeof color === "string" && color.trim() ? color.trim() : DEFAULT_BUDGET_COLOR;
}

async function createDatabase() {
  const SQL = await getSQL();
  let db;

  try {
    const file = await fs.readFile(DB_FILE);
    db = new SQL.Database(file);
  } catch {
    db = new SQL.Database();
  }

  db.run(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      amount REAL NOT NULL,
      date TEXT NOT NULL,
      type TEXT NOT NULL CHECK (type IN ('income', 'expense'))
    );

    CREATE TABLE IF NOT EXISTS budgets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category TEXT NOT NULL,
      amount REAL NOT NULL,
      spent REAL NOT NULL,
      color TEXT NOT NULL DEFAULT '#277C78',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS pots (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      target REAL NOT NULL,
      saved REAL NOT NULL DEFAULT 0,
      color TEXT NOT NULL DEFAULT '#277C78',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS recurring_bills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      amount REAL NOT NULL,
      status TEXT NOT NULL CHECK (status IN ('paid', 'upcoming', 'due'))
    );
  `);

  ensureBudgetsSchema(db);
  ensurePotsSchema(db);

  const seeded = [
    seedTable(db, "transactions", seedTransactions, ["name", "amount", "date", "type"]),
    seedTable(db, "budgets", seedBudgets, ["category", "amount", "spent", "color", "created_at", "updated_at"]),
    seedTable(db, "pots", seedPots, ["name", "target", "saved", "color", "created_at", "updated_at"]),
    seedTable(db, "recurring_bills", seedRecurringBills, ["name", "amount", "status"]),
  ].some(Boolean);

  if (seeded) {
    await saveDatabase(db);
  }

  return db;
}

export async function getDb() {
  if (!dbPromise) {
    dbPromise = createDatabase();
  }

  return dbPromise;
}

export async function getOverviewData() {
  const db = await getDb();
  const { income, expenses } = await ensureNonNegativeBalance(db);
  const pots = listPotsFromDb(db);
  const budgets = listBudgetsFromDb(db);
  const financialSnapshot = buildFinancialSnapshot({
    income,
    expenses,
    pots,
  });

  return {
    balance: financialSnapshot.balance,
    income,
    expenses,
    availableBalance: financialSnapshot.currentAvailable,
    potsSaved: financialSnapshot.potsSaved,
    pots,
    transactions: execRows(db, "SELECT * FROM transactions ORDER BY date DESC, id DESC"),
    budgets,
    recurringBills: execRows(db, "SELECT * FROM recurring_bills ORDER BY id ASC"),
  };
}

export async function getBudgetsData() {
  const db = await getDb();
  const budgets = listBudgetsFromDb(db);

  return {
    budgets,
    summary: buildBudgetsSummary(budgets),
  };
}

export async function getPotsData() {
  const db = await getDb();
  const pots = listPotsFromDb(db);
  const { income, expenses } = await ensureNonNegativeBalance(db);
  const financialSnapshot = buildFinancialSnapshot({
    income,
    expenses,
    pots,
  });

  return {
    pots,
    summary: {
      ...buildPotsSummary(pots),
      currentAvailable: financialSnapshot.currentAvailable,
    },
  };
}

export async function createPot({ name, target, saved = 0, color }) {
  const db = await getDb();
  const now = getNowIso();
  const startingSaved = Number(saved);

  if (startingSaved > getAvailableBalanceFromDb(db)) {
    throw new Error("Insufficient funds.");
  }

  const statement = db.prepare(
    "INSERT INTO pots (name, target, saved, color, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
  );

  statement.run([name, Number(target), startingSaved, normalizeColor(color), now, now]);
  statement.free();

  const [row] = execRows(db, "SELECT last_insert_rowid() AS id");
  await saveDatabase(db);

  return getPotByIdFromDb(db, Number(row?.id));
}

export async function updatePot(id, { name, target, color }) {
  const db = await getDb();
  const now = getNowIso();
  const statement = db.prepare(
    "UPDATE pots SET name = ?, target = ?, color = ?, updated_at = ? WHERE id = ?",
  );

  statement.run([name, Number(target), normalizeColor(color), now, Number(id)]);
  statement.free();

  const pot = getPotByIdFromDb(db, id);
  if (!pot) {
    throw new Error("Pot not found.");
  }

  await saveDatabase(db);
  return pot;
}

export async function deletePot(id) {
  const db = await getDb();
  const existing = getPotByIdFromDb(db, id);
  if (!existing) {
    throw new Error("Pot not found.");
  }

  const statement = db.prepare("DELETE FROM pots WHERE id = ?");
  statement.run([Number(id)]);
  statement.free();

  await saveDatabase(db);
}

export async function addFundsToPot(id, amount) {
  const db = await getDb();
  const existing = getPotByIdFromDb(db, id);
  if (!existing) {
    throw new Error("Pot not found.");
  }

  const nextAmount = Number(amount);
  if (nextAmount > getAvailableBalanceFromDb(db)) {
    throw new Error("Insufficient funds.");
  }

  const nextSaved = existing.saved + nextAmount;
  const statement = db.prepare("UPDATE pots SET saved = ?, updated_at = ? WHERE id = ?");
  statement.run([nextSaved, getNowIso(), Number(id)]);
  statement.free();

  await saveDatabase(db);
  return getPotByIdFromDb(db, id);
}

export async function withdrawFundsFromPot(id, amount) {
  const db = await getDb();
  const existing = getPotByIdFromDb(db, id);
  if (!existing) {
    throw new Error("Pot not found.");
  }

  const nextSaved = existing.saved - Number(amount);
  if (nextSaved < 0) {
    throw new Error("Insufficient saved balance.");
  }

  const statement = db.prepare("UPDATE pots SET saved = ?, updated_at = ? WHERE id = ?");
  statement.run([nextSaved, getNowIso(), Number(id)]);
  statement.free();

  await saveDatabase(db);
  return getPotByIdFromDb(db, id);
}

export async function createBudget({ category, amount, spent = 0, color }) {
  const db = await getDb();
  const now = getNowIso();
  const statement = db.prepare(
    "INSERT INTO budgets (category, amount, spent, color, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
  );

  statement.run([category, Number(amount), Number(spent), normalizeBudgetColor(color), now, now]);
  statement.free();

  const [row] = execRows(db, "SELECT last_insert_rowid() AS id");
  await saveDatabase(db);

  return getBudgetByIdFromDb(db, Number(row?.id));
}

export async function updateBudget(id, { category, amount, color }) {
  const db = await getDb();
  const existing = getBudgetByIdFromDb(db, id);
  if (!existing) {
    throw new Error("Budget not found.");
  }

  const statement = db.prepare(
    "UPDATE budgets SET category = ?, amount = ?, color = ?, updated_at = ? WHERE id = ?",
  );
  statement.run([category, Number(amount), normalizeBudgetColor(color), getNowIso(), Number(id)]);
  statement.free();

  await saveDatabase(db);
  return getBudgetByIdFromDb(db, id);
}

export async function deleteBudget(id) {
  const db = await getDb();
  const existing = getBudgetByIdFromDb(db, id);
  if (!existing) {
    throw new Error("Budget not found.");
  }

  const statement = db.prepare("DELETE FROM budgets WHERE id = ?");
  statement.run([Number(id)]);
  statement.free();

  await saveDatabase(db);
}

export async function addBudgetSpend(id, amount) {
  const db = await getDb();
  const existing = getBudgetByIdFromDb(db, id);
  if (!existing) {
    throw new Error("Budget not found.");
  }

  const statement = db.prepare("UPDATE budgets SET spent = ?, updated_at = ? WHERE id = ?");
  statement.run([existing.spent + Number(amount), getNowIso(), Number(id)]);
  statement.free();

  await saveDatabase(db);
  return getBudgetByIdFromDb(db, id);
}

export async function reduceBudgetSpend(id, amount) {
  const db = await getDb();
  const existing = getBudgetByIdFromDb(db, id);
  if (!existing) {
    throw new Error("Budget not found.");
  }

  const nextSpent = existing.spent - Number(amount);
  if (nextSpent < 0) {
    throw new Error("Spent amount cannot be negative.");
  }

  const statement = db.prepare("UPDATE budgets SET spent = ?, updated_at = ? WHERE id = ?");
  statement.run([nextSpent, getNowIso(), Number(id)]);
  statement.free();

  await saveDatabase(db);
  return getBudgetByIdFromDb(db, id);
}
