<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Slug extends Model
{
    protected $table = 'slugs';

    protected $fillable = ['key', 'reference_id', 'reference_type', 'prefix'];
}
