<?php namespace App\Models\Access\Role\Traits\Relationship;

/**
 * Class RoleRelationship
 * @package App\Models\Access\Role\Traits\Relationship
 */
trait RoleRelationship {

    /**
     * @return mixed
     */
    public function users()
    {
        return $this->belongsToMany(config('auth.model'), config('access.assigned_roles_table'), 'role_id', 'user_id');
    }

    /**
     * @return mixed
     */
    public function permissions()
    {
        return $this->belongsToMany(config('access.permission'), config('access.permission_role_table'), 'role_id', 'permission_id')
            ->orderBy('display_name', 'asc');
    }
    public function UserPlans(){
        return $this->hasMany(\App\Models\SubscriptionPlanType\SubscriptionPlanType::class,'role_type');
    }
}