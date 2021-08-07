<?php namespace App\Http\Requests\Frontend\Categories;

use App\Http\Requests\Request;

/**
 * Class CreateCategoryRequest
 * @package App\Http\Requests\Frontend\Categories\CreateCategoryRequest
 */
class CreateCategoryRequest extends Request {

	/**
	 * Determine if the user is authorized to make this request.
	 *
	 * @return bool
	 */
	public function authorize()
	{
		return access()->can('create-users');
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