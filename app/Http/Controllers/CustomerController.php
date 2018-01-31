<?php

namespace App\Http\Controllers;

use App\Company;
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
            return Customer::latest()->get();
        } else {
            $customers = Customer::latest()->owned()->get();
            return $customers;
        }
    }

    public function indexCompanySA(Customer $customer, User $user, Company $company)
    {
        if(Auth::user()->isAdmin()) {
            $customers = Customer::orderBy('user_id', 'desc')
                ->latest()
                ->where('company_id', $company->id)
                ->get();
            return $customers;
        }
        elseif(Auth::user()->isCompanyAdmin()) {
            if(Auth::user()->company_id == $company->id) {
                $customers = Customer::orderBy('user_id', 'desc')
                    ->latest()
                    ->where('company_id', Auth::user()->company_id)
                    ->get();
                return $customers;
            }
        }else {
            return response(['message' => 'Page not found'], 404);
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
        $customer = Customer::create($request->getCustomerAttribute());
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
            return response(["error" => "Page not found"], 404);
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

    public function updateFA(Request $request, User $user)
    {
        if(Auth::user()->isAdmin() or Auth::user()->isCompanyAdmin()) {
            $requests = $request->all();
            foreach ($requests as $request) {
                $customer = Customer::find($request['id']);
                $customer->update(['user_id' => $request['user_id']]);
                $customers[] = $customer;
            }
            return response(['customers' => $customers], 201);
        } else {
            return response(['message' => 'Page not found'], 404);
        }
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
