<?php

namespace App\Repositories\Backend\Subscription;

//use App\Repositories\Backend\Subscription\EloquentInvoiceRecordsRepository;

interface InvoiceRecordsContract {

    public function getInvoiceDetail();

    public function searchInvoiceRecords($input);
}
