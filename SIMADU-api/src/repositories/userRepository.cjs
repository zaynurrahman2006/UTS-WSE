const bcrypt = require('bcryptjs');

// Password di-hash menggunakan bcrypt, tidak pernah disimpan dalam plaintext
const users = [
  {
    id: 'mhs01',
    username: 'mhs01',
    nama: 'Zayn',
    role: 'mahasiswa',
    passwordHash: bcrypt.hashSync('mhs123', 10)
  },
  {
    id: 'mhs02',
    username: 'mhs02',
    nama: 'Budi Santoso',
    role: 'mahasiswa',
    passwordHash: bcrypt.hashSync('mhs123', 10)
  },
  {
    id: 'admin01',
    username: 'admin01',
    nama: 'Administrator SIMADU',
    role: 'admin',
    passwordHash: bcrypt.hashSync('admin123', 10)
  }
];

class UserRepository {
  findByUsername(username) {
    if (!username) return null;
    return users.find(u => u.username.toLowerCase() === username.toLowerCase() || u.id.toLowerCase() === username.toLowerCase()) || null;
  }

  findById(id) {
    if (!id) return null;
    return users.find(u => u.id === id) || null;
  }

  getAll() {
    return users.map(({ passwordHash, ...safeUser }) => safeUser);
  }
}

module.exports = new UserRepository();
