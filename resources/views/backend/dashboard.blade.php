@extends('backend.layouts.master') 
@section('page-header')
<h1>
    {{ trans('strings.backend.dashboard_title') }}
</h1>
@endsection 
@section('breadcrumbs')
<li>
    <a href="{!!route('backend.dashboard')!!}">
        <i class="fa fa-dashboard"></i> {{ trans('menus.dashboard') }}</a>
</li>
<li class="active">{{ trans('strings.here') }}</li>
@endsection @section('content')
<!-- Info boxes -->

<div class="row summary mb-4">
    <div class="col">
        <!-- small box -->
        <div class="small-box bg-aqua">
            <div class="inner d-flex justify-content-between">
              <div class="">
<!--                <h3><?php // echo (App\User::get_sale_count()[0]->total_sale)?App\User::get_sale_count()[0]->total_sale:"$0"; ?></h3>-->
                <h3>$<?php echo ($balance)?$balance:"0"; ?></h3>
                <p>Total Sales</p>
              </div>
              <!-- <div class="">
                <h3><?php echo (App\User::get_sale_count()[0]->total_sale) ? App\User::get_sale_count()[0]->total_sale : "$0"; ?></h3>
                <p>Last Month Sale</p>
              </div>
              <div class="">
                <h3><?php echo (App\User::get_sale_count()[0]->total_sale)? App\User::get_sale_count()[0]->total_sale: "$0"; ?></h3>
                <p>This Month Sale</p>
              </div> -->
            </div>
            <div class="icon">
              <i class="ion ion-stats-bars"></i>
            </div>
            <a href="{{url('admin/transactions')}}" class="small-box-footer">More info <i class="fa fa-arrow-circle-right"></i></a>
        </div>
    </div>
    <!-- ./col -->
    <div class="col">
        <!-- small box -->
        <div class="small-box bg-green">
            <div class="inner">
                <h3><?php echo App\User::get_listing_count(); ?></h3>
                <p>Total Listings</p>
            </div>
            <div class="icon">
                <i class="ion ion-bag"></i>
            </div>
<!--            <a href="#" class="small-box-footer">More info <i class="fa fa-arrow-circle-right"></i></a>-->
        </div>
    </div>
    <!-- ./col -->
    <div class="col">
        <!-- small box -->
        <div class="small-box bg-yellow">
            <div class="inner">
                <h3><?php echo App\User::get_user_count(); ?></h3>
                <p>User Registrations</p>
            </div>
            <div class="icon">
                <i class="ion ion-person-add"></i>
            </div>
            <a href="{{url('admin/access/users')}}" class="small-box-footer">More info <i class="fa fa-arrow-circle-right"></i></a>
        </div>
    </div>
    <!-- ./col -->
    <div class="col">
        <!-- small box -->
        <div class="small-box bg-red">
            <div class="inner">
                <h3><?php echo App\User::get_visitor_count()[0]->count; ?></h3>
                <p>Unique Visitors</p>
            </div>
            <div class="icon">
                <i class="ion ion-pie-graph"></i>
            </div>
            <a href="{{url('admin/dashboard/visits')}}" class="small-box-footer">More info <i class="fa fa-arrow-circle-right"></i></a>
        </div>
    </div>
    <!-- ./col -->
</div>

<div class="btn-right" align="right"><a href="{{url('admin/dashboard/visits')}}" class="btn btn-primary">Visited Users</a></div>
<!------------------------------------------ Start visitors graph -------------------------------------------->
<div class="row">
    <div class="col-sm-12">
        <div class="box box-solid bg-teal-gradient visitors_charts">
            <div class="box-header">
                <h3 class="box-title" style="color:#000;">Visitors Graph: 
                    <?php
                    if (isset($_REQUEST['graph']) && ($_REQUEST['graph'] == 'visitors')) {
                        $visitor_title = '' . $_REQUEST["val"] . ' ' . ucfirst($_REQUEST["type"]) . '';
                    } else {
                        $visitor_title = '10 Days';
                    }
                    echo $visitor_title;
                    ?>
                </h3>
                <div class="hit_statistics">
                    <ul>
                        <li><a href="{{url('/admin/dashboard?type=days&val=10&graph=visitors')}}" class="<?php if ($visitor_title == '10 Days') {
                        echo 'active';
                    } ?>">10 Days</a></li>
                        <li><a href="{{url('/admin/dashboard?type=days&val=20&graph=visitors')}}" class="<?php if ($visitor_title == '20 Days') {
                        echo 'active';
                    } ?>">20 Days</a></li>
                        <li><a href="{{url('/admin/dashboard?type=days&val=30&graph=visitors')}}" class="<?php if ($visitor_title == '30 Days') {
                        echo 'active';
                    } ?>">30 Days</a></li>
                        <li><a href="{{url('/admin/dashboard?type=months&val=2&graph=visitors')}}" class="<?php if ($visitor_title == '2 Months') {
                        echo 'active';
                    } ?>">2 Months</a></li>
                        <li><a href="{{url('/admin/dashboard?type=months&val=3&graph=visitors')}}" class="<?php if ($visitor_title == '3 Months') {
                        echo 'active';
                    } ?>">3 Months</a></li>
                        <li><a href="{{url('/admin/dashboard?type=months&val=6&graph=visitors')}}" class="<?php if ($visitor_title == '6 Months') {
                        echo 'active';
                    } ?>">6 Months</a></li>
                        <li><a href="{{url('/admin/dashboard?type=months&val=9&graph=visitors')}}" class="<?php if ($visitor_title == '9 Months') {
                        echo 'active';
                    } ?>">9 Months</a></li>
                        <li><a href="{{url('/admin/dashboard?type=years&val=1&graph=visitors')}}" class="<?php if ($visitor_title == '1 Years') {
                        echo 'active';
                    } ?>">1 Year</a></li>
                        <li><a href="{{url('/admin/dashboard?type=years&val=2&graph=visitors')}}" class="<?php if ($visitor_title == '2 Years') {
            echo 'active';
        } ?>">2 Year</a></li>
                        <li><a href="{{url('/admin/dashboard?type=years&val=3&graph=visitors')}}" class="<?php if ($visitor_title == '3 Years') {
            echo 'active';
        } ?>">3 Year</a></li>
                        <li><a href="{{url('/admin/dashboard?type=years&val=4&graph=visitors')}}" class="<?php if ($visitor_title == '4 Years') {
            echo 'active';
        } ?>">4 Year</a></li>
                        <li><a href="{{url('/admin/dashboard?type=years&val=5&graph=visitors')}}" class="<?php if ($visitor_title == '5 Years') {
            echo 'active';
        } ?>">5 Year</a></li>
                    </ul>
                </div>
            </div>
            <div class="box-body border-radius-none">
                <div class="chart" id="visitors-chart" style="height: 250px;"></div>
            </div><!-- /.box-body -->

        </div><!-- /.box -->
<?php
$visitors = App\User::return_visitor_chart_data();

/* for($i=2; $i>0;$i--)
  {
  $temp = strtotime("-$i year");
  $year = date("Y-m-d", $temp );
  echo $year;
  } */
?>
        <script>

            var line = new Morris.Bar({
                element: 'visitors-chart',
                resize: true,
                data: [
<?php echo $visitors; ?>
                ],
                xkey: 'y',
                ykeys: ['a'],
                labels: ['Visitors'],
                lineColors: ['#000'],
                lineWidth: 1,
                hideHover: 'auto',
                gridTextColor: "#000",
                gridStrokeWidth: 0.4,
                pointSize: 4,
                pointStrokeColors: ["#000"],
                gridLineColor: "#000",
                gridTextFamily: "Open Sans",
                gridTextSize: 10
                        /* lineColors: ['#efefef'],
                         lineWidth: 2,
                         hideHover: 'auto',
                         gridTextColor: "#fff",
                         gridStrokeWidth: 0.4,
                         pointSize: 4,
                         pointStrokeColors: ["#efefef"],
                         gridLineColor: "#efefef",
                         gridTextFamily: "Open Sans",
                         gridTextSize: 10   */
            });

        </script>


        <!-- /#chart -->
    </div>
</div>

<!------------------------------------------ End visitors graph -------------------------------------------->

<!------------------------------------------ Start sales graph -------------------------------------------->
<!--<div class="row">
    <div class="col-sm-12">
        <div class="box box-solid bg-teal-gradient visitors_charts">
            <div class="box-header">
                <h3 class="box-title" style="color:#000;">Sales Graph: 
<?php
if (isset($_REQUEST['graph']) && ($_REQUEST['graph'] == 'sales')) {
    $sale_title = '' . $_REQUEST["val"] . ' ' . ucfirst($_REQUEST["type"]) . '';
} else {
    $sale_title = '10 Days';
}
echo $sale_title;
?>
                </h3>
                <div class="hit_statistics">
                    <ul>
                        <li><a href="{{url('/admin/dashboard?type=days&val=10&graph=sales')}}" class="<?php if ($sale_title == '10 Days') {
    echo 'active';
} ?>">10 Days</a></li>
                        <li><a href="{{url('/admin/dashboard?type=days&val=20&graph=sales')}}" class="<?php if ($sale_title == '20 Days') {
            echo 'active';
        } ?>">20 Days</a></li>
                        <li><a href="{{url('/admin/dashboard?type=days&val=30&graph=sales')}}" class="<?php if ($sale_title == '30 Days') {
            echo 'active';
        } ?>">30 Days</a></li>
                        <li><a href="{{url('/admin/dashboard?type=months&val=2&graph=sales')}}" class="<?php if ($sale_title == '2 Months') {
            echo 'active';
        } ?>">2 Months</a></li>
                        <li><a href="{{url('/admin/dashboard?type=months&val=3&graph=sales')}}" class="<?php if ($sale_title == '3 Months') {
            echo 'active';
        } ?>">3 Months</a></li>
                        <li><a href="{{url('/admin/dashboard?type=months&val=6&graph=sales')}}" class="<?php if ($sale_title == '6 Months') {
            echo 'active';
        } ?>">6 Months</a></li>
                        <li><a href="{{url('/admin/dashboard?type=months&val=9&graph=sales')}}" class="<?php if ($sale_title == '9 Months') {
            echo 'active';
        } ?>">9 Months</a></li>
                        <li><a href="{{url('/admin/dashboard?type=years&val=1&graph=sales')}}" class="<?php if ($sale_title == '1 Years') {
            echo 'active';
        } ?>">1 Year</a></li>
                        <li><a href="{{url('/admin/dashboard?type=years&val=2&graph=sales')}}" class="<?php if ($sale_title == '2 Years') {
            echo 'active';
        } ?>">2 Year</a></li>
                        <li><a href="{{url('/admin/dashboard?type=years&val=3&graph=sales')}}" class="<?php if ($sale_title == '3 Years') {
            echo 'active';
        } ?>">3 Year</a></li>
                        <li><a href="{{url('/admin/dashboard?type=years&val=4&graph=sales')}}" class="<?php if ($sale_title == '4 Years') {
            echo 'active';
        } ?>">4 Year</a></li>
                        <li><a href="{{url('/admin/dashboard?type=years&val=5&graph=sales')}}" class="<?php if ($sale_title == '5 Years') {
            echo 'active';
        } ?>">5 Year</a></li>
                    </ul>
                </div>
            </div>
            <div class="box-body border-radius-none">
                <div class="chart" id="sales-chart" style="height: 250px;"></div>
            </div> /.box-body 

        </div> /.box 
<?php
$sales = App\User::return_sale_chart_data();

/* for($i=2; $i>0;$i--)
  {
  $temp = strtotime("-$i year");
  $year = date("Y-m-d", $temp );
  echo $year;
  } */
?>
        <script>

//            var line = new Morris.Bar({
//                element: 'sales-chart',
//                resize: true,
//                data: [
//<?php // echo $sales; ?>
//                ],
//                xkey: 'y',
//                ykeys: ['a'],
//                labels: ['Sale'],
//                lineColors: ['#000'],
//                lineWidth: 1,
//                hideHover: 'auto',
//                gridTextColor: "#000",
//                gridStrokeWidth: 0.4,
//                pointSize: 4,
//                pointStrokeColors: ["#000"],
//                gridLineColor: "#000",
//                gridTextFamily: "Open Sans",
//                gridTextSize: 10
//                        /* lineColors: ['#efefef'],
//                         lineWidth: 2,
//                         hideHover: 'auto',
//                         gridTextColor: "#fff",
//                         gridStrokeWidth: 0.4,
//                         pointSize: 4,
//                         pointStrokeColors: ["#efefef"],
//                         gridLineColor: "#efefef",
//                         gridTextFamily: "Open Sans",
//                         gridTextSize: 10   */
//            });

        </script>


         /#chart 
    </div>
</div>

---------------------------------------- End Sales graph ------------------------------------------

 /.row -->
@endsection
