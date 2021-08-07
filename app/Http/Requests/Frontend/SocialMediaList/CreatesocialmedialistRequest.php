<?php namespace App\Http\Requests\Frontend\SocialMediaList;

use App\Http\Requests\Request;

/**
 * Class CreatesocialmedialistRequest
 * @package App\Http\Requests\Frontend\SocialMediaList\CreatesocialmedialistRequest
 */
class CreatesocialmedialistRequest extends Request {

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