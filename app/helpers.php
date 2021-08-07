<?php

/**
 * Global helpers file with misc functions
 * */
if (!function_exists('app_name')) {

    /**
     * Helper to grab the application name
     *
     * @return mixed
     */
    function app_name()
    {
        return config('app.name');
    }
}

if (!function_exists('access')) {

    /**
     * Access (lol) the Access:: facade as a simple function
     */
    function access()
    {
        return app('access');
    }
}

if (!function_exists('javascript')) {

    /**
     * Access the javascript helper
     */
    function javascript()
    {
        return app('JavaScript');
    }
}

if (!function_exists('gravatar')) {

    /**
     * Access the gravatar helper
     */
    function gravatar()
    {
        return app('gravatar');
    }
}

function urlHelper($url)
{
    $new_url = '';
    $url_check = parse_url($url);
    if (!isset($url_check['scheme'])) {
        $new_url = 'http://' . $url;
    } else {
        $new_url = $url;
    }
    return $new_url;
}

function validatePhoneNumberWithCountry($phoneNumber, $countryCode)
{
    $data = "";
    try {
        $phoneNumberUtil = \libphonenumber\PhoneNumberUtil::getInstance();
        $phoneNumber = $phoneNumberUtil->parse($phoneNumber, $countryCode, null, true);
        $possibleNumber = $phoneNumberUtil->isValidNumber($phoneNumber);
        $validNumberForRegion = $phoneNumberUtil->isValidNumberForRegion($phoneNumber, $countryCode);
        if ($possibleNumber && $validNumberForRegion) {
            $data = substr($phoneNumberUtil->format($phoneNumber, \libphonenumber\PhoneNumberFormat::E164), 1);
        }
    } catch (\Exception  $e) {
        $data = "";
    }
    return $data;
}
function validatePhoneNumberWithCountryList($phoneNumber)
{
    $countryCodeList = ['AU'];
    $data = "";
    foreach ($countryCodeList as $key => $countryCode) {
        try {
            $data = validatePhoneNumberWithCountry($phoneNumber, $countryCode);
            if ($data != "") {
                break;
            }
        } catch (\Exception  $e) {
            continue;
        }
    }
    return $data;
}
