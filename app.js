const itemForm = document.getElementById('item-form');
const nameInput = document.getElementById('item-name');
const priceInput = document.getElementById('item-price');
const qtyInput = document.getElementById('item-qty');
const tableBody = document.getElementById('item-table-body');
const totalDisplay = document.getElementById('grand-total');
const resetBtn = document.getElementById('reset-all-btn');

let itemList = JSON.parse(localStorage.getItem('kasirItemList')) || [];
let buyerList = JSON.parse(localStorage.getItem('kasirBuyerList')) || [];

// Render Barang
function renderItemTable() {
  tableBody.innerHTML = '';
  let total = 0;

  itemList.forEach((item, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td data-label="No">${index + 1}</td>
        <td data-label="Nama">${item.name}</td>
        <td data-label="Harga">Rp ${item.price.toLocaleString()}</td>
        <td data-label="Jumlah">${item.qty}</td>
        <td data-label="Subtotal">Rp ${(item.price * item.qty).toLocaleString()}</td>
        <td data-label="Aksi"><button onclick="deleteItem(${item.id})">Hapus</button></td>
    `;

    tableBody.appendChild(row);
    total += item.price * item.qty;
  });

  totalDisplay.textContent = `Rp ${total.toLocaleString()}`;
  localStorage.setItem('kasirItemList', JSON.stringify(itemList));
  renderBarangOptions();
}

function deleteItem(id) {
  itemList = itemList.filter(item => item.id !== id);
  renderItemTable();
}

itemForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const name = nameInput.value.trim();
  const price = parseFloat(priceInput.value);
  const qty = parseInt(qtyInput.value);

  if (!name || isNaN(price) || isNaN(qty) || price <= 0 || qty <= 0) {
    alert('Lengkapi data dan pastikan harga/jumlah lebih dari 0');
    return;
  }

  itemList.push({ id: Date.now(), name, price, qty });
  renderItemTable();
  itemForm.reset();
});

resetBtn.addEventListener('click', () => {
  if (confirm('Yakin reset semua data barang?')) {
    itemList = [];
    localStorage.removeItem('kasirItemList');
    renderItemTable();
  }
});

// Render Dropdown
function renderBarangOptions() {
  const select = document.getElementById('select-barang');
  select.innerHTML = '';
  itemList.forEach(item => {
    const opt = document.createElement('option');
    opt.value = item.name;
    opt.textContent = `${item.name} - Rp ${item.price.toLocaleString()}`;
    opt.dataset.harga = item.price;
    select.appendChild(opt);
  });
}

// Transaksi Pembeli
const buyerForm = document.getElementById('buyer-form');
const buyerTbody = document.getElementById('buyer-table-body');

buyerForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const nama = document.getElementById('nama-pembeli').value;
  const barangSelect = document.getElementById('select-barang');
  const barang = barangSelect.value;
  const harga = parseFloat(barangSelect.options[barangSelect.selectedIndex].dataset.harga);
  const jumlah = parseInt(document.getElementById('jumlah-barang').value);
  const catatan = document.getElementById('catatan-pembeli').value.trim();


  if (!nama || !barang || isNaN(jumlah)) return alert('Lengkapi semua data');

  const buyer = {
    id: Date.now(),
    namaPembeli: nama,
    namaBarang: barang,
    hargaBarang: harga,
    jumlahBarang: jumlah,
    catatan: catatan,
    sudahTransfer: false,
    sudahDikirim: false
  };
  buyerList.push(buyer);
  localStorage.setItem('kasirBuyerList', JSON.stringify(buyerList));
  renderBuyerTable();
  buyerForm.reset();
});

// ... (Kode seperti yang sudah kamu punya sebelumnya)

// function renderBuyerTable() {
//   buyerTbody.innerHTML = '';
//   buyerList.forEach((buyer, index) => {
//     const total = buyer.hargaBarang * buyer.jumlahBarang;
//     const row = document.createElement('tr');
//     row.innerHTML = `
//       <td>${index + 1}</td>
//       <td>${buyer.namaPembeli}</td>
//       <td>${buyer.namaBarang}</td>
//       <td>${buyer.jumlahBarang}</td>
//       <td>${buyer.catatan || '-'}</td>
//       <td>Rp ${total.toLocaleString()}</td>
//       <td>
//   <button onclick="toggleTransfer(${buyer.id})"
//     class="status-transfer ${buyer.sudahTransfer ? 'sudah' : 'belum'}">
//     ${buyer.sudahTransfer ? '✅ Transfer' : '❌ Transfer'}
//   </button>
// </td>
// <td>
//   <button onclick="toggleKirim(${buyer.id})"
//     class="status-kirim ${buyer.sudahDikirim ? 'sudah' : 'belum'}">
//     ${buyer.sudahDikirim ? '🚚 Kirim' : '❌ Kirim'}
//   </button>
// </td>
// <td>
//   <button onclick="cetakStrukCanvas(${buyer.id})" class="struk-btn">
//     🧾 Struk
//   </button>
// </td>
//
//     `;
//     buyerTbody.appendChild(row);
//   });
// }

function renderBuyerTable() {
  const filterTransfer = document.getElementById('filter-transfer').value;
  const filterKirim = document.getElementById('filter-kirim').value;

  buyerTbody.innerHTML = '';
  buyerList
    .filter(buyer =>
        (!filterTransfer || buyer.sudahTransfer.toString() === filterTransfer) &&
        (!filterKirim || buyer.sudahDikirim.toString() === filterKirim)
      )
    .forEach((buyer, index) => {
      const total = buyer.hargaBarang * buyer.jumlahBarang;
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${buyer.namaPembeli}</td>
        <td>${buyer.namaBarang}</td>
        <td>${buyer.jumlahBarang}</td>
        <td>${buyer.catatan || '-'}</td>
        <td>Rp ${total.toLocaleString()}</td>
        <td>
          <button onclick="toggleTransfer(${buyer.id})"
            class="status-transfer ${buyer.sudahTransfer ? 'sudah' : 'belum'}">
            ${buyer.sudahTransfer ? '✅ Transfer' : '❌ Transfer'}
          </button>
        </td>
        <td>
          <button onclick="toggleKirim(${buyer.id})"
            class="status-kirim ${buyer.sudahDikirim ? 'sudah' : 'belum'}">
            ${buyer.sudahDikirim ? '🚚 Kirim' : '❌ Kirim'}
          </button>
        </td>
        <td>
          <button onclick="cetakStrukCanvas(${buyer.id})" class="struk-btn">
            🧾 Struk
          </button>
        </td>`;
      buyerTbody.appendChild(row);
    });
  updateRekapPenjualan();
}

document.getElementById('filter-transfer').addEventListener('change', renderBuyerTable);
document.getElementById('filter-kirim').addEventListener('change', renderBuyerTable);


// Navigasi antar section
function showSection(id) {
  document.querySelectorAll('.section').forEach(sec => sec.style.display = 'none');
  const target = document.getElementById(id);
  if (target) target.style.display = 'block';

  document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(link => {
    if (link.textContent.toLowerCase() === id) link.classList.add('active');
  });
}


// Init
renderItemTable();
renderBuyerTable();

function toggleTransfer(id) {
  const buyer = buyerList.find(b => b.id === id);
  if (buyer) {
    buyer.sudahTransfer = !buyer.sudahTransfer;
    localStorage.setItem('kasirBuyerList', JSON.stringify(buyerList));
    renderBuyerTable();
  }
}

function toggleKirim(id) {
  const buyer = buyerList.find(b => b.id === id);
  if (buyer) {
    buyer.sudahDikirim = !buyer.sudahDikirim;
    localStorage.setItem('kasirBuyerList', JSON.stringify(buyerList));
    renderBuyerTable();
  }
}

document.getElementById('reset-buyer-btn').addEventListener('click', () => {
  if (confirm('Yakin reset semua transaksi pembeli?')) {
    buyerList = [];
    localStorage.removeItem('kasirBuyerList');
    renderBuyerTable();
  }
});

// Struk Canvas
function cetakStrukCanvas(id) {
  const buyer = buyerList.find(b => b.id === id);
  if (!buyer) return;

  const canvas = document.getElementById('struk-canvas');
  const ctx = canvas.getContext('2d');
  const total = buyer.hargaBarang * buyer.jumlahBarang;

  // Reset canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#000";
  let y = 30;
  const lineHeight = 22;

  // Header toko
  ctx.font = "bold 18px Courier New";
  ctx.fillText("    CT Catering", 40, y);
  y += lineHeight;

  ctx.font = "14px Courier New";
  ctx.fillText("Lorong Elis Nirwana No 1492", 10, y); y += lineHeight;
  ctx.fillText("Sukabangun 2, Palembang. 30151", 10, y); y += lineHeight;
  ctx.fillText("Telp: 081360996295", 10, y); y += 10;

  ctx.beginPath();
  ctx.moveTo(10, y);
  ctx.lineTo(290, y);
  ctx.stroke();
  y += lineHeight;

  // Info pembeli
  ctx.fillText(`Nama Pembeli : ${buyer.namaPembeli}`, 10, y); y += lineHeight;
  ctx.fillText(`Barang       : ${buyer.namaBarang}`, 10, y); y += lineHeight;
  ctx.fillText(`Jumlah       : ${buyer.jumlahBarang}`, 10, y); y += lineHeight;
  ctx.fillText(`Total Bayar  : Rp ${total.toLocaleString()}`, 10, y); y += lineHeight;
  ctx.fillText(`Catatan      : ${buyer.catatan || '-'}`, 10, y); y += lineHeight;

  ctx.beginPath();
  ctx.moveTo(10, y);
  ctx.lineTo(290, y);
  ctx.stroke();
  y += lineHeight;

  // Payment info
  ctx.fillText("Pembayaran via:", 10, y); y += lineHeight;
  ctx.fillText("CINDY ANJELINA BARIN", 10, y); y += lineHeight;
  ctx.fillText("Bank Mandiri", 10, y); y += lineHeight;
  ctx.fillText("1570009775306", 10, y); y += lineHeight;

  ctx.font = "italic 12px Courier New";
  ctx.fillText("Terima kasih 🙏", 90, y + 10);

  // Download
  const image = canvas.toDataURL("image/png");
  const link = document.createElement('a');
  link.download = `struk-${buyer.namaPembeli}.png`;
  link.href = image;
  link.click();
}

// Init
renderItemTable();
renderBuyerTable();



// Rekap
function updateRekapPenjualan() {
  const totalPembeli = buyerList.length;
  const totalBarang = buyerList.reduce((sum, b) => sum + b.jumlahBarang, 0);
  const totalUang = buyerList.reduce((sum, b) => b.sudahTransfer ? sum + (b.hargaBarang * b.jumlahBarang) : sum, 0);
  const totalKirim = buyerList.filter(b => b.sudahDikirim).length;

  document.getElementById('rekap-total-pembeli').textContent = totalPembeli;
  document.getElementById('rekap-total-barang').textContent = totalBarang;
  document.getElementById('rekap-total-uang').textContent = `Rp ${totalUang.toLocaleString()}`;
  document.getElementById('rekap-total-kirim').textContent = totalKirim;
}







