<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Consult extends Model
{
    protected $table = 're_consults';

    protected $fillable = [
        'name', 'email', 'phone', 'project_id', 'property_id',
        'ip_address', 'content', 'custom_fields', 'status',
    ];

    protected $casts = [
        'custom_fields' => 'array',
    ];
}
