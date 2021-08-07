@extends('frontend.layouts.account') @section('content')
<script type="text/javascript">
    var checkvalidation = 0;</script>
@include('frontend.includes.hearderportion')
<div class="clear"></div>
<div class="signup" ng-controller="AuthController as authCtrl" ng-init="authCtrl.active = {{$showregister}}">
<!--<section class="bg_gray border_top register_container">-->
    <div class="container">
        <div class="row" style="padding-top:30px;">
            <div class="col-xs-12 col-sm-12 col-md-4">
                <div ng-if="authCtrl.active === 1">
                    <!--@include('frontend.includes.left_register_sp')-->  
                    @include('frontend.includes.register_sp_benefit')
                </div>
                <div ng-if="authCtrl.active === 2">                                 
                    @include('frontend.includes.register_individual_benefit')                                              
                </div>
            </div>
            <div class="col-xs-12 col-sm-12 col-md-8 vertical-seprator main-tabs" >
                <div class="businessTabsMobile">
                    <button type="button" class="btn-main-tabs btn btn-default btn-sm" ng-class="{active:authCtrl.active === 1}"    ng-click="authCtrl.active = 1">Businesses & Freelancers Registration</button>
                    <button type="button" class="btn-main-tabs btn-for-service btn btn-default btn-sm" ng-class="{active:authCtrl.active === 2}" ng-click="authCtrl.active = 2">Customer Registration</button>
                </div>    
                <div class="row mg-tp-23">
                    <div class="col-sm-12 col-md-12">
                        <div class="register_form" ng-init="authCtrl.activetab=1">
                            <uib-tabset class="register_tab" >
                                <div ng-if="authCtrl.active === 1"> 
                                    <uib-tabset class="register_tab" >
                                        <uib-tab ng-click="authCtrl.activetab=1" heading="Service Provider" select="authCtrl.selectForm ('service_provider')" >
                                            @include('frontend.includes.register_service_provider')
                                        </uib-tab>
                                        <uib-tab ng-click="authCtrl.activetab=2" heading="Distributor" select="authCtrl.selectForm('distributor')" @if(app('request')->input('type')=='distributor') active="true" @endif >
                                            @include('frontend.includes.register_distributor')
                                        </uib-tab>
                                        <uib-tab ng-click="authCtrl.activetab=3" heading="School / College" select="authCtrl.selectForm('school_college')"  @if(app('request')->input('type')=='school_college') active="true" @endif>
                                            @include('frontend.includes.register_school_college')
                                        </uib-tab>                            
                                </div>
                                <div ng-if="authCtrl.active === 2">
                                    <uib-tab heading="" select="authCtrl.selectForm('individual')" @if(app('request')->input('type')=='individual') active="true" @endif >
                                        @include('frontend.includes.register_individual')
                                    </uib-tab>
                                </div>
                            </uib-tabset>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
<!--</section>-->

<!-- Modal -->
    <div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title" id="myModalLabel">Modal title</h4>
                </div>
                <div class="modal-body" style="text-align: center;">

                    <button class="btn-packages" plan-id="1">Trendy - Basic</button>
                    <button class="btn-packages" plan-id="2">Artistic - Medium</button>
                    <button class="btn-packages" plan-id="3">Glamours - Premium</button>

                    <div class="show-stripe-form">

                        <div class="form-row">

                            <div id="card-element">
                                <!-- A Stripe Element will be inserted here. -->
                            </div>

                            <!-- Used to display form errors. -->
                            <div id="card-errors" class="card-title" role="alert"></div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" id="save-button">Save changes</button>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
