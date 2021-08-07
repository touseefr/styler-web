<?php namespace App\Http\Requests\Backend\Category;

use App\Http\Requests\Request;

/**
 * Class PermanentlyDeleteCategoryRequest
 * @package App\Http\Requests\Backend\Access\Category
 */
class PermanentlyDeleteCategoryRequest extends Request {

    /**
     * Determine if the Category is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return access()->can('delete-category');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            //
        ];
    }
}