<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PageView extends Model
{
    protected $fillable = [
        'session_id',
        'ip_address',
        'page',
        'referrer',
        'country',
        'country_code',
        'city',
        'device_type',
        'browser',
        'os',
        'user_agent',
        'is_bot',
    ];

    protected $casts = [
        'is_bot' => 'boolean',
    ];
}
