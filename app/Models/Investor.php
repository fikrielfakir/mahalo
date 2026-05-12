<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Investor extends Model
{
    protected $table = 're_investors';

    protected $fillable = ['name', 'status', 'logo', 'website'];

    public function projects(): HasMany
    {
        return $this->hasMany(Project::class, 'investor_id');
    }
}
