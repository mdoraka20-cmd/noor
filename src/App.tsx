import React, { useState, useEffect, useCallback } from 'react';
import {
  ActiveTab,
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
  SmsComposeRequest,
  SmsGatewaySettings,
  SmsLog,
  StockInRecord,
  Txn,
  StaffPermissions,
} from './types';
import { StorageService } from './services/storage';
import { CloudSyncState, FirestoreSyncService } from './services/firestoreSync';
import { HeaderToolbar } from './components/HeaderToolbar';
import { DashboardView } from './components/DashboardView';
import { OrderView } from './components/OrderView';
import { StockInventoryView } from './components/StockInventoryView';
import { AdminControlView } from './components/AdminControlView';
import { CustomerView } from './components/CustomerView';
import { ProductView } from './components/ProductView';
import { PayReceiptView } from './components/PayReceiptView';
import { DueListView } from './components/DueListView';
import { IncomeExpenseView } from './components/IncomeExpenseView';
import { SalesReportView } from './components/SalesReportView';
import { SmsCenterView } from './components/SmsCenterView';
import { SmsComposerModal } from './components/SmsComposerModal';
import { SettingsView } from './components/SettingsView';
import { DataBackupView } from './components/DataBackupView';
import { VbCodeModal } from './components/VbCodeModal';
import { PrintModal } from './components/PrintModal';
import { LoginModal } from './components/LoginModal';
import { LoginPage } from './components/LoginPage';
import { AdminAuthModal } from './components/AdminAuthModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [cloudSync, setCloudSync] = useState<CloudSyncState>(() =>
    FirestoreSyncService.getState()
  );

  // User Authentication State
  const [currentUser, setCurrentUser] = useState<AppUser>(() => StorageService.getCurrentUser());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => StorageService.isUserLoggedIn());
  const [staffPermissions, setStaffPermissions] = useState<StaffPermissions>(() =>
    StorageService.getStaffPermissions()
  );
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Application Data States
  const [shop, setShop] = useState<ShopConfig>(() => StorageService.getShop());
  const [products, setProducts] = useState<Product[]>(() => StorageService.getProducts());
  const [customers, setCustomers] = useState<Customer[]>(() => StorageService.getCustomers());
  const [invoices, setInvoices] = useState<Invoice[]>(() => StorageService.getInvoices());
  const [payments, setPayments] = useState<Payment[]>(() => StorageService.getPayments());
  const [txns, setTxns] = useState<Txn[]>(() => StorageService.getTxns());
  const [users, setUsers] = useState<AppUser[]>(() => StorageService.getUsers());
  const [dealers, setDealers] = useState<DealerDeal[]>(() => StorageService.getDealers());
  const [paymentMethods, setPaymentMethods] = useState<string[]>(() =>
    StorageService.getPaymentMethods()
  );
  const [notice, setNotice] = useState<NoticeBanner>(() => StorageService.getNotice());
  const [contactsInfo, setContactsInfo] = useState<ContactsInfo>(() =>
    StorageService.getContactsInfo()
  );
  const [smsLogs, setSmsLogs] = useState<SmsLog[]>(() => StorageService.getSmsLogs());
  const [smsSettings, setSmsSettings] = useState<SmsGatewaySettings>(() =>
    StorageService.getSmsSettings()
  );
  const [smsComposerState, setSmsComposerState] = useState<{
    isOpen: boolean;
    request: SmsComposeRequest | null;
  }>({
    isOpen: false,
    request: null,
  });

  // Customer modal picker state
  const [isCustomerPickerOpen, setIsCustomerPickerOpen] = useState(false);
  const [selectedPickedCustomer, setSelectedPickedCustomer] = useState<Customer | null>(null);

  // Print modal state
  const [printModal, setPrintModal] = useState<{
    isOpen: boolean;
    type: 'invoice' | 'challan' | 'receipt' | 'report' | 'delivery_challan' | 'stock_in';
    invoice?: Invoice;
    payment?: Payment;
    reportData?: any;
    deliveryChallan?: DeliveryChallan;
    stockInRecord?: StockInRecord;
  }>({
    isOpen: false,
    type: 'invoice',
  });

  // Admin authorization modal state
  const [adminAuthModal, setAdminAuthModal] = useState<{
    isOpen: boolean;
    actionTitle: string;
    actionDetails?: string;
    onSuccess: () => void;
  }>({
    isOpen: false,
    actionTitle: '',
    onSuccess: () => {},
  });

  const refreshAllData = useCallback(() => {
    setShop(StorageService.getShop());
    setProducts(StorageService.getProducts());
    setCustomers(StorageService.getCustomers());
    setInvoices(StorageService.getInvoices());
    setPayments(StorageService.getPayments());
    setTxns(StorageService.getTxns());
    const latestUsers = StorageService.getUsers();
    setUsers(latestUsers);
    setDealers(StorageService.getDealers());
    setPaymentMethods(StorageService.getPaymentMethods());
    setNotice(StorageService.getNotice());
    setContactsInfo(StorageService.getContactsInfo());
    setSmsLogs(StorageService.getSmsLogs());
    setSmsSettings(StorageService.getSmsSettings());
    if (StorageService.isUserLoggedIn()) {
      const savedCurr = StorageService.getCurrentUser();
      const matched = latestUsers.find(
        (u) => u.id === savedCurr.id || u.username.toLowerCase() === savedCurr.username.toLowerCase()
      );
      if (matched) {
        if (JSON.stringify(matched) !== JSON.stringify(savedCurr)) {
          StorageService.setCurrentUser(matched);
        }
        setCurrentUser(matched);
      } else {
        setCurrentUser(savedCurr);
      }
    }
    setStaffPermissions(StorageService.getStaffPermissions());
  }, []);

  const handleLogout = () => {
    StorageService.setAuthSession(false);
    setIsAuthenticated(false);
  };

  const handleLoginSuccess = (user: AppUser) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    refreshAllData();
    setActiveTab('dashboard');
  };

  const requestAdminAction = (
    actionTitle: string,
    onExecute: () => void,
    actionDetails?: string
  ) => {
    if (currentUser.role === 'admin') {
      onExecute();
    } else {
      setAdminAuthModal({
        isOpen: true,
        actionTitle,
        actionDetails,
        onSuccess: () => {
          setAdminAuthModal((prev) => ({ ...prev, isOpen: false }));
          onExecute();
        },
      });
    }
  };

  const [currentDateStr, setCurrentDateStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentDateStr(
        now.toLocaleDateString('bn-BD', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);

    FirestoreSyncService.init();
    const unsubCloud = FirestoreSyncService.subscribe((nextState) => {
      setCloudSync(nextState);
    });

    const unsubStorage = () => refreshAllData();
    window.addEventListener('app-storage-updated', unsubStorage);

    return () => {
      clearInterval(interval);
      unsubCloud();
      window.removeEventListener('app-storage-updated', unsubStorage);
    };
  }, [refreshAllData]);

  // Handlers for Order / Invoices
  const handleSaveInvoice = (inv: Invoice, printKind: 'none' | 'invoice' | 'challan') => {
    const currentInvoices = StorageService.getInvoices();
    const existingIdx = currentInvoices.findIndex((i) => i.no === inv.no);
    let updated: Invoice[];
    if (existingIdx >= 0) {
      updated = [...currentInvoices];
      updated[existingIdx] = inv;
    } else {
      updated = [inv, ...currentInvoices];
    }
    setInvoices(updated);
    StorageService.saveInvoices(updated);

    const latestCustomers = StorageService.getCustomers();
    setCustomers(latestCustomers);

    if (printKind === 'invoice') {
      setPrintModal({
        isOpen: true,
        type: 'invoice',
        invoice: inv,
      });
    } else if (printKind === 'challan') {
      setPrintModal({
        isOpen: true,
        type: 'challan',
        invoice: inv,
      });
    }
  };

  const handleDeleteInvoice = (no: number) => {
    const updated = StorageService.getInvoices().filter((i) => i.no !== no);
    setInvoices(updated);
    StorageService.saveInvoices(updated);
    StorageService.deleteDeliveryChallansByInvoice(no);
  };

  const handleDeleteDeliveryChallan = (challanId: number) => {
    StorageService.deleteDeliveryChallan(challanId);
    refreshAllData();
  };

  const handleUpdateInvoiceDeal = (_invoiceNo: number, _newDeal: string) => {
    const latestInvs = StorageService.getInvoices();
    setInvoices(latestInvs);
    setDealers(StorageService.getDealers());
  };

  // Handlers for Customer
  const handleSaveCustomer = (cust: Customer) => {
    const currentCustomers = StorageService.getCustomers();
    const existingIdx = currentCustomers.findIndex((c) => c.id === cust.id);
    let updated: Customer[];
    if (existingIdx >= 0) {
      updated = [...currentCustomers];
      updated[existingIdx] = cust;
    } else {
      updated = [...currentCustomers, cust];
    }
    setCustomers(updated);
    StorageService.saveCustomers(updated);
  };

  const handleDeleteCustomer = (id: number) => {
    const updated = StorageService.getCustomers().filter((c) => c.id !== id);
    setCustomers(updated);
    StorageService.saveCustomers(updated);
  };

  // Handlers for Products
  const handleSaveProduct = (prod: Product) => {
    const currentProducts = StorageService.getProducts();
    const existingIdx = currentProducts.findIndex((p) => p.id === prod.id);
    let updated: Product[];
    if (existingIdx >= 0) {
      updated = [...currentProducts];
      updated[existingIdx] = prod;
    } else {
      updated = [...currentProducts, prod];
    }
    setProducts(updated);
    StorageService.saveProducts(updated);
  };

  const handleDeleteProduct = (id: number) => {
    const updated = StorageService.getProducts().filter((p) => p.id !== id);
    setProducts(updated);
    StorageService.saveProducts(updated);
  };

  // Handlers for Payments
  const handleSavePayment = (payment: Payment, print: boolean) => {
    const currentPayments = StorageService.getPayments();
    const existingIdx = currentPayments.findIndex((p) => p.id === payment.id);
    let updated: Payment[];
    if (existingIdx >= 0) {
      updated = [...currentPayments];
      updated[existingIdx] = payment;
    } else {
      updated = [payment, ...currentPayments];
    }
    setPayments(updated);
    StorageService.savePayments(updated);

    if (print) {
      setPrintModal({
        isOpen: true,
        type: 'receipt',
        payment,
      });
    }
  };

  const handleDeletePayment = (id: number) => {
    const updated = StorageService.getPayments().filter((p) => p.id !== id);
    setPayments(updated);
    StorageService.savePayments(updated);
  };

  // Handlers for Txns
  const handleSaveTxn = (t: Txn) => {
    const currentTxns = StorageService.getTxns();
    const existingIdx = currentTxns.findIndex((x) => x.id === t.id);
    let updated: Txn[];
    if (existingIdx >= 0) {
      updated = [...currentTxns];
      updated[existingIdx] = t;
    } else {
      updated = [t, ...currentTxns];
    }
    setTxns(updated);
    StorageService.saveTxns(updated);
  };

  const handleDeleteTxn = (id: number) => {
    const updated = StorageService.getTxns().filter((t) => t.id !== id);
    setTxns(updated);
    StorageService.saveTxns(updated);
  };

  // Shop Config
  const handleSaveShop = (updatedShop: ShopConfig) => {
    setShop(updatedShop);
    StorageService.saveShop(updatedShop);
  };

  if (!isAuthenticated) {
    return (
      <LoginPage
        shop={shop}
        users={users}
        cloudSync={cloudSync}
        onConnectCloud={() => FirestoreSyncService.signInWithGoogle()}
        onSyncNow={() => FirestoreSyncService.syncNow()}
        onDisconnectCloud={() => FirestoreSyncService.signOutGoogle()}
        onDismissCloudError={() => FirestoreSyncService.clearError()}
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  const handleTabChange = (tab: ActiveTab) => {
    if (currentUser.role !== 'admin') {
      if (tab === 'admin_control') {
        setActiveTab('dashboard');
        return;
      }
      if (tab === 'stock_inventory' && staffPermissions.canAccessStock === false) return;
      if (tab === 'customer' && staffPermissions.canManageCustomers === false) return;
      if (tab === 'products' && staffPermissions.canManageProducts === false) return;
      if (tab === 'payment' && staffPermissions.canRecordPayment === false) return;
      if (tab === 'income_expend' && staffPermissions.canManageExpenses === false) return;
      if (tab === 'sales_report' && staffPermissions.canViewReports === false) return;
      if (tab === 'sms_center' && staffPermissions.canSendSms === false) return;
      if (tab === 'settings' && staffPermissions.canAccessSettings === false) return;
      if (tab === 'data_backup' && staffPermissions.canBackupData === false) return;
    }
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans select-none antialiased">
      <HeaderToolbar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        shop={shop}
        currentDateStr={currentDateStr}
        currentUser={currentUser}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
        permissions={staffPermissions}
        notice={notice}
        cloudSync={cloudSync}
        onConnectCloud={() => void FirestoreSyncService.signInWithGoogle()}
        onSyncNow={() => void FirestoreSyncService.syncNow()}
        onDismissCloudError={() => FirestoreSyncService.clearError()}
      />

      <main className="flex-1 overflow-auto">
        {activeTab === 'dashboard' && (
          <DashboardView
            invoices={invoices}
            customers={customers}
            products={products}
            payments={payments}
            shop={shop}
            contactsInfo={contactsInfo}
            currentUser={currentUser}
            onOpenLoginModal={() => setIsLoginModalOpen(true)}
            onNavigate={(tab) => setActiveTab(tab)}
            onPrintInvoice={(inv, isChallan) => {
              setPrintModal({
                isOpen: true,
                type: isChallan ? 'challan' : 'invoice',
                invoice: inv,
              });
            }}
            onSelectCustomerForPayment={(cust) => {
              setSelectedPickedCustomer(cust);
            }}
          />
        )}

        {activeTab === 'order' && (
          <OrderView
            products={products}
            customers={customers}
            invoices={invoices}
            dealers={dealers}
            shop={shop}
            currentUser={currentUser}
            permissions={staffPermissions}
            onSaveInvoice={handleSaveInvoice}
            onDeleteInvoice={handleDeleteInvoice}
            onOpenCustomerPicker={() => setIsCustomerPickerOpen(true)}
            selectedCustomerFromPicker={selectedPickedCustomer}
            onClearCustomerPicker={() => setSelectedPickedCustomer(null)}
            onPrintDirectInvoice={(inv, isChallan) => {
              setPrintModal({
                isOpen: true,
                type: isChallan ? 'challan' : 'invoice',
                invoice: inv,
              });
            }}
            onUpdateInvoiceDeal={handleUpdateInvoiceDeal}
            onNavigateToStock={() => setActiveTab('stock_inventory')}
            onRequireAdminAuth={requestAdminAction}
            onOpenSmsComposer={(req) => setSmsComposerState({ isOpen: true, request: req })}
          />
        )}

        {activeTab === 'stock_inventory' && (
          <StockInventoryView
            products={products}
            invoices={invoices}
            shop={shop}
            currentUser={currentUser}
            permissions={staffPermissions}
            onOpenPrintModal={(payload) => setPrintModal(payload)}
            onStockUpdated={refreshAllData}
            onDeletePendingChallan={handleDeleteInvoice}
            onDeleteDeliveryChallan={handleDeleteDeliveryChallan}
            onRequireAdminAuth={requestAdminAction}
          />
        )}

        {activeTab === 'customer' && (
          <CustomerView
            customers={customers}
            invoices={invoices}
            dealers={dealers}
            currentUser={currentUser}
            onSaveCustomer={handleSaveCustomer}
            onDeleteCustomer={handleDeleteCustomer}
            onRequireAdminAuth={requestAdminAction}
          />
        )}

        {activeTab === 'products' && (
          <ProductView
            products={products}
            currentUser={currentUser}
            onSaveProduct={handleSaveProduct}
            onDeleteProduct={handleDeleteProduct}
            onProductsReload={refreshAllData}
            onRequireAdminAuth={requestAdminAction}
          />
        )}

        {activeTab === 'payment' && (
          <PayReceiptView
            customers={customers}
            payments={payments}
            paymentMethods={paymentMethods}
            onPaymentMethodsChanged={(methods) => setPaymentMethods(methods)}
            currentUser={currentUser}
            onSavePayment={handleSavePayment}
            onDeletePayment={handleDeletePayment}
            onReprintPayment={(p) => {
              setPrintModal({
                isOpen: true,
                type: 'receipt',
                payment: p,
              });
            }}
            onOpenCustomerPicker={() => setIsCustomerPickerOpen(true)}
            selectedCustomerFromPicker={selectedPickedCustomer}
            onClearCustomerPicker={() => setSelectedPickedCustomer(null)}
            onRequireAdminAuth={requestAdminAction}
            permissions={staffPermissions}
            onOpenSmsComposer={(req) => setSmsComposerState({ isOpen: true, request: req })}
          />
        )}

        {activeTab === 'due_list' && (
          <DueListView
            customers={customers}
            invoices={invoices}
            payments={payments}
            currentUser={currentUser}
            permissions={staffPermissions}
            onSelectCustomerForPayment={(cust) => {
              setSelectedPickedCustomer(cust);
            }}
            onNavigateToPayment={() => setActiveTab('payment')}
            onOpenSmsComposer={(req) => setSmsComposerState({ isOpen: true, request: req })}
          />
        )}

        {activeTab === 'income_expend' && (
          <IncomeExpenseView
            txns={txns}
            currentUser={currentUser}
            onSaveTxn={handleSaveTxn}
            onDeleteTxn={handleDeleteTxn}
            onRequireAdminAuth={requestAdminAction}
          />
        )}

        {activeTab === 'sales_report' && (
          <SalesReportView
            invoices={invoices}
            payments={payments}
            products={products}
            customers={customers}
            txns={txns}
            shop={shop}
            onOpenPrintModal={(reportData) => {
              setPrintModal({
                isOpen: true,
                type: 'report',
                reportData,
              });
            }}
          />
        )}

        {activeTab === 'sms_center' && (
          <SmsCenterView
            customers={customers}
            smsLogs={smsLogs}
            smsSettings={smsSettings}
            shop={shop}
            currentUser={currentUser}
            permissions={staffPermissions}
            onOpenSmsComposer={(req) => setSmsComposerState({ isOpen: true, request: req })}
            onSaveCustomer={handleSaveCustomer}
            onUpdateSmsSettings={(updated) => {
              setSmsSettings(updated);
              StorageService.saveSmsSettings(updated);
            }}
            onDeleteSmsLog={(id) => {
              const updated = StorageService.getSmsLogs().filter((l) => l.id !== id);
              setSmsLogs(updated);
              StorageService.saveSmsLogs(updated);
            }}
          />
        )}

        {activeTab === 'admin_control' && currentUser.role === 'admin' && (
          <AdminControlView
            currentUser={currentUser}
            invoices={invoices}
            customers={customers}
            users={users}
            dealers={dealers}
            products={products}
            payments={payments}
            txns={txns}
            staffPermissions={staffPermissions}
            notice={notice}
            onUpdateNotice={(updatedNotice) => {
              setNotice(updatedNotice);
            }}
            contactsInfo={contactsInfo}
            onUpdateContacts={(updatedContacts) => {
              setContactsInfo(updatedContacts);
            }}
            shop={shop}
            smsSettings={smsSettings}
            onUpdateSmsSettings={(updated) => {
              setSmsSettings(updated);
              StorageService.saveSmsSettings(updated);
            }}
            onOpenSmsCenter={() => setActiveTab('sms_center')}
            onDeletePendingChallan={handleDeleteInvoice}
            onDeleteDeliveryChallan={handleDeleteDeliveryChallan}
            onDataChanged={refreshAllData}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView shop={shop} onSaveShop={handleSaveShop} />
        )}

        {activeTab === 'data_backup' && (
          <DataBackupView
            products={products}
            customers={customers}
            invoices={invoices}
            payments={payments}
            txns={txns}
            shop={shop}
            onDataReload={refreshAllData}
            cloudSync={cloudSync}
            onConnectCloud={() => FirestoreSyncService.signInWithGoogle()}
            onDisconnectCloud={() => FirestoreSyncService.signOutGoogle()}
            onPullFromCloud={() => FirestoreSyncService.forcePullFromCloud()}
            onPushToCloud={() => FirestoreSyncService.pushAllLocalToCloud()}
          />
        )}

        {activeTab === 'vb_code' && <VbCodeModal />}
      </main>

      {isCustomerPickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-300">
            <CustomerView
              customers={customers}
              invoices={invoices}
              dealers={dealers}
              currentUser={currentUser}
              onSaveCustomer={handleSaveCustomer}
              onDeleteCustomer={handleDeleteCustomer}
              onRequireAdminAuth={requestAdminAction}
              isPickMode={true}
              onPickCustomer={(cust) => {
                setSelectedPickedCustomer(cust);
                setIsCustomerPickerOpen(false);
              }}
              onClosePickModal={() => setIsCustomerPickerOpen(false)}
            />
          </div>
        </div>
      )}

      {isLoginModalOpen && (
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          currentUser={currentUser}
          users={users}
          onLoginSuccess={(u) => {
            setCurrentUser(u);
            refreshAllData();
            const latestPerms = StorageService.getStaffPermissions();
            if (u.role !== 'admin') {
              if (
                activeTab === 'admin_control' ||
                (activeTab === 'stock_inventory' && latestPerms.canAccessStock === false) ||
                (activeTab === 'customer' && latestPerms.canManageCustomers === false) ||
                (activeTab === 'products' && latestPerms.canManageProducts === false) ||
                (activeTab === 'payment' && latestPerms.canRecordPayment === false) ||
                (activeTab === 'income_expend' && latestPerms.canManageExpenses === false) ||
                (activeTab === 'sales_report' && latestPerms.canViewReports === false) ||
                (activeTab === 'sms_center' && latestPerms.canSendSms === false) ||
                (activeTab === 'settings' && latestPerms.canAccessSettings === false) ||
                (activeTab === 'data_backup' && latestPerms.canBackupData === false)
              ) {
                setActiveTab('dashboard');
              }
            }
          }}
        />
      )}

      {adminAuthModal.isOpen && (
        <AdminAuthModal
          isOpen={adminAuthModal.isOpen}
          actionTitle={adminAuthModal.actionTitle}
          actionDetails={adminAuthModal.actionDetails}
          onSuccess={adminAuthModal.onSuccess}
          onCancel={() => setAdminAuthModal((prev) => ({ ...prev, isOpen: false }))}
        />
      )}

      {printModal.isOpen && (
        <PrintModal
          type={printModal.type}
          invoice={printModal.invoice}
          payment={printModal.payment}
          reportData={printModal.reportData}
          deliveryChallan={printModal.deliveryChallan}
          stockInRecord={printModal.stockInRecord}
          shop={shop}
          onClose={() => setPrintModal({ isOpen: false, type: 'invoice' })}
        />
      )}

      {smsComposerState.isOpen && (
        <SmsComposerModal
          isOpen={smsComposerState.isOpen}
          request={smsComposerState.request}
          shop={shop}
          smsLogs={smsLogs}
          smsSettings={smsSettings}
          customers={customers}
          currentUser={currentUser}
          onClose={() => setSmsComposerState({ isOpen: false, request: null })}
          onLogsCreated={() => setSmsLogs(StorageService.getSmsLogs())}
        />
      )}

    </div>
  );
}
