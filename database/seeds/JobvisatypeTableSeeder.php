<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class JobvisatypeTableSeeder extends Seeder {

	public function run() {

		if (env('DB_DRIVER') == 'mysql') {
			DB::statement('SET FOREIGN_KEY_CHECKS=0;');
		}

		if (env('DB_DRIVER') == 'mysql') {
			DB::table('job_visa_types')->truncate();
		} elseif (env('DB_DRIVER') == 'sqlite') {
			DB::statement("DELETE FROM job_visa_types");
		} else //For PostgreSQL or anything else
		{
			DB::statement("TRUNCATE TABLE job_visa_types CASCADE");
		}

		if (env('DB_DRIVER') == 'mysql') {
			DB::statement('SET FOREIGN_KEY_CHECKS=0;');
		}

		$job_visa_types = [
			[
				'title' => 'Australian Visa',
				'created_at' => '2015-12-21 21:39:11',
				'updated_at' => '2015-12-21 21:39:11',
			],
			[
				'title' => 'Working',
				'created_at' => '2015-12-21 21:39:11',
				'updated_at' => '2015-12-21 21:39:11',
			], 
			[
				'title' => 'Holiday',
				'created_at' => '2015-12-21 21:39:11',
				'updated_at' => '2015-12-21 21:39:11',
			],
			
		];
		DB::table('job_visa_types')->insert($job_visa_types);

		if (env('DB_DRIVER') == 'mysql') {
			DB::statement('SET FOREIGN_KEY_CHECKS=1;');
		}

	}
}
