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
            $table->tinyInteger('order')->default(0);
            $table->string('image', 255)->nullable();
            $table->tinyInteger('is_default')->unsigned()->default(0);
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
            $table->string('image', 255)->nullable();
            $table->tinyInteger('is_default')->unsigned()->default(0);
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

        Schema::create('re_currencies', function (Blueprint $table) {
            $table->id();
            $table->string('title', 120);
            $table->string('symbol', 10);
            $table->boolean('is_prefix_symbol')->default(true);
            $table->string('decimals', 10)->nullable();
            $table->boolean('is_default')->default(false);
            $table->string('order', 10)->nullable();
            $table->string('exchange_rate', 20)->nullable();
            $table->timestamps();
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

        Schema::create('re_facilities_distances', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('reference_id');
            $table->string('reference_type');
            $table->unsignedBigInteger('facility_id');
            $table->string('distance', 30)->nullable();
            $table->index(['reference_type', 'reference_id']);
        });

        Schema::create('re_investors', function (Blueprint $table) {
            $table->id();
            $table->string('name', 120);
            $table->string('status', 60)->default('published');
            $table->timestamps();
            $table->string('logo', 255)->nullable();
            $table->string('website', 255)->nullable();
        });

        Schema::create('re_packages', function (Blueprint $table) {
            $table->id();
            $table->string('name', 120);
            $table->double('price')->unsigned();
            $table->unsignedBigInteger('currency_id');
            $table->unsignedInteger('percent_save')->default(0);
            $table->unsignedInteger('number_of_listings');
            $table->unsignedInteger('account_limit')->nullable();
            $table->tinyInteger('order')->default(0);
            $table->tinyInteger('is_default')->unsigned()->default(0);
            $table->string('status', 60)->default('published');
            $table->string('description', 400)->nullable();
            $table->text('features')->nullable();
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
            $table->unsignedBigInteger('credits')->default(0);
            $table->unsignedBigInteger('package_id')->nullable();
            $table->timestamp('package_started_at')->nullable();
            $table->timestamp('package_ended_at')->nullable();
            $table->rememberToken();
            $table->timestamps();
        });

        Schema::create('re_projects', function (Blueprint $table) {
            $table->id();
            $table->string('name', 300);
            $table->string('description', 400)->nullable();
            $table->longText('content')->nullable();
            $table->text('images')->nullable();
            $table->longText('floor_plans')->nullable();
            $table->string('location', 255)->nullable();
            $table->unsignedBigInteger('investor_id')->nullable();
            $table->integer('number_block')->nullable();
            $table->smallInteger('number_floor')->nullable();
            $table->smallInteger('number_flat')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->integer('featured_priority')->default(0);
            $table->date('date_finish')->nullable();
            $table->date('date_sell')->nullable();
            $table->decimal('price_from', 15, 0)->nullable();
            $table->decimal('price_to', 15, 0)->nullable();
            $table->unsignedBigInteger('currency_id')->nullable();
            $table->unsignedBigInteger('city_id')->nullable();
            $table->unsignedBigInteger('state_id')->nullable();
            $table->unsignedBigInteger('country_id')->default(1);
            $table->string('status', 60)->default('selling');
            $table->unsignedBigInteger('author_id')->nullable();
            $table->string('author_type', 255)->default('Botble\\ACL\\Models\\User');
            $table->string('latitude', 25)->nullable();
            $table->string('longitude', 25)->nullable();
            $table->string('zip_code', 20)->nullable();
            $table->unsignedInteger('views')->default(0);
            $table->string('unique_id', 255)->nullable()->unique();
            $table->text('private_notes')->nullable();
            $table->timestamps();
            $table->index('status');
        });

        Schema::create('re_properties', function (Blueprint $table) {
            $table->id();
            $table->string('name', 300);
            $table->string('type', 20)->default('sale');
            $table->string('description', 400)->nullable();
            $table->longText('content')->nullable();
            $table->string('location', 255)->nullable();
            $table->text('images')->nullable();
            $table->longText('floor_plans')->nullable();
            $table->unsignedBigInteger('project_id')->default(0);
            $table->decimal('number_bedroom', 8, 1)->default(0);
            $table->decimal('number_bathroom', 8, 1)->default(0);
            $table->integer('number_floor')->nullable();
            $table->double('square')->nullable();
            $table->decimal('price', 15, 2)->nullable();
            $table->unsignedBigInteger('currency_id')->nullable();
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
            $table->string('reject_reason', 400)->nullable();
            $table->date('expire_date')->nullable();
            $table->boolean('auto_renew')->default(false);
            $table->boolean('never_expired')->default(false);
            $table->string('latitude', 25)->nullable();
            $table->string('longitude', 25)->nullable();
            $table->string('zip_code', 20)->nullable();
            $table->unsignedInteger('views')->default(0);
            $table->string('unique_id', 255)->nullable()->unique();
            $table->text('private_notes')->nullable();
            $table->timestamps();
            $table->index('status');
            $table->index('moderation_status');
            $table->index('type');
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

        Schema::create('testimonials', function (Blueprint $table) {
            $table->id();
            $table->string('name', 120);
            $table->text('content');
            $table->string('image', 255)->nullable();
            $table->string('company', 120)->nullable();
            $table->string('status', 60)->default('published');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('testimonials');
        Schema::dropIfExists('re_consults');
        Schema::dropIfExists('re_reviews');
        Schema::dropIfExists('re_project_categories');
        Schema::dropIfExists('re_project_features');
        Schema::dropIfExists('re_property_categories');
        Schema::dropIfExists('re_property_features');
        Schema::dropIfExists('re_properties');
        Schema::dropIfExists('re_projects');
        Schema::dropIfExists('re_accounts');
        Schema::dropIfExists('re_packages');
        Schema::dropIfExists('re_investors');
        Schema::dropIfExists('re_facilities_distances');
        Schema::dropIfExists('re_facilities');
        Schema::dropIfExists('re_features');
        Schema::dropIfExists('re_categories');
        Schema::dropIfExists('re_currencies');
        Schema::dropIfExists('slugs');
        Schema::dropIfExists('cities');
        Schema::dropIfExists('states');
        Schema::dropIfExists('countries');
    }
};
