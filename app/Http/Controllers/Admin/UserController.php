<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserController extends Controller
{
    // Menampilkan daftar pengguna
    public function index(Request $request)
    {
        $query = User::latest();

        // Fitur Pencarian Akun
        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->where('name', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%");
        }

        $users = $query->paginate(10)->withQueryString();

        return Inertia::render('admin/users/index', [
            'users' => $users,
            'filters' => $request->only(['search']),
        ]);
    }

    // Menampilkan form tambah akun
    public function create()
    {
        return Inertia::render('admin/users/create');
    }

    // Menyimpan akun baru
    public function store(Request $request)
    {
        // 1. Validasi inputan
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'role' => 'required|in:admin,guru', // Asumsi 'guru' adalah role untuk Guru
            'password' => 'required|string|min:2|confirmed', // Harus ada _confirmation di React
        ], [
            'email.unique' => 'Email ini sudah terdaftar!',
            'password.confirmed' => 'Konfirmasi password tidak cocok!',
        ]);

        // 2. Simpan ke database
        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'role' => $request->role,
            'password' => Hash::make($request->password), // Password diacak (hashing)
        ]);

        // 3. Kembali dengan pesan sukses
        return redirect('/admin/users')->with('success', 'Akun pengguna baru berhasil ditambahkan!');
    }

    // Menampilkan form edit akun
    public function edit($id)
    {
        $user = User::findOrFail($id);

        return Inertia::render('admin/users/edit', [
            'userEdit' => $user, // Menggunakan nama 'userEdit' agar tidak bentrok dengan data user yang sedang login
        ]);
    }

    // Memproses update data akun
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        // 1. Validasi inputan
        // Perhatikan bagian 'unique:users,email,'.$id -> Ini agar emailnya sendiri tidak dianggap duplikat
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,'.$id,
            'role' => 'required|in:admin,guru',
            'password' => 'nullable|string|min:2|confirmed', // nullable = boleh kosong
        ], [
            'email.unique' => 'Email ini sudah dipakai oleh akun lain!',
            'password.confirmed' => 'Konfirmasi password baru tidak cocok!',
        ]);

        // 2. Update data dasar
        $user->name = $request->name;
        $user->email = $request->email;

        // Proteksi: Jangan biarkan admin mengubah role-nya sendiri menjadi user biasa (mencegah terkunci dari sistem)
        if (Auth::id() !== $user->id) {
            $user->role = $request->role;
        }

        // 3. Update password (HANYA JIKA DIISI)
        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        $user->save();

        return redirect('/admin/users')->with('success', 'Data akun berhasil diperbarui!');
    }

    // Menghapus akun
    public function destroy($id)
    {
        $user = User::findOrFail($id);

        // Proteksi: Admin tidak boleh menghapus dirinya sendiri!
        if (Auth::id() === $user->id) {
            return redirect()->back()->with('error', 'Anda tidak bisa menghapus akun Anda sendiri!');
        }

        $user->delete();

        return redirect()->back()->with('success', 'Akun berhasil dihapus permanen.');
    }
}
