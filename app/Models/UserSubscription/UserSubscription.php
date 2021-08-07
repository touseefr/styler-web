<?php

namespace App\Models\UserSubscription;

use Illuminate\Database\Eloquent\Model;
use App\Models\Plans\Plans;
class UserSubscription extends Model {

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'user_subscription';

    /**
     * The attributes that should be mutated to dates.
     *
     * @var array
     */
    protected $dates = ['deleted_at'];
    protected $fillable = ['plan_id', 'plan_status','trial_status','starting_date','ending_date','plan_type','stripe_invoiceId','stp_customer_id','stp_card_token'];

    public function scopestatusactive($query) {
        $query->where("plan_status", 1);
    }

    public function subscription_user_plan(){
        return $this->belongsTo(Plans::class,'plan_id');
    }

}
