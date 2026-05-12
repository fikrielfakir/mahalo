<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Agent extends Model
{
    protected $table = 're_accounts';

    protected $hidden = ['password', 'remember_token'];

    protected $fillable = [
        'first_name', 'last_name', 'description', 'gender', 'email',
        'username', 'password', 'avatar_id', 'phone', 'whatsapp',
        'is_featured', 'is_verified', 'verified_at', 'city_id',
        'credits', 'package_id', 'package_started_at', 'package_ended_at',
    ];

    protected $casts = [
        'is_featured' => 'boolean',
        'is_verified' => 'boolean',
    ];

    public function getNameAttribute(): string
    {
        return trim($this->first_name . ' ' . $this->last_name);
    }

    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class, 'city_id');
    }

    public function properties(): HasMany
    {
        return $this->hasMany(Property::class, 'author_id');
    }

    public function projects(): HasMany
    {
        return $this->hasMany(Project::class, 'author_id');
    }
}
