@extends('frontend.layouts.account') @section('content')
@include('frontend.includes.hearderportion')
<div class="clear"></div>
<section class="reset_password_section">
    <div class="container">
        <div class="row" style="padding-top: 80px;padding-bottom: 80px;">
            <div class="col-md-12">
                <div class="row">
                    <div class="col-md-4 col-md-offset-2">
                        <div class="login_info">
                            <h1>{{ trans('labels.reset_password_box_title') }}</h1>
                            <h2 style="margin-bottom: 20px;" class="visible-md-block visible-lg-block">Its quick and easy..</h2>
                        </div>
                    </div>
                    <div class="col-md-4 vertical-seprator">
                        <div class="login_form">
                            @include('includes.partials.messages')
                            <!-- /reset password -->
                            {!! Form::open(['to' => 'password/reset', 'class' => 'form-horizontal', 'role' => 'form']) !!}
                            <input type="hidden" name="token" value="{{ $token }}">
                            <div class="form-group">
                            	<div class="col-md-12">
                            		<p class="text-hint">Please enter your email address followed by your new password.</p>
                            	</div>
                            </div>
                            <div class="form-group">
                                {!! Form::label('email', trans('validation.attributes.email'), ['class' => 'col-md-4 control-label sr-only']) !!}
                                <div class="col-md-12">
                                    {!! Form::input('email', 'email', old('email'), ['class' => 'form-control box-shadow--4dp', 'placeholder'=>'Enter regitered email']) !!}
                                </div>
                            </div>
                            <div class="form-group">
                                {!! Form::label('password', trans('validation.attributes.password'), ['class' => 'col-md-4 control-label sr-only']) !!}
                                <div class="col-md-12">
                                    
                                    <div class="error-msg" style='display: none;'>
                                        Password should be at least 8 characters long and should contain  1 capital letter, 1 special character and at least 1 digit.
                                    </div>
                                    <input class="form-control" name="password" type="password" id="password" onkeyup="keychange(this)" placeholder="New password">
                                    
                                </div>
                            </div>
                            <div class="form-group">
                                {!! Form::label('password_confirmation', trans('validation.attributes.password_confirmation'), ['class' => 'col-md-4 control-label sr-only']) !!}
                                <div class="col-md-12">                                                                        
                                    {!! Form::input('password', 'password_confirmation', null, ['class' => 'form-control box-shadow--4dp', 'placeholder'=>'Confirm new password']) !!}
                                </div>
                            </div>
                            <div class="form-group">
                                <div class="col-md-12">
                                    {!! Form::submit(trans('labels.reset_password_button'), ['class' => 'btn btn-primary box-shadow--4dp']) !!}
                                </div>
                            </div>
                            {!! Form::close() !!}
                            <!-- ./reset password -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
@endsection
@section('after-scripts-end')
<script type="text/javascript">

    function keychange(txtpassword) {

        console.log(txtpassword.value);
        if (checkValidPassword(txtpassword.value)) {
            $('.error-msg').hide();
            $('input[type="submit"]').removeAttr('disabled');
        } else {
            $('.error-msg').show();
            $('input[type="submit"]').attr('disabled','disabled');
        }
    }
    function checkValidPassword(txtpassword) {
        var patt = /^(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,50}$/;
        return txtpassword.match(patt);
    }
</script>
@endsection
