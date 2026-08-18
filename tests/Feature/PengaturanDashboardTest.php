<?php

use App\Models\Setting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;

uses(RefreshDatabase::class);

it('admin dapat menyimpan kutipan dashboard', function () {
    $user = User::factory()->create([
        'role' => 'admin',
        'password' => Hash::make('admin'),
        'email_verified_at' => now(),
    ]);

    $this->actingAs($user)
        ->put('/admin/pengaturan', [
            'kutipan' => 'Kutipan baru dari test',
            'kutipan_style' => 'italic',
            'slider' => [],
        ], ['X-Inertia' => 'true'])
        ->assertSessionHasNoErrors();

    expect(Setting::get('kutipan_dashboard'))->toBe('Kutipan baru dari test');
});

it('mengembalikan error bila kutipan kosong', function () {
    $user = User::factory()->create([
        'role' => 'admin',
        'password' => Hash::make('admin'),
        'email_verified_at' => now(),
    ]);

    $this->actingAs($user)
        ->put('/admin/pengaturan', [
            'kutipan' => '',
            'slider' => [],
        ], ['X-Inertia' => 'true'])
        ->assertSessionHasErrors('kutipan');
});

it('mengembalikan error bila kutipan_style tidak valid', function () {
    $user = User::factory()->create([
        'role' => 'admin',
        'password' => Hash::make('admin'),
        'email_verified_at' => now(),
    ]);

    $this->actingAs($user)
        ->put('/admin/pengaturan', [
            'kutipan' => 'Kutipan',
            'kutipan_style' => 'hacks',
            'slider' => [],
        ], ['X-Inertia' => 'true'])
        ->assertSessionHasErrors('kutipan_style');
});

it('menyimpan kutipan + style bold-italic', function () {
    $user = User::factory()->create([
        'role' => 'admin',
        'password' => Hash::make('admin'),
        'email_verified_at' => now(),
    ]);

    $this->actingAs($user)
        ->put('/admin/pengaturan', [
            'kutipan' => 'Kutipan setebal besi',
            'kutipan_style' => 'bold-italic',
            'slider' => [],
        ], ['X-Inertia' => 'true'])
        ->assertSessionHasNoErrors();

    expect(Setting::get('kutipan_style'))->toBe('bold-italic');
});
