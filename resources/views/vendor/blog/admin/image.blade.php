@extends('backend.layouts.master')
@section('page-header')
<h1>Add an Image to a Post</h1>
@endsection
@section('content')

    {!! Form::open(['files' => true] ) !!}

    <input type="hidden" id="post_id" value="{{ $post->id }}" />
    <input type="hidden" id="_token" value="{!! csrf_token() !!}" />

    {!! Form::file('image') !!}

    {!! Form::submit() !!}

    {!! Form::close() !!}

@endsection

@section('footer-scripts')

@endsection
