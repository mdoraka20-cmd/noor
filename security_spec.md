# Firestore Security Specification — Inventory & Billing Pro

## 1. Data Invariants & Master Source of Truth
1. **Verified Multi-Tenant Ownership**: Every operational document (`shops`, `products`, `customers`, `invoices`, `payments`, `txns`, `stock_ins`, `delivery_challans`, `dealers`, `app_users`, `sms_logs`, `sms_settings`, `app_metadata`) belongs to a single verified Google account (`ownerUid == request.auth.uid`), with Bootstrapped Admin (`md.oraka20@gmail.com` with `email_verified == true`) or `/admins/{uid}` override.
2. **PII Isolation**: Collections storing phone numbers, street addresses, or local login credentials (`customers`, `invoices`, `delivery_challans`, `dealers`, `app_users`, `sms_logs`) are strictly restricted to `ownerUid == request.auth.uid` or verified admin on both `get` and `list`.
3. **Query Enforcer (No Blanket Reads)**: Every `allow list` rule enforces `isVerifiedUser() && (existing().ownerUid == request.auth.uid || isBootstrappedAdmin())` without any `get()` or `exists()` lookups.
4. **Temporal & Immutable Field Integrity**: On `create`, `createdAt == request.time`, `updatedAt == request.time`, and `ownerUid == request.auth.uid`. On `update`, `ownerUid` and `createdAt` are immutable (`incoming().ownerUid == existing().ownerUid && incoming().createdAt == existing().createdAt`) and `updatedAt == request.time`.
5. **Relational & Atomic Batch Guarantees**:
   - Creating a `delivery_challans` document linked to an invoice (`invoiceNo > 0`) MUST atomically verify `existsAfter(/databases/$(database)/documents/invoices/$(request.auth.uid + '_inv_' + string(incoming().invoiceNo)))`.
   - Creating a `stock_ins` document MUST include at least one item (`items.size() > 0 && items.size() <= 100`).
6. **Terminal State Protection**:
   - Once an `invoices` document reaches `deliveryStatus == 'delivered'`, non-admin owners cannot mutate core invoice line items, customer linkage, or `no` — only settlement/deal correction fields (`deal`, `cash`, `bank`, `bkash`, `discount`, `comment`, `deliveryStatus`, `updatedAt`).
   - Once an `sms_logs` document reaches `deliveryStatus == 'DELIVERED'`, non-admin updates are blocked.
7. **Path & Resource Guarding**: Every single-document `get`, `create`, `update`, and `delete` enforces `isValidId(docId)` (`^[a-zA-Z0-9_\-]+$`, length 1..128), strict `keys().hasAll(...) && keys().hasOnly(...)`, explicit type checks, numeric checks, bounded strings/lists, and action-scoped `affectedKeys().hasOnly(...)` on every update.

## 2. "Dirty Dozen" Adversarial Payloads (Must All Return `PERMISSION_DENIED`)
1. **Unverified Email Spoof (`customers` create/read)**: Attacker signs in with `email: 'md.oraka20@gmail.com'` and `email_verified: false`, attempts to read or create a customer. Blocked by `isVerifiedUser()` checking `request.auth.token.email_verified == true`.
2. **Identity Spoofing on Create (`products` create)**: User A (`uid_A`) tries to create a product with `ownerUid: 'uid_B'`. Blocked by `incoming().ownerUid == request.auth.uid`.
3. **Shadow / Ghost Field Injection (`shops` create/update)**: Owner sends `{ ..., isSuperVerified: true }` or `{ ..., adminOverride: true }`. Blocked by `data.keys().hasOnly(...)` inside `isValidShopConfig()` and `affectedKeys().hasOnly(...)`.
4. **Oversized Document ID Poisoning (`products` create)**: User sends document ID `'a'.repeat(500)` or `'bad/id$1'`. Blocked by `isValidId(productId)`.
5. **Unbounded String / Denial-of-Wallet Exhaustion (`products` create)**: Owner sets `name` to a 50,000-char string. Blocked by `data.name.size() <= 200`.
6. **Unbounded Array / List Poisoning (`invoices` create)**: Owner sends `items` array with 500 elements or first element as a raw string instead of a map. Blocked by `data.items.size() <= 100 && (data.items.size() == 0 || data.items[0] is map)`.
7. **Cross-Tenant PII Read (`customers` get)**: User A attempts `getDoc(doc(db, 'customers', 'uid_B_cust_1'))`. Blocked by `isOwnerData(existing()) || isAdmin()`.
8. **Unscoped List Scrape (`invoices` list)**: User A queries `collection(db, 'invoices')` without `.where('ownerUid', '==', 'uid_A')`. Blocked because `allow list` checks `existing().ownerUid == request.auth.uid`.
9. **Client Timestamp Tampering (`payments` create)**: Owner sends `createdAt: new Date('2020-01-01')` instead of `serverTimestamp()`. Blocked by `incoming().createdAt == request.time`.
10. **Immutable Field Hijack on Update (`customers` update)**: Owner attempts to change `ownerUid` or `createdAt` during an update. Blocked by `incoming().ownerUid == existing().ownerUid && incoming().createdAt == existing().createdAt`.
11. **Terminal State Bypass (`invoices` update)**: Non-admin owner attempts to overwrite `items` and `no` on an invoice whose `existing().deliveryStatus == 'delivered'`. Blocked by `existing().deliveryStatus != 'delivered'` branch restriction.
12. **Orphaned Delivery Challan (`delivery_challans` create)**: Owner creates a challan with `invoiceNo: 999999` where no corresponding invoice exists before or after the batch. Blocked by `existsAfter(...)`.
