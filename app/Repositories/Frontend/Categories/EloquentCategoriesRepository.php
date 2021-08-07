<?php

namespace App\Repositories\Frontend\Categories;

use App\Exceptions\GeneralException;
use App\Models\Categories\Categories;
use App\Repositories\Frontend\Categories\CategoriesContract;

/**
 * Class EloquentCategoriesRepository
 * @package App\Repositories\Categories
 */
class EloquentCategoriesRepository implements CategoriesContract {

    /**
     * [__construct description]
     * @author Mohan Singh <mslogicmaster@gmail.com>
     */
    public function __construct() {
        
    }

    /**
     * @param $id
     * @param bool $withRoles
     * @return mixed
     * @throws GeneralException
     */
    public function findOrThrowException($id) {

        $categry = Categories::withTrashed()->find($id);
        if (!is_null($categry)) {
            return $categry;
        }

        throw new GeneralException('That category does not exist.');
    }

    /**
     * @param string $order_by
     * @param string $sort
     * @return mixed
     */
    public function getcategoriesByType($type, $parent='', $order_by = 'id', $sort = 'asc') {
        $categories = Categories::where('type_code', '=', $type);
        if (!empty($parent)) {
            $categories->where('parent', '=', $parent);
        }
        $categories->where('id', '!=', '1');
        $categories->groupBy('name');
        return $categories->orderBy($order_by, $sort)
                        ->get();
    }

    /**
     * @param string $order_by
     * @param string $sort
     * @return mixed
     */
    public function searchCategoriesByType($q, $type, $except, $order_by = 'id', $sort = 'asc') {

        return Categories::where('type_code', '=', $type)
                        ->where('name', 'Like', "%{$q}%")
                        ->whereNotIn('id', $except)
                        ->orderBy($order_by, $sort)
                        ->groupBy('name')        
                        ->get();
    }

    /**
     * @param string $order_by
     * @param string $sort
     * @return mixed
     */
    public function getAllCategories($order_by = 'id', $sort = 'asc') {
        return Categories::orderBy($order_by, $sort)->get();
    }

    public function getAll($type, $parent) {
        return Categories::ofType($type)->children($parent)->get();
    }

    public function getAllSubCategories($type) {
        return Categories::ofType($type)->whereNotNull('parent')->get();
    }

    public function getAllTypes($parent) {
        return Categories::children($parent)->get();
    }

    /**
     * @param $input
     * @param $roles
     * @param $permissions
     * @return bool
     * @throws GeneralException
     * @throws UserNeedsRolesException
     */
    public function create($input) {
        //echo $input['updatedid']; die;
        if (isset($input['updatedid'])) {
            $category = $this->findOrThrowException($input['updatedid']);
        } else {
            $category = new Categories();
        }
        $category->type_code = $input['categorytype'];
        $category->name = $input['categoryname'];
        if (isset($input['parent']) && $input['parent'] != '0') {
            $category->parent = $input['parent'];
        }
        $category->save();
        return $category;
        //throw new GeneralException('There was a problem creating this category. Please try again.');
    }

    /**
     * @param $id
     * @param $input
     * @param $roles
     * @return bool
     * @throws GeneralException
     */
    public function update($id, $input) {
        $category = $this->findOrThrowException($id);
        $category->name = $input['categoryname'];
        $category->type_code = $input['categorytype'];
        $category->parent = NULL;
        if (isset($input['parent']) && $input['parent'] != '0') {
            $category->parent = $input['parent'];
        }
        $category->save();
        return $category;

        throw new GeneralException('There was a problem updating this user. Please try again.');
    }

    /**
     * @param $id
     * @return boolean|null
     * @throws GeneralException
     */
    public function delete($id) {
        $category = $this->findOrThrowException($id, true);
        try {
            $category->forceDelete();
            die($id);
        } catch (\Exception $e) {
            die($e->getMessage());

            throw new GeneralException($e->getMessage());
        }
    }

    /**
     * @param $id
     * @return bool
     * @throws GeneralException
     */
    public function restore($id) {
        $user = $this->findOrThrowException($id);

        if ($user->restore()) {
            return true;
        }

        throw new GeneralException("There was a problem restoring this user. Please try again.");
    }

}
