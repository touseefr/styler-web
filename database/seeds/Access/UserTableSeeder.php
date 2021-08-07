<?php

use Carbon\Carbon as Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UserTableSeeder extends Seeder {

	public function run() {

		if (env('DB_DRIVER') == 'mysql') {
			DB::statement('SET FOREIGN_KEY_CHECKS=0;');
		}

		if (env('DB_DRIVER') == 'mysql') {
			DB::table(config('auth.table'))->truncate();
		} elseif (env('DB_DRIVER') == 'sqlite') {
			DB::statement("DELETE FROM " . config('auth.table'));
		} else //For PostgreSQL or anything else
		{
			DB::statement("TRUNCATE TABLE " . config('auth.table') . " CASCADE");
		}

		//Add the master administrator, user id of 1
		$users = [
			[
				'name' => 'Administrator',
				'email' => 'administrator@createyour.com.au',
				'password' => bcrypt('1234'),
				'confirmation_code' => md5(uniqid(mt_rand(), true)),
				'confirmed' => true,
				'created_at' => Carbon::now(),
				'updated_at' => Carbon::now(),
			],
			[
				'name' => 'Admin',
				'email' => 'admin@createyour.com.au',
				'password' => bcrypt('1234'),
				'confirmation_code' => md5(uniqid(mt_rand(), true)),
				'confirmed' => true,
				'created_at' => Carbon::now(),
				'updated_at' => Carbon::now(),
			],
			[
				'name' => 'Individual User',
				'email' => 'individual@createyour.com.au',
				'password' => bcrypt('1234'),
				'confirmation_code' => md5(uniqid(mt_rand(), true)),
				'confirmed' => true,
				'created_at' => Carbon::now(),
				'updated_at' => Carbon::now(),
			],
			[
				'name' => 'Job Seeker',
				'email' => 'jobseeker@createyour.com.au',
				'password' => bcrypt('1234'),
				'confirmation_code' => md5(uniqid(mt_rand(), true)),
				'confirmed' => true,
				'created_at' => Carbon::now(),
				'updated_at' => Carbon::now(),
			],
			[
				'name' => 'Service provider',
				'email' => 'serviceprovider@createyour.com.au',
				'password' => bcrypt('1234'),
				'confirmation_code' => md5(uniqid(mt_rand(), true)),
				'confirmed' => true,
				'created_at' => Carbon::now(),
				'updated_at' => Carbon::now(),
			],
			[
				'name' => 'Distributor',
				'email' => 'distributor@createyour.com.au',
				'password' => bcrypt('1234'),
				'confirmation_code' => md5(uniqid(mt_rand(), true)),
				'confirmed' => true,
				'created_at' => Carbon::now(),
				'updated_at' => Carbon::now(),
			],
		];

		DB::table(config('auth.table'))->insert($users);

		if (env('DB_DRIVER') == 'mysql') {
			DB::statement('SET FOREIGN_KEY_CHECKS=1;');
		}

	}
}
