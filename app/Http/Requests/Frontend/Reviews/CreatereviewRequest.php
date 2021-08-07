<?php namespace App\Http\Requests\Frontend\Reviews;

use App\Http\Requests\Request;

/**
 * Class CreatereviewRequest
 * @package App\Http\Requests\Frontend\Reviews\CreatereviewRequest
 */
class CreatereviewRequest extends Request {

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