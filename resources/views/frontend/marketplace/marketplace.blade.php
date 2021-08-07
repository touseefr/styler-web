@extends('frontend.layouts.account') 
@section('content')
<style type="text/css">
    .spinner_overlay {
    z-index: 2000 !important;    
}    
</style>
<market-place user='' bind-to-window="true"></market-place>
@endsection