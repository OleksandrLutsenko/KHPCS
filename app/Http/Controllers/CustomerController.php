<?php

namespace App\Http\Controllers;

use App\Customer;
use App\User;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Customer $customer)
    {
        return Customer::all();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Customer $customer
     * @param  \Illuminate\Http\Request $request
     * @param User $user
     * @return \Illuminate\Http\Response
     */
    public function store(Customer $customer, Request $request, User $user)
    {
        $customer = Customer::create($request->all());
        return response()->json($customer, 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Customer $customer)
    {
        return $customer;
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @param Customer $customer
     * @param User $user
     * @return \Illuminate\Http\Response
     * @internal param int $id
     */
    public function update(Request $request, Customer $customer, User $user)
    {
            $customer->update($request->all());
            return response()->json($customer, 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Customer $customer
     * @param User $user
     * @return \Illuminate\Http\Response
     * @internal param int $id
     */
    public function destroy(Customer $customer, User $user)
    {
        if ($user->can('delete', $customer)) {
            $customer->delete();
            return response()->json(null, 204);
        }else{
            abort(404);
        }
    }
}
