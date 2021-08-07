<?php namespace App\Http\Requests\Backend\Schoolcolleges;

use App\Http\Requests\Request;

/**
 * Class CreateSchoolcollegesRequest
 * @package App\Http\Requests\Backend\Schoolcolleges\CreateSchoolcollegesRequest
 */
class CreateSchoolcollegesRequest extends Request {

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