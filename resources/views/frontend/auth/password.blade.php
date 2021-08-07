@extends('frontend.layouts.account') @section('content')
 
@include('frontend.includes.hearderportion')

<div class="clear"></div>
<div class="send_password_section">
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
                            {!! Form::open(['to' => 'password/email', 'class' => 'form-horizontal', 'role' => 'form']) !!}
                            <div class="form-group">
                            	<div class="col-md-12">
                            		<p class="text-hint">Please enter your email address. You will then receive an email with a link, via which you can choose a new password.</p>
                            	</div>
                            </div>
                            <div class="form-group">
                                {!! Form::label('email', trans('validation.attributes.email'), ['class' => 'col-md-4 control-label sr-only']) !!}
                                <div class="col-md-12">
                                    {!! Form::input('email', 'email', old('email'), ['class' => 'form-control box-shadow--4dp', 'placeholder'=>'Enter regitered email']) !!}
                                </div>
                            </div>
                             <div class="form-group">
                            <div class="col-md-12">
                                {!! Form::submit(trans('labels.send_password_reset_link_button'), ['class' => 'btn btn-primary box-shadow--4dp']) !!}
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
</div>
@endsection
