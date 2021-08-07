<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategoryTableSeeder extends Seeder {

	public function run() {

		if (env('DB_DRIVER') == 'mysql') {
			DB::statement('SET FOREIGN_KEY_CHECKS=0;');
		}

		if (env('DB_DRIVER') == 'mysql') {
			DB::table('categories')->truncate();
		} elseif (env('DB_DRIVER') == 'sqlite') {
			DB::statement("DELETE FROM categories");
		} else //For PostgreSQL or anything else
		{
			DB::statement("TRUNCATE TABLE categories CASCADE");
		}

		if (env('DB_DRIVER') == 'mysql') {
			DB::statement('SET FOREIGN_KEY_CHECKS=0;');
		}

		/*$categoryTypes = [
			[
				'type_code' => 'service',
				'name' => 'Services',
				'parent' => NULL,
			], [
				'type_code' => 'classified',
				'name' => 'Classified',
				'parent' => NULL,

			], [
				'type_code' => 'distributor',
				'name' => 'Distributors',
				'parent' => NULL,
			],[
				'type_code' => 'gallery',
				'name' => 'Gallery',
				'parent' => NULL,
			],
			[
				'type_code' => 'job',
				'name' => 'Jobs',
				'parent' => NULL,
			]
		];
		DB::table('categories')->insert($categoryTypes);
		*/

		if (env('DB_DRIVER') == 'mysql') {
			DB::statement('SET FOREIGN_KEY_CHECKS=1;');
		}

	}
}
