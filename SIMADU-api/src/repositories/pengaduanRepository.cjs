// In-memory data store pengaduan dengan data awal minimal dua mahasiswa
let pengaduanStore = [
  {
    id: 1,
    mahasiswaId: 'mhs01',
    judul: 'AC Ruang TI-201 Rusak',
    kategori: 'Fasilitas',
    deskripsi: 'AC mengeluarkan udara panas dan berisik saat perkuliahan berlangsung.',
    status: 'diajukan',
    createdAt: '2026-11-20T08:00:00.000Z'
  },
  {
    id: 2,
    mahasiswaId: 'mhs02',
    judul: 'KRS Online Mengalami Galat',
    kategori: 'Akademik',
    deskripsi: 'Tidak dapat menyimpan mata kuliah pilihan saat pengisian KRS semester genap.',
    status: 'diproses',
    createdAt: '2026-11-21T09:30:00.000Z'
  }
];

let nextId = 3;

class PengaduanRepository {
  getAll() {
    return [...pengaduanStore];
  }

  getByMahasiswaId(mahasiswaId) {
    return pengaduanStore.filter(item => item.mahasiswaId === mahasiswaId);
  }

  getById(id) {
    const numericId = Number(id);
    return pengaduanStore.find(item => item.id === numericId) || null;
  }

  create({ mahasiswaId, judul, kategori, deskripsi }) {
    const newPengaduan = {
      id: nextId++,
      mahasiswaId,
      judul,
      kategori,
      deskripsi,
      status: 'diajukan',
      createdAt: new Date().toISOString()
    };
    pengaduanStore.push(newPengaduan);
    return { ...newPengaduan };
  }

  update(id, { judul, kategori, deskripsi }) {
    const numericId = Number(id);
    const index = pengaduanStore.findIndex(item => item.id === numericId);
    if (index === -1) return null;

    pengaduanStore[index] = {
      ...pengaduanStore[index],
      judul: judul !== undefined ? judul : pengaduanStore[index].judul,
      kategori: kategori !== undefined ? kategori : pengaduanStore[index].kategori,
      deskripsi: deskripsi !== undefined ? deskripsi : pengaduanStore[index].deskripsi
    };

    return { ...pengaduanStore[index] };
  }

  updateStatus(id, newStatus) {
    const numericId = Number(id);
    const index = pengaduanStore.findIndex(item => item.id === numericId);
    if (index === -1) return null;

    pengaduanStore[index] = {
      ...pengaduanStore[index],
      status: newStatus
    };

    return { ...pengaduanStore[index] };
  }

  delete(id) {
    const numericId = Number(id);
    const index = pengaduanStore.findIndex(item => item.id === numericId);
    if (index === -1) return false;

    pengaduanStore.splice(index, 1);
    return true;
  }

  reset() {
    pengaduanStore = [
      {
        id: 1,
        mahasiswaId: 'mhs01',
        judul: 'AC Ruang TI-201 Rusak',
        kategori: 'Fasilitas',
        deskripsi: 'AC mengeluarkan udara panas dan berisik saat perkuliahan berlangsung.',
        status: 'diajukan',
        createdAt: '2026-11-20T08:00:00.000Z'
      },
      {
        id: 2,
        mahasiswaId: 'mhs02',
        judul: 'KRS Online Mengalami Galat',
        kategori: 'Akademik',
        deskripsi: 'Tidak dapat menyimpan mata kuliah pilihan saat pengisian KRS semester genap.',
        status: 'diproses',
        createdAt: '2026-11-21T09:30:00.000Z'
      }
    ];
    nextId = 3;
  }
}

module.exports = new PengaduanRepository();
