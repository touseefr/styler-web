{{ trans('strings.appointmentwith')}}
<br /><br />{{$appointment}}<br /><br />
{{trans('strings.followingservices')}}<br/><br />
@if(count($servicesSelected)>0)
<table><tr><th>Category</th><th>Service</th></tr>
@foreach($servicesSelected as $key=>$value)
<tr><td>{{ $value['category']['name'] }}</td><td>{{ $value['service']['name'] }}</td></tr>
@endforeach
</table>
@endif
