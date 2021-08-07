<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Repositories\Frontend\Categories\CategoriesContract;
use Illuminate\Support\Facades\Response;
use Maatwebsite\Excel\Facades\Excel;
use Input;

class CategoriesController extends Controller {

    /**
     * [$categories description]
     * @var [type]
     */
    protected $categories;

    function __construct(CategoriesContract $categories) {
        $this->categories = $categories;
    }

    public function types() {
        return Response::json($this->categories->getAllTypes(null), 200);
    }

    public function index() {
        try {
            $type = Input::get('cat_type', 'classified');
            $parent = Input::get('cat_parent', null);
            if($type == 'businessforsale' || $type == 'deal') {
                $type = 'service';
            }            
            if (!$parent) {                
                $results = $this->categories->getAll($type, $parent);
                $parent = $results[0]->id;
            }            

            $results = $this->categories->getAll($type, $parent);
            //$results = array('type' => $type, 'parent' => $parent);
//			if(!in_array($parent, array(1, 2, 5, 663))){
//				$results[] = array('id' => "", 'name' => 'Other', 'type_code' => $type, 'parent' => $parent);
//			}
            return Response::json($results, 200);
        } catch (\Exception $e) {
            return Response::json(sprintf("Error Getting categories Failed %s", $e->getMessage()), 422);
        }
    }

    public function subcategories() {
        try {
            $type = Input::get('cat_type', 'classified');

            if ($type == 'businessforsale') {
                $type = 'service';
            }

            $results = $this->categories->getAllSubCategories($type);
            return Response::json($results, 200);
        } catch (\Exception $e) {
            return Response::json(sprintf("Error Getting categories Failed %s", $e->getMessage()), 422);
        }
    }

    public function serviceprovidercategories() {
        $ty=Input::get('type');
        try {
            if($ty=='service')
            {
                $type = Input::get('cat_type',$ty);
                $q = Input::get('q', null);
                $except = array();
                if (Input::has('except')) {
                    $except = explode(',', Input::get('except'));
                }
                $results = $this->categories->searchCategoriesByType($q, $type, $except);
                return Response::json($results, 200);
            }
            else{
            $type = Input::get('cat_type', 'distributor');
            $q = Input::get('q', null);
            $except = array();
            if (Input::has('except')) {
                $except = explode(',', Input::get('except'));
            }
            $results = $this->categories->searchCategoriesByType($q, $type, $except);
            return Response::json($results, 200);
        }
        } catch (\Exception $e) {
            return Response::json(sprintf("Error Getting categories Failed %s", $e->getMessage()), 422);
        }
    }

    public function childcategries() {
        try {
            $parent = Input::get('id');
            $results = $this->categories->getAllTypes($parent);
            return Response::json($results, 200);
        } catch (\Exception $e) {
            return Response::json(sprintf("Error Getting categories Failed %s", $e->getMessage()), 422);
        }
    }

    public function insertCategories() {
        $categories = Excel::load("public/assets/categories/Categories.csv")->get()->toArray();
        echo "<pre>";
//        print_r($categories);
        $services = array();
        $subcategoryId = array();
        $count = 1;
        $date = date("Y-m-d H:i:s");
        foreach ($categories[0] as $key => $value) {
            $objCat = new \App\Models\Categories\Categories();
            $objCat->name = $key;
            $objCat->type_code = "service";
            $objCat->parent = "1";
            $objCat->created_at = $date;
            $objCat->updated_at = $date;
            $objCat->save();
            $subcategoryId[$key] = $objCat->id;
        }
        print_r($subcategoryId);
        foreach ($categories as $key => $category) {
            foreach ($category as $index => $cat) {

                if (!empty($cat)) {
                    $services[] = array(
                        "name" => $cat,
                        "type_code" => "service",
                        "parent" => $subcategoryId[$index],
                        "created_at" => $date,
                        "updated_at" => $date,
                    );
                }
            }
        }
        print_r($services);
            \App\Models\Categories\Categories::insert($services);


        exit;
        $category_value = array();
        $date = date("Y-m-d H:i:s");
        foreach ($categories as $index => $cat) {
            $category_Are = \App\Models\Categories\Categories::where('name', $cat)->where('parent', '10')->get();
            if ($category_Are->count() == 0) {
                echo "no present";
                $category_value[] = array(
                    "name" => $cat[0],
                    "type_code" => "service",
                    "parent" => "1",
                    "created_at" => $date,
                    "updated_at" => $date,
                );
            } else {
                
            }
        }
        echo "------------------------------------------------------------------------------------------------------";
        print_r($category_value);
        echo "------------------------------------------------------------------------------------------------------";
        \Illuminate\Support\Facades\DB::table('categories')->insert($category_value);
    }

}
