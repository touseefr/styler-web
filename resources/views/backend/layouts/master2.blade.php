<!doctype html>
<html class="no-js" lang="">

    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="_token" content="{{ csrf_token() }}" />
        <title>@yield('title', app_name()) - Cpanel</title>
        <meta name="description" content="@yield('meta_description', 'Default Description')">
        <script type='text/javascript'>
            var web_site = "{{url('/')}}";
        </script>
        {!! HTML::style('css/backend/bootstrap.min.css') !!}    
        {!! HTML::style('css/backend/jquery-ui.css') !!}    
         <!--<link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">-->
      
        {!! HTML::style('css/raterater.css') !!}                    
        {!! HTML::style('build/css/star-rating.min.css') !!}
        @yield('meta') @yield('before-styles-end')
        {!! HTML::style(elixir('css/backend.css')) !!} 
        @yield('after-styles-end')
        {!! HTML::style('css/backend/select2.min.css') !!}@yield('before-styles-end')
        {!! HTML::style('css/backend/plugin/jstree/themes/proton/style.min.css') !!}@yield('before-styles-end')
        {!! HTML::style('css/backend/plugin/bootstrap-wysihtml5/bootstrap3-wysihtml5.min.css') !!}@yield('before-styles-end')


        @yield('before-styles-end') 

        {!! HTML::script('js/jquery.min.js') !!}
        {!! HTML::script('js/backend/plugin/select2/select2.full.min.js') !!}
        {!! HTML::script('js/backend/plugin/jstree/jstree.min.js') !!}
        {!! HTML::script('js/backend/plugin/bootstrap-wysihtml5/bootstrap3-wysihtml5.all.min.js') !!}
        {!! HTML::script('build/js/star-rating.min.js') !!}
        {!! HTML::script('js/popper.min.js') !!}

        <!---------------------------- Start charts --------------------------------->

        {!! HTML::script('js/backend/raphael-min.js') !!}
        {!! HTML::script('js/backend/morris.min.js') !!}
        {!! HTML::style('css/backend/morris.css') !!}

        <!---------------------------- END charts --------------------------------->
        <!--{!! HTML::style('css/backend/ionicons.min.css') !!}-->
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/ionicons/2.0.1/css/ionicons.min.css">
        <!--------------------------------dataTables---------------------------------------->
        {!! HTML::style('css/backend/jquery.dataTables.min.css') !!}
        <style>
            /* Override star colors */
            .raterater-bg-layer {
                color: rgba( 0, 0, 0, 0.25 );
            }
            .raterater-hover-layer {
                color: rgba( 255, 255, 0, 0.75 );
            }
            .raterater-hover-layer.rated {
                color: rgba( 255, 255, 0, 1 );
            }
            .raterater-rating-layer {
                color: rgba( 255, 155, 0, 0.75 );
            }
            .raterater-outline-layer {
                color: rgba( 0, 0, 0, 0.25 );
            }
        </style>
    </head>
    <body class="sidebar-mini skin-green">
        <div class="wrapper">
            
            <!-- Content Wrapper. Contains page content -->
            <div class="content-wrapper">
                <!-- Content Header (Page header) -->
                <section class="content-header">
                    @yield('page-header')
                    <ol class="breadcrumb">
                        @yield('breadcrumbs')
                    </ol>
                </section>
                <!-- Main content -->
                <section class="content importfile" >
                    
                    @yield('content')
                </section>
                <!-- /.content -->
            </div>
            <!-- /.content-wrapper -->
            
        </div>
        <!-- ./wrapper -->

        <script type="text/javascript">
            window.jQuery || document.write('<script src="{{asset('js / vendor / jquery - 1.11.2.min.js ')}}"><\/script>')
        </script>
        {!! HTML::script('js/vendor/bootstrap.min.js') !!} 
        {!! HTML::script('js/jquery-ui.js') !!} 
        <!--<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>-->

        {!! HTML::script('js/raterater.jquery.js') !!}        

        @yield('before-scripts-end') 
        {!! HTML::script(elixir('js/backend.js')) !!}
        @yield('after-scripts-end')

        <!--------------------------------dataTables---------------------------------------->  
        {!! HTML::script('js/jquery.dataTables.min.js') !!}
        {!! HTML::script('js/dataTables.buttons.min.js') !!}
        {!! HTML::script('js/buttons.flash.min.js') !!}
        {!! HTML::script('js/jszip.min.js') !!}
        {!! HTML::script('js/pdfmake.min.js') !!}
        {!! HTML::script('js/vfs_fonts.js') !!}
        {!! HTML::script('js/buttons.html5.min.js') !!}
        {!! HTML::script('js/buttons.print.min.js') !!}
        <script type="text/javascript">
            $(document).ready(function () {
                $('.table').DataTable({
                    dom: 'Bfrtip',
                    buttons: [
                        {
                            extend: 'excelHtml5',
                            exportOptions: {
                                columns: ':visible:not(.not-export-col)'
                            }
                        },
                        {
                            extend: 'pdfHtml5',
                            exportOptions: {
                                columns: ':visible:not(.not-export-col)'
                            },
                            orientation: 'landscape'
                        }

                    ]});
                var table = $('#features').DataTable();
                table.destroy();

                $('.ratebox').raterater({
                    //  submitFunction: 'rateAlert', 
                    allowChange: false,
                    starWidth: 20,
                    spaceWidth: 2,
                    numStars: 5,
                    isStatic: true
                });
//                $.datetimepicker.setLocale('en');
//                $('#datetimepicker4').datetimepicker();
//                
                 $('#fromDate').datepicker();
                 $(document).on("click","#btn-date-from",function(){                     
                    $("#fromDate").trigger("select");
                 });
                 
                 
                 $('#toDate').datepicker();
                 $(document).on("click","#btn-date-to",function(){                   
                    $("#toDate").trigger("select");
                 });

            });
        </script>
        {!! HTML::script('js/custom_js_module.js') !!}
        @yield('footer-scripts')
        


    </body>

</html>
