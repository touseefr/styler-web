<?php 
$inv_id = $_REQUEST['inv_id'];
$inv_info = App\Invoice::where('id', $inv_id)->get();
$inv_date = $inv_info[0] -> generated_on;
$user = DB::select("select * from users where id = {$inv_info[0] -> user_id}");
$user_info = DB::select("select * from user_info where user_id = {$inv_info[0] -> user_id}");
//$invoice = App\Invoice::where('txn_id', $txn_id)->get();
$plan = @unserialize($inv_info[0] -> plan_info);

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Untitled Document</title>
</head>
<?php 
		$onload = (isset($_REQUEST['print'])) ? 'onload="window.print();"' : '';
?>
<body <?php echo $onload;?>>
<table width="550" border="0" cellspacing="5" cellpadding="5" style="font-family:Arial, Helvetica, sans-serif; font-size:12px;">
  <tr>
    <td width="450"><?php echo Settings::get('company_name');?> Inc.</td>
    <td width="100">Date: {{$inv_date}}</td>
  </tr>
  <tr>
    <td colspan="2"><table width="570" border="0" cellspacing="5" cellpadding="5">
      <tr>
        <td>From<br />
          <strong>{{Settings::get('company_name')}}, Inc.</strong><br />
          {{Settings::get('company_address')}}<br />
          Phone: {{Settings::get('company_phone')}}<br />
          Email: {{Settings::get('company_email')}}
		  </td>
        <td>To<br />
          <strong><?php if(!empty($user[0] -> name)){echo $user[0] -> name;}?></strong><br>
			  <?php if(!empty($user_info[0] -> address)){echo $user_info[0] -> address;}?><br>
          Phone: <?php if(!empty($user_info[0] -> contact_number)){echo $user_info[0] -> contact_number;}?><br>
          Email: <?php if(!empty($user[0] -> email)){echo $user[0] -> email;}?></td>
        <td><p><strong>Invoice #{{$inv_id}}</strong></p>
          <p><strong>Order ID</strong>: {{$inv_id}}<br />
           </p></td>
      </tr>
    </table></td>
  </tr>
  <tr>
    <td colspan="2"><table width="550" border="0" cellspacing="5" cellpadding="5">
      <tr bgcolor="#CCCCCC">
        <td width="6%"><strong>Qty</strong></td>
        <td width="14%"><strong>Product</strong></td>
        <td width="15%"><strong>Serial #</strong></td>
        <td width="47%"><strong>Description</strong></td>
        <td width="18%"><strong>Subtotal</strong></td>
      </tr>
      <tr>
        <td>1</td>
        <td>{{$plan['name']}}</td>
        <td>{{$plan['id']}}</td>
        <td>{{$plan['desc']}}</td>
        <td>{{$inv_info[0] -> price}} {{$inv_info[0] -> currency}}</td>
      </tr>
    </table></td>
  </tr>
  <tr>
    <td colspan="2"><table width="550" border="0" cellspacing="5" cellpadding="5">
      <tr>
        <td width="64%">&nbsp;</td>
        <td width="36%"><h3>Amount Due {{$inv_date}}</h3></td>
      </tr>
      <tr>
        <td>&nbsp;</td>
        <td><table width="200" border="0" cellspacing="1" cellpadding="1">
          <tr>
            <td align="left"><strong>Subtotal:</strong></td>
            <td>{{$inv_info[0] -> price}} {{$inv_info[0] -> currency}}</td>
          </tr>

          <tr>
            <td align="left"><strong>Total:</strong></td>
            <td>{{$inv_info[0] -> price}} {{$inv_info[0] -> currency}}</td>
          </tr>
          <tr>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
          </tr>
        </table></td>
      </tr>
    </table></td>
  </tr>
  <tr>
    <td colspan="2">&nbsp;</td>
  </tr>
</table>

</body>
</html>
