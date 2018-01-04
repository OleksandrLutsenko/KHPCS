<?php

namespace App\Http\Controllers;

use App\Customer;
use App\CustomerAnswer;
use App\Http\Requests\CustomerRequest;
use App\User;
use Auth;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @param Customer $customer
     * @param User $user
     * @return \Illuminate\Http\Response
     */
    public function index(Customer $customer, User $user)
    {
        if(Auth::user()->isAdmin()){
            return Customer::all();
        } else {
            $customers = Customer::latest()->owned()->get();
            return $customers;
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Customer $customer
     * @param CustomerRequest $request
     * @param User $user
     * @return \Illuminate\Http\Response
     */
    public function store(Customer $customer, CustomerRequest $request, User $user)
    {
        $customer = Customer::create($request->all());
        return response()->json($customer, 201);
    }

    /**
     * Display the specified resource.
     *
     * @param Customer $customer
     * @param User $user
     * @return \Illuminate\Http\Response
     * @internal param int $id
     */
    public function show(Customer $customer, User $user)
    {
        if ($user->can('show', $customer)) {
            return $customer;
        } else {
            return response([
                "error" => "Page is not found"], 404
            );
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param CustomerRequest $request
     * @param Customer $customer
     * @param User $user
     * @return \Illuminate\Http\Response
     * @internal param int $id
     */
    public function update(CustomerRequest $request, Customer $customer, User $user)
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
        $customer->delete();
        return response()->json(null, 204);
    }
}