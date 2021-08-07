@extends('frontend.layouts.account') @section('content')
@include('frontend.includes.hearderportion')
<div class="clear"></div>
<div class="change_password">
    <div class="container">
        <div class="row" style="padding-top: 80px;padding-bottom: 80px;">
            <div class="col-md-12">
                <div class="row">
                    <div class="col-md-4">
                        <div class="login_info">
                            <h1>Change Password</h1>
                        </div>
                    </div>
                    <div class="col-md-8 vertical-seprator">
                        <div class="login_form">
                            {!! Form::open(['route' => ['password.change'], 'class' => 'form-horizontal']) !!}
                            @include('includes.partials.messages')
                            <div class="form-group">
                                {!! Form::label('old_password', trans('validation.attributes.old_password'), ['class' => 'col-md-4 control-label']) !!}
                                <div class="col-md-6">
                                    {!! Form::input('password', 'old_password', null, ['class' => 'form-control', 'placeholder'=>'Old password' ]) !!}
                                </div>
                            </div>

                            <div class="form-group">
                                {!! Form::label('password', trans('validation.attributes.new_password'), ['class' => 'col-md-4 control-label']) !!}
                                <div class="col-md-6">
                                    <div class="error-msg" style='display: none;'>
                                        Password should be at least 8 characters long and should contain  1 capital letter, 1 special character and at least 1 digit.
                                    </div>
                                    <input class="form-control" name="password" type="password" id="password" onkeyup="keychange(this)" placeholder="New password">
                                </div>
                            </div>

                            <div class="form-group">
                                {!! Form::label('password_confirmation', trans('validation.attributes.new_password_confirmation'), ['class' => 'col-md-4 control-label']) !!}
                                <div class="col-md-6">
                                    {!! Form::input('password', 'password_confirmation', null, ['class' => 'form-control', 'placeholder'=>'Confirm new password']) !!}
                                </div>
                            </div>

                            <div class="form-group">
                                <div class="col-md-6 col-md-offset-4">
                                    {!! Form::submit(trans('labels.change_password_button'), ['class' => 'btn btn-primary']) !!}
                                </div>
                            </div>

                            {!! Form::close() !!}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
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