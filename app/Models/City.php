<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class City extends Model
{
    protected $table = 'cities';

    protected $fillable = ['name', 'slug', 'state_id', 'country_id', 'order', 'image', 'status'];

    public function properties(): HasMany
    {
        return $this->hasMany(Property::class, 'city_id');
    }
}
