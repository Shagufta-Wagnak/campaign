<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ApiController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/campaigndata', [ApiController::class, 'getCampaignData']);
Route::post('/postcampaigndata', [ApiController::class, 'postCampaignData']);


Route::get('/env', function () {
    return response()->json([
        'APP_URL' => env('APP_URL'),
        'APP_ENV' => env('APP_ENV'),
        // Add other environment variables you want to expose
    ]);
});

