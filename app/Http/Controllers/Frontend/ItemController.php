<?php

namespace App\Http\Controllers\Frontend;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Item;

class ItemController extends Controller
{
    //
    public function getblogs()
    {
       
        dd("get all blogs");
    //    $user_id = Auth::User()->id;
    //     $b=Item::all();
    //   //  dd($b);
    //     if (isset($b) && $b->count() > 0) {
    //         $args = array();
    //         foreach($b as $a){
    //             $args[] = array(
    //                 'id' => $a->id,
    //                 'title' =>  $a->title,
    //                 'des' => $a->description,
    //             );
    //         }
    //     }
    //     //dd("gello");
    //     return response()->json($args, 200);
    }
    public function addblog()
    {
        dd("addblog");
    }
}
