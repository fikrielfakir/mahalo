<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Category extends Model
{
    protected $table = 're_categories';

    protected $fillable = ['name', 'description', 'content', 'status', 'order', 'parent_id'];

    public function properties(): BelongsToMany
    {
        return $this->belongsToMany(Property::class, 're_property_categories', 'category_id', 'property_id');
    }

    public function slug()
    {
        return $this->hasOne(Slug::class, 'reference_id')
            ->where('reference_type', 'Botble\\RealEstate\\Models\\Category');
    }

    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }
}
