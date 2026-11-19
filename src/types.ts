export interface Product {
  id: number;
  code: string;
  category: string;
  vendor?: string;
  grade?: 'A' | 'B' | 'C' | string;
  name: string;
  isTile: boolean;
  w: number;
  h: number;
  scm: number;
  sftPack: number;
  qtyPack: number;
  rate: number;
  price: number;
  stockBox?: number;
  stockPiece?: number;
  stockSft?: number;
}

export interface Customer {
  id: number;
  name: string;
  address: string;
  phone: string;
  deal: string;
  openDue: number;
  smsOptOut?: boolean;
  smsConsent?: boolean;
  smsConsentUpdatedAt?: string;
}

export interface DealerDeal {
  id: number;
  name: string;
  phone?: string;
  address?: string;
  note?: string;
}

export interface Item {
  productId: number;
  name: string;
  dim: string;
  box: number;
  piece: number;
  sft: number;
  unit: number;
  total: number;
  isTile: boolean;
}

export interface Payment {
  id: number;
  date: string;
  custId: number;
  custName: string;
  amount: number;
  discount?: number;
  remark: string;
  method: 'Cash' | 'Bank' | 'Bkash' | string;
}

export interface Invoice {
  no: number;
  date: string;
  custId: number;
  custName: string;
  address: string;
  phone: string;
  deal: string;
  comment: string;
  labor: number;
  discount: number;
  prevDue: number;
  cash: number;
  bank: number;
  bkash: number;
  items: Item[];
  deliveryStatus?: 'pending' | 'partial' | 'delivered';
}

export interface Txn {
  id: number;
  date: string;
  isIncome: boolean;
  head: string;
  amount: number;
}

export interface ShopConfig {
  name: string;
  address: string;
  phones: string;
  web: string;
  note: string;
  preparedBy: string;
  startInvoiceNo: string;
  footerText: string;
  logoUrl?: string;
}

export type UserRole = 'admin' | 'staff';

export interface AppUser {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  password: string;
  phone?: string;
  createdAt: string;
}

export interface StaffPermissions {
  canCreateInvoice: boolean;
  canEditInvoice: boolean;
  canDeleteInvoice: boolean;
  canChangeDeal: boolean;
  canAccessStock: boolean;
  canDispatchDelivery: boolean;
  canStockIn: boolean;
  canDeletePendingChallan: boolean;
  canDeleteDeliveryChallan: boolean;
  canManageCustomers: boolean;
  canDeleteCustomers: boolean;
  canManageProducts: boolean;
  canRecordPayment: boolean;
  canManageExpenses: boolean;
  canViewReports: boolean;
  canAccessSettings: boolean;
  canBackupData: boolean;
  canSendSms?: boolean;
  canManageSmsSettings?: boolean;
}

export interface NoticeBanner {
  enabled: boolean;
  message: string;
  updatedAt?: string;
  updatedBy?: string;
}

export interface ContactsInfo {
  companyName: string;
  phones: string;
  serviceMessage: string;
  updatedAt?: string;
  updatedBy?: string;
}

export interface StockInItem {
  productId: number;
  name: string;
  dim: string;
  box: number;
  piece: number;
  sft: number;
  rate: number;
  total: number;
  isTile: boolean;
}

export interface StockInRecord {
  id: number;
  vendorName: string;
  vendorChallanNo: string;
  referenceNo: string;
  date: string;
  note: string;
  items: StockInItem[];
  totalAmount: number;
  receivedBy: string;
}

export interface DeliveryItem {
  productId: number;
  name: string;
  dim: string;
  box: number;
  piece: number;
  sft: number;
  isTile: boolean;
}

export interface DeliveryChallan {
  id: number;
  challanNo: string;
  outType?: 'challan' | 'manual';
  manualRefNo?: string;
  invoiceNo: number;
  custId: number;
  custName: string;
  address: string;
  phone: string;
  deal: string;
  date: string;
  vehicleNo?: string;
  driverName?: string;
  driverPhone?: string;
  note?: string;
  items: DeliveryItem[];
  dispatchedBy: string;
}

export type ActiveTab =
  | 'dashboard'
  | 'order'
  | 'stock_inventory'
  | 'customer'
  | 'products'
  | 'payment'
  | 'due_list'
  | 'income_expend'
  | 'sales_report'
  | 'sms_center'
  | 'settings'
  | 'admin_control'
  | 'data_backup'
  | 'vb_code';

export type SmsProviderId =
  | 'sandbox'
  | 'bulksmsbd'
  | 'greenweb'
  | 'sslwireless'
  | 'twilio'
  | 'custom_webhook';

export type SmsTriggerType = 'invoice' | 'payment' | 'due_reminder' | 'bulk' | 'custom';

export type SmsDeliveryStatus =
  | 'DELIVERED'
  | 'SENT'
  | 'PENDING'
  | 'FAILED'
  | 'SKIPPED_DUPLICATE'
  | 'SKIPPED_OPT_OUT';

export interface SmsTemplate {
  id: string;
  name: string;
  triggerType: SmsTriggerType;
  language: 'bn' | 'en';
  body: string;
}

export interface SmsGatewaySettings {
  smsEnabled: boolean;
  activeProvider: SmsProviderId;
  senderId: string;
  costPerSms: number;
  duplicateWindowMinutes: number;
  requireConsent: boolean;
  appendOptOutText: boolean;
  customApiUrl?: string;
  customBalanceUrl?: string;
  customAuthHeader?: string;
  templates: SmsTemplate[];
  updatedAt?: string;
  updatedBy?: string;
}

export interface SmsLog {
  id: number;
  date: string;
  custId?: number;
  custName: string;
  phone: string;
  triggerType: SmsTriggerType;
  referenceNo?: string;
  message: string;
  provider: SmsProviderId;
  providerMessageId?: string;
  status: SmsDeliveryStatus;
  deliveryStatus: 'DELIVERED' | 'SENT' | 'PENDING' | 'FAILED';
  isUnicode: boolean;
  parts: number;
  cost: number;
  sentBy: string;
  error?: string;
}

export interface SmsRecipientPayload {
  custId?: number;
  custName: string;
  phone: string;
  smsOptOut?: boolean;
  smsConsent?: boolean;
  invoiceNo?: string;
  totalAmount?: number;
  paidAmount?: number;
  dueAmount?: number;
  date?: string;
}

export interface SmsComposeRequest {
  triggerType: SmsTriggerType;
  recipients: SmsRecipientPayload[];
  title?: string;
}
