<?php namespace App\Models\Schoolcolleges\Traits\Attribute;

use Illuminate\Support\Facades\Hash;

/**
 * Class SchoolcollegesAttribute
 * @package App\Models\Schoolcolleges\Traits\Attribute
 */
trait SchoolcollegesAttribute {

    /** get Edit button
     * @return string
     */
    public function getEditButtonAttribute() {
        if (access()->can('edit-school-college'))
            return '<a href="'.route('backend.schoolcolleges.edit', $this->id).'" class="btn btn-xs btn-primary"><i class="fa fa-pencil" data-toggle="tooltip" data-placement="top" title="' . trans('crud.edit_button') . '"></i></a> ';
        return '';
    }


    /** get Delete Button
     * @return string
     */
    public function getDeleteButtonAttribute() {
        if (access()->can('delete-school-college'))
            return '<a href="'.route('backend.schoolcolleges.delete', $this->id).'" data-method="delete" class="btn btn-xs btn-danger"><i class="fa fa-trash" data-toggle="tooltip" data-placement="top" title="' . trans('crud.delete_button') . '"></i></a>';
        return '';
    }

    

    /**
     * @return string
     */
    public function getActionButtonsAttribute() {
        return $this->getEditButtonAttribute().
        $this->getDeleteButtonAttribute();
    }
}