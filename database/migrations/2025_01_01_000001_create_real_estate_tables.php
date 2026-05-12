<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('countries', function (Blueprint $table) {
            $table->id();
            $table->string('name', 120);
            $table->string('code', 10)->nullable();
            $table->string('nationality', 120)->nullable();
            $table->string('status', 60)->default('published');
            $table->timestamps();
        });

        Schema::create('states', function (Blueprint $table) {
            $table->id();
            $table->string('name', 120);
            $table->string('slug', 120)->nullable()->unique();
            $table->string('abbreviation', 10)->nullable();
            $table->foreignId('country_id')->nullable();
            $table->tinyInteger('order')->default(0);
            $table->string('status', 60)->default('published');
            $table->timestamps();
        });

        Schema::create('cities', function (Blueprint $table) {
            $table->id();
            $table->string('name', 120);
            $table->string('slug', 120)->nullable()->unique();
            $table->foreignId('state_id')->nullable();
            $table->foreignId('country_id')->nullable();
            $table->tinyInteger('order')->default(0);
            $table->string('image', 255)->nullable();
            $table->tinyInteger('is_default')->unsigned()->default(0);
            $table->string('status', 60)->default('published');
            $table->timestamps();
        });

        Schema::create('slugs', function (Blueprint $table) {
            $table->id();
            $table->string('key');
            $table->unsignedBigInteger('reference_id');
            $table->string('reference_type');
            $table->string('prefix', 120)->default('');
            $table->timestamps();
            $table->index(['reference_id', 'reference_type']);
            $table->index(['key', 'prefix']);
        });

        Schema::create('re_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name', 120);
            $table->text('description')->nullable();
            $table->longText('content')->nullable();
            $table->string('status', 60)->default('published');
            $table->unsignedInteger('order')->default(0);
            $table->tinyInteger('is_default')->default(0);
            $table->unsignedBigInteger('parent_id')->default(0);
            $table->timestamps();
        });

        Schema::create('re_features', function (Blueprint $table) {
            $table->id();
            $table->string('name', 120);
            $table->string('icon', 60)->nullable();
            $table->string('status', 60)->default('published');
        });

        Schema::create('re_facilities', function (Blueprint $table) {
            $table->id();
            $table->string('name', 120);
            $table->string('icon', 60)->nullable();
            $table->string('status', 60)->default('published');
            $table->timestamps();
        });

        Schema::create('re_investors', function (Blueprint $table) {
            $table->id();
            $table->string('name', 120);
            $table->string('description', 400)->nullable();
            $table->string('avatar', 255)->nullable();
            $table->string('status', 60)->default('published');
            $table->timestamps();
        });

        Schema::create('re_accounts', function (Blueprint $table) {
            $table->id();
            $table->string('first_name', 120);
            $table->string('last_name', 120);
            $table->text('description')->nullable();
            $table->string('gender', 20)->nullable();
            $table->string('email', 255)->nullable()->unique();
            $table->string('username', 60)->nullable()->unique();
            $table->string('password');
            $table->unsignedBigInteger('avatar_id')->nullable();
            $table->string('phone', 25)->nullable();
            $table->string('whatsapp', 25)->nullable();
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_verified')->default(false);
            $table->timestamp('verified_at')->nullable();
            $table->unsignedBigInteger('city_id')->nullable();
            $table->rememberToken();
            $table->timestamps();
        });

        Schema::create('re_projects', function (Blueprint $table) {
            $table->id();
            $table->string('name', 300);
            $table->string('description', 400)->nullable();
            $table->longText('content')->nullable();
            $table->text('images')->nullable();
            $table->string('location', 255)->nullable();
            $table->unsignedBigInteger('investor_id')->nullable();
            $table->integer('number_block')->nullable();
            $table->smallInteger('number_floor')->nullable();
            $table->smallInteger('number_flat')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->integer('featured_priority')->default(0);
            $table->decimal('price_from', 15, 0)->nullable();
            $table->decimal('price_to', 15, 0)->nullable();
            $table->unsignedBigInteger('city_id')->nullable();
            $table->unsignedBigInteger('state_id')->nullable();
            $table->unsignedBigInteger('country_id')->default(1);
            $table->string('status', 60)->default('selling');
            $table->unsignedBigInteger('author_id')->nullable();
            $table->string('author_type', 255)->default('Botble\\ACL\\Models\\User');
            $table->string('latitude', 25)->nullable();
            $table->string('longitude', 25)->nullable();
            $table->unsignedInteger('views')->default(0);
            $table->timestamps();
        });

        Schema::create('re_properties', function (Blueprint $table) {
            $table->id();
            $table->string('name', 300);
            $table->string('type', 20)->default('sale');
            $table->string('description', 400)->nullable();
            $table->longText('content')->nullable();
            $table->string('location', 255)->nullable();
            $table->text('images')->nullable();
            $table->unsignedBigInteger('project_id')->default(0);
            $table->decimal('number_bedroom', 8, 1)->default(0);
            $table->decimal('number_bathroom', 8, 1)->default(0);
            $table->integer('number_floor')->nullable();
            $table->double('square')->nullable();
            $table->decimal('price', 15, 2)->nullable();
            $table->boolean('is_featured')->default(false);
            $table->integer('featured_priority')->default(0);
            $table->unsignedBigInteger('city_id')->nullable();
            $table->unsignedBigInteger('state_id')->nullable();
            $table->unsignedBigInteger('country_id')->default(1);
            $table->string('period', 30)->default('month');
            $table->string('status', 60)->default('selling');
            $table->unsignedBigInteger('author_id')->nullable();
            $table->string('author_type', 255)->default('Botble\\ACL\\Models\\User');
            $table->string('moderation_status', 60)->default('pending');
            $table->string('latitude', 25)->nullable();
            $table->string('longitude', 25)->nullable();
            $table->string('zip_code', 20)->nullable();
            $table->unsignedInteger('views')->default(0);
            $table->string('unique_id', 255)->nullable()->unique();
            $table->timestamps();
            $table->index('status');
        });

        Schema::create('re_property_features', function (Blueprint $table) {
            $table->unsignedBigInteger('property_id');
            $table->unsignedBigInteger('feature_id');
            $table->index('property_id');
            $table->index('feature_id');
        });

        Schema::create('re_property_categories', function (Blueprint $table) {
            $table->unsignedBigInteger('property_id');
            $table->unsignedBigInteger('category_id');
            $table->primary(['property_id', 'category_id']);
        });

        Schema::create('re_project_features', function (Blueprint $table) {
            $table->unsignedBigInteger('project_id');
            $table->unsignedBigInteger('feature_id');
            $table->primary(['project_id', 'feature_id']);
        });

        Schema::create('re_project_categories', function (Blueprint $table) {
            $table->unsignedBigInteger('project_id');
            $table->unsignedBigInteger('category_id');
            $table->primary(['project_id', 'category_id']);
        });

        Schema::create('re_reviews', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('account_id');
            $table->string('reviewable_type');
            $table->unsignedBigInteger('reviewable_id');
            $table->tinyInteger('star');
            $table->string('content', 500);
            $table->string('status', 60)->default('approved');
            $table->timestamps();
            $table->index(['reviewable_type', 'reviewable_id']);
        });

        Schema::create('re_consults', function (Blueprint $table) {
            $table->id();
            $table->string('name', 120);
            $table->string('email', 255)->nullable();
            $table->string('phone', 255)->nullable();
            $table->unsignedBigInteger('project_id')->nullable();
            $table->unsignedBigInteger('property_id')->nullable();
            $table->string('ip_address', 39)->nullable();
            $table->longText('content')->nullable();
            $table->text('custom_fields')->nullable();
            $table->string('status', 60)->default('unread');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('re_consults');
        Schema::dropIfExists('re_reviews');
        Schema::dropIfExists('re_project_categories');
        Schema::dropIfExists('re_project_features');
        Schema::dropIfExists('re_property_categories');
        Schema::dropIfExists('re_property_features');
        Schema::dropIfExists('re_properties');
        Schema::dropIfExists('re_projects');
        Schema::dropIfExists('re_accounts');
        Schema::dropIfExists('re_investors');
        Schema::dropIfExists('re_facilities');
        Schema::dropIfExists('re_features');
        Schema::dropIfExists('re_categories');
        Schema::dropIfExists('slugs');
        Schema::dropIfExists('cities');
        Schema::dropIfExists('states');
        Schema::dropIfExists('countries');
    }
};
