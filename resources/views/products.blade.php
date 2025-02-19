@extends('layouts.products', [])
@section('title', 'Products')
@section('content')
    <div class="pagetitle">
        <h1>Products</h1>
    </div><!-- End Page Title -->
    <section class="section">
        <div class="container text-center">
            <div class="row">
                @foreach ($products as $key => $product)
                    <div class="col">
                        <div class="card" style="width: 18rem;">
                            <img src="https://placehold.co/300x250?text={{ $product->name }}" class="card-img-top" alt="...">
                            <div class="card-body">
                                <p class="card-text">{{ $product->description }}</p>
                            </div>
                            <div class="d-flex justify-content-between">
                                <div class="p-2 fw-bold align-middle">Rs. {{ $product->price }}</div>
                                <div class="p-2"><a type="button" class="btn btn-secondary" href="{{route('buy',$product->id)}}">Buy Now</a></div>
                            </div>
                        </div>
                    </div>
                @endforeach
            </div>
        </div>
    </section>
@endsection
@push('head-assets')
    <link rel="stylesheet" href="{{ asset('assets/user/css/flatpickr.min.css?v=') . config('version.css_user') }}">
    <style>
        .seats {
            font-family: Arial;
            display: flex;
            flex-wrap: wrap;
            width: 100%;
        }

        .seats label {
            position: relative;
            margin: 4px 15px 4px 0;
            display: inline-flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
        }

        .seats input {
            opacity: 0;
            position: absolute;
            left: 0;
            top: 0;
        }

        .seats label span {
            display: block;
            text-align: center;
            width: 100%;
            background: #fff;
            border: 5px solid #ccc;
            color: #bababa;
            font-size: 14px;
            border-radius: 4px;
            padding: 10px 20px;
            min-width: 70px;
        }

        .seats label:hover span,
        .seats label:hover span:before {
            border: 5px solid #777;
            color: #777;
        }

        .seats label span:before {}

        .seats input:checked~span {
            color: green;
            border: 5px solid green;
        }

        .seats label input:checked~span:before {
            background: green;
            border: 5px solid green;
        }

        .seats input:disabled~span {
            color: #e06b6b;
            border: 5px solid #e06b6b;
        }

        .seats label input:disabled~span:before {
            background: #e06b6b;
            border: 5px solid #e06b6b;
        }
    </style>
@endpush
@push('footer-assets')
    <script src="{{ asset('assets/user/js/flatpickr.js?v=') . config('version.js_user') }}"></script>
@endpush
