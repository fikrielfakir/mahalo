<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Consult extends Model
{
    protected $table = 're_consults';

    protected $fillable = [
        'name', 'email', 'phone', 'project_id', 'property_id', 'agent_id', 'user_id',
        'ip_address', 'content', 'custom_fields', 'status',
    ];

    protected $casts = [
        'custom_fields' => 'array',
    ];

    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class, 'property_id');
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class, 'project_id');
    }

    public function agent(): BelongsTo
    {
        return $this->belongsTo(Agent::class, 'agent_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(\App\Models\User::class, 'user_id');
    }

    public function replies(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(ConsultReply::class, 'consult_id')->orderBy('created_at');
    }
}
