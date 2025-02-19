<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Stripe\Stripe;

class BuyController extends Controller
{
    public function buy(Request $request, $product_id)
    {
        $product = Product::findOrFail($product_id);
        return view('buy', compact('product'));
    }
    public function charge(Request $request)
    {
        // Get the authenticated user
        $user = User::first();

        // Set the Stripe API key
        Stripe::setApiKey(config('cashier.secret'));

        // Make the charge
        try {
            $charge = $user->charge($request->amount, $request->payment_method_id, [
                'return_url' => url('')
            ]); // Amount in cents (1000 = $10)

            // Return a success response
            return response()->json([
                'message' => 'Payment successful',
                'charge' => $charge
            ]);
        } catch (\Exception $e) {
            // Handle the error
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }
}
