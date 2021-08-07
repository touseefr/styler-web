<?php namespace App\Http\Controllers\Backend;
use App\Http\Controllers\Controller;
use App\Http\Requests\Backend\Schoolcolleges\CreateSchoolcollegesRequest;
use App\Repositories\Backend\Assets\AssetsContract;
use App\Repositories\Backend\Schoolcolleges\SchoolcollegesContract;
use Input;
use Validator;
use Image;

class SchoolcollegesController extends Controller {
	/**
	 * [$schoolcolleges description]
	 * @var [type]
	 */
	protected $schoolcolleges;

	function __construct(SchoolcollegesContract $schoolcolleges, AssetsContract $assets) {
		$this->schoolcolleges = $schoolcolleges;
		$this->assets = $assets;
	}

	/**
	 * @return mixed
	 */
	public function index() {
		return view('backend.schoolcolleges.index')
			->withSchoolcolleges($this->schoolcolleges->getschoolcollegesPaginated(10, 1));
	}

	/**
	 * @param CreateSchoolcollegesRequest $request
	 * @return mixed
	 */
	public function create(CreateSchoolcollegesRequest $request) {
		return view('backend.schoolcolleges.create');
	}

	/**
	 * @param $id
	 * @param EditSchoolcollegeRequest $request
	 * @return mixed
	 */
	public function edit($id, CreateSchoolcollegesRequest $request) {
		$schoolcollegedetail = $this->schoolcolleges->findOrThrowException($id);
		return view('backend.schoolcolleges.edit')
			->withSchoolcollegesdetail($schoolcollegedetail)
			->withSchoolcollegescategories($this->schoolcolleges->getAllSchoolcollegesCategories($schoolcollegedetail->type));
	}

	/**
	 * @param SaveSchoolcollegeRequest $request
	 * @return mixed
	 */
	public function save(CreateSchoolcollegesRequest $request) {
		// getting all of the post data
		
		$this->schoolcolleges->create($request->all());
		
		$record = trans("labels.school.school");
		if ($request['schooltype']) {
			$record = trans("labels.school.college");
		}
		return redirect()->route('backend.schoolcolleges.index')->withFlashSuccess($record.trans("labels.school.created"));
	}

	/**
	* upload image
	*/

	public function uploadImage($file){

			$image = array('image' => $file);
			// setting up rules
			$rules = array('mimes' => 'bmp,png'); //mimes:jpeg,bmp,png and for max size max:10000
			// doing the validation, passing post data, rules and the messages
			$validator = Validator::make($image, $rules);
			if ($validator->fails()) {
				return redirect()->route('backend.schoolcolleges.index')->withFlashSuccess('Invalid image format');
			} else {
				// checking file is valid.
				if ($file) {
					$destinationPath = 'assets/schoolcolleges/'; // upload path
					$extension = $file->getClientOriginalExtension(); // getting image extension
					$fileName = rand(11111, 99999) . '.' . $extension; // renameing image
					$img = Image::make($_FILES['schoolimage']['tmp_name'])->save($destinationPath.$fileName);
					$input = array("name" => $fileName, "path" => $destinationPath, "ext" => $extension);
					return $input;
				}
			}
	}

	/**
	 * @param SaveSchoolcollegesRequest $request
	 * @return mixed
	 */
	public function update(CreateSchoolcollegesRequest $request) {
		
		$assetId = NULL;
		if (Input::file('schoolimage')) {
			$input = self::uploadImage(Input::file('schoolimage'));
			$asset = $this->assets->create($input);
			$assetId = $asset->id;
		}
		$this->schoolcolleges->update($assetId,$request->id, $request->all());
		$record =trans("labels.school.school");
		if ($request['schooltype']) {
			$record = trans("labels.school.college");
		}
		return redirect()->route('backend.schoolcolleges.index')->withFlashSuccess($record.trans("labels.school.updated"));
	}

	/**
	 * @param $id
	 * @param PermanentlyDeleteSchoolcolleges $request
	 * @return mixed
	 */
	public function delete($id, CreateSchoolcollegesRequest $request) {
		$this->schoolcolleges->delete($id);
		return redirect()->back()->withFlashSuccess(trans("labels.school.deleted"));
	}

}