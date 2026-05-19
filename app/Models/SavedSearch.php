<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SavedSearch extends Model
{
    protected $fillable = [
        'email',
        'name',
        'description',
        'preferences',
        'last_notified_at',
        'is_active',
    ];

    protected $casts = [
        'preferences'     => 'array',
        'last_notified_at' => 'datetime',
        'is_active'       => 'boolean',
    ];
}
