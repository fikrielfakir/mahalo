<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Facility extends Model
{
    protected $table = 're_facilities';

    protected $fillable = ['name', 'icon', 'status'];

    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }
}
