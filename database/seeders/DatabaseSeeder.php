<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Buat Akun Super Admin
        User::create([
            'name' => 'admin',
            'email' => 'admin@gmail.com',
            'nip' => '00000000',
            'password' => Hash::make('admin'), // Password default admin
            'role' => 'admin',
            'email_verified_at' => now(),
        ]);

        // 2. Buat Akun Guru 1
        User::create([
            'name' => 'Budi Santoso, S.Pd',
            'email' => 'anas@gmail.com',
            'nip' => '198001012005011001',
            'password' => Hash::make('guru123'), // Password default guru
            'role' => 'guru',
            'email_verified_at' => now(),
        ]);

        // 3. Buat Akun Guru 2
        User::create([
            'name' => 'Siti Aminah, M.Pd',
            'email' => 'haidar@gmail.com',
            'nip' => '198502022010012002',
            'password' => Hash::make('guru123'), // Password default guru
            'role' => 'guru',
            'email_verified_at' => now(),
        ]);
    }
}
