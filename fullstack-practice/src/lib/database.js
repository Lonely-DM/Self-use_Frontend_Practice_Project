import fs from "node:fs/promises";
import path from "node:path";
import initSqlJs from "sql.js";

const DB_DIR = path.join(process.cwd(), "storage");
const DB_FILE = path.join(DB_DIR, "catalog.sqlite");
const WASM_DIR = path.join(process.cwd(), "node_modules", "sql.js", "dist");

let sqlPromise;
let dbPromise;

const seedTransactions = [
  { name: "Salary", amount: 7200, date: "2026-04-01", type: "income" },
  { name: "Freelance Project", amount: 1400, date: "2026-04-04", type: "income" },
  { name: "Groceries", amount: 320, date: "2026-04-06", type: "expense" },
  { name: "Rent", amount: 1800, date: "2026-04-08", type: "expense" },
  { name: "Dining Out", amount: 168, date: "2026-04-11", type: "expense" }
];

const seedBudgets = [
  { category: "Entertainment", amount: 600, spent: 420 },
  { category: "Bills", amount: 2200, spent: 1880 },
  { category: "Dining Out", amount: 900, spent: 520 },
  { category: "Personal Care", amount: 450, spent: 260 }
];

const seedPots = [
  { name: "Emergency Fund", target: 20000, saved: 8600 },
  { name: "Vacation", target: 8000, saved: 3100 },
  { name: "New Laptop", target: 9000, saved: 4700 }
];

const seedRecurringBills = [
  { name: "Rent", amount: 1800, status: "paid" },
  { name: "Internet", amount: 120, status: "upcoming" },
  { name: "Credit Card", amount: 680, status: "due" }
];

async function getSQL() {
  if (!sqlPromise) {
    sqlPromise = initSqlJs({
      locateFile: (file) => path.join(WASM_DIR, file),
    });
  }

  return sqlPromise;
}

async function saveDatabase(db) {
  await fs.mkdir(DB_DIR, { recursive: true });
  const data = db.export();
  await fs.writeFile(DB_FILE, Buffer.from(data));
}

function mapRows(result) {
  if (!result.length) return [];

  const [{ columns, values }] = result;
  return values.map((row) =>
    Object.fromEntries(columns.map((column, index) => [column, row[index]]))
  );
}

function execRows(db, query) {
  return mapRows(db.exec(query));
}

function seedTable(db, tableName, rows, columns) {
  const count = Number(execRows(db, `SELECT COUNT(*) AS count FROM ${tableName}`)[0]?.count || 0);
  if (count > 0) return false;

  const placeholders = columns.map(() => "?").join(", ");
  const statement = db.prepare(
    `INSERT INTO ${tableName} (${columns.join(", ")}) VALUES (${placeholders})`
  );

  for (const row of rows) {
    statement.run(columns.map((column) => row[column]));
  }

  statement.free();
  return true;
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
      spent REAL NOT NULL
    );

    CREATE TABLE IF NOT EXISTS pots (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      target REAL NOT NULL,
      saved REAL NOT NULL
    );

    CREATE TABLE IF NOT EXISTS recurring_bills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      amount REAL NOT NULL,
      status TEXT NOT NULL CHECK (status IN ('paid', 'upcoming', 'due'))
    );
  `);

  const seeded = [
    seedTable(db, "transactions", seedTransactions, ["name", "amount", "date", "type"]),
    seedTable(db, "budgets", seedBudgets, ["category", "amount", "spent"]),
    seedTable(db, "pots", seedPots, ["name", "target", "saved"]),
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

  const [incomeRow] = execRows(
    db,
    "SELECT COALESCE(SUM(amount), 0) AS total FROM transactions WHERE type = 'income'"
  );
  const [expensesRow] = execRows(
    db,
    "SELECT COALESCE(SUM(amount), 0) AS total FROM transactions WHERE type = 'expense'"
  );

  const income = Number(incomeRow?.total || 0);
  const expenses = Number(expensesRow?.total || 0);
  const balance = income - expenses;

  return {
    balance,
    income,
    expenses,
    pots: execRows(db, "SELECT * FROM pots ORDER BY id ASC"),
    transactions: execRows(db, "SELECT * FROM transactions ORDER BY date DESC, id DESC"),
    budgets: execRows(db, "SELECT * FROM budgets ORDER BY id ASC"),
    recurringBills: execRows(db, "SELECT * FROM recurring_bills ORDER BY id ASC"),
  };
}