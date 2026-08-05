<?php

namespace App\Http\Controllers;

use App\Concerns\HasNotificationBadges;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    use HasNotificationBadges;

    /**
     * Endpoint ringan untuk polling badge notifikasi (tanpa reload halaman).
     */
    public function count(Request $request)
    {
        return response()->json([
            'badges' => $this->badgesFor($request->user()),
        ]);
    }
}
