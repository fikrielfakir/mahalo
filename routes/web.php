<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json(['status' => 'Homzen Real Estate API', 'version' => '1.0']);
});
