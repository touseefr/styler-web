<?php

namespace App\Models\UserSubscription;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\UserSubscription\Traits\Relationship\InvoiceRecordsRelationship;

class InvoiceRecords extends Model {

    use SoftDeletes,InvoiceRecordsRelationship;

    protected $table = 'invoice_records';

    /**
     * The attributes that should be mutated to dates.
     *
     * @var array
     */
    protected $dates = ['deleted_at'];
    protected $fillable = ['user_id', 'stripe_customer_id', 'type', 'plan_title', 'amount', 'currency', 'invoiceId', 'interval', 'start_from', 'end_at', 'stripe_string_payment_succeeded'];

}
