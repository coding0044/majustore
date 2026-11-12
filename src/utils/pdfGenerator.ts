/**
 * MAJU STORE® Client-Side Order Invoice & Receipt PDF Generator
 * Formatted for standard A4 paper matching the brand's monochrome luxury aesthetic.
 */

import { jsPDF } from 'jspdf';
import { formatDiscount, formatMoney } from '../data/fashionData';

export interface OrderData {
  orderRef: string;
  date: string;
  time: string;
  customer: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  items: Array<{
    cartItemId: string;
    product: {
      id: string;
      name: string;
      category: string;
      price: number;
      lookNumber: number;
      itemNumber: number;
    };
    size: string;
    quantity: number;
  }>;
  subtotal: number;
  totalDiscount: number;
  finalTotal: number;
  paymentMethod: string;
  paymentStatus: string;
}

export function downloadOrderReceiptPdf(order: OrderData): void {
  // A4 dimensions: 210mm x 297mm
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const leftMargin = 16;
  const rightMargin = 194;
  const contentWidth = rightMargin - leftMargin;

  let y = 20;

  // 1. Header & Brand Lockup
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(0, 0, 0);
  doc.text('MAJU STORE', leftMargin, y);
  doc.setFontSize(10);
  doc.text('®', leftMargin + 48, y - 4);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(111, 111, 111);
  doc.text('OFFICIAL ORDER INVOICE & DISPATCH RECEIPT', rightMargin, y - 2, { align: 'right' });
  doc.text('VOL. 01 ARCHIVE · MONOCHROME STUDIO', rightMargin, y + 3, { align: 'right' });

  y += 10;
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.8);
  doc.line(leftMargin, y, rightMargin, y);

  // 2. Order Reference & Customer Destination Block
  y += 10;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text('ORDER REFERENCE:', leftMargin, y);
  doc.setFont('helvetica', 'bold');
  doc.text(order.orderRef, leftMargin + 40, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(111, 111, 111);
  doc.text('DATE & TIME:', rightMargin - 60, y);
  doc.setTextColor(0, 0, 0);
  doc.text(`${order.date} · ${order.time}`, rightMargin, y, { align: 'right' });

  y += 8;
  doc.setDrawColor(210, 210, 210);
  doc.setLineWidth(0.3);
  doc.line(leftMargin, y, rightMargin, y);

  // 3. Customer & Shipping / Payment Information Columns
  y += 8;
  const colWidth = contentWidth / 2;

  // Left Column: Customer & Delivery Address
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(0, 0, 0);
  doc.text('DISPATCH DESTINATION:', leftMargin, y);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(50, 50, 50);
  y += 5;
  doc.text(order.customer.fullName, leftMargin, y);
  y += 4.5;
  doc.text(order.customer.address, leftMargin, y);
  y += 4.5;
  doc.text(`${order.customer.city}, ${order.customer.postalCode}`, leftMargin, y);
  y += 4.5;
  doc.text(order.customer.country, leftMargin, y);

  // Right Column: Payment & Contact Info
  let rightY = y - 14;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(0, 0, 0);
  doc.text('PAYMENT & CONTACT DETAILS:', leftMargin + colWidth + 5, rightY);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(50, 50, 50);
  rightY += 5;
  doc.text(`Method: ${order.paymentMethod}`, leftMargin + colWidth + 5, rightY);
  rightY += 4.5;
  doc.text(`Status: ${order.paymentStatus}`, leftMargin + colWidth + 5, rightY);
  rightY += 4.5;
  doc.text(`Email: ${order.customer.email}`, leftMargin + colWidth + 5, rightY);
  rightY += 4.5;
  doc.text(`Phone: ${order.customer.phone}`, leftMargin + colWidth + 5, rightY);

  y = Math.max(y, rightY) + 12;

  // 4. Itemized Product Table
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  doc.line(leftMargin, y, rightMargin, y);

  // Table Header
  y += 5;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(0, 0, 0);
  doc.text('ITEM / DESCRIPTION', leftMargin, y);
  doc.text('CATEGORY', leftMargin + 72, y);
  doc.text('SIZE', leftMargin + 105, y);
  doc.text('QTY', leftMargin + 125, y, { align: 'center' });
  doc.text('PRICE (PKR)', leftMargin + 150, y, { align: 'right' });
  doc.text('AMOUNT (PKR)', rightMargin, y, { align: 'right' });

  y += 3;
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  doc.line(leftMargin, y, rightMargin, y);

  // Table Rows
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);

  order.items.forEach((item) => {
    y += 6;
    doc.setTextColor(0, 0, 0);
    doc.text(item.product.name, leftMargin, y);
    doc.setTextColor(100, 100, 100);
    doc.text(`Look ${String(item.product.lookNumber).padStart(2, '0')} · ${item.product.category}`, leftMargin + 72, y);
    doc.text(item.size, leftMargin + 105, y);
    doc.text(String(item.quantity), leftMargin + 125, y, { align: 'center' });
    doc.setTextColor(50, 50, 50);
    doc.text(formatMoney(item.product.price), leftMargin + 150, y, { align: 'right' });
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(formatMoney(item.product.price * item.quantity), rightMargin, y, { align: 'right' });
    doc.setFont('helvetica', 'normal');

    y += 2.5;
    doc.setDrawColor(230, 230, 230);
    doc.setLineWidth(0.2);
    doc.line(leftMargin, y, rightMargin, y);
  });

  // 5. Financial Summary Block
  y += 8;
  const summaryLeft = leftMargin + 100;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text('Subtotal:', summaryLeft, y);
  doc.setTextColor(0, 0, 0);
  doc.text(formatMoney(order.subtotal), rightMargin, y, { align: 'right' });

  if (order.totalDiscount > 0) {
    y += 6;
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text('Whole-Fit Bundle Discount (−10%):', summaryLeft, y);
    doc.text(formatDiscount(order.totalDiscount), rightMargin, y, { align: 'right' });
    doc.setFont('helvetica', 'normal');
  }

  y += 6;
  doc.setTextColor(100, 100, 100);
  doc.text('Express Courier Delivery:', summaryLeft, y);
  doc.setTextColor(0, 0, 0);
  doc.text('Complimentary (PKR 0)', rightMargin, y, { align: 'right' });

  y += 3;
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.6);
  doc.line(summaryLeft, y, rightMargin, y);

  y += 6;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text('TOTAL AMOUNT:', summaryLeft, y);
  doc.text(formatMoney(order.finalTotal), rightMargin, y, { align: 'right' });

  // 6. Brand Ethos, Return Policy & Verification Footer
  y += 22;
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.line(leftMargin, y, rightMargin, y);

  y += 6;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(0, 0, 0);
  doc.text('MAJU STORE® · STAY OUT OF THE LOOP.', leftMargin, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(111, 111, 111);
  y += 4.5;
  doc.text('30-day complimentary returns on all garments in original unworn packaging with studio tags attached.', leftMargin, y);
  y += 4;
  doc.text('For client care, fitting appointments, or shipment queries, contact concierge@majustore.com.', leftMargin, y);

  // Filename formatted with order reference
  const sanitizedFilename = `${order.orderRef.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`;
  doc.save(sanitizedFilename);
}
