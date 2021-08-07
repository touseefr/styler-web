<?php namespace App\Http\Requests\Backend\Packages;

use App\Http\Requests\Request;

/**
 * Class CreatePackagesRequest
 * @package App\Http\Requests\Backend\Packages\CreatePackagesRequest
 */
class CreatePackagesRequest extends Request {

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