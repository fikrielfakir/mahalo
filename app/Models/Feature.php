<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Feature extends Model
{
    protected $table = 're_features';

    public $timestamps = false;

    protected $fillable = ['name', 'icon', 'status'];

    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }
}
