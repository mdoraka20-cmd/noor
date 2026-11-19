/**
 * Dirty Dozen Adversarial Security Rules Test Suite for Inventory & Billing Pro
 * Compatible with @firebase/rules-unit-testing against local Firestore Emulator.
 */
import { assertFails, assertSucceeds, initializeTestEnvironment, RulesTestEnvironment } from '@firebase/rules-unit-testing';
import { doc, getDoc, getDocs, collection, setDoc, updateDoc, serverTimestamp, writeBatch } from 'firebase/firestore';
import fs from 'node:fs';

let testEnv: RulesTestEnvironment;

export async function runSecurityRulesTests() {
  testEnv = await initializeTestEnvironment({
    projectId: 'bold-research-kw1rw',
    firestore: {
      rules: fs.readFileSync('firestore.rules', 'utf8'),
    },
  });

  const alice = testEnv.authenticatedContext('alice_uid', { email: 'alice@example.com', email_verified: true });
  const bob = testEnv.authenticatedContext('bob_uid', { email: 'bob@example.com', email_verified: true });
  const spoofAdmin = testEnv.authenticatedContext('spoof_uid', { email: 'md.oraka20@gmail.com', email_verified: false });

  await testEnv.withSecurityRulesDisabled(async (ctx) => {
    const db = ctx.firestore();
    await setDoc(doc(db, 'customers', 'bob_uid_cust_1'), {
      ownerUid: 'bob_uid',
      id: 1,
      name: 'Bob Secret Customer',
      address: 'Dhaka',
      phone: '01700000001',
      deal: '',
      openDue: 500,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    await setDoc(doc(db, 'invoices', 'alice_uid_inv_1001'), {
      ownerUid: 'alice_uid',
      no: 1001,
      date: '2026-01-01 10:00:00',
      custId: 1,
      custName: 'Delivered Cust',
      address: 'Dhaka',
      phone: '01700000002',
      deal: 'Self',
      comment: '',
      labor: 0,
      discount: 0,
      prevDue: 0,
      cash: 1000,
      bank: 0,
      bkash: 0,
      items: [{ productId: 1, name: 'Tile', dim: '12x12', box: 1, piece: 0, sft: 10, unit: 100, total: 1000, isTile: true }],
      deliveryStatus: 'delivered',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  });

  // 1. Unverified admin email spoof MUST fail
  await assertFails(getDoc(doc(spoofAdmin.firestore(), 'customers', 'bob_uid_cust_1')));

  // 2. Identity spoofing on create MUST fail
  await assertFails(setDoc(doc(alice.firestore(), 'products', 'alice_uid_prod_1'), {
    ownerUid: 'bob_uid',
    id: 1, code: 'P1', category: 'Floor', name: 'White Tile', isTile: true,
    w: 12, h: 12, scm: 0, sftPack: 16, qtyPack: 16, rate: 50, price: 60,
    createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
  }));

  // 3. Shadow / ghost field injection MUST fail
  await assertFails(setDoc(doc(alice.firestore(), 'shops', 'main_alice_uid'), {
    ownerUid: 'alice_uid',
    name: 'Test Shop', address: 'Dhaka', phones: '017', web: '', note: '', preparedBy: '',
    startInvoiceNo: '1001', footerText: 'Thanks', isSuperVerified: true,
    createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
  }));

  // 4. Oversized / invalid ID poisoning MUST fail
  await assertFails(setDoc(doc(alice.firestore(), 'products', 'x'.repeat(200)), {
    ownerUid: 'alice_uid',
    id: 2, code: 'P2', category: 'Floor', name: 'Tile 2', isTile: true,
    w: 12, h: 12, scm: 0, sftPack: 16, qtyPack: 16, rate: 50, price: 60,
    createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
  }));

  // 5. Oversized string Denial-of-Wallet MUST fail
  await assertFails(setDoc(doc(alice.firestore(), 'products', 'alice_uid_prod_big'), {
    ownerUid: 'alice_uid',
    id: 3, code: 'P3', category: 'Floor', name: 'N'.repeat(500), isTile: true,
    w: 12, h: 12, scm: 0, sftPack: 16, qtyPack: 16, rate: 50, price: 60,
    createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
  }));

  // 6. Invalid / oversized items array poisoning MUST fail
  await assertFails(setDoc(doc(alice.firestore(), 'invoices', 'alice_uid_inv_bad'), {
    ownerUid: 'alice_uid', no: 1002, date: '2026-01-01 10:00:00', custId: 1,
    custName: 'Bad', address: '', phone: '', deal: '', comment: '',
    labor: 0, discount: 0, prevDue: 0, cash: 0, bank: 0, bkash: 0,
    items: ['not-a-map'], deliveryStatus: 'pending',
    createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
  }));

  // 7. Cross-tenant PII read MUST fail
  await assertFails(getDoc(doc(alice.firestore(), 'customers', 'bob_uid_cust_1')));

  // 8. Unscoped collection list scrape MUST fail
  await assertFails(getDocs(collection(alice.firestore(), 'invoices')));

  // 9. Client-forged timestamp MUST fail
  await assertFails(setDoc(doc(alice.firestore(), 'payments', 'alice_uid_pay_1'), {
    ownerUid: 'alice_uid', id: 1, date: '2026-01-01 10:00:00', custId: 1, custName: 'C',
    amount: 100, remark: 'ok', method: 'Cash',
    createdAt: new Date('2020-01-01T00:00:00Z'), updatedAt: serverTimestamp(),
  }));

  // 10. Immutable ownerUid / createdAt change on update MUST fail
  await assertFails(updateDoc(doc(bob.firestore(), 'customers', 'bob_uid_cust_1'), {
    ownerUid: 'alice_uid',
    updatedAt: serverTimestamp(),
  }));

  // 11. Terminal delivered invoice item overwrite by non-admin owner MUST fail
  await assertFails(updateDoc(doc(alice.firestore(), 'invoices', 'alice_uid_inv_1001'), {
    items: [],
    updatedAt: serverTimestamp(),
  }));

  // 12. Orphaned delivery challan referencing non-existent invoice MUST fail
  await assertFails(setDoc(doc(alice.firestore(), 'delivery_challans', 'alice_uid_ch_1'), {
    ownerUid: 'alice_uid', id: 1, challanNo: 'CH-999999-1', outType: 'challan',
    invoiceNo: 999999, custId: 1, custName: 'C', address: '', phone: '', deal: '',
    date: '2026-01-01 10:00:00',
    items: [{ productId: 1, name: 'Tile', dim: '12x12', box: 1, piece: 0, sft: 10, isTile: true }],
    dispatchedBy: 'Admin', createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
  }));

  // Positive sanity check: Valid atomic challan dispatch on existing invoice succeeds
  const batch = writeBatch(alice.firestore());
  batch.set(doc(alice.firestore(), 'delivery_challans', 'alice_uid_ch_2'), {
    ownerUid: 'alice_uid', id: 2, challanNo: 'CH-1001-1', outType: 'challan',
    invoiceNo: 1001, custId: 1, custName: 'Delivered Cust', address: 'Dhaka', phone: '01700000002', deal: 'Self',
    date: '2026-01-01 11:00:00',
    items: [{ productId: 1, name: 'Tile', dim: '12x12', box: 1, piece: 0, sft: 10, isTile: true }],
    dispatchedBy: 'Admin', createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
  });
  await assertSucceeds(batch.commit());

  await testEnv.cleanup();
}
