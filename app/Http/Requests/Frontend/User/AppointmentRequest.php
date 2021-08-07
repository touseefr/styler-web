<?php namespace App\Http\Requests\Frontend\User;

use App\Http\Requests\Request;

/**
 * Class GetProfileRequest
 * @package App\Http\Requests\Frontend\User
 */
class AppointmentRequest extends Request {

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
			
		];
	}
}