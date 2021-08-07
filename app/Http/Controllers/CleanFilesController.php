<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Assets\Assets;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CleanFilesController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $directories = Storage::allDirectories();
        $count = 0;
        $delete_count = 0;
        foreach ($directories as $directory) {
            $files = Storage::files($directory);
            foreach ($files as $key => $value) {
                $file_Info = pathinfo($value);
                $field_status = Assets::where('name', $file_Info['basename'])->count();
                if ($field_status > 0) {
                    $count++;
                } else {
                    $delete_count++;
                    Storage::delete($value);
                }                
            }            
            echo "Number of file exists=" . $count;
            echo "<br />";
            echo "Number of file deleted=" . $delete_count;
            echo "<br />";
            $count = 0;
            $delete_count = 0;
        }

        exit;

    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
