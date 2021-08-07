<form role="form" name="authCtrl.userRegister" autocomplete="off" novalidate="" ng-submit="authCtrl.registerAccount()" ng-if="authCtrl.activeForm === 'job_seeker'">
    <input type="hidden" value="{{$planid}}" id="plan_id" name="planid" />
    <div class="alert alert-danger" ng-if="authCtrl.errors.length" style="maring-top:15px;">
        <ul>
            <li ng-repeat="(key, error) in authCtrl.errors" ng-bind-html="error"></li>
        </ul>
    </div>
    <div class="alert alert-success" ng-if="authCtrl.successMsg" style="maring-top:15px;">
        <p ng-bind-html="authCtrl.successMsg"></p>
    </div>
        <div class="row">
        <div class="col-md-12">
            <h3 style="margin-top: 30px;margin-bottom: 30px;" class="pull-left">Job Seeker Account</h3>
            <h3 style="margin-top: 30px;margin-bottom: 30px;" class="pull-right">
                Login Via
                <span><a href="/auth/login/facebook" style="color:#3558bd;">Facebook</a></span>
            </h3>
        </div>
    </div>
    <div class="row">
        <div class="col-md-6">
            <div class="form-group" ng-class="{ 'has-error' : authCtrl.userRegister.name.$invalid && !authCtrl.userRegister.name.$pristine }">
                <input type="text" placeholder="Name" ng-model="authCtrl.user.name" name="name" required class="form-control" autocomplete="off" />
                <div ng-show="authCtrl.userRegister.name.$invalid && !authCtrl.userRegister.name.$pristine">
                    <p ng-show="authCtrl.userRegister.name.$error.required" class="help-block">Please enter name</p>
                </div>
            </div>
            <div class="form-group" ng-class="{ 'has-error' : authCtrl.userRegister.email.$invalid && !authCtrl.userRegister.email.$pristine }">
                <input type="text" placeholder="Email" ng-model="authCtrl.user.email" name="email" required ng-pattern="/^[-_a-z0-9]+(\.[-_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/" class="form-control" autocomplete="off" />
                <div ng-show="authCtrl.userRegister.email.$invalid && !authCtrl.userRegister.email.$pristine">
                    <p ng-show="authCtrl.userRegister.email.$error.required" class="help-block">Please enter email</p>
                    <p ng-show="authCtrl.userRegister.email.$error.pattern" class="help-block">Please enter valid email</p>
                </div>
            </div>
            <div class="form-group" ng-class="{ 'has-error' : authCtrl.userRegister.suburb.$invalid && !authCtrl.userRegister.suburb.$pristine }">
                <ui-select ng-model="authCtrl.user.locations" theme="bootstrap" required ng-model-options="authCtrl.modelOptions" ng-disabled="disabled" reset-search-input="true" title="Addess? (suburb, postcode, or city)" append-to-body="true" style="width:100%">
                    <ui-select-match placeholder="Suburb or Postcode">
                        <%$select.selected.location%> - <%$select.selected.state%>, <%$select.selected.postcode%>
                    </ui-select-match>
                    <ui-select-choices repeat="address in authCtrl.suburbList track by $index" refresh="authCtrl.getLocation($select.search)" refresh-delay="0">
                        <span ng-bind-html="address.location | highlight: $select.search"></span> - <span ng-bind-html="address.state | highlight: $select.search"></span>, <span ng-bind-html="address.postcode | highlight: $select.search"></span>
                    </ui-select-choices>
                </ui-select><span us-spinner spinner-theme="inline" spinner-key="search_location" ></span>
                <div ng-show="authCtrl.userRegister.suburb.$invalid && !authCtrl.userRegister.suburb.$pristine">
                    <p ng-show="authCtrl.userRegister.suburb.$error.required" class="help-block">Please enter suburb</p>
                </div>
            </div>
        </div>
        <div class="col-md-6">
            <div class="form-group" ng-class="{ 'has-error' : authCtrl.userRegister.password.$invalid && !authCtrl.userRegister.password.$pristine }">
                <input type="password" id="password" class="form-control" ng-model="authCtrl.user.password" placeholder="Password" name="password" required autocomplete="off" />
                <div ng-show="authCtrl.userRegister.password.$invalid && !authCtrl.userRegister.password.$pristine">
                    <p ng-show="authCtrl.userRegister.password.$error.required" class="help-block">Please enter password</p>
                </div>
            </div>
            <div class="form-group" ng-class="{ 'has-error' : authCtrl.userRegister.password_confirmation.$invalid && !authCtrl.userRegister.password_confirmation.$pristine }">
                <input type="password" class="form-control" ng-model="authCtrl.user.password_confirmation" placeholder="Confirm password" name="password_confirmation" required match="authCtrl.user.password" />
                <div ng-show="authCtrl.userRegister.password_confirmation.$invalid && !authCtrl.userRegister.password_confirmation.$pristine">
                    <p ng-show="authCtrl.userRegister.password_confirmation.$error.required" class="help-block">Please enter confirm password</p>
                    <p ng-show="authCtrl.userRegister.password_confirmation.$error.match" class="help-block">Passwords do not match</p>
                </div>
            </div>
            <div class="terms form-group" ng-class="{ 'has-error' : authCtrl.userRegister.terms_condition.$invalid && !authCtrl.userRegister.terms_condition.$pristine }">
                <a href="../termsandconditions" class="terms">Terms and conditions</a>
                <span class="chkbox">
                <input type="checkbox" name="terms_condition" ng-model="authCtrl.user.terms_condition" />
                </span>
                <div ng-show="authCtrl.userRegister.terms_condition.$invalid && !authCtrl.userRegister.terms_condition.$pristine">
                    <p class="help-block">Please select terms</p>
                </div>
            </div>
        </div>
    </div>
    <button class="submit_btn" type="submit" data-ng-disabled="authCtrl.userRegister.$invalid || loadingSpinner">
        <i class="fa fa-circle-o-notch fa-spin" ng-show="loadingSpinner"></i>Register account</button>
</form>
