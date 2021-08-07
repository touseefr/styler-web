<!DOCTYPE HTML>
<html>
<head>
<title>Admin Login</title>
<link href='//fonts.googleapis.com/css?family=Droid+Sans' rel='stylesheet' type='text/css'>
<link href="/build/css/admin_login_css.css" rel="stylesheet" type="text/css" media="all" />
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" /> 

</head>

<body>



<!---728x90--->
<!-- contact-form -->	
<div class="message warning">
<div class="inset">
	<div class="login-head">
		<h1>Login Form</h1>
		
	</div>
	
		<form name="admin_login" action="" method="post" id="admin_login">
			@if(Session::has('message'))
				<div class="alert alert-{{Session::get('type')}}" style="text-align: center;">{{Session::get('message')}}</div>
			@endif
			<input type="hidden" name="_token" value="{{csrf_token()}}"/>
			<li>
				<input name="username" type="text" class="text" value="Username" onfocus="this.value = '';" onblur="if (this.value == '') {this.value = 'Username';}" required>
			</li>
				<div class="clear"> </div>
			<li>
				<input name="password" type="password" value="Password" onfocus="this.value = '';" onblur="if (this.value == '') {this.value = 'Password';}" required> 
			</li>
			<div class="clear"> </div>
			<div class="submit">
				<input type="submit" name="admin_login" value="Sign in" >
			
						  <div class="clear">  </div>	
			</div>
				
		</form>
		</div>					
	</div>
	</div>
	<div class="clear"> </div>

</body>
</html>