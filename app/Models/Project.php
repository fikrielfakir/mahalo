<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Project extends Model
{
    protected $table = 're_projects';

    protected $fillable = [
        'name', 'description', 'content', 'images', 'location',
        'investor_id', 'number_block', 'number_floor', 'number_flat',
        'is_featured', 'price_from', 'price_to', 'city_id', 'state_id',
        'country_id', 'status', 'author_id', 'latitude', 'longitude', 'views',
    ];

    protected $casts = [
        'is_featured' => 'boolean',
        'price_from'  => 'decimal:2',
        'price_to'    => 'decimal:2',
        'images'      => 'array',
    ];

    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class);
    }

    public function state(): BelongsTo
    {
        return $this->belongsTo(State::class);
    }

    public function investor(): BelongsTo
    {
        return $this->belongsTo(Investor::class);
    }

    public function features(): BelongsToMany
    {
        return $this->belongsToMany(Feature::class, 're_project_features', 'project_id', 'feature_id');
    }

    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class, 're_project_categories', 'project_id', 'category_id');
    }

    public function properties(): HasMany
    {
        return $this->hasMany(Property::class, 'project_id');
    }

    public function slug()
    {
        return $this->hasOne(Slug::class, 'reference_id')
            ->where('reference_type', 'Botble\\RealEstate\\Models\\Project');
    }

    public function scopePublished($query)
    {
        return $query->where('status', 'selling');
    }
}
