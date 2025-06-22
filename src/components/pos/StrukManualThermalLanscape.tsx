const printStrukCustom = (payload) => {
  const username =
    JSON.parse(localStorage.getItem("auth-storage") || "{}")?.state?.user
      ?.username || "-";

  const tanggalCetak = new Date().toLocaleString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const total = payload.total.toLocaleString();
  const dibayar = payload.dibayar.toLocaleString();
  const kembali = payload.kembali.toLocaleString();
  const ongkir = (payload.ongkir || 0).toLocaleString();
  const sisaPiutang = (payload.sisa_piutang || 0).toLocaleString();

  const detailRows = payload.detail
    .map(
      (item, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${item.barang_id || "-"}</td>
      <td>${item.nama_barang || "-"}</td>
      <td>${item.qty} ${item.nama_satuan}</td>
      <td align="right">${(+item.harga_jual).toLocaleString()}</td>
      <td align="right">0,00</td>
      <td align="right">${item.subtotal.toLocaleString()}</td>
    </tr>
  `
    )
    .join("");

  const html = `
  <html>
    <head>
      <title>Struk Transaksi</title>
      <style>
        body {
          font-family: monospace;
          font-size: 12px;
          padding: 10px;
        }
        .header, .footer { text-align: center; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        td, th { padding: 4px; border-bottom: 1px dotted #000; }
        .totals td { border: none; padding: 2px 4px; }
        .bold { font-weight: bold; }
        hr { border: none; border-top: 1px dashed black; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="header bold">
        TOKO BANGUNAN MAJU JAYA<br />
        Jl. Raya Bangunan No. 123, Palu<br />
        Telp/WA: 08xxxxxxxxxx
      </div>
      <table style="margin-top: 10px;">
        <tr>
          <td>Tanggal</td>
          <td>: ${payload.tanggal}</td>
          <td>Pelanggan</td>
          <td>: ${payload.customer}</td>
        </tr>
        <tr>
          <td>No Faktur</td>
          <td>: -</td>
          <td>Kasir</td>
          <td>: ${username}</td>
        </tr>
        <tr>
          <td>Alamat</td>
          <td colspan="3">: -</td>
        </tr>
      </table>
      <hr />
      <div class="bold">FAKTUR PENJUALAN</div>
      <table>
        <thead>
          <tr class="bold">
            <th>No</th>
            <th>Kd Item</th>
            <th>Nama Item</th>
            <th>Jml Satuan</th>
            <th>Harga</th>
            <th>Disc</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${detailRows}
        </tbody>
      </table>
      <hr />
      <div style="margin-top: 8px;">
        Terbilang: <i>... (auto convert angka ke huruf jika kamu mau)</i>
      </div>
      <table class="totals" style="margin-top: 10px;">
        <tr><td width="70%">Subtotal</td><td align="right">${total}</td></tr>
        <tr><td>Biaya Lain</td><td align="right">${ongkir}</td></tr>
        <tr><td><b>TOTAL</b></td><td align="right"><b>${(
          payload.total + payload.ongkir
        ).toLocaleString()}</b></td></tr>
        <tr><td>Discon</td><td align="right">0,00</td></tr>
        <tr><td>Pajak</td><td align="right">0,00</td></tr>
        <tr><td>Bayar/DP</td><td align="right">${dibayar}</td></tr>
        <tr><td>Kembali</td><td align="right">${kembali}</td></tr>
        <tr><td>Kredit</td><td align="right">${sisaPiutang}</td></tr>
      </table>

      <div class="footer" style="margin-top: 20px;">
        <table width="100%">
          <tr>
            <td>Penerima</td>
            <td></td>
            <td align="right">Hormat Kami</td>
          </tr>
          <tr>
            <td colspan="3" style="height: 40px;"></td>
          </tr>
        </table>
        <hr />
        <div style="font-size: 10px;">
          Tgl. Cetak: ${tanggalCetak} ${username}<br />
          ig: @tokobangunan | web: www.tokobangunan.com
        </div>
      </div>
    </body>
  </html>
  `;

  const win = window.open("", "_blank", "width=600,height=800");
  win.document.open();
  win.document.write(html);
  win.document.close();
  win.focus();
  win.print();
  win.close();
};

export { printStrukCustom };
