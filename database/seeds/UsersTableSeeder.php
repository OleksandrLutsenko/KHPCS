<?php

use Illuminate\Database\Seeder;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
//        DB::table('users')->insert([
//            'name' => 'SuperAdmin',
//            'email' => 'admin12@adm.adm',
//            'role_id' => 2,
//            'password' => bcrypt(12345678),
//            'created_at' => Carbon::now()->format('Y-m-d H:i:s'),
//            'updated_at' => Carbon::now()->format('Y-m-d H:i:s')
//        ]);
//
//        DB::table('users')->insert([
//            'name' => 'CompanyAdmin',
//            'email' => 'ca12@ca.ca',
//            'role_id' => 3,
////            'company_id' => 28,
//            'password' => bcrypt(12345678),
//            'created_at' => Carbon::now()->format('Y-m-d H:i:s'),
//            'updated_at' => Carbon::now()->format('Y-m-d H:i:s')
//        ]);

//        DB::table('users')->insert([
//            'name' => 'CompanyAdmin',
//            'email' => 'ca123@ca.ca',
//            'role_id' => 3,
//            'company_id' => 28,
//            'password' => bcrypt(12345678),
//            'created_at' => Carbon::now()->format('Y-m-d H:i:s'),
//            'updated_at' => Carbon::now()->format('Y-m-d H:i:s')
//        ]);

        DB::table('users')->insert([
            'name' => 'FA1',
            'email' => 'fa123@fa.fa',
            'role_id' => 1,
//            'company_id' => 28,
            'password' => bcrypt(12345678),
            'created_at' => Carbon::now()->format('Y-m-d H:i:s'),
            'updated_at' => Carbon::now()->format('Y-m-d H:i:s')
        ]);

        DB::table('users')->insert([
            'name' => 'CompanyAdmin',
            'email' => 'ca12@ca.ca',
            'role_id' => 3,
//            'company_id' => 28,
            'password' => bcrypt(12345678),
            'created_at' => Carbon::now()->format('Y-m-d H:i:s'),
            'updated_at' => Carbon::now()->format('Y-m-d H:i:s')
        ]);

        DB::table('users')->insert([
            'name' => 'FA',
            'email' => 'fa12@fa.fa',
            'role_id' => 1,
//            'company_id' => 28,
            'password' => bcrypt(12345678),
            'created_at' => Carbon::now()->format('Y-m-d H:i:s'),
            'updated_at' => Carbon::now()->format('Y-m-d H:i:s')
        ]);
    }
}
