import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // <--- 1. UBAH CARA IMPORT

// Definisikan tipe data
interface Transaction {
  id: number;
  createdAt: string;
  type: string;
  amount: number;
  priceAtTime: number;
  product: { name: string; sku: string };
  customer?: { name: string; address: string; phone: string };
  supplier?: { name: string };
  user: { name: string };
}

export const generateInvoice = (trx: Transaction) => {
  const doc = new jsPDF();

  // 1. Header Perusahaan
  doc.setFontSize(20);
  doc.setTextColor(40);
  doc.text("SCM ENTERPRISE LTD", 14, 22);
  
  doc.setFontSize(10);
  doc.text("Jalan Teknologi No. 88, Silicon Valley, Indonesia", 14, 28);
  doc.text("Email: finance@scmenterprise.com", 14, 33);

  // Garis Pembatas
  doc.setLineWidth(0.5);
  doc.line(14, 38, 196, 38);

  // 2. Info Invoice & Pelanggan
  const invoiceNo = `INV-${new Date(trx.createdAt).getFullYear()}/${trx.id.toString().padStart(4, '0')}`;
  const date = new Date(trx.createdAt).toLocaleDateString('id-ID');

  doc.setFontSize(12);
  doc.text("INVOICE / FAKTUR PENJUALAN", 14, 50);

  doc.setFontSize(10);
  doc.text(`No. Invoice : ${invoiceNo}`, 14, 60);
  doc.text(`Tanggal     : ${date}`, 14, 66);
  doc.text(`Kasir       : ${trx.user.name}`, 14, 72);

  // Info Customer (Kanan)
  doc.text("Kepada Yth:", 120, 60);
  doc.setFont("helvetica", "bold");
  doc.text(trx.customer?.name || "Pelanggan Umum", 120, 66);
  doc.setFont("helvetica", "normal");
  doc.text(trx.customer?.phone || "-", 120, 72);
  
  const splitAddress = doc.splitTextToSize(trx.customer?.address || "-", 70);
  doc.text(splitAddress, 120, 78);

  // 3. Tabel Produk
  // UBAH CARA PANGGIL: autoTable(doc, { options })
  autoTable(doc, {
    startY: 90,
    head: [['No', 'Produk / SKU', 'Qty', 'Harga Satuan', 'Total']],
    body: [
      [
        1,
        `${trx.product.name}\n(${trx.product.sku})`,
        trx.amount,
        `Rp ${new Intl.NumberFormat('id-ID').format(trx.priceAtTime)}`,
        `Rp ${new Intl.NumberFormat('id-ID').format(trx.amount * trx.priceAtTime)}`
      ]
    ],
    theme: 'grid',
    headStyles: { fillColor: [41, 128, 185] }, // Warna Biru
  });

  // 4. Total & Footer
  // Ambil posisi Y terakhir dari tabel
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(`TOTAL TAGIHAN: Rp ${new Intl.NumberFormat('id-ID').format(trx.amount * trx.priceAtTime)}`, 14, finalY);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Terima kasih atas kepercayaan Anda.", 14, finalY + 20);
  doc.text("( Dokumen ini sah dan diproses oleh komputer )", 14, finalY + 26);

  // 5. Download PDF
  doc.save(`${invoiceNo}.pdf`);
};