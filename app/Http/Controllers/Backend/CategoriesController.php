<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use App\Http\Requests\Backend\Category\CreateCategoryRequest;
use App\Repositories\Frontend\Categories\CategoriesContract;
use App\Http\Requests\Backend\Category\PermanentlyDeleteCategoryRequest;
use Illuminate\Support\Collection;
use Log;

class CategoriesController extends Controller {

    /**
     * [$categories description]
     * @var [type]
     */
    protected $categories;

    function __construct(CategoriesContract $categories) {
        $this->categories = $categories;
    }

    /**
     * @return mixed
     */
    public function index() {
        return view('backend.categories.index')
                        ->withCategories($this->categories->getAllTypes(null));
    }

    /**
     * @return \Illuminate\Http\JsonResponse
     */
    public function all() {        
        $type = \Input::get('type');
        $parent = \Input::get('parent');

        Log::info('Showing categories of ' . $type . 'type. Parent category ' . $parent);
        $categories = collect($this->categories->getAll($type, $parent))->map(function ($category) {
            return array('id' => $category->id, 'text' => $category->name, 'children' => ($category->categories($category->parent)->count() > 0 ? true : false ), 'data' => array('parentCat' => $category->parent, 'type_code' => $category->type_code));
        });
//        $categories=$this->categories->getAll($type, $parent);        
        
        return response()->json($categories, 200);
    }

    /**
     * @param $id
     * @param EditCategoryRequest $request
     * @return mixed
     */
    public function edit($id, CreateCategoryRequest $request) {
        return view('backend.categories.edit')
                        ->withCategorydetail($this->categories->findOrThrowException($id))
                        ->withCategories($this->categories->getMainCategories());
    }

    /**
     * @param SaveCategoryRequest $request
     * @return mixed
     */
    public function save(CreateCategoryRequest $request) {
        $catgeory = $this->categories->create($request->all());
        return response()->json(array('success' => true, 'data' => $catgeory), 200);
    }

    /**
     * @param SaveCategoryRequest $request
     * @return mixed
     */
    public function update(CreateCategoryRequest $request, $id) {
        $this->categories->update($id, $request->all());
        return response()->json(array('success' => true, 'message' => trans("labels.category.updated")), 200);
    }

    /**
     * @param $id
     * @param PermanentlyDeleteCategoryRequest $request
     * @return mixed
     */
    public function delete($id, PermanentlyDeleteCategoryRequest $request) {
        $this->categories->delete($id);
        return response()->json(array('success' => true, 'message' => trans("labels.category.deleted")), 204);
    }

}
