@section('after-angular-load')
@endsection
<style type="text/css">
    .tab-content>.tab-pane {
        display: block !important;
    }

    .tabCustomStyle li {
        margin-right: 0px;
    }
</style>
@extends('frontend.layouts.account') @section('content')
@include('frontend.includes.hearderportion')
<div class="clear"></div>
<section class="pt-25" ng-controller="SubscriptionController as subctl" ng-init="subctl.userType = 'ServiceProvider'">
    <div class="container">
        <div class="row" style="padding-bottom: 30px;">
            <div class="col-md-12">
                <div class="row">
                    <div class="col-md-12">
                        <h1 class="mt-0 mb-0 lineH1-5">Pricing</h1>
                    </div>
                    <div class="col-md-12">
                        <ul class="nav tabCustomStyle">
                            <?php foreach ($planinfo as $key => $plan) { ?>
                                <li <?php echo ($key == 0) ? 'class="active"' : ''; ?><?php echo count($plan['user_plans']) == 0 ? 'style="display:none;"' : ''; ?>><a data-toggle="tab" ng-click="subctl.userType = '<?php echo $plan['name']; ?>'">
                                        <?php if ($plan['name'] == "SchoolCollege") {
                                            echo "School/College";
                                        } else {
                                            echo $plan['name'];
                                        } ?>
                                    </a></li>
                            <?php  } ?>
                        </ul>
                        <div class="tab-content">
                            <?php foreach ($planinfo as $key => $plan) {
                                ?>
                                <div id="<?php echo $plan['name']; ?>" class="tab-pane fade in <?php echo ($key == 0) ? 'active' : ''; ?>" ng-if="subctl.userType == '<?php echo $plan['name']; ?>'">
                                    <div class="row packagesPricing">
                                        <?php
                                        $PlanPackagesClass = array("free", "glamour", "artistic");
                                        $planReplacement = array("week" => "weekly", "month" => "monthly", "year" => "annaully");
                                        foreach ($plan['user_plans'] as $index => $plandetail) {
                                            $descPoints = GuzzleHttp\json_decode($plandetail['template_description']);
                                            ?>
                                            <div class="col-xs-12 col-md-3">
                                                <div class="<?php
                                                            if ($plandetail['top_circle_text'] == "1") {
                                                                $index = 1;
                                                            } else {
                                                                $index = 0;
                                                            }

                                                            echo $PlanPackagesClass[$index];
                                                            ?>">
                                                    <div class="packageTitle">
                                                        <?php
                                                        if ($plandetail['plan_type'] == 0) {
                                                            echo "Free";
                                                        } else {
                                                            foreach ($plandetail['plan_detail'] as $keyVal => $valVal) {
                                                                echo '<span>' . $valVal['price'] . '<i class="fa fa-dollar small"></i></span> <small>' . $planReplacement[$valVal['duration']] . '</small>';
                                                                break;
                                                            }
                                                        }
                                                        ?>
                                                    </div>
                                                    <div class="availableFeatures" style="<?php echo (!empty($plandetail['bg_colour'])) ? 'background:' . $plandetail['bg_colour'] . ' !important;' : 'background:#FDE827 !important;' ?>">
                                                        <h2 class="font-bold h3"><?php echo $plandetail['name']; ?></h2>
                                                        <?php
                                                        foreach ($descPoints as $value) {
                                                            $value = (array)GuzzleHttp\json_decode($value);
                                                            ?>
                                                            <div class="featureItem">
                                                                <span><?php echo $value['text']; ?></span>
                                                                <?php
                                                                if ($value['type'] == 'cb') {
                                                                    if ($value['inputValue'] == '1') {
                                                                        ?>
                                                                        <span><i class="fa fa-check"></i></span>
                                                                    <?php } else {
                                                                    ?>
                                                                        <span><i class="fa fa-times"></i></span>


                                                                    <?php
                                                                }
                                                            } else {
                                                                ?>
                                                                    <span><?php echo $value['inputValue']; ?> </span>
                                                                <?php } ?>

                                                            </div>
                                                        <?php } ?>

                                                        <div class="buyNow">
                                                            <button type="button" class="btn btn-lg btn-block text-uppercase value" ng-click="subctl.openDialog(<?php echo $plandetail['plan_type']; ?>, <?php echo $plandetail['id']; ?>)" class="btn value">
                                                                <span ng-if="subctl.userplanid != '<?php echo $plandetail['id']; ?>'"><?php
                                                                                                                                        if ($plandetail['plan_type'] == 0) {
                                                                                                                                            echo "Free";
                                                                                                                                        } else {
                                                                                                                                            echo "Buy Now";
                                                                                                                                        }
                                                                                                                                        ?></span>
                                                                <span ng-if="subctl.userplanid == '<?php echo $plandetail['id']; ?>'">current</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        <?php } ?>
                                    </div>
                                </div>

                            <?php } ?>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
@endsection