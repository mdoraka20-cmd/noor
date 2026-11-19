import {
  AppUser,
  ContactsInfo,
  Customer,
  DealerDeal,
  DeliveryChallan,
  Invoice,
  NoticeBanner,
  Payment,
  Product,
  ShopConfig,
  SmsGatewaySettings,
  SmsLog,
  StaffPermissions,
  StockInRecord,
  Txn,
} from '../types';
import { DEFAULT_SMS_TEMPLATES } from '../utils/smsUtils';
import {
  GREAT_WALL_CATEGORIES,
  GREAT_WALL_PRODUCTS,
  GREAT_WALL_VENDOR,
} from '../data/greatWallProducts';
import {
  RAK_CATEGORIES,
  RAK_PRODUCTS,
  RAK_VENDOR,
} from '../data/rakProducts';
import {
  SHELTECH_CATEGORIES,
  SHELTECH_PRODUCTS,
  SHELTECH_VENDOR,
} from '../data/sheltechProducts';
import {
  MONALISA_CATEGORIES,
  MONALISA_PRODUCTS,
  MONALISA_VENDOR,
} from '../data/monalisaProducts';

const KEYS = {
  SHOP: 'inv_billing_fresh_v1_shop',
  PRODUCTS: 'inv_billing_fresh_v1_products',
  CUSTOMERS: 'inv_billing_fresh_v1_customers',
  INVOICES: 'inv_billing_fresh_v1_invoices',
  PAYMENTS: 'inv_billing_fresh_v1_payments',
  TXNS: 'inv_billing_fresh_v1_txns',
  USERS: 'inv_billing_fresh_v1_users',
  DEALERS: 'inv_billing_fresh_v1_dealers',
  PAYMENT_METHODS: 'inv_billing_fresh_v1_payment_methods',
  CATEGORIES: 'inv_billing_fresh_v1_categories',
  VENDORS: 'inv_billing_fresh_v1_vendors',
  STAFF_PERMS: 'inv_billing_fresh_v1_staff_perms',
  NOTICE: 'inv_billing_fresh_v1_notice',
  CONTACTS: 'inv_billing_fresh_v1_contacts',
  SMS_LOGS: 'inv_billing_fresh_v1_sms_logs',
  SMS_SETTINGS: 'inv_billing_fresh_v1_sms_settings',
  STOCK_INS: 'inv_billing_fresh_v1_stock_ins',
  DELIVERY_CHALLANS: 'inv_billing_fresh_v1_delivery_challans',
  CURRENT_USER: 'inv_billing_fresh_v1_current_user',
  AUTH_SESSION: 'inv_billing_fresh_v1_auth_session',
  GW_CATALOG_SEEDED: 'inv_billing_fresh_v1_gw_catalog_seeded_v1',
  ALL_CATALOGS_SEEDED: 'inv_billing_fresh_v1_all_catalogs_seeded_v2',
};

export const STORAGE_KEYS = KEYS;

const ALL_SEED_PRODUCTS: Product[] = [
  ...GREAT_WALL_PRODUCTS,
  ...SHELTECH_PRODUCTS,
  ...RAK_PRODUCTS,
  ...MONALISA_PRODUCTS,
];

const ALL_SEED_VENDORS: string[] = [
  GREAT_WALL_VENDOR,
  SHELTECH_VENDOR,
  RAK_VENDOR,
  MONALISA_VENDOR,
];

const ALL_SEED_CATEGORIES: string[] = Array.from(
  new Set([
    ...GREAT_WALL_CATEGORIES,
    ...SHELTECH_CATEGORIES,
    ...RAK_CATEGORIES,
    ...MONALISA_CATEGORIES,
  ])
);

export const defaultShop: ShopConfig = {
  name: 'নতুন টাইলস ও স্যানিটারি হাউস',
  address: 'দোকানের ঠিকানা লিখুন (Settings থেকে পরিবর্তন করুন)',
  phones: '01700-000000',
  web: '',
  note: 'চায়না, ভেজা, সিমেন্ট লাগানো টাইলস ফেরত যোগ্য নয়।\nঅবশ্যই ২ মাসের ভিতর টাইলস ফেরত দিতে হবে।',
  preparedBy: '',
  startInvoiceNo: '1001',
  footerText: 'আমাদের সেবায় সন্তুষ্ট থাকলে আবার আসবেন — ধন্যবাদ',
  logoUrl: '',
};

export const defaultStaffPermissions: StaffPermissions = {
  canCreateInvoice: true,
  canEditInvoice: true,
  canDeleteInvoice: false,
  canChangeDeal: true,
  canAccessStock: true,
  canDispatchDelivery: true,
  canStockIn: true,
  canDeletePendingChallan: false,
  canDeleteDeliveryChallan: false,
  canManageCustomers: true,
  canDeleteCustomers: false,
  canManageProducts: true,
  canRecordPayment: true,
  canManageExpenses: true,
  canViewReports: true,
  canAccessSettings: false,
  canBackupData: false,
  canSendSms: true,
  canManageSmsSettings: false,
};

export const defaultNoticeBanner: NoticeBanner = {
  enabled: true,
  message: 'নতুন ইনভেন্টরি ও বিলিং সিস্টেমে স্বাগতম! সেটিংস থেকে আপনার দোকানের নাম, ঠিকানা ও মোবাইল নম্বর আপডেট করুন।',
  updatedAt: '',
  updatedBy: 'System',
};

export const defaultContactsInfo: ContactsInfo = {
  companyName: 'Inventory Support Desk',
  phones: '01700-000000',
  serviceMessage: 'সফটওয়্যার সংক্রান্ত যেকোনো সহায়তা ও কাস্টমাইজেশনের জন্য এডমিন প্যানেল থেকে যোগাযোগ তথ্য আপডেট করুন।',
  updatedAt: '',
  updatedBy: 'System',
};

export const defaultSmsSettings: SmsGatewaySettings = {
  smsEnabled: true,
  activeProvider: 'sandbox',
  senderId: 'MYSHOP',
  costPerSms: 0.35,
  duplicateWindowMinutes: 5,
  requireConsent: false,
  appendOptOutText: false,
  customApiUrl: '',
  customBalanceUrl: '',
  customAuthHeader: 'Authorization',
  templates: DEFAULT_SMS_TEMPLATES,
  updatedAt: '',
  updatedBy: 'System',
};

const defaultUsers: AppUser[] = [
  {
    id: 'usr_admin_1',
    username: 'admin',
    name: 'সিস্টেম এডমিন',
    role: 'admin',
    password: 'admin123',
    phone: '',
    createdAt: new Date().toISOString().slice(0, 10),
  },
  {
    id: 'usr_staff_1',
    username: 'staff',
    name: 'সেলস স্টাফ',
    role: 'staff',
    password: '1234',
    phone: '',
    createdAt: new Date().toISOString().slice(0, 10),
  },
];

const defaultCategories: string[] = [
  'Floor',
  'Wall',
  'Decor',
  'Matching Floor',
  'Step',
  'Rustic Wall',
  'Stone Sheild Floor',
  'Border',
  'Stair',
  'Sanitary',
  'Fittings',
  'Adhesive',
];
const defaultVendors: string[] = [
  GREAT_WALL_VENDOR,
  SHELTECH_VENDOR,
  RAK_VENDOR,
  MONALISA_VENDOR,
  'AKIJ',
  'RAK',
  'DBC',
  'Mir Ceramic',
  'Star Ceramic',
  'Fresh',
];
export const defaultPaymentMethods: string[] = ['Cash', 'Bank', 'Bkash'];

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

let suppressCloudSync = false;
let syncListener: ((key: string) => void) | null = null;

function writeJSON(
  key: string,
  val: unknown,
  silent = false,
  skipCloudSync = false
): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
    if (!silent) {
      window.dispatchEvent(new Event('app-storage-updated'));
    }
    if (!skipCloudSync && !suppressCloudSync && syncListener) {
      syncListener(key);
    }
  } catch (err) {
    console.error('LocalStorage write failed:', err);
  }
}

export const StorageService = {
  registerSyncListener(cb: ((key: string) => void) | null): void {
    syncListener = cb;
  },
  runWithoutSync(fn: () => void, emitUpdatedEvent = false): void {
    const prev = suppressCloudSync;
    suppressCloudSync = true;
    try {
      fn();
    } finally {
      suppressCloudSync = prev;
    }
    if (emitUpdatedEvent) {
      window.dispatchEvent(new Event('app-storage-updated'));
    }
  },
  getShop(): ShopConfig {
    return { ...defaultShop, ...readJSON<Partial<ShopConfig>>(KEYS.SHOP, {}) };
  },
  saveShop(shop: ShopConfig, silent = false): void {
    writeJSON(KEYS.SHOP, shop, silent);
  },

  mergeAllCatalogs(existingProducts: Product[]): { merged: Product[]; added: Product[] } {
    const merged = [...existingProducts];
    const added: Product[] = [];
    const usedIds = new Set<number>(existingProducts.map((p) => p.id));
    const existingCodes = new Set<string>(
      existingProducts.map((p) => (p.code || '').trim().toLowerCase()).filter(Boolean)
    );
    const existingNames = new Set<string>(
      existingProducts.map((p) => (p.name || '').trim().toLowerCase()).filter(Boolean)
    );
    let maxId = existingProducts.reduce((m, p) => Math.max(m, p.id || 0), 0);

    for (const seedProd of ALL_SEED_PRODUCTS) {
      const codeKey = seedProd.code.trim().toLowerCase();
      const nameKey = seedProd.name.trim().toLowerCase();
      if (existingCodes.has(codeKey) || existingNames.has(nameKey)) {
        continue;
      }
      let nextId = seedProd.id;
      if (usedIds.has(nextId)) {
        maxId = Math.max(maxId, nextId) + 1;
        nextId = maxId;
      }
      usedIds.add(nextId);
      existingCodes.add(codeKey);
      existingNames.add(nameKey);

      const created: Product = { ...seedProd, id: nextId };
      merged.push(created);
      added.push(created);
    }

    return { merged, added };
  },

  mergeGreatWallCatalog(existingProducts: Product[]): { merged: Product[]; added: Product[] } {
    return this.mergeAllCatalogs(existingProducts);
  },

  ensureAllCatalogsSeeded(emitEvent = false): void {
    try {
      if (localStorage.getItem(KEYS.ALL_CATALOGS_SEEDED) === 'true') {
        return;
      }

      const rawCats = readJSON<string[]>(KEYS.CATEGORIES, []);
      const baseCats = rawCats.length > 0 ? [...rawCats] : [...defaultCategories];
      let catsChanged = rawCats.length === 0;
      for (const cat of ALL_SEED_CATEGORIES) {
        if (!baseCats.some((c) => c.toLowerCase() === cat.toLowerCase())) {
          baseCats.push(cat);
          catsChanged = true;
        }
      }
      if (catsChanged) {
        writeJSON(KEYS.CATEGORIES, baseCats, true, true);
      }

      const rawVends = readJSON<string[]>(KEYS.VENDORS, []);
      const baseVends = rawVends.length > 0 ? [...rawVends] : [...defaultVendors];
      let vendsChanged = rawVends.length === 0;
      for (let i = ALL_SEED_VENDORS.length - 1; i >= 0; i--) {
        const vendor = ALL_SEED_VENDORS[i];
        if (!baseVends.some((v) => v.toLowerCase() === vendor.toLowerCase())) {
          baseVends.unshift(vendor);
          vendsChanged = true;
        }
      }
      if (vendsChanged) {
        writeJSON(KEYS.VENDORS, baseVends, true, true);
      }

      const existingProds = readJSON<Product[]>(KEYS.PRODUCTS, []);
      const { merged, added } = this.mergeAllCatalogs(existingProds);
      if (added.length > 0 || existingProds.length === 0) {
        writeJSON(KEYS.PRODUCTS, merged, true, true);
      }

      localStorage.setItem(KEYS.GW_CATALOG_SEEDED, 'true');
      localStorage.setItem(KEYS.ALL_CATALOGS_SEEDED, 'true');
      if (emitEvent) {
        window.dispatchEvent(new Event('app-storage-updated'));
      }
    } catch (err) {
      console.error('Failed seeding vendor catalogs:', err);
    }
  },

  ensureGreatWallCatalogSeeded(emitEvent = false): void {
    this.ensureAllCatalogsSeeded(emitEvent);
  },

  getProducts(): Product[] {
    this.ensureAllCatalogsSeeded(false);
    return readJSON<Product[]>(KEYS.PRODUCTS, []);
  },
  saveProducts(products: Product[], silent = false): void {
    writeJSON(KEYS.PRODUCTS, products, silent);
  },

  getCustomers(): Customer[] {
    return readJSON<Customer[]>(KEYS.CUSTOMERS, []);
  },
  saveCustomers(customers: Customer[], silent = false): void {
    writeJSON(KEYS.CUSTOMERS, customers, silent);
  },

  getInvoices(): Invoice[] {
    return readJSON<Invoice[]>(KEYS.INVOICES, []);
  },
  saveInvoices(invoices: Invoice[], silent = false): void {
    writeJSON(KEYS.INVOICES, invoices, silent);
  },

  getPayments(): Payment[] {
    return readJSON<Payment[]>(KEYS.PAYMENTS, []);
  },
  savePayments(payments: Payment[], silent = false): void {
    writeJSON(KEYS.PAYMENTS, payments, silent);
  },

  getTxns(): Txn[] {
    return readJSON<Txn[]>(KEYS.TXNS, []);
  },
  saveTxns(txns: Txn[], silent = false): void {
    writeJSON(KEYS.TXNS, txns, silent);
  },

  getUsers(): AppUser[] {
    const list = readJSON<AppUser[]>(KEYS.USERS, []);
    if (list.length === 0) {
      writeJSON(KEYS.USERS, defaultUsers, true, true);
      return defaultUsers;
    }
    return list;
  },
  saveUsers(users: AppUser[], silent = false): void {
    writeJSON(KEYS.USERS, users, silent);
  },

  getDealers(): DealerDeal[] {
    return readJSON<DealerDeal[]>(KEYS.DEALERS, []);
  },
  saveDealers(dealers: DealerDeal[], silent = false): void {
    writeJSON(KEYS.DEALERS, dealers, silent);
  },

  getPaymentMethods(): string[] {
    const list = readJSON<string[]>(KEYS.PAYMENT_METHODS, []);
    return list.length > 0 ? list : defaultPaymentMethods;
  },
  savePaymentMethods(methods: string[], silent = false): void {
    writeJSON(KEYS.PAYMENT_METHODS, methods, silent);
  },
  addPaymentMethod(name: string): { updated: string[]; added: boolean; matchedName: string } {
    const clean = name.trim();
    const list = this.getPaymentMethods();
    const existing = list.find((m) => m.toLowerCase() === clean.toLowerCase());
    if (existing) {
      return { updated: list, added: false, matchedName: existing };
    }
    const updated = [...list, clean];
    this.savePaymentMethods(updated);
    return { updated, added: true, matchedName: clean };
  },
  deletePaymentMethod(name: string): string[] {
    const updated = this.getPaymentMethods().filter((m) => m.toLowerCase() !== name.toLowerCase());
    const finalMethods = updated.length > 0 ? updated : ['Cash'];
    this.savePaymentMethods(finalMethods);
    return finalMethods;
  },

  getCategories(): string[] {
    this.ensureGreatWallCatalogSeeded(false);
    const list = readJSON<string[]>(KEYS.CATEGORIES, []);
    return list.length > 0 ? list : defaultCategories;
  },
  saveCategories(cats: string[], silent = false): void {
    writeJSON(KEYS.CATEGORIES, cats, silent);
  },
  addCategory(name: string): string[] {
    const clean = name.trim();
    if (!clean) return this.getCategories();
    const list = this.getCategories();
    if (list.some((c) => c.toLowerCase() === clean.toLowerCase())) return list;
    const updated = [...list, clean];
    this.saveCategories(updated);
    return updated;
  },
  renameCategory(
    oldName: string,
    newName: string
  ): { updatedCategories: string[]; affectedCount: number; affectedProducts: Product[] } {
    const cleanNew = newName.trim();
    const list = this.getCategories();
    const updatedCategories = list.map((c) => (c === oldName ? cleanNew : c));
    this.saveCategories(updatedCategories);

    const prods = this.getProducts();
    const affectedProducts: Product[] = [];
    const updatedProds = prods.map((p) => {
      if (p.category === oldName) {
        const nextProd = { ...p, category: cleanNew };
        affectedProducts.push(nextProd);
        return nextProd;
      }
      return p;
    });
    if (affectedProducts.length > 0) {
      this.saveProducts(updatedProds);
    }
    return {
      updatedCategories,
      affectedCount: affectedProducts.length,
      affectedProducts,
    };
  },
  deleteCategory(name: string): string[] {
    const updated = this.getCategories().filter((c) => c !== name);
    const finalList = updated.length > 0 ? updated : ['General'];
    this.saveCategories(finalList);
    return finalList;
  },

  getVendors(): string[] {
    this.ensureGreatWallCatalogSeeded(false);
    const list = readJSON<string[]>(KEYS.VENDORS, []);
    return list.length > 0 ? list : defaultVendors;
  },
  saveVendors(vendors: string[], silent = false): void {
    writeJSON(KEYS.VENDORS, vendors, silent);
  },
  addVendor(name: string): string[] {
    const clean = name.trim();
    if (!clean) return this.getVendors();
    const list = this.getVendors();
    if (list.some((v) => v.toLowerCase() === clean.toLowerCase())) return list;
    const updated = [...list, clean];
    this.saveVendors(updated);
    return updated;
  },
  renameVendor(
    oldName: string,
    newName: string
  ): { updatedVendors: string[]; affectedCount: number; affectedProducts: Product[] } {
    const cleanNew = newName.trim();
    const list = this.getVendors();
    const updatedVendors = list.map((v) => (v === oldName ? cleanNew : v));
    this.saveVendors(updatedVendors);

    const prods = this.getProducts();
    const affectedProducts: Product[] = [];
    const updatedProds = prods.map((p) => {
      if ((p.vendor || '') === oldName) {
        const nextProd = { ...p, vendor: cleanNew };
        affectedProducts.push(nextProd);
        return nextProd;
      }
      return p;
    });
    if (affectedProducts.length > 0) {
      this.saveProducts(updatedProds);
    }
    return {
      updatedVendors,
      affectedCount: affectedProducts.length,
      affectedProducts,
    };
  },
  deleteVendor(name: string): string[] {
    const updated = this.getVendors().filter((v) => v !== name);
    this.saveVendors(updated);
    return updated;
  },

  getStaffPermissions(): StaffPermissions {
    return { ...defaultStaffPermissions, ...readJSON<Partial<StaffPermissions>>(KEYS.STAFF_PERMS, {}) };
  },
  saveStaffPermissions(perms: StaffPermissions, silent = false): void {
    writeJSON(KEYS.STAFF_PERMS, perms, silent);
  },

  getNotice(): NoticeBanner {
    return { ...defaultNoticeBanner, ...readJSON<Partial<NoticeBanner>>(KEYS.NOTICE, {}) };
  },
  saveNotice(notice: NoticeBanner, silent = false): void {
    writeJSON(KEYS.NOTICE, notice, silent);
  },

  getContactsInfo(): ContactsInfo {
    return { ...defaultContactsInfo, ...readJSON<Partial<ContactsInfo>>(KEYS.CONTACTS, {}) };
  },
  saveContactsInfo(info: ContactsInfo, silent = false): void {
    writeJSON(KEYS.CONTACTS, info, silent);
  },

  getSmsLogs(): SmsLog[] {
    return readJSON<SmsLog[]>(KEYS.SMS_LOGS, []);
  },
  saveSmsLogs(logs: SmsLog[], silent = false): void {
    writeJSON(KEYS.SMS_LOGS, logs, silent);
  },

  getSmsSettings(): SmsGatewaySettings {
    const raw = readJSON<Partial<SmsGatewaySettings>>(KEYS.SMS_SETTINGS, {});
    return {
      ...defaultSmsSettings,
      ...raw,
      templates: raw.templates && raw.templates.length > 0 ? raw.templates : DEFAULT_SMS_TEMPLATES,
    };
  },
  saveSmsSettings(settings: SmsGatewaySettings, silent = false): void {
    writeJSON(KEYS.SMS_SETTINGS, settings, silent);
  },

  getStockInRecords(): StockInRecord[] {
    return readJSON<StockInRecord[]>(KEYS.STOCK_INS, []);
  },
  saveStockInRecords(records: StockInRecord[], silent = false): void {
    writeJSON(KEYS.STOCK_INS, records, silent);
  },

  getDeliveryChallans(): DeliveryChallan[] {
    return readJSON<DeliveryChallan[]>(KEYS.DELIVERY_CHALLANS, []);
  },
  saveDeliveryChallans(challans: DeliveryChallan[], silent = false): void {
    writeJSON(KEYS.DELIVERY_CHALLANS, challans, silent);
  },

  getCurrentUser(): AppUser {
    const saved = readJSON<AppUser | null>(KEYS.CURRENT_USER, null);
    if (saved) return saved;
    const users = this.getUsers();
    return users[0] || defaultUsers[0];
  },
  setCurrentUser(user: AppUser): void {
    writeJSON(KEYS.CURRENT_USER, user, true, true);
  },

  isUserLoggedIn(): boolean {
    return readJSON<boolean>(KEYS.AUTH_SESSION, false);
  },
  setAuthSession(loggedIn: boolean): void {
    writeJSON(KEYS.AUTH_SESSION, loggedIn, true, true);
  },

  verifyAdminPassword(password: string): boolean {
    const users = this.getUsers();
    return users.some((u) => u.role === 'admin' && u.password === password);
  },

  // ================= ID GENERATORS =================
  nextProductId(): number {
    const list = this.getProducts();
    return list.length === 0 ? 1 : Math.max(...list.map((p) => p.id || 0)) + 1;
  },
  nextCustId(): number {
    const list = this.getCustomers();
    return list.length === 0 ? 1001 : Math.max(...list.map((c) => c.id || 0)) + 1;
  },
  nextPayId(): number {
    const list = this.getPayments();
    return list.length === 0 ? 1 : Math.max(...list.map((p) => p.id || 0)) + 1;
  },
  nextTxnId(): number {
    const list = this.getTxns();
    return list.length === 0 ? 1 : Math.max(...list.map((t) => t.id || 0)) + 1;
  },
  nextInvoiceNo(): number {
    const invs = this.getInvoices();
    const startNo = parseInt(this.getShop().startInvoiceNo || '1001', 10) || 1001;
    if (invs.length === 0) return startNo;
    return Math.max(startNo - 1, ...invs.map((i) => i.no || 0)) + 1;
  },
  nextStockInId(): number {
    const list = this.getStockInRecords();
    return list.length === 0 ? 1 : Math.max(...list.map((r) => r.id || 0)) + 1;
  },
  nextDeliveryChallanId(): number {
    const list = this.getDeliveryChallans();
    return list.length === 0 ? 1 : Math.max(...list.map((c) => c.id || 0)) + 1;
  },
  nextSmsLogId(): number {
    const list = this.getSmsLogs();
    return list.length === 0 ? 1 : Math.max(...list.map((l) => l.id || 0)) + 1;
  },

  // ================= DOMAIN HELPERS =================
  getInvoiceTotals(inv: Invoice) {
    const itemsTotal = (inv.items || []).reduce((sum, it) => sum + (Number(it.total) || 0), 0);
    const labor = Number(inv.labor) || 0;
    const discount = Number(inv.discount) || 0;
    const prevDue = Number(inv.prevDue) || 0;
    const cash = Number(inv.cash) || 0;
    const bank = Number(inv.bank) || 0;
    const bkash = Number(inv.bkash) || 0;

    const sub1 = itemsTotal + labor;
    const sub2 = sub1 - discount;
    const net = sub2 + prevDue;
    const paid = cash + bank + bkash;
    const due = net - paid;

    return {
      itemsTotal,
      sub1,
      sub2,
      net,
      paid,
      due,
    };
  },

  getCustomerBalance(custId: number): number {
    const cust = this.getCustomers().find((c) => c.id === custId);
    const openDue = Number(cust?.openDue) || 0;

    const invs = this.getInvoices().filter((i) => i.custId === custId);
    let billed = 0;
    let invPaid = 0;
    invs.forEach((inv) => {
      const { sub2, paid } = this.getInvoiceTotals(inv);
      billed += sub2;
      invPaid += paid;
    });

    const pays = this.getPayments().filter((p) => p.custId === custId);
    const recPaid = pays.reduce(
      (s, p) => s + (Number(p.amount) || 0) + (Number(p.discount) || 0),
      0
    );

    return Math.round((openDue + billed - invPaid - recPaid) * 100) / 100;
  },

  addOrGetDealer(name: string): DealerDeal {
    const clean = name.trim();
    const list = this.getDealers();
    const existing = list.find((d) => d.name.toLowerCase() === clean.toLowerCase());
    if (existing) return existing;
    const nextId = list.length === 0 ? 1 : Math.max(...list.map((d) => d.id || 0)) + 1;
    const created: DealerDeal = { id: nextId, name: clean };
    this.saveDealers([...list, created]);
    return created;
  },

  updateInvoiceDeal(invoiceNo: number, newDeal: string): Invoice | null {
    const clean = newDeal.trim();
    const invs = this.getInvoices();
    let updatedInv: Invoice | null = null;
    const nextInvs = invs.map((i) => {
      if (i.no === invoiceNo) {
        updatedInv = { ...i, deal: clean };
        return updatedInv;
      }
      return i;
    });
    if (updatedInv) {
      this.saveInvoices(nextInvs);
      if (clean) {
        this.addOrGetDealer(clean);
      }
    }
    return updatedInv;
  },

  getAvailableProductStock(prod?: Product) {
    if (!prod) {
      return {
        stockBox: 0,
        stockPiece: 0,
        stockSft: 0,
        totalPieces: 0,
        hasStock: false,
      };
    }
    const stockBox = Number(prod.stockBox) || 0;
    const stockPiece = Number(prod.stockPiece) || 0;
    const stockSft = Number(prod.stockSft) || 0;
    const qtyPack = Number(prod.qtyPack) || 0;

    if (prod.isTile && qtyPack > 0) {
      const totalPieces = Math.max(0, stockBox * qtyPack + stockPiece);
      return {
        stockBox: Math.floor(totalPieces / qtyPack),
        stockPiece: totalPieces % qtyPack,
        stockSft: Math.max(0, stockSft),
        totalPieces,
        hasStock: totalPieces > 0,
      };
    }

    const totalPieces = Math.max(0, stockPiece);
    return {
      stockBox: Math.max(0, stockBox),
      stockPiece: totalPieces,
      stockSft: Math.max(0, stockSft),
      totalPieces,
      hasStock: totalPieces > 0 || stockBox > 0,
    };
  },

  computeDispatchableForRemaining(
    prod: Product | undefined,
    remainingBox: number,
    remainingPiece: number,
    remainingSft: number
  ) {
    const avail = this.getAvailableProductStock(prod);
    if (!prod || !avail.hasStock || (remainingBox <= 0 && remainingPiece <= 0)) {
      return {
        dispatchBox: 0,
        dispatchPiece: 0,
        dispatchSft: 0,
        hasAnyStock: false,
        isPartialByStock: false,
      };
    }

    if (prod.isTile && (prod.qtyPack || 0) > 0) {
      const remTotalPcs = remainingBox * prod.qtyPack + remainingPiece;
      const dispPcs = Math.min(remTotalPcs, avail.totalPieces);
      const dispatchBox = Math.floor(dispPcs / prod.qtyPack);
      const dispatchPiece = dispPcs % prod.qtyPack;
      const dispatchSft =
        prod.sftPack > 0
          ? Math.round((dispPcs / prod.qtyPack) * prod.sftPack * 100) / 100
          : Math.round(remainingSft * 100) / 100;
      return {
        dispatchBox,
        dispatchPiece,
        dispatchSft,
        hasAnyStock: dispPcs > 0,
        isPartialByStock: dispPcs > 0 && dispPcs < remTotalPcs,
      };
    }

    const remPcs = remainingPiece > 0 ? remainingPiece : remainingBox;
    const dispPcs = Math.min(remPcs, avail.totalPieces > 0 ? avail.totalPieces : avail.stockBox);
    return {
      dispatchBox: remainingBox > 0 ? Math.min(remainingBox, avail.stockBox || dispPcs) : 0,
      dispatchPiece: dispPcs,
      dispatchSft: 0,
      hasAnyStock: dispPcs > 0,
      isPartialByStock: dispPcs > 0 && dispPcs < remPcs,
    };
  },

  getInvoiceDeliveryStatus(invoiceNo: number) {
    const inv = this.getInvoices().find((i) => i.no === invoiceNo);
    const challans = this.getDeliveryChallans().filter(
      (c) => c.invoiceNo === invoiceNo && c.outType !== 'manual'
    );
    const products = this.getProducts();

    let orderedTotalBox = 0;
    let orderedTotalPiece = 0;
    let deliveredTotalBox = 0;
    let deliveredTotalPiece = 0;
    let remainingTotalBox = 0;
    let remainingTotalPiece = 0;

    const itemStatuses = (inv?.items || []).map((it) => {
      const prod = products.find((p) => p.id === it.productId);
      const qtyPack = prod?.isTile && (prod.qtyPack || 0) > 0 ? prod.qtyPack : 0;

      const ordBox = Number(it.box) || 0;
      const ordPiece = Number(it.piece) || 0;
      const ordSft = Number(it.sft) || 0;

      let delBox = 0;
      let delPiece = 0;
      let delSft = 0;
      challans.forEach((ch) => {
        (ch.items || []).forEach((ci) => {
          if (ci.productId === it.productId) {
            delBox += Number(ci.box) || 0;
            delPiece += Number(ci.piece) || 0;
            delSft += Number(ci.sft) || 0;
          }
        });
      });

      let remBox = 0;
      let remPiece = 0;
      let remSft = 0;

      if (qtyPack > 0) {
        const ordTotalPcs = ordBox * qtyPack + ordPiece;
        const delTotalPcs = delBox * qtyPack + delPiece;
        const remPcs = Math.max(0, ordTotalPcs - delTotalPcs);
        delBox = Math.floor(delTotalPcs / qtyPack);
        delPiece = delTotalPcs % qtyPack;
        remBox = Math.floor(remPcs / qtyPack);
        remPiece = remPcs % qtyPack;
        remSft = Math.max(0, Math.round((ordSft - delSft) * 100) / 100);
      } else {
        remBox = Math.max(0, ordBox - delBox);
        remPiece = Math.max(0, ordPiece - delPiece);
        remSft = Math.max(0, Math.round((ordSft - delSft) * 100) / 100);
      }

      orderedTotalBox += ordBox;
      orderedTotalPiece += ordPiece;
      deliveredTotalBox += delBox;
      deliveredTotalPiece += delPiece;
      remainingTotalBox += remBox;
      remainingTotalPiece += remPiece;

      return {
        productId: it.productId,
        name: it.name,
        dim: it.dim,
        isTile: it.isTile,
        orderedBox: ordBox,
        orderedPiece: ordPiece,
        orderedSft: ordSft,
        deliveredBox: delBox,
        deliveredPiece: delPiece,
        deliveredSft: delSft,
        remainingBox: remBox,
        remainingPiece: remPiece,
        remainingSft: remSft,
      };
    });

    const hasRemaining = itemStatuses.some((s) => s.remainingBox > 0 || s.remainingPiece > 0);
    const hasDelivered = challans.length > 0 && itemStatuses.some((s) => s.deliveredBox > 0 || s.deliveredPiece > 0);

    let status: 'pending' | 'partial' | 'delivered' = 'pending';
    if (inv && itemStatuses.length > 0 && !hasRemaining && hasDelivered) {
      status = 'delivered';
    } else if (hasDelivered) {
      status = 'partial';
    } else if (inv?.deliveryStatus === 'delivered' && !hasRemaining) {
      status = 'delivered';
    }

    return {
      status,
      isFullyDelivered: status === 'delivered',
      dispatchesCount: challans.length,
      challans,
      itemStatuses,
      orderedTotalBox,
      orderedTotalPiece,
      deliveredTotalBox,
      deliveredTotalPiece,
      remainingTotalBox,
      remainingTotalPiece,
    };
  },

  exportAllAsJSON(): string {
    return JSON.stringify(
      {
        version: '1.0',
        exportedAt: new Date().toISOString(),
        shop: this.getShop(),
        products: this.getProducts(),
        customers: this.getCustomers(),
        invoices: this.getInvoices(),
        payments: this.getPayments(),
        txns: this.getTxns(),
        users: this.getUsers(),
        dealers: this.getDealers(),
        paymentMethods: this.getPaymentMethods(),
        categories: this.getCategories(),
        vendors: this.getVendors(),
        staffPermissions: this.getStaffPermissions(),
        notice: this.getNotice(),
        contacts: this.getContactsInfo(),
        smsLogs: this.getSmsLogs(),
        smsSettings: this.getSmsSettings(),
        stockIns: this.getStockInRecords(),
        deliveryChallans: this.getDeliveryChallans(),
      },
      null,
      2
    );
  },

  resetToDefaults(): void {
    this.saveShop(defaultShop, true);
    this.saveProducts([...ALL_SEED_PRODUCTS], true);
    this.saveCustomers([], true);
    this.saveInvoices([], true);
    this.savePayments([], true);
    this.saveTxns([], true);
    this.saveUsers(defaultUsers, true);
    this.saveDealers([], true);
    this.savePaymentMethods(defaultPaymentMethods, true);
    this.saveCategories(defaultCategories, true);
    this.saveVendors(defaultVendors, true);
    this.saveStaffPermissions(defaultStaffPermissions, true);
    this.saveNotice(defaultNoticeBanner, true);
    this.saveContactsInfo(defaultContactsInfo, true);
    this.saveSmsLogs([], true);
    this.saveSmsSettings(defaultSmsSettings, true);
    this.saveStockInRecords([], true);
    this.saveDeliveryChallans([], true);
    try {
      localStorage.setItem(KEYS.GW_CATALOG_SEEDED, 'true');
      localStorage.setItem(KEYS.ALL_CATALOGS_SEEDED, 'true');
    } catch {
      // ignore storage quota errors
    }
    window.dispatchEvent(new Event('app-storage-updated'));
  },

  addStockInRecord(record: StockInRecord): void {
    const products = this.getProducts();
    const nextProducts = products.map((prod) => {
      const matched = record.items.find((it) => it.productId === prod.id);
      if (!matched) return prod;

      let nextBox = Number(prod.stockBox) || 0;
      let nextPiece = Number(prod.stockPiece) || 0;
      let nextSft = Number(prod.stockSft) || 0;

      if (prod.isTile && (prod.qtyPack || 0) > 0) {
        const curTotalPcs = nextBox * prod.qtyPack + nextPiece;
        const addPcs = (Number(matched.box) || 0) * prod.qtyPack + (Number(matched.piece) || 0);
        const finalPcs = curTotalPcs + addPcs;
        nextBox = Math.floor(finalPcs / prod.qtyPack);
        nextPiece = finalPcs % prod.qtyPack;
        nextSft =
          prod.sftPack > 0
            ? Math.round((finalPcs / prod.qtyPack) * prod.sftPack * 100) / 100
            : Math.round((nextSft + (Number(matched.sft) || 0)) * 100) / 100;
      } else {
        nextBox += Number(matched.box) || 0;
        nextPiece += Number(matched.piece) || 0;
      }

      return { ...prod, stockBox: nextBox, stockPiece: nextPiece, stockSft: nextSft };
    });

    this.saveProducts(nextProducts, true);
    const records = [
      record,
      ...this.getStockInRecords().filter((r) => r.id !== record.id),
    ];
    this.saveStockInRecords(records);
  },

  addDeliveryChallan(challan: DeliveryChallan): void {
    const products = this.getProducts();
    const nextProducts = products.map((prod) => {
      const matched = challan.items.find((it) => it.productId === prod.id);
      if (!matched) return prod;

      let nextBox = Number(prod.stockBox) || 0;
      let nextPiece = Number(prod.stockPiece) || 0;
      let nextSft = Number(prod.stockSft) || 0;

      if (prod.isTile && (prod.qtyPack || 0) > 0) {
        const curTotalPcs = nextBox * prod.qtyPack + nextPiece;
        const subPcs = (Number(matched.box) || 0) * prod.qtyPack + (Number(matched.piece) || 0);
        const finalPcs = Math.max(0, curTotalPcs - subPcs);
        nextBox = Math.floor(finalPcs / prod.qtyPack);
        nextPiece = finalPcs % prod.qtyPack;
        nextSft =
          prod.sftPack > 0
            ? Math.round((finalPcs / prod.qtyPack) * prod.sftPack * 100) / 100
            : Math.max(0, Math.round((nextSft - (Number(matched.sft) || 0)) * 100) / 100);
      } else {
        nextBox = Math.max(0, nextBox - (Number(matched.box) || 0));
        nextPiece = Math.max(0, nextPiece - (Number(matched.piece) || 0));
      }

      return { ...prod, stockBox: nextBox, stockPiece: nextPiece, stockSft: nextSft };
    });

    this.saveProducts(nextProducts, true);
    const nextChallans = [
      challan,
      ...this.getDeliveryChallans().filter((c) => c.id !== challan.id),
    ];
    this.saveDeliveryChallans(nextChallans, true);

    if (challan.invoiceNo > 0) {
      const statusObj = this.getInvoiceDeliveryStatus(challan.invoiceNo);
      const existingInv = this.getInvoices().find((i) => i.no === challan.invoiceNo);
      if (existingInv) {
        const updatedInvoice = { ...existingInv, deliveryStatus: statusObj.status };
        const invs = this.getInvoices().map((i) =>
          i.no === challan.invoiceNo ? updatedInvoice : i
        );
        this.saveInvoices(invs, true);
      }
    }
    window.dispatchEvent(new Event('app-storage-updated'));
  },

  deleteDeliveryChallan(challanId: number): void {
    const existingChallans = this.getDeliveryChallans();
    const target = existingChallans.find((c) => c.id === challanId);
    if (!target) return;

    const nextProducts = this.getProducts().map((prod) => {
      const matched = (target.items || []).find((it) => it.productId === prod.id);
      if (!matched) return prod;

      let nextBox = Number(prod.stockBox) || 0;
      let nextPiece = Number(prod.stockPiece) || 0;
      let nextSft = Number(prod.stockSft) || 0;

      if (prod.isTile && (prod.qtyPack || 0) > 0) {
        const curTotalPcs = nextBox * prod.qtyPack + nextPiece;
        const addPcs = (Number(matched.box) || 0) * prod.qtyPack + (Number(matched.piece) || 0);
        const finalPcs = curTotalPcs + addPcs;
        nextBox = Math.floor(finalPcs / prod.qtyPack);
        nextPiece = finalPcs % prod.qtyPack;
        nextSft =
          prod.sftPack > 0
            ? Math.round((finalPcs / prod.qtyPack) * prod.sftPack * 100) / 100
            : Math.round((nextSft + (Number(matched.sft) || 0)) * 100) / 100;
      } else {
        nextBox += Number(matched.box) || 0;
        nextPiece += Number(matched.piece) || 0;
      }

      return { ...prod, stockBox: nextBox, stockPiece: nextPiece, stockSft: nextSft };
    });

    this.saveProducts(nextProducts, true);
    this.saveDeliveryChallans(
      existingChallans.filter((c) => c.id !== challanId),
      true
    );

    if (target.invoiceNo > 0) {
      const statusObj = this.getInvoiceDeliveryStatus(target.invoiceNo);
      const existingInv = this.getInvoices().find((i) => i.no === target.invoiceNo);
      if (existingInv) {
        const updatedInvoice = { ...existingInv, deliveryStatus: statusObj.status };
        const invs = this.getInvoices().map((i) =>
          i.no === target.invoiceNo ? updatedInvoice : i
        );
        this.saveInvoices(invs, true);
      }
    }
    window.dispatchEvent(new Event('app-storage-updated'));
  },

  deleteDeliveryChallansByInvoice(invoiceNo: number): void {
    const matching = this.getDeliveryChallans().filter((c) => c.invoiceNo === invoiceNo);
    for (const ch of matching) {
      this.deleteDeliveryChallan(ch.id);
    }
  },

  restoreAllFromJSON(jsonStr: string): boolean {
    try {
      const parsed = JSON.parse(jsonStr) as Record<string, unknown>;
      if (!parsed || typeof parsed !== 'object') return false;

      if (parsed.shop) this.saveShop(parsed.shop as ShopConfig, true);
      if (Array.isArray(parsed.products)) this.saveProducts(parsed.products as Product[], true);
      if (Array.isArray(parsed.customers)) this.saveCustomers(parsed.customers as Customer[], true);
      if (Array.isArray(parsed.invoices)) this.saveInvoices(parsed.invoices as Invoice[], true);
      if (Array.isArray(parsed.payments)) this.savePayments(parsed.payments as Payment[], true);
      if (Array.isArray(parsed.txns)) this.saveTxns(parsed.txns as Txn[], true);
      if (Array.isArray(parsed.users)) this.saveUsers(parsed.users as AppUser[], true);
      if (Array.isArray(parsed.dealers)) this.saveDealers(parsed.dealers as DealerDeal[], true);
      if (Array.isArray(parsed.paymentMethods)) {
        this.savePaymentMethods(parsed.paymentMethods as string[], true);
      }
      if (Array.isArray(parsed.categories)) {
        this.saveCategories(parsed.categories as string[], true);
      }
      if (Array.isArray(parsed.vendors)) this.saveVendors(parsed.vendors as string[], true);
      if (parsed.staffPermissions) {
        this.saveStaffPermissions(parsed.staffPermissions as StaffPermissions, true);
      }
      if (parsed.notice) this.saveNotice(parsed.notice as NoticeBanner, true);
      if (parsed.contacts) this.saveContactsInfo(parsed.contacts as ContactsInfo, true);
      if (Array.isArray(parsed.smsLogs)) this.saveSmsLogs(parsed.smsLogs as SmsLog[], true);
      if (parsed.smsSettings) this.saveSmsSettings(parsed.smsSettings as SmsGatewaySettings, true);
      if (Array.isArray(parsed.stockIns)) {
        this.saveStockInRecords(parsed.stockIns as StockInRecord[], true);
      }
      if (Array.isArray(parsed.deliveryChallans)) {
        this.saveDeliveryChallans(parsed.deliveryChallans as DeliveryChallan[], true);
      }
      window.dispatchEvent(new Event('app-storage-updated'));
      return true;
    } catch (err) {
      console.error('Restore failed:', err);
      return false;
    }
  },

  clearCollections(targets: string[]): void {
    if (targets.includes('invoices')) this.saveInvoices([], true);
    if (targets.includes('customers')) this.saveCustomers([], true);
    if (targets.includes('payments')) this.savePayments([], true);
    if (targets.includes('txns')) this.saveTxns([], true);
    if (targets.includes('deliveryChallans')) this.saveDeliveryChallans([], true);
    if (targets.includes('products')) this.saveProducts([], true);
    if (targets.includes('smsLogs')) this.saveSmsLogs([], true);
    if (targets.includes('stockIns')) this.saveStockInRecords([], true);
    window.dispatchEvent(new Event('app-storage-updated'));
  },
};
