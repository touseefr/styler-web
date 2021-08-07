<form role="form" name="authCtrl.userRegister"  novalidate="" ng-init="authCtrl.user.sub_newletter = 1" ng-submit="authCtrl.registerAccount()"  ng-if="authCtrl.activeForm === 'service_provider'">
<!--    <% authCtrl.stripetoken %>-->   
    <h3 style="margin-top: 30px;margin-bottom: 30px;">Service Provider</h3>
    <div class="alert alert-danger" ng-if="authCtrl.errors.length" style="margin-top:15px;">
        <div ng-bind="authCtrl.testfunction(authCtrl.errors)"></div>
        <p ng-repeat="(key, error) in authCtrl.errors" ng-bind-html="error"></p>
    </div>
    <div class="alert alert-success" ng-if="authCtrl.successMsg" style="margin-top:15px;">
        <p ng-bind-html="authCtrl.successMsg"></p>
    </div>
    <div class="row">
        <div class="col-xs-12 col-sm-6">
            <div class="form-group" ng-class="{ 'has-error' : authCtrl.userRegister.business_name.$invalid && !authCtrl.userRegister.business_name.$pristine }">
                <input type="text" placeholder="Business Name" ng-model="authCtrl.user.business_name" name="business_name" required class="form-control" tabindex="1" />
                <div ng-show="authCtrl.userRegister.business_name.$invalid && !authCtrl.userRegister.business_name.$pristine">
                    <p ng-show="authCtrl.userRegister.business_name.$error.required" class="help-block">Please enter business name</p>
                </div>
            </div>
            <div class="form-group">
                <input type="text" placeholder="Last Name" ng-model="authCtrl.user.lastName" name="lastName" class="form-control" tabindex="3" />
            </div>         
            <div class="form-group" ng-class="{ 'has-error' : authCtrl.userRegister.email.$invalid && !authCtrl.userRegister.email.$pristine }">
                <!--<input type="text" placeholder="Email" ng-model="authCtrl.user.email" name="email" required ng-pattern="/^[-_a-z0-9]+(\.[-_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/" class="form-control" tabindex="5" />-->
                <input type="text" placeholder="Email" ng-model="authCtrl.user.email" name="email" required ng-pattern='/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/' class="form-control" tabindex="5" />
                <div ng-show="authCtrl.userRegister.email.$invalid && !authCtrl.userRegister.email.$pristine">
                    <p ng-show="authCtrl.userRegister.email.$error.required" class="help-block">Please enter email</p>
                    <p ng-show="authCtrl.userRegister.email.$error.pattern" class="help-block">Please enter valid email</p>
                </div>
            </div>
            <div class="form-group" ng-class="{ 'has-error' : authCtrl.userRegister.password.$invalid && !authCtrl.userRegister.password.$pristine }">
                <div class="error-msg" ng-show="authCtrl.userRegister.password.$invalid && !authCtrl.userRegister.password.$pristine">
                    Password should be at least 8 characters long and should contain  1 capital letter, 1 special character and at least 1 digit.
                </div>
                <input type="password" ng-pattern="/^(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,50}$/"  class="form-control" ng-model="authCtrl.user.password" placeholder="Password" name="password" required tabindex="7" />
                <div ng-show="authCtrl.userRegister.password.$invalid && !authCtrl.userRegister.password.$pristine">
                    <p ng-show="authCtrl.userRegister.password.$error.required" class="help-block">Please enter password</p>
                </div>
            </div>
            <div class="form-group" >                
                <div class="select-postcode">
                    <select class="businessType-select form-control" ng-model="authCtrl.user.hear_us" tabindex="9" >
                        <option value="" disabled selected><span style="color:#ccc">How did you hear about us?</span></option>
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
            <div class="form-group" ng-if="authCtrl.user.hear_us == 'Others'">
                <input class="form-control" ng-if="authCtrl.user.hear_us == 'Others'" type="text"  name="txtplan" ng-model="authCtrl.user.other_option" placeholder="Other Option" tabindex="11"/>
            </div>           
            <div class="terms form-group theme-color">
                <div class="row">
                    <div class="col-xs-12 col-sm-12 mt-8">
                        <div class="form-group">
                            Do you have promo coupon?
                            <span class="chkbox ml-10">
                                <input type="checkbox" name="sub_newletter" ng-model="authCtrl.havepromo" value="1" ng-true-value="1" ng-false-value="0" tabindex="12"  />
                            </span>
                        </div>                        
                    </div>
                    <div class="col-xs-12 col-sm-12">
                        <div class="terms theme-color" ng-class="{ 'has-error' : authCtrl.couponerror == 1}">
                            <span ng-if="authCtrl.havepromo"  >
                                <input type="text"  class="form-control" ng-model="authCtrl.user.promo_code" placeholder="Promo Code" name="promo_code" ng-keyup="authCtrl.couponerror = 0" />
                            </span>
                            <p ng-if="authCtrl.couponerror == 1" class="help-block">Invalid Coupon.</p>
                        </div>
                    </div>
                </div>                
            </div>

        </div>
        <div class="col-xs-12 col-sm-6">
            <div class="form-group" ng-class="{ 'has-error' : authCtrl.userRegister.firstName.$invalid && !authCtrl.userRegister.firstName.$pristine }">
                <input type="text" placeholder="First Name" ng-model="authCtrl.user.firstName" name="firstName" required class="form-control"  tabindex="2"/>
                <div ng-show="authCtrl.userRegister.firstName.$invalid && !authCtrl.userRegister.firstName.$pristine">
                    <p ng-show="authCtrl.userRegister.firstName.$error.required" class="help-block">Please enter first name</p>
                </div>
            </div>
            <div class="form-group" ng-class="{ 'has-error' : authCtrl.userRegister.contact_number.$invalid && !authCtrl.userRegister.contact_number.$pristine }">
                <input type="text" placeholder="Contact Number" ng-model="authCtrl.user.contact_number" name="contact_number" class="form-control" required tabindex="4" />
                <div ng-show="authCtrl.userRegister.contact_number.$invalid && !authCtrl.userRegister.contact_number.$pristine">
                    <p ng-show="authCtrl.userRegister.contact_number.$error.required" class="help-block">Please enter contact number</p>
                </div>
            </div>
            <div class="form-group" ng-class="{ 'has-error' : authCtrl.userRegister.suburb.$invalid && !authCtrl.userRegister.suburb.$pristine }">
                <ui-select ng-model="authCtrl.user.locations" theme="bootstrap"  required ng-model-options="authCtrl.modelOptions" ng-disabled="disabled" reset-search-input="true" title="Suburb or Postcode" append-to-body="true" style="width:100%" tabindex="6">
                    <ui-select-match placeholder="Suburb or Postcode">                        
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
                <!--<input type="password" class="form-control" ng-model="authCtrl.user.password_confirmation" placeholder="Confirm Password" name="password_confirmation" required match="authCtrl.user.password" tabindex="8" />-->
                <input type="password" class="form-control" ng-model="authCtrl.user.password_confirmation" placeholder="Confirm Password" name="password_confirmation" required passwordmatchonBlur  ng-blur="authCtrl.onBlurConfirmPassword(authCtrl.user.password,authCtrl.user.password_confirmation)" tabindex="8" />
                    <div ng-show="authCtrl.userRegister.password_confirmation.$invalid && !authCtrl.userRegister.password_confirmation.$pristine || authCtrl.confirmationPassword==1">
                    <p ng-show="authCtrl.userRegister.password_confirmation.$error.required" class="help-block">Please enter confirm password</p>
                    <p ng-show="authCtrl.confirmationPassword==1" class="help-block" style="color: red;">Passwords does not match</p>
                </div>
            </div>
            <div class="terms form-group theme-color mt-25">
                Subscribe to Newsletter
                <span class="chkbox ml-10">
                    <input type="checkbox" name="sub_newletter" ng-model="authCtrl.user.sub_newletter" value="1" ng-true-value="1" ng-false-value="0" checked="checked" tabindex="10"/>
                </span>
            </div>
            <div class="terms form-group theme-color mt-25">
                Do you have more than one branch?
                <span class="chkbox ml-12">
                    <input type="checkbox" name="sub_newletter" ng-model="authCtrl.morebranches" value="1" ng-true-value="1" ng-false-value="0"  tabindex="12" />
                </span>
                <span ng-show="authCtrl.morebranches == 1" class="chkbox ml-12 more-branches">
                    If you have more than one location, please contact support for custom design pages for all locations
                </span>
            </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-12 mt-10">By clicking Register Account button you agree to our <a href="../termsandconditions">Terms and Conditions</a>, including our Cookie use</div>
        <div class="col-xs-12 col-sm-12 col-md-12">
            <button class="submit_btn" ng-class="{diabledCls:authCtrl.userRegister.$invalid || loadingSpinner || authCtrl.couponerror == 1 || authCtrl.confirmationPassword==1}" type="submit" data-ng-disabled="authCtrl.userRegister.$invalid || loadingSpinner || authCtrl.couponerror == 1 || authCtrl.confirmationPassword==1" >
                <i class="fa fa-circle-o-notch fa-spin" ng-show="loadingSpinner"></i>Register Account</button>
        </div>
        <div class="col-xs-12 col-sm-6">
            <div class="clearfix"></div>

        </div>
        <!---->
    </div>    
</form>
