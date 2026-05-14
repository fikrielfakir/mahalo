<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Review extends Model
{
    protected $table = 're_reviews';

    protected $fillable = ['account_id', 'reviewable_type', 'reviewable_id', 'star', 'content', 'status'];

    public function agent(): BelongsTo
    {
        return $this->belongsTo(Agent::class, 'account_id');
    }
}
