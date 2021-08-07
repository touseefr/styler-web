<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;
    public function removeSpaceFromArray($medata) {
        $strip_tag = array();
        foreach ($medata as $cat_id => $cat_assets) {
            foreach ($cat_assets as $asset_id => $asset_info) {
                $strip_tag[$cat_id][trim(strip_tags($asset_id))] = $asset_info;
            }
        }
        return $strip_tag;
    }
}
