<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MediaFile extends Model
{
    protected $table = 'media_files';

    protected $fillable = [
        'file_name',
        'original_name',
        'path',
        'url',
        'mime_type',
        'size',
        'collection',
        'thumbnail_path',
        'thumbnail_url',
    ];
}
