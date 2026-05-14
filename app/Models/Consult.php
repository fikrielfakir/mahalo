<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Consult extends Model
{
    protected $table = 're_consults';

    protected $fillable = [
        'name', 'email', 'phone', 'project_id', 'property_id', 'agent_id',
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
}
