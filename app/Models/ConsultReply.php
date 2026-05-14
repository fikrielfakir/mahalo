<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ConsultReply extends Model
{
    protected $table = 'consult_replies';

    protected $fillable = ['consult_id', 'body', 'sender'];

    public function consult(): BelongsTo
    {
        return $this->belongsTo(Consult::class, 'consult_id');
    }
}
