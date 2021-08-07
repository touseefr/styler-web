@extends('backend.layouts.master')
@section('page-header')
@if (isset($postid) && !empty($postid))
<h1>Edit a Post</h1>
@else
<h1>Add a new Post</h1>
@endif
<div class="content-toolbox">
    <ul id="toolbar-nav" class="nav nav-pills pull-right" style="margin:0">
        <li>
            <a class="toolbar_btn" title="Faqs" href="{{url('admin/blog')}}">
                <i class="fa  fa-tags tool-icon"></i>
                <div>Posts</div>
            </a>
        </li>
        @if(isset($postid) &&  empty($postid))
        <li>
            <a href="" class="toolbar_btn" title="Create New Faq">
                <i class="fa fa-plus tool-icon"></i>
                <div>Add New Post</div>
            </a>            
        </li>   
        @endif
    </ul>
</div>
@endsection

@section ('breadcrumbs')
<li><a href="{{route('backend.dashboard')}}"><i class="fa fa-dashboard"></i> {{ trans('menus.dashboard') }}</a></li>
<li class="active"> 
    @if (isset($postid) && $postid > 0)

    Edit a Post
    @else
    Add a new Post
    @endif
</li>
@stop
<?php
$post_url = '/admin/blog/post/create';
if (isset($postid) && !empty($postid)) {
    $post_url = 'admin/blog/post/edit';
}
?>
@section('content')
{{ Form::open(array('class' => 'form-horizontal', 'files' => 'true', 'url' => $post_url)) }}
<div class="form-group">
    <label class="col-sm-2 control-label" for="title">Title</label>
    <div class="col-sm-10">
        <input type="text" class="form-control" name="title" id="title" value='<?php echo isset($post->title) ? $post->title : ''; ?>'/>
    </div>
</div>

<div class="form-group">
    <label class="col-sm-2 control-label" for="slug">Slug</label>
    <div class="col-sm-10">
        <input type="text" class="form-control" id="slug" name="slug" value='<?php echo isset($post->slug) ? $post->slug : ''; ?>' />
    </div>
</div>
<div class="form-group">
    <label class="col-sm-2 control-label" for="chapo">Category</label>
    <div class="col-sm-10">      
        <select name="cat_id" class="form-control">
            <option value="">Select Category</option>
            <?php
            if (count($categories->toArray()) > 0) {
                foreach ($categories->toArray() as $category) {
                    ?>
                    <option value="<?php echo $category['id'] ?>" <?php echo (isset($post) && ($category['id'] == $post->category_id)) ? 'selected="selected"' : ""; ?>><?php echo $category['name'] ?></option>
                    <?php
                }
            }
            ?>
        </select>
    </div>
</div>
<div class="form-group">
    <label class="col-sm-2 control-label" for="content">Content</label>
    <div class="col-sm-10">
        <textarea id="content" name="content" class="ckeditor form-control"><?php echo isset($post->content) ? $post->content : ''; ?></textarea>
    </div>
</div>
<div class="form-group">
    <label class="col-sm-2 control-label" for="chapo">Excerpt</label>
    <div class="col-sm-10">
        <textarea id="chapo" name="chapo" class="ckeditor form-control"><?php echo isset($post->chapo) ? $post->chapo : ''; ?></textarea>
    </div>
</div>
<div class="form-group">
    <label class="col-sm-2 control-label" for="content">Image</label>
    <div class="col-sm-10">
        @if (isset($postid) && !empty($postid))    
        <input name="same_image" class="image" type="hidden" value="{{ $post->image }}"/>
        @endif
        <input name="image" type="file" class="image" />
        <br/>
        @if (isset($postid) && !empty($postid))
        @if ($post->image != '')
        <p><img width="35%" src="{{ url('assets/posts/'.$post->image) }}" alt="" class="img-responsive"></p>
        @endif
        @endif
    </div>
</div>
<input name="post_id" type="hidden" id="post_id" value="{{ isset($postid)?$postid:'' }}" />
<button id="btn_save_post" type="submit" class="col-md-offset-2 btn btn-primary">Save post</button>
@if (isset($postid) && $postid > 0)
@endif
{{ Form::close()}}
@endsection
@section('footer-scripts')
<script src="//cdn.ckeditor.com/4.5.6/standard/ckeditor.js"></script>
<script src="//cdn.ckeditor.com/4.5.6/standard/adapters/jquery.js"></script>
<script>
function showPost(data) {
    $('#title').val(data.title);
    $('#slug').val(data.slug);
    $('#chapo').val(data.chapo);
    $('#content').val(data.content);
    $('#published_at').val(data.published_at);
    $('#category_id').val(data.category_id);
}
$(document).ready(function () {
    $('.ckedit').ckeditor(); // if class is prefered.
    // loading
    var post_id = $('#post_id').val();
    if (post_id > 0) {
        $.post('<?php echo url("/admin/blog/load_post"); ?>', {
            _token: "{{ csrf_token() }}",

            post_id: post_id
        }, function (data) {
            showPost(data);

        }, 'json');
    }

    // saving
    /* $('#btn_save_post').click(function(e) {
     e.preventDefault();
     
     $(this).addClass('disabled');
     
     console.log('cat_id : '+$('#category_id').val());
     
     
     $.post('<?php echo url("/admin/blog/save_post"); ?>', {
     _token: "{{ csrf_token() }}",
     
     title: $('#title').val(),
     slug: $('#slug').val(),
     chapo: CKEDITOR.instances['chapo'].getData(),
     content: CKEDITOR.instances['content'].getData(),
     published_at: $('#published_at').val(),
     category_id: $('#category_id').val(),
     image : $('.image').val(),
     post_id: $('#post_id').val()
     }, function(data) {
     
     $('#btn_save_post').removeClass('disabled');
     $('#post_id').val(data.id);
     
     toastr.success('Post saved.');
     
     showPost(data);
     }, 'json');
     }); */

    // publishing
    $('#btn_publish_post').click(function (e) {
        e.preventDefault();

        $(this).addClass('disabled');

        $.post('<?php echo url("/admin/blog/save_post"); ?>', {
            _token: "{{ csrf_token() }}",

            post_id: $('#post_id').val()
        }, function (data) {

            $('#btn_publish_post').removeClass('disabled');

        }, 'json');
    });
});
</script>
@endsection