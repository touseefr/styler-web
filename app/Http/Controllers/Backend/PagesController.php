<?php namespace App\Http\Controllers\Backend;
use App\Http\Controllers\Controller;
use App\Http\Requests\Backend\Pages\CreatePagesRequest;
use App\Repositories\Backend\Pages\PagesContract;
use Input;
use Validator;
use Image;
use App\Faq;
class PagesController extends Controller {
	/**
	 * [$schoolcolleges description]
	 * @var [type]
	 */
	protected $pages;

	function __construct(PagesContract $pages) {
		$this->pages = $pages;
	}

	/**
	 * @return mixed
	 */
	public function index() {
		return view('backend.pages.index')
			->withpages($this->pages->getpagesPaginated(10, 1));
	}

	/**
	 * @param CreatePagesRequest $request
	 * @return mixed
	 */
	public function create(CreatePagesRequest $request) {
		return view('backend.pages.create');
	}

	/**
	 * @param $id
	 * @param EditSchoolcollegeRequest $request
	 * @return mixed
	 */
	public function edit($id, CreatePagesRequest $request) {
		$pagedetail = $this->pages->findOrThrowException($id);
		return view('backend.pages.edit')
			->withpagedetail($pagedetail);
	}

	/**
	 * @param SaveSchoolcollegeRequest $request
	 * @return mixed
	 */
	public function save(CreatePagesRequest $request) {
		// getting all of the post data
		$this->pages->create($request->all());
		return redirect()->route('backend.pages.index')->withFlashSuccess(trans("labels.pages.created"));
	}

	

	/**
	 * @param SaveSchoolcollegesRequest $request
	 * @return mixed
	 */
	public function update(CreatePagesRequest $request) {
		$this->pages->update($request->id, $request->all());
		return redirect()->route('backend.pages.index')->withFlashSuccess(trans("labels.pages.updated"));
	}

	/**
	 * @param $id
	 * @param PermanentlyDeleteSchoolcolleges $request
	 * @return mixed
	 */
	public function delete($id, CreatePagesRequest $request) {
		$this->pages->delete($id);
		return redirect()->back()->withFlashSuccess(trans("labels.school.deleted"));
	}
	
	/*
	** FAQ
	*/
	
	public function faq(){
		$faqs = Faq::all();
		return view('backend.pages.faq')->with(array('faqs' => $faqs));
	}
	
	/*
	** FAQ Create
	*/
	
	public function faq_create(){
		return view('backend.pages.faq_create');
	}
	
	/*
	** Faq Edit
	*/
	
	public function faq_edit($id){
	
		$faq = Faq::find($id);
		return view('backend.pages.faq_edit')->with(array('faq' => $faq));
	}
	
	/*
	** Faq Save
	*/
	
	public function faq_save(){
		$args = array('category_id' => Input::get('faq_category'), 'question' => Input::get('question'), 'answer' => Input::get('answer'));
		
		if(Faq::create($args)){
			return redirect('admin/pages/faq/create')->with(array('type' => 'success', 'message' => 'Faq created successfully!'));
		}
		else{
			return redirect('admin/pages/faq/create')->with(array('type' => 'error', 'message' => 'Faq could not be created!'));
		}
	}
	
	/*
	** Faq update
	*/
	
	public function faq_update($id){
		echo $id;
		
		print_r(Input::all());
		$faq = Faq::find($id);
		$faq->category_id = Input::get('faq_category');
		$faq->question = Input::get('question');
		$faq->answer = Input::get('answer');
		
		if($faq->save()){
			return redirect('admin/pages/faq/edit/'.$id)->with(array('type' => 'success', 'message' => 'Faq updated successfully!'));
		}
		else{
			return redirect('admin/pages/faq/edit/'.$id)->with(array('type' => 'error', 'message' => 'Faq could not be updated!'));
		}
	}
	
	/*
	** Faq delete
	*/
	
	public function faq_delete($id){
		$faq = Faq::find($id);
		if($faq->delete()){
			return redirect('admin/pages/faq')->with(array('type' => 'success', 'message' => 'Faq deleted successfully!'));
		}
		else{
			return redirect('admin/pages/faq')->with(array('type' => 'error', 'message' => 'Faq could not be deleted!'));
		}
	}

}