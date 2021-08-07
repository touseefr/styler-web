<?php

namespace App;

use Kodeine\Metable\Metable;
Use DB;
use Illuminate\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Auth\Passwords\CanResetPassword;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Contracts\Auth\CanResetPassword as CanResetPasswordContract;
use Auth;

class User extends Model implements AuthenticatableContract, CanResetPasswordContract {

    use Authenticatable,
        CanResetPassword;
    use Metable;

    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'users';
    protected $metaTable = 'user_meta';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    //protected $hidden = ['password', 'remember_token'];

    /*     * *************************** charts function ************************** */

    /*
     * * get visitor count 
     */

    public static function get_visitor_count($by = '', $data = '') {
        switch ($by) {
            case "date":
                $count = DB::select("SELECT  count(distinct(ip_address)) as count FROM site_views WHERE DATE_FORMAT(created_at, '%Y-%m-%d')  = '" . $data . "'");
                break;
            case "month":
                $count = DB::select("SELECT  count(distinct(ip_address)) as count FROM site_views WHERE DATE_FORMAT(created_at, '%Y-%m')  = '" . $data . "'");
                break;
            case "year":
                $count = DB::select("SELECT  count(distinct(ip_address)) as count FROM site_views WHERE DATE_FORMAT(created_at, '%Y')  = '" . $data . "'");
                break;
            default:
                $count = DB::select("SELECT  count(distinct(ip_address)) as count FROM site_views");
                break;
        }
        return $count;
    }

    /*
     * * get sale count 
     */

    public static function get_sale_count($by = '', $data = '') {
        switch ($by) {
            case "date":
                $count = DB::select("SELECT  round(sum(amount)) as total_sale FROM transactions WHERE DATE_FORMAT(created_at, '%Y-%m-%d')  = '" . $data . "'");
                break;
            case "month":
                $count = DB::select("SELECT  round(sum(amount)) as total_sale FROM transactions WHERE DATE_FORMAT(created_at, '%Y-%m')  = '" . $data . "'");
                break;
            case "year":
                $count = DB::select("SELECT  round(sum(amount)) as total_sale FROM transactions WHERE DATE_FORMAT(created_at, '%Y')  = '" . $data . "'");
                break;
            default:
                $count = DB::select("SELECT  round(sum(amount)) as total_sale FROM transactions");
                break;
        }
        return $count;
    }

    public static function get_listing_count() {
        $count = DB::select("SELECT  count(*) as total_listing FROM listing");
        return $count[0]->total_listing;
    }

    public static function get_user_count() {
        $count = DB::select("SELECT  count(*) as total_users FROM users");
        return $count[0]->total_users;
    }

    /*
     * * return visitor chart data
     */

    public static function return_visitor_chart_data() {
        $data = '';
        $type = '';
        $val = '';
        $graph = '';
        if (isset($_REQUEST['graph']) && ($_REQUEST['graph'] == 'visitors')) {
            $type = $_REQUEST['type'];
            $val = $_REQUEST['val'] - 1;
        }

        switch ($type) {
            case 'days':
                /*                 * **************** Days calculation for charts data ********************** */

                for ($i = ($val); $i > 0; $i--) {
                    $temp = strtotime("-$i day");
                    $dates = date("Y-m-d", $temp);
                    $count_data = User::get_visitor_count('date', $dates);
                    $count = $count_data[0]->count;
                    $data .= "{ y: '" . date('D, M d, Y', strtotime($dates)) . "', a: " . $count . "},";
                }

                /*
                 * * current day
                 */
                $count_data1 = User::get_visitor_count('date', date("Y-m-d"));
                $count1 = $count_data1[0]->count;
                $data .= "{ y: '" . date('D, M d, Y') . "', a: " . $count1 . "},";

                /*                 * **************** END days calculation for charts data ********************** */
                break;
            case 'months':
                /*                 * **************** Months calculation for charts data ********************** */

                for ($i = $val; $i > 0; $i--) {
                    $temp = strtotime("-$i month");
                    $month = date("Y-m", $temp);
                    $count_data = User::get_visitor_count('month', $month);
                    $count = $count_data[0]->count;
                    $data .= "{ y: '" . date('M', strtotime($month)) . "', a: " . $count . "},";
                }
                /*
                 * * current month
                 */
                $count_data1 = User::get_visitor_count('month', date("Y-m"));
                $count1 = $count_data1[0]->count;
                $data .= "{ y: '" . date('M') . "', a: " . $count1 . "},";
                /*                 * **************** END months calculation for charts data ********************** */
                break;
            case 'years':
                /*                 * **************** Years calculation for charts data ********************** */

                for ($i = $val; $i > 0; $i--) {
                    $temp = strtotime("-$i year");
                    $year = date("Y", $temp);
                    $count_data = User::get_visitor_count('year', $year);
                    $count = $count_data[0]->count;
                    $data .= "{ y: '" . $year . "', a: " . $count . "},";
                }

                /*
                 * * current year
                 */
                $count_data1 = User::get_visitor_count('year', date('Y'));
                $count1 = $count_data1[0]->count;
                $data .= "{ y: '" . date('Y') . "', a: " . $count1 . "},";

                /*                 * **************** END years calculation for charts data ********************** */
                break;
            default:
                /*                 * **************** Days calculation for charts data ********************** */

                for ($i = 9; $i > 0; $i--) {
                    $temp = strtotime("-$i day");
                    $dates = date("Y-m-d", $temp);
                    $count_data = User::get_visitor_count('date', $dates);
                    $count = $count_data[0]->count;
                    $data .= "{ y: '" . date('D, M d, Y', strtotime($dates)) . "', a: " . $count . "},";
                }

                /*
                 * * current day
                 */
                $count_data1 = User::get_visitor_count('date', date("Y-m-d"));
                $count1 = $count_data1[0]->count;
                $data .= "{ y: '" . date('D, M d, Y') . "', a: " . $count1 . "},";
                /*                 * **************** END days calculation for charts data ********************** */
                break;
        }
        return $data;
    }

    /*
     * * return sale chart data
     */

    public static function return_sale_chart_data() {
        $data = '';
        $type = '';
        $val = '';
        $graph = '';
        if (isset($_REQUEST) && !empty($_REQUEST['type']) && ($_REQUEST['graph'] == 'sales')) {
            $type = $_REQUEST['type'];
            $val = $_REQUEST['val'] - 1;
        }

        switch ($type) {
            case 'days':
                /*                 * **************** Days calculation for charts data ********************** */

                for ($i = $val; $i > 0; $i--) {
                    $temp = strtotime("-$i day");
                    $dates = date("Y-m-d", $temp);
                    $count_data = User::get_sale_count('date', $dates);
                    $count = $count_data[0]->total_sale;
                    if ($count == '') {
                        $count = 0;
                    }
                    $data .= "{ y: '" . date('D, M d, Y', strtotime($dates)) . "', a: " . $count . "},";
                }
                /*
                 * * current day
                 */

                $count_data1 = User::get_sale_count('date', date('Y-m-d'));

                $count1 = $count_data1[0]->total_sale;
                $count1 = ($count1 == '') ? 0 : $count1;
                $data .= "{ y: '" . date('D, M d, Y') . "', a: " . $count1 . "},";

                /*                 * **************** END days calculation for charts data ********************** */
                break;
            case 'months':
                /*                 * **************** Months calculation for charts data ********************** */

                for ($i = $val; $i > 0; $i--) {
                    $temp = strtotime("-$i month");
                    $month = date("Y-m", $temp);
                    $count_data = User::get_sale_count('month', $month);
                    $count = $count_data[0]->total_sale;
                    if ($count == '') {
                        $count = 0;
                    }
                    $data .= "{ y: '" . date('M', strtotime($month)) . "', a: " . $count . "},";
                }

                /*
                 * * current month
                 */

                $count_data1 = User::get_sale_count('month', date('Y-m'));
                $count1 = $count_data1[0]->total_sale;
                $count1 = ($count1 == '') ? 0 : $count1;
                $data .= "{ y: '" . date('M') . "', a: " . $count1 . "},";


                /*                 * **************** END months calculation for charts data ********************** */
                break;
            case 'years':
                /*                 * **************** Years calculation for charts data ********************** */

                for ($i = $val; $i > 0; $i--) {
                    $temp = strtotime("-$i year");
                    $year = date("Y", $temp);
                    $count_data = User::get_sale_count('year', $year);
                    $count = $count_data[0]->total_sale;
                    if ($count == '') {
                        $count = 0;
                    }
                    $data .= "{ y: '" . $year . "', a: " . $count . "},";
                }

                /*
                 * * current year
                 */

                $count_data1 = User::get_sale_count('year', date('Y'));
                $count1 = $count_data1[0]->total_sale;
                $count1 = ($count1 == '') ? 0 : $count1;
                $data .= "{ y: '" . date('Y') . "', a: " . $count1 . "},";

                /*                 * **************** END years calculation for charts data ********************** */
                break;
            default:
                /*                 * **************** Days calculation for charts data ********************** */

                for ($i = 10; $i > 0; $i--) {
                    $temp = strtotime("-$i day");
                    $dates = date("Y-m-d", $temp);
                    $count_data = User::get_sale_count('date', $dates);
                    $count = $count_data[0]->total_sale;
                    if ($count == '') {
                        $count = 0;
                    }
                    $data .= "{ y: '" . date('D, M d, Y', strtotime($dates)) . "', a: " . $count . "},";
                }

                /*
                 * * current day
                 */

                $count_data1 = User::get_sale_count('date', date('Y-m-d'));
                $count1 = $count_data1[0]->total_sale;
                $count1 = ($count1 == '') ? 0 : $count1;
                $data .= "{ y: '" . date('D, M d, Y') . "', a: " . $count1 . "},";

                /****************** END days calculation for charts data ********************** */
                break;
        }
        return $data;
    }

    /*
     * * get os info from user info
     */

    public static function getOS($user_agent) {


        $os_platform = "Unknown OS Platform";

        $os_array = array(
            '/windows nt 10/i' => 'Windows 10',
            '/windows nt 6.3/i' => 'Windows 8.1',
            '/windows nt 6.2/i' => 'Windows 8',
            '/windows nt 6.1/i' => 'Windows 7',
            '/windows nt 6.0/i' => 'Windows Vista',
            '/windows nt 5.2/i' => 'Windows Server 2003/XP x64',
            '/windows nt 5.1/i' => 'Windows XP',
            '/windows xp/i' => 'Windows XP',
            '/windows nt 5.0/i' => 'Windows 2000',
            '/windows me/i' => 'Windows ME',
            '/win98/i' => 'Windows 98',
            '/win95/i' => 'Windows 95',
            '/win16/i' => 'Windows 3.11',
            '/macintosh|mac os x/i' => 'Mac OS X',
            '/mac_powerpc/i' => 'Mac OS 9',
            '/linux/i' => 'Linux',
            '/ubuntu/i' => 'Ubuntu',
            '/iphone/i' => 'iPhone',
            '/ipod/i' => 'iPod',
            '/ipad/i' => 'iPad',
            '/android/i' => 'Android',
            '/blackberry/i' => 'BlackBerry',
            '/webos/i' => 'Mobile'
        );

        foreach ($os_array as $regex => $value) {

            if (preg_match($regex, $user_agent)) {
                $os_platform = $value;
            }
        }

        return $os_platform;
    }

    /*
     * * Get browser info from user agent
     */

    public static function getBrowser($user_agent) {

        $browser = "Unknown Browser";

        $browser_array = array(
            '/msie/i' => 'Internet Explorer',
            '/firefox/i' => 'Firefox',
            '/safari/i' => 'Safari',
            '/chrome/i' => 'Chrome',
            '/edge/i' => 'Edge',
            '/opera/i' => 'Opera',
            '/netscape/i' => 'Netscape',
            '/maxthon/i' => 'Maxthon',
            '/konqueror/i' => 'Konqueror',
            '/mobile/i' => 'Handheld Browser'
        );

        foreach ($browser_array as $regex => $value) {

            if (preg_match($regex, $user_agent)) {
                $browser = $value;
            }
        }

        return $browser;
    }

    /*
     * * Pagination
     */

    public static function pagination($targetset, $total_records, $limit, $set) {
        unset($_GET['page']);
        $qs = http_build_query($_GET);
        $qs = str_replace('?set=' . $set, '', $qs);
        $qs = str_replace('&set=' . $set, '', $qs);
        $qs = str_replace('set=' . $set, '', $qs);
        $identifier = (empty($qs)) ? '?' : '&';
        $identifier2 = (empty($qs)) ? '' : '?';
        // How many adjacent sets should be shown on each side?
        $adjacents = 3;

        /*
          First get total number of rows in data table.
          If you have a WHERE clause in your query, make sure you mirror it here.
         */
        //$query = "SELECT COUNT(*) as num FROM $tbl_name";
        //$total_sets = mysql_fetch_array(mysql_query($query));
        $total_sets = $total_records;

        /* Setup vars for query. */
        //$targetset = get_site_url()."/?".$_SERVER['QUERY_STRING']; 	//your file name  (the name of this file)
        //$targetset = get_site_url()."/".$_REQUEST['page'].$identifier2.$qs; 	//your file name  (the name of this file)
        //$limit = 2; 								//how many items to show per set
        //$set = $_GET['set'];
        //$start = get_offset($limit, $set);								//if no set var is given, set start to 0

        /* Get data. */
        //$sql = "SELECT column_name FROM $tbl_name LIMIT $start, $limit";
        //$result = mysql_query($sql);

        /* Setup set vars for display. */
        if ($set == 0)
            $set = 1;     //if no set var is given, default to 1.
        $prev = $set - 1;       //previous set is set - 1
        $next = $set + 1;

        $lastset = ceil($total_sets / $limit);  //lastset is = total sets / items per set, rounded up.
        $lpm1 = $lastset - 1;      //last set minus 1

        /*
          Now we apply our rules and draw the pagination object.
          We're actually saving the code to a variable in case we want to draw it more than once.
         */
        $pagination = "";
        if ($lastset > 1) {
            $pagination .= "<div class=\"pagination\"><ul class=\"pagination pagination_1\">";
            //previous button
            if ($set > 1)
                $pagination .= "<li><a href=\"$targetset" . $identifier . "set=$prev\">&laquo; Previous</a></li>";
            else
                $pagination .= "<li><a href=\"#\"><span class=\"disabled\">&laquo; Previous</span></a></li>";

            //sets	
            if ($lastset < 7 + ($adjacents * 2)) { //not enough sets to bother breaking it up
                for ($counter = 1; $counter <= $lastset; $counter++) {
                    if ($counter == $set)
                        $pagination .= "<li><a href=\"#\" class=\"current\"><span>$counter</span></a></li>";
                    else
                        $pagination .= "<li><a href=\"$targetset" . $identifier . "set=$counter\">$counter</a></li>";
                }
            }
            elseif ($lastset > 5 + ($adjacents * 2)) { //enough sets to hide some
                //close to beginning; only hide later sets
                if ($set < 1 + ($adjacents * 2)) {
                    for ($counter = 1; $counter < 4 + ($adjacents * 2); $counter++) {
                        if ($counter == $set)
                            $pagination .= "<li><a href=\"#\" class=\"current\"><span>$counter</span></a></li>";
                        else
                            $pagination .= "<li><a href=\"$targetset" . $identifier . "set=$counter\">$counter</a></li>";
                    }
                    $pagination .= "<li><a href=\"#\">...</a></li>";
                    $pagination .= "<li><a href=\"$targetset" . $identifier . "set=$lpm1\">$lpm1</a></li>";
                    $pagination .= "<li><a href=\"$targetset" . $identifier . "set=$lastset\">$lastset</a></li>";
                }
                //in middle; hide some front and some back
                elseif ($lastset - ($adjacents * 2) > $set && $set > ($adjacents * 2)) {
                    $pagination .= "<li><a href=\"$targetset" . $identifier . "set=1\">1</a></li>";
                    $pagination .= "<li><a href=\"$targetset" . $identifier . "set=2\">2</a></li>";
                    $pagination .= "<li><a href=\"#\">...</a></li>";
                    for ($counter = $set - $adjacents; $counter <= $set + $adjacents; $counter++) {
                        if ($counter == $set)
                            $pagination .= "<li><a href=\"#\" class=\"current\"><span>$counter</span></a></li>";
                        else
                            $pagination .= "<li><a href=\"$targetset" . $identifier . "set=$counter\">$counter</a></li>";
                    }
                    $pagination .= "<li><a href=\"#\">...</a></li>";
                    $pagination .= "<li><a href=\"$targetset" . $identifier . "set=$lpm1\">$lpm1</a></li>";
                    $pagination .= "<li><a href=\"$targetset" . $identifier . "set=$lastset\">$lastset</a></li>";
                }
                //close to end; only hide early sets
                else {
                    $pagination .= "<li><a href=\"$targetset" . $identifier . "set=1\">1</a></li>";
                    $pagination .= "<li><a href=\"$targetset" . $identifier . "set=2\">2</a></li>";
                    $pagination .= "<li><a href=\"#\">...</a></li>";
                    for ($counter = $lastset - (2 + ($adjacents * 2)); $counter <= $lastset; $counter++) {
                        if ($counter == $set)
                            $pagination .= "<li><a href=\"#\" class=\"current\"><span>$counter</span></a></li>";
                        else
                            $pagination .= "<li><a href=\"$targetset" . $identifier . "set=$counter\">$counter</a></li>";
                    }
                }
            }

            //next button
            if ($set < $counter - 1)
                $pagination .= "<li><a href=\"$targetset" . $identifier . "set=$next\">Next &raquo;</a></li>";
            else
                $pagination .= "<li><a href=\"#\"><span class=\"disabled\">Next &raquo;</span></a></li>";
            $pagination .= "</ul></div>\n";
        }
        echo $pagination;
    }

    /*
     * * get offset
     */

    public static function get_offset($limit, $set) {
        if ($set)
            $start = ($set - 1) * $limit;    //first item to display on this set
        else
            $start = 0;


        return $start;
    }

    /*
     * * get user role
     */

    public static function get_role($user_id) {
        $role = DB::select("select a.name from roles a join assigned_roles b on(a.id = b.role_id) where b.user_id = {$user_id}");
        if ($role) {
            return $role[0]->name;
        } else {
            return '';
        }
    }

    /*
     * * get paid roles
     */

    public static function paid_roles() {
        return array('ServiceProvider', 'Distributor');
    }

    /*
     * * remove watchlist item
     */

    public static function remove_watchlist_item($item_id, $user_id, $watchtype) {
        if (DB::delete("delete from watch_list where item_id = {$item_id} and user_id = {$user_id} and watchtype = '{$watchtype}'")) {
            return 'true';
        } else {
            return 'false';
        }
    }
    
    public static function getuserrole($user_id){
        $user_role=DB::table('assigned_roles')
                    ->select(DB::raw("roles.name"))
                    ->join("roles","roles.id","=","assigned_roles.role_id")
                    ->where("assigned_roles.user_id",$user_id)
                    ->get();    
        print_r($user_role);
        exit;

    }

}
