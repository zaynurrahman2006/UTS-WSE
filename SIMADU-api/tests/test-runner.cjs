const http = require('http');
const app = require('../app.cjs');

const BASE_URL = 'http://localhost:3000';
let server;

async function startServer() {
  return new Promise((resolve) => {
    server = app.listen(3000, () => {
      resolve();
    });
  });
}

function stopServer() {
  if (server) {
    server.close();
  }
}

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  const response = await fetch(url, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  let data;
  try {
    data = await response.json();
  } catch (e) {
    data = null;
  }

  return {
    status: response.status,
    data
  };
}

async function runTests() {
  console.log('================================================================');
  console.log(' PENGUJIAN 12 SKENARIO SIMADU REST API (UTS WSE 2026)');
  console.log('================================================================\n');

  await startServer();

  let tokenMhs1 = '';
  let tokenMhs2 = '';
  let tokenAdmin = '';
  let createdPengaduanId = null;

  const results = [];

  async function testScenario(no, description, expectedStatus, testFn) {
    try {
      const res = await testFn();
      const passed = res.status === expectedStatus;
      results.push({
        no,
        description,
        expectedStatus,
        actualStatus: res.status,
        passed,
        response: res.data
      });

      const mark = passed ? '[PASS]' : '[FAIL]';
      console.log(`${mark} Skenario ${no}: ${description}`);
      console.log(`       Ekspektasi: ${expectedStatus} | Aktual: ${res.status}`);
      if (!passed) {
        console.log(`       Respons: ${JSON.stringify(res.data)}`);
      }
    } catch (err) {
      results.push({
        no,
        description,
        expectedStatus,
        actualStatus: 'ERROR',
        passed: false,
        error: err.message
      });
      console.log(`[FAIL] Skenario ${no}: ${description} -> Error: ${err.message}`);
    }
  }

  // 1. Login dengan kredensial benar -> 200, token diterima
  await testScenario(1, 'Login dengan kredensial benar', 200, async () => {
    const res = await request('/api/auth/login', {
      method: 'POST',
      body: { username: 'mhs01', password: 'mhs123' }
    });
    if (res.status === 200 && res.data?.token) {
      tokenMhs1 = res.data.token;
    }
    return res;
  });

  // Siapkan juga token untuk mhs02 dan admin
  const resMhs2 = await request('/api/auth/login', {
    method: 'POST',
    body: { username: 'mhs02', password: 'mhs123' }
  });
  if (resMhs2.status === 200) tokenMhs2 = resMhs2.data.token;

  const resAdmin = await request('/api/auth/login', {
    method: 'POST',
    body: { username: 'admin01', password: 'admin123' }
  });
  if (resAdmin.status === 200) tokenAdmin = resAdmin.data.token;

  // 2. Login dengan password salah -> 401
  await testScenario(2, 'Login dengan password salah', 401, async () => {
    return request('/api/auth/login', {
      method: 'POST',
      body: { username: 'mhs01', password: 'wrongpassword' }
    });
  });

  // 3. Akses endpoint terlindungi tanpa token -> 401
  await testScenario(3, 'Akses endpoint terlindungi tanpa token', 401, async () => {
    return request('/api/pengaduan');
  });

  // 4. Akses menggunakan token tidak valid -> 401
  await testScenario(4, 'Akses menggunakan token tidak valid', 401, async () => {
    return request('/api/pengaduan', {
      headers: { Authorization: 'Bearer tokensembatangan123.yang.salah' }
    });
  });

  // 5. Mahasiswa membuat pengaduan valid -> 201
  await testScenario(5, 'Mahasiswa membuat pengaduan valid', 201, async () => {
    const res = await request('/api/pengaduan', {
      method: 'POST',
      headers: { Authorization: `Bearer ${tokenMhs1}` },
      body: {
        judul: 'Proyektor Lab Multimedia Mati Total',
        kategori: 'TI',
        deskripsi: 'Lampu indikator berkedip merah dan tidak memproyeksikan layar presentasi saat mata kuliah WSE.'
      }
    });
    if (res.status === 201 && res.data?.data?.id) {
      createdPengaduanId = res.data.data.id;
    }
    return res;
  });

  // 6. Mahasiswa membaca pengaduan sendiri -> 200
  await testScenario(6, 'Mahasiswa membaca pengaduan sendiri', 200, async () => {
    // ID 1 dimiliki oleh mhs01
    return request('/api/pengaduan/1', {
      headers: { Authorization: `Bearer ${tokenMhs1}` }
    });
  });

  // 7. Mahasiswa mencoba membaca pengaduan orang lain -> 403
  await testScenario(7, 'Mahasiswa mencoba membaca pengaduan orang lain', 403, async () => {
    // ID 2 dimiliki oleh mhs02, mhs01 mencoba mengakses
    return request('/api/pengaduan/2', {
      headers: { Authorization: `Bearer ${tokenMhs1}` }
    });
  });

  // 8. Mahasiswa mengubah status pengaduan -> 403
  await testScenario(8, 'Mahasiswa mengubah status pengaduan', 403, async () => {
    return request('/api/pengaduan/1/status', {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${tokenMhs1}` },
      body: { status: 'selesai' }
    });
  });

  // 9. Admin melihat seluruh pengaduan -> 200
  await testScenario(9, 'Admin melihat seluruh pengaduan', 200, async () => {
    return request('/api/pengaduan', {
      headers: { Authorization: `Bearer ${tokenAdmin}` }
    });
  });

  // 10. Admin memperbarui status pengaduan -> 200
  await testScenario(10, 'Admin memperbarui status pengaduan', 200, async () => {
    return request('/api/pengaduan/1/status', {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${tokenAdmin}` },
      body: { status: 'diproses' }
    });
  });

  // 11. Membuat pengaduan dengan field wajib kosong -> 400
  await testScenario(11, 'Membuat pengaduan dengan field wajib kosong', 400, async () => {
    return request('/api/pengaduan', {
      method: 'POST',
      headers: { Authorization: `Bearer ${tokenMhs1}` },
      body: {
        judul: '',
        kategori: 'Fasilitas',
        deskripsi: ''
      }
    });
  });

  // 12. Mengakses ID pengaduan yang tidak ditemukan -> 404
  await testScenario(12, 'Mengakses ID pengaduan yang tidak ditemukan', 404, async () => {
    return request('/api/pengaduan/999999', {
      headers: { Authorization: `Bearer ${tokenMhs1}` }
    });
  });

  stopServer();

  console.log('\n================================================================');
  const allPassed = results.every(r => r.passed);
  console.log(`TOTAL SKENARIO: ${results.length} | LULUS: ${results.filter(r => r.passed).length} | GAGAL: ${results.filter(r => !r.passed).length}`);
  console.log('================================================================\n');

  if (allPassed) {
    console.log('Semua 12 skenario berhasil lulus 100%!');
    process.exit(0);
  } else {
    console.error('Terdapat skenario yang gagal.');
    process.exit(1);
  }
}

runTests();
