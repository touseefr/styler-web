<?php

namespace App\Repositories\Backend\Subscription;

use App\Exceptions\GeneralException;
use App\Models\UserSubscription\InvoiceRecords;
use App\Repositories\Backend\Subscription\InvoiceRecordsContract;

class EloquentInvoiceRecordsRepository implements InvoiceRecordsContract {

    public function getInvoiceDetail() {
        return InvoiceRecords::with('userDetail')->orderBy('id', 'dsc')->get();
    }

    public function searchInvoiceRecords($input) {
        $invoiceRecords = InvoiceRecords::with('userDetail')
                ->with('userDetail');

        if (isset($input['plan_type']) && !empty($input['plan_type'])) {
            $invoiceRecords->where("interval", $input['plan_type']);
        }

        if (isset($input['plan']) && !empty($input['plan'])) {
            $invoiceRecords->where("plan_title", $input['plan']);
        }
        
        if((isset($input['from_date']) && !empty($input['from_date']) )&&(isset($input['to_date']) && !empty($input['to_date'])) && ($input['from_date'] === $input['to_date']) ){
             $invoiceRecords->whereDate('start_from','=',date('Y-m-d', strtotime($input['to_date'])));
        }else{
        
        if (isset($input['from_date']) && !empty($input['from_date'])) {

            $todate = date('Y-m-d', strtotime($input['to_date']));
            if (isset($input['to_date']) && empty($input['to_date'])) {
                $todate = Date('Y-m-d');
            }
            $invoiceRecords->whereBetween('start_from', [date('Y-m-d', strtotime($input['from_date'])), $todate]);
        } else {
            if (isset($input['to_date']) && !empty($input['to_date'])) {
                $invoiceRecords->whereDate('start_from','<=',date('Y-m-d', strtotime($input['to_date'])));
            }
        }
        }
        if (isset($input['business_type']) && !empty($input['business_type'])) {
            $invoiceRecords->whereHas('userDetail.roles', function ($query) use($input) {
                $query->where('name', $input['business_type']);
            });
        }
//        echo  $invoiceRecords->orderBy('id', 'dsc')->toSql();
//        print_r($invoiceRecords->getBindings());
        return $invoiceRecords->orderBy('id', 'dsc')->get();
    }

}
