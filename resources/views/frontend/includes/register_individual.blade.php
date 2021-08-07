<form role="form" name="authCtrl.userRegister" autocomplete="off" novalidate="" ng-init="authCtrl.user.sub_newletter = 1" ng-submit="authCtrl.registerAccount()" ng-if="authCtrl.activeForm === 'individual'">    
    <div class="row">
        <div class="col-md-6">
            <h3 style="margin-top: 30px;margin-bottom: 30px;" class="pull-left">Individual/Job Seeker Account</h3>
            <div class="col-xs-12 login_section">
                <a href="/auth/login/facebook" title="login with facebook" class="attrflex" style="width: 100%;"><div class="facebook"><i class="fab fa-facebook-f"></i></div><div class="facebook-text">LOG IN WITH FACEBOOK</div></a>
            </div>
            <div class="or-signup">
                <p>OR</p>
            </div>            
        </div>
    </div>
    <div class="alert alert-danger" ng-if="authCtrl.errors.length" style="margin-top:15px;">
        <p ng-repeat="(key, error) in authCtrl.errors" ng-bind-html="error"></p>
    </div>
    <div class="alert alert-success" ng-if="authCtrl.successMsg" style="margin-top:15px;">
        <p ng-bind-html="authCtrl.successMsg"></p>
    </div>
    <div class="row">
        <div class="col-xs-12 col-md-6">
            <div class="form-group" ng-class="{ 'has-error' : authCtrl.userRegister.name.$invalid && !authCtrl.userRegister.name.$pristine }">
                <input tabindex="1" type="text" placeholder="Name" ng-model="authCtrl.user.name" name="name" required class="form-control" autocomplete="off" />
                <div ng-show="authCtrl.userRegister.name.$invalid && !authCtrl.userRegister.name.$pristine">
                    <p ng-show="authCtrl.userRegister.name.$error.required" class="help-block">Please enter name</p>
                </div>
            </div>
            <div class="form-group" ng-class="{ 'has-error' : authCtrl.userRegister.suburb.$invalid && !authCtrl.userRegister.suburb.$pristine }">
                <ui-select tabindex="3" ng-model="authCtrl.user.locations" theme="bootstrap" required ng-model-options="authCtrl.modelOptions" ng-disabled="disabled" reset-search-input="true" title="Addess? (suburb, postcode, or city)" append-to-body="true" style="width:100%">
                    <ui-select-match placeholder="Suburb or Postcode">
                        <!--<%$select.selected.name%> - <%$select.selected.state%>, <%$select.selected.postcode%>-->
                        <%$select.selected.location%>  <%$select.selected.state%> <%$select.selected.postcode%>
                    </ui-select-match>
                    <ui-select-choices ui-disable-choice="address.no_found" repeat="address in authCtrl.suburbList track by $index" refresh="authCtrl.getLocation($select.search)" refresh-delay="0">
                        <span ng-if="!address.no_found" ng-bind-html="address.location | highlight: $select.search"></span> <span ng-if="!address.no_found">-</span> <span ng-if="!address.no_found" ng-bind-html="address.state | highlight: $select.search"></span><span ng-if="!address.no_found">,</span> <span ng-if="!address.no_found" ng-bind-html="address.postcode | highlight: $select.search"></span>
                        <span ng-if="address.no_found">Records not found.</span>
                    </ui-select-choices>
                </ui-select>                
                <div ng-show="authCtrl.showspinner == 1" class="signup-serach-loader"><i class="fas fa-spinner fa-spin"></i></div>    
                <div ng-show="authCtrl.userRegister.suburb.$invalid && !authCtrl.userRegister.suburb.$pristine">
                    <p ng-show="authCtrl.userRegister.suburb.$error.required" class="help-block">Please enter suburb</p>
                </div>
            </div>
            <div class="form-group" ng-class="{ 'has-error' : authCtrl.userRegister.password_confirmation.$invalid && !authCtrl.userRegister.password_confirmation.$pristine }">
                <input tabindex="5" type="password" class="form-control" ng-model="authCtrl.user.password_confirmation" placeholder="Confirm Password" name="password_confirmation" required autocomplete="off" match="authCtrl.user.password" />
                <div ng-show="authCtrl.userRegister.password_confirmation.$invalid && !authCtrl.userRegister.password_confirmation.$pristine">
                    <p ng-show="authCtrl.userRegister.password_confirmation.$error.required" class="help-block">Please enter confirm password</p>
                    <p ng-show="authCtrl.userRegister.password_confirmation.$error.match" class="help-block">Passwords do not match</p>
                </div>
            </div>
            <div class="form-group" ng-if="authCtrl.user.hear_us == 'Others'">
                <input tabindex="7" class="form-control" ng-if="authCtrl.user.hear_us == 'Others'" type="text"  name="txtplan" ng-model="authCtrl.user.other_option" placeholder="Other Option" />
            </div>
            <div class="form-group" >             
                <input type="text"  
                       placeholder="Date Of Birth" 
                       class="form-control" 
                       uib-datepicker-popup="yyyy-MM-dd"
                       ng-model="authCtrl.user.dob"                         
                       datepicker-options="dateOptions" 
                       tabindex="12"
                       onfocus="this.type='date';" 
                       onblur="javascript: if( !this.value ) this.type='text';"
                       />                          
            </div>
            <div class="form-group theme-color">
                Are you Jobseeker
                <span class="chkbox">
                    <input tabindex="9" type="checkbox" name="Jobseeker" ng-model="authCtrl.user.Jobseeker" />
                </span>
            </div>
        </div>
        <div class="col-xs-12 col-md-6">
            <div class="form-group" ng-class="{ 'has-error' : authCtrl.userRegister.email.$invalid && !authCtrl.userRegister.email.$pristine }">
                <input tabindex="2" type="text" placeholder="Email" ng-model="authCtrl.user.email" name="email" required ng-pattern='/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/' class="form-control" autocomplete="off" />
                <div ng-show="authCtrl.userRegister.email.$invalid && !authCtrl.userRegister.email.$pristine">
                    <p ng-show="authCtrl.userRegister.email.$error.required" class="help-block">Please enter email</p>
                    <p ng-show="authCtrl.userRegister.email.$error.pattern" class="help-block">Please enter valid email</p>
                </div>
            </div>
            <div class="form-group" ng-class="{ 'has-error' : authCtrl.userRegister.password.$invalid && !authCtrl.userRegister.password.$pristine }">
                <div class="error-msg" ng-show="authCtrl.userRegister.password.$invalid && !authCtrl.userRegister.password.$pristine">
                    Password should be at least 8 characters long and should contain  1 capital letter, 1 special character and at least 1 digit.
                </div>
                <input tabindex="4" type="password" ng-pattern="/^(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,50}$/" class="form-control" ng-model="authCtrl.user.password" placeholder="Password" name="password" required autocomplete="off" />
                <div ng-show="authCtrl.userRegister.password.$invalid && !authCtrl.userRegister.password.$pristine">
                    <p ng-show="authCtrl.userRegister.password.$error.required" class="help-block">Please enter password</p>
                </div>
            </div>
            <div class="form-group" >
                <div class="select-postcode">
                    <select tabindex="6" class="businessType-select" ng-model="authCtrl.user.hear_us">                        
                        <option value="" disabled selected>How did you hear about us?</option>
                        <option value="Facebook">Facebook</option>
                        <option value="Magazine">Magazine</option>                                
                        <option value="Search Engine">Search Engine</option>                                
                        <option value="Email">Email</option>                                
                        <option value="Referral">Referral</option>                                
                        <option value="Youtube">Youtube</option>  
                        <option value="Others">Others</option>           
                    </select>                           
                </div>
            </div>
            <div class="form-group theme-color">                             
                Subscribe for News Letter
                <span class="chkbox" >
                    <input tabindex="8" type="checkbox" name="sub_newletter" ng-model="authCtrl.user.sub_newletter" value="1" ng-true-value="1" ng-false-value="0" />
                </span>   
            </div>
        </div>
        <div class="col-md-12">By clicking Register Account button you agree to our <a href="../termsandconditions">Terms and Conditions</a>, including our Cookie use</div>
        <div class="col-md-12">
            <button class="submit_btn btn-submit-for-service" type="submit" data-ng-disabled="authCtrl.userRegister.$invalid || loadingSpinner"><i class="fa fa-circle-o-notch fa-spin" ng-show="loadingSpinner"></i>Register Account</button>
        </div>
    </div>

</form>
