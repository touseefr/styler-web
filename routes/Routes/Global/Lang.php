<?php

/**
 * Sets the specified locale to the session
 */
Route::get('lang/{lang}', function($lang)
{
    session()->put('locale', $lang);
    return redirect()->back();
});