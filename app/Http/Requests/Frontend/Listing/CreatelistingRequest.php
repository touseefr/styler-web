<?php namespace App\Http\Requests\Frontend\Listing;

use App\Http\Requests\Request;

/**
 * Class CreatelistingRequest
 * @package App\Http\Requests\Frontend\Listing\CreatelistingRequest
 */
class CreatelistingRequest extends Request {

	/**
	 * Determine if the user is authorized to make this request.
	 *
	 * @return bool
	 */
	public function authorize()
	{
		return true;
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