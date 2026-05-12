<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Investor extends Model
{
    protected $table = 're_investors';

    protected $fillable = ['name', 'description', 'avatar', 'status'];
}
