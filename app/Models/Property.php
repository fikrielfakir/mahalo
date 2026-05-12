<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Property extends Model
{
    protected $table = 're_properties';

    protected $fillable = [
        'name', 'type', 'description', 'content', 'location', 'images',
        'project_id', 'number_bedroom', 'number_bathroom', 'number_floor',
        'square', 'price', 'is_featured', 'city_id', 'state_id', 'country_id',
        'period', 'status', 'author_id', 'latitude', 'longitude', 'zip_code', 'views',
    ];

    protected $casts = [
        'is_featured' => 'boolean',
        'price'       => 'decimal:2',
        'square'      => 'float',
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

    public function country(): BelongsTo
    {
        return $this->belongsTo(Country::class);
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function agent(): BelongsTo
    {
        return $this->belongsTo(Agent::class, 'author_id');
    }

    public function features(): BelongsToMany
    {
        return $this->belongsToMany(Feature::class, 're_property_features', 'property_id', 'feature_id');
    }

    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class, 're_property_categories', 'property_id', 'category_id');
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class, 'reviewable_id')
            ->where('reviewable_type', 'Botble\\RealEstate\\Models\\Property')
            ->where('status', 'approved');
    }

    public function slug()
    {
        return $this->hasOne(Slug::class, 'reference_id')
            ->where('reference_type', 'Botble\\RealEstate\\Models\\Property');
    }

    public function scopePublished($query)
    {
        return $query->where('status', 'selling');
    }
}
