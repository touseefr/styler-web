<?php namespace App\Models\Assets\Traits\Attribute;

use Illuminate\Support\Facades\Hash;

/**
 * Class AssetsAttribute
 * @package App\Models\Assets\Traits\Attribute
 */
trait AssetsAttribute {

    /**
     * @return string
     */
    public function getEditButtonAttribute() {
        if (access()->can('edit-categories'))
            return '<a href="'.route('backend.categories.edit', $this->id).'" class="btn btn-xs btn-primary"><i class="fa fa-pencil" data-toggle="tooltip" data-placement="top" title="' . trans('crud.edit_button') . '"></i></a> ';
        return '';
    }


    /**
     * @return string
     */
    public function getDeleteButtonAttribute() {
        if (access()->can('delete-categories'))
            return '<a href="'.route('backend.categories.destroy', $this->id).'" data-method="delete" class="btn btn-xs btn-danger"><i class="fa fa-trash" data-toggle="tooltip" data-placement="top" title="' . trans('crud.delete_button') . '"></i></a>';
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