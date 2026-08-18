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
            'kutipan' => 'Setiap [b]hari[/b] adalah [i]kesempatan[/i] baru.',
            'slider' => [],
        ], ['X-Inertia' => 'true'])
        ->assertSessionHasNoErrors();

    expect(Setting::get('kutipan_dashboard'))->toBe('Setiap [b]hari[/b] adalah [i]kesempatan[/i] baru.');
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

it('menyimpan kutipan lewat permintaan multipart (forceFormData)', function () {
    $user = User::factory()->create([
        'role' => 'admin',
        'password' => Hash::make('admin'),
        'email_verified_at' => now(),
    ]);

    $response = $this->actingAs($user)
        ->call('PUT', '/admin/pengaturan', [
            'kutipan' => 'Salam [b]sehat[/b] dan [i]semangat[/i]!',
        ], [], [], [
            'HTTP_ACCEPT' => 'text/html',
            'CONTENT_TYPE' => 'multipart/form-data',
        ]);

    $response->assertSessionHasNoErrors();

    expect(Setting::get('kutipan_dashboard'))->toBe('Salam [b]sehat[/b] dan [i]semangat[/i]!');
});

it('mengembalikan error kutipan required ketika kosong', function () {
    $user = User::factory()->create([
        'role' => 'admin',
        'password' => Hash::make('admin'),
        'email_verified_at' => now(),
    ]);

    $this->actingAs($user)
        ->put('/admin/pengaturan', [
            'kutipan' => '   ',
            'slider' => [],
        ], ['X-Inertia' => 'true'])
        ->assertSessionHasErrors('kutipan');
});
