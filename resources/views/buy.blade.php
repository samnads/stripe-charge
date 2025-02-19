@extends('layouts.products', [])
@section('title', 'Checkout')
@section('content')
    <div class="pagetitle">
        <h1>Checkout</h1>
    </div><!-- End Page Title -->
    <section class="section">
        <div class="container text-center">
            <div class="container">
                <div class="row">
                    <div class="col">
                        <div class="card" style="width: 18rem;">
                            <img src="https://placehold.co/300x250?text={{ $product->name }}" class="card-img-top"
                                alt="...">
                            <div class="card-body">
                                <p class="card-text">{{ $product->description }}</p>
                            </div>
                            <div class="d-flex justify-content-between">
                                <div class="p-2 fw-bold align-middle">Rs. {{ $product->price }}</div>
                            </div>
                        </div>
                    </div>
                    <div class="col">
                        <form id="payment-form">
                            <div id="card-element">
                                <!-- A Stripe Element will be inserted here. -->
                            </div>
                            <button id="submit" class="btn btn-sm stripe-btn mt-3">Pay</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </section>
@endsection
@push('head-assets')
    <style>
        .stripe-btn {
            background-color: #5469d4;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            width: 100%;
        }

        .stripe-btn:hover {
            background-color: #4353b3;
        }
    </style>
@endpush
@push('footer-assets')
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="https://js.stripe.com/v3/"></script>
    <script>
        const stripe = Stripe('{{ config('cashier.key') }}');
        const product = {!! $product !!};
    </script>
    <script src="{{ asset('buy.js?v=') . time() }}"></script>
@endpush
