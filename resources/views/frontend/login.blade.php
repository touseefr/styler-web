<link href="{{url('new_assets/css/bootstrap.min.css')}}" rel="stylesheet">
<link href="{{url('new_assets/css/fontawesome-all.css')}}" rel="stylesheet">
<style type="text/css">
.login_background{margin: 0;padding: 0;width: 100%;z-index: 0;position: relative;}
body{margin: 0}
.overlay{background-color: rgba(0,0,0,0.7);z-index: 1;width: 100%;height: 100%;position: fixed;top: 0;left: 0;right: 0;bottom: 0;background-size: 100% 100%;}
.login_section{z-index: 2;position: fixed;top: 0;left: 0;right:0;bottom: 0; }
.logo_img img{width: 40px;height: 40px;}
.logo_img{padding: 15px 0 10px;}
.section{min-width: 300px;max-width: 300px;margin: 0 auto;padding-top: 10%;}
.login_form{background-color: white;box-shadow: 0 0 20px rgba(255,255,255,0.4);}
.header-section{background-color: #F6F6F6}
.body-section{background-color: white;margin-top: 20px;}
.title_text{font-size: 20px;padding-bottom: 10px;}
.facebook{padding: 14px 18px;background-color:  #23325e;color:  white;width:  42px;height: 42px;border-radius: 4px;border-bottom-right-radius: 0;border-top-right-radius: 0;}
.facebook-text{padding: 14px 10px 0;background-color: #304c8d;color: white;font-size: 12px;width: 100%;border-radius: 4px;border-bottom-left-radius: 0;border-top-left-radius: 0;}
.flex{display: flex;}
.or_space{margin: 20px 0;}
.body-section .input-group-addon{width: 42px;height: 42px;}
.body-section input{height: 42px;}
.body-section .form-group,.body-section .input-group{width: 100%;}
.login_btn{height: 42px;background-color: #4ABDAC;color: white;}
.forget-password{margin-bottom: 10px;}
</style>
<img src="../images/banner_img.jpg" class="login_background">
<div class="overlay"></div>
<div class="login_section">
	<div class="section">
		<div class="login_form">
			<div class="header-section">
				<div class="logo_img text-center"><img src="favicon.png"></div>
				<div class="text-center title_text">AuthO</div>
			</div>
			<div class="body-section">
				<div class="col-xs-12 flex"><div class="facebook"><i class="fab fa-facebook-f"></i></div><div class="facebook-text">LOG IN WITH FACEBOOK</div>
				</div>
				<div class="col-xs-12"><div class="or_space text-center">or</div></div>
				<form>
					<div class="clearfix">
						<div class="col-xs-12">
							<div class="form-group">
                                <div class="input-group">
                            <div class="input-group-addon">
                                <i class="far fa-user"></i>
                            </div>
                                {!! Form::text('username' , null , ["class" => "form-control", "placeholder" => "Username", 'required']) !!}
                            </div>


                        </div>
						</div>
						<div class="col-xs-12">
							<div class="form-group">
                                <div class="input-group">
                            <div class="input-group-addon">
                                <i class="fas fa-lock"></i>
                            </div>
                                {!! Form::password('password' , ["class" => "form-control", "placeholder" => "Password"]) !!}
                            </div>


                        </div>
						</div>
						<div class="col-xs-12 text-center forget-password">
							<a href="">Reset Password</a>
						</div>
						<div class="col-xs-12">
							<div class="form-group">
								<button type="submit" class="form-control login_btn btn" >LOGIN <i class="fas fa-chevron-right"></i></button>

                        	</div>
						</div>
						<div class="col-xs-12 text-center forget-password">
							<a href="">Back To Home</a>
						</div>
					</div>
				</form>

			<div class="footer-section">

			</div>
		</div>
	</div>
</div>
