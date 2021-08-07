<form role="form" name="authCtrl.userRegister" novalidate="" ng-init="authCtrl.user.sub_newletter=1" ng-submit="authCtrl.registerAccount()" ng-if="authCtrl.activeForm === 'distributor'">
    
    <h3 style="margin-top: 30px;margin-bottom: 30px;">Distributor</h3>
    <div class="alert alert-danger" ng-if="authCtrl.errors.length" style="margin-top:15px;">
        <p ng-repeat="(key, error) in authCtrl.errors" ng-bind-html="error"></p>
    </div>
    <div class="alert alert-success" ng-if="authCtrl.successMsg" style="margin-top:15px;">
        <p ng-bind-html="authCtrl.successMsg"></p>
    </div>
    <div class="row">
        <div class="col-xs-12 col-md-6">
            <div class="form-group ng-class="{ 'has-error' : authCtrl.userRegister.business_name.$invalid && !authCtrl.userRegister.business_name.$pristine }">
                <input tabindex="1" type="text" placeholder="Business Name" ng-model="authCtrl.user.business_name" name="business_name" required class="form-control" />
                <div ng-show="authCtrl.userRegister.business_name.$invalid && !authCtrl.userRegister.business_name.$pristine">
                    <p ng-show="authCtrl.userRegister.business_name.$error.required" class="help-block">Please enter business name</p>
                </div>
            </div>
            <div class="form-group">
                <input tabindex="3" type="text" placeholder="Last Name" ng-model="authCtrl.user.lastName" name="lastName" class="form-control" />
            </div>
            <div class="form-group" ng-class="{ 'has-error' : authCtrl.userRegister.email.$invalid && !authCtrl.userRegister.email.$pristine }">
                <input type="text" tabindex="5" placeholder="Email" ng-model="authCtrl.user.email" name="email" required ng-pattern='/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/' class="form-control" />
                <div ng-show="authCtrl.userRegister.email.$invalid && !authCtrl.userRegister.email.$pristine">
                    <p ng-show="authCtrl.userRegister.email.$error.required" class="help-block">Please enter email</p>
                    <p ng-show="authCtrl.userRegister.email.$error.pattern" class="help-block">Please enter valid email</p>
                </div>
            </div>
            <div class="form-group" ng-class="{ 'has-error' : authCtrl.userRegister.password.$invalid && !authCtrl.userRegister.password.$pristine }">
                <div class="error-msg" ng-show="authCtrl.userRegister.password.$invalid && !authCtrl.userRegister.password.$pristine">
                    Password should be at least 8 characters long and should contain  1 capital letter, 1 special character and at least 1 digit.
                </div>

                <input tabindex="7" type="password" ng-pattern="/^(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,50}$/"  class="form-control" ng-model="authCtrl.user.password" placeholder="Password" name="password" required />
                <div ng-show="authCtrl.userRegister.password.$invalid && !authCtrl.userRegister.password.$pristine">
                    <p ng-show="authCtrl.userRegister.password.$error.required" class="help-block">Please enter password</p>
                </div>
            </div>
            <div class="form-group">                
              <div class="select-postcode">
                <select tabindex="9" class="businessType-select form-control" placeholder="How did you hear about us?" ng-model="authCtrl.user.hear_us">
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
            <div class="terms theme-color h50min">
                <div class="row">
                    <div class="col-xs-12 col-sm-12 mt-8">
                        <div class="form-group">
                            Do you have promo coupon?
                            <span class="chkbox ml-10">
                                <input tabindex="11" type="checkbox" name="sub_newletter" ng-model="authCtrl.havepromo" value="1" ng-true-value="1" ng-false-value="0" />
                            </span>
                        </div>
                    </div>
                    <div class="col-xs-12 col-sm-12">
                        <div class="terms form-group theme-color" ng-class="{ 'has-error' : authCtrl.couponerror==1}" >
                            <span ng-if="authCtrl.havepromo"  >
                                <input type="text"  class="form-control" ng-model="authCtrl.user.promo_code" placeholder="Promo Code" name="promo_code" ng-keyup="authCtrl.couponerror=0" />
                            </span>
                            <p ng-if="authCtrl.couponerror==1" class="help-block">Invalid Coupon.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-xs-12 col-md-6">
            <div class="form-group" ng-class="{ 'has-error' : authCtrl.userRegister.firstName.$invalid && !authCtrl.userRegister.firstName.$pristine }">
                <input tabindex="2" type="text" placeholder="First Name" ng-model="authCtrl.user.firstName" name="firstName" required class="form-control" />
                <div ng-show="authCtrl.userRegister.firstName.$invalid && !authCtrl.userRegister.firstName.$pristine">
                    <p ng-show="authCtrl.userRegister.firstName.$error.required" class="help-block">Please enter first name</p>
                </div>
            </div>
            <div tabindex="4" class="form-group" ng-class="{ 'has-error' : authCtrl.userRegister.contact_number.$invalid && !authCtrl.userRegister.contact_number.$pristine }">
                <input type="text" placeholder="Contact Number" ng-model="authCtrl.user.contact_number" name="contact_number" class="form-control" required />
                <div ng-show="authCtrl.userRegister.contact_number.$invalid && !authCtrl.userRegister.contact_number.$pristine">
                    <p ng-show="authCtrl.userRegister.contact_number.$error.required" class="help-block">Please enter contact number</p>
                </div>
            </div>
            <div class="form-group" ng-class="{ 'has-error' : authCtrl.userRegister.suburb.$invalid && !authCtrl.userRegister.suburb.$pristine }">
                <ui-select tabindex="6" ng-model="authCtrl.user.locations" theme="bootstrap" required ng-model-options="authCtrl.modelOptions" ng-disabled="disabled" reset-search-input="true" title="Addess? (suburb, postcode, or city)" append-to-body="true" style="width:100%">
                    <ui-select-match placeholder="Suburb or Postcode">
                        <%$select.selected.location%>  <%$select.selected.state%> <%$select.selected.postcode%>
                    </ui-select-match>
                    
                      <ui-select-choices ui-disable-choice="address.no_found" repeat="address in authCtrl.suburbList track by $index" refresh="authCtrl.getLocation($select.search)" refresh-delay="0">
                        <span ng-if="!address.no_found" ng-bind-html="address.location | highlight: $select.search"></span> <span ng-if="!address.no_found">-</span> <span ng-if="!address.no_found" ng-bind-html="address.state | highlight: $select.search"></span><span ng-if="!address.no_found">,</span> <span ng-if="!address.no_found" ng-bind-html="address.postcode | highlight: $select.search"></span>
                        <span ng-if="address.no_found">Records not found.</span>
                    </ui-select-choices>                    
                </ui-select>
                <div ng-show="authCtrl.showspinner ==1" class="signup-serach-loader"><i class="fas fa-spinner fa-spin"></i></div>
                <div ng-show="authCtrl.userRegister.suburb.$invalid && !authCtrl.userRegister.suburb.$pristine">
                    <p ng-show="authCtrl.userRegister.suburb.$error.required" class="help-block">Please enter suburb</p>
                </div>
            </div>
            <div class="form-group" ng-class="{ 'has-error' : authCtrl.userRegister.password_confirmation.$invalid && !authCtrl.userRegister.password_confirmation.$pristine }">
                <input type="password" tabindex="8" class="form-control" ng-model="authCtrl.user.password_confirmation" placeholder="Confirm Password" name="password_confirmation" required match="authCtrl.user.password" />
                <div ng-show="authCtrl.userRegister.password_confirmation.$invalid && !authCtrl.userRegister.password_confirmation.$pristine">
                    <p ng-show="authCtrl.userRegister.password_confirmation.$error.required" class="help-block">Please enter confirm password</p>
                    <p ng-show="authCtrl.userRegister.password_confirmation.$error.match" class="help-block">Passwords do not match</p>
                </div>
            </div>
            <div class="form-group" ng-if="authCtrl.user.hear_us=='Others'">
              <input class="form-control" tabindex="10" ng-if="authCtrl.user.hear_us=='Others'" type="text"  name="txtplan" ng-model="authCtrl.user.other_option" placeholder="Other Option" />
            </div>            
            <div class="terms form-group theme-color mt-25">                                               
                Subscribe for Newsletter
                <span class="chkbox ">
                    <input type="checkbox"  name="sub_newletter" ng-model="authCtrl.user.sub_newletter" value="1" ng-true-value="1" ng-false-value="0"  />
                </span>&nbsp;&nbsp;&nbsp;&nbsp;
            </div>
             <div class="terms form-group theme-color mt-25">
                Do you have more than one branch?
                <span class="chkbox ml-12">
                    <input type="checkbox" name="sub_newletter" ng-model="authCtrl.morebranches" value="1" ng-true-value="1" ng-false-value="0"  />
                </span>
                <span ng-show="authCtrl.morebranches==1" class="chkbox ml-12 more-branches">
                    If you have more than one location, please contact support for custom design pages for all locations
                </span>
            </div>
        </div>
        <div class="clearfix"></div>
        <div class="col-md-12 mt-10">By clicking Register Account button you agree to our <a href="../termsandconditions">Terms and Conditions</a>, including our Cookie use</div>
        <div class="col-md-12">
            <button class="submit_btn" type="submit" ng-class="{diabledCls:authCtrl.userRegister.$invalid || loadingSpinner || authCtrl.couponerror == 1}" data-ng-disabled="authCtrl.userRegister.$invalid || loadingSpinner || authCtrl.couponerror==1">
            <i class="fa fa-circle-o-notch fa-spin" ng-show="loadingSpinner"></i>Register Account</button>
        </div>
    </div>
</form>
