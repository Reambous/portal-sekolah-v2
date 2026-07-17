<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        // Jika belum login atau bukan admin, tendang ke halaman 403 (Akses Ditolak)
        if (! Auth::check() || Auth::user()->role !== 'admin') {
            abort(403, 'Akses Ditolak! Halaman ini khusus Administrator Kak Roz.');
        }

        // Jika dia admin, persilakan lewat
        return $next($request);
    }
}
