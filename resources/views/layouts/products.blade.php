<!DOCTYPE html>
<html lang="en">

<head>
    <title>Sumanas - @yield('title', 'Default')</title>
    <meta charset="utf-8">
    <meta content="width=device-width, initial-scale=1.0" name="viewport">
    <meta content="" name="description">
    <meta content="" name="keywords">
    <meta name="csrf-token" content="{{ csrf_token() }}" />
    @include('includes.main.head-assets')
    @stack('head-assets')
</head>

<body class="{{ @$body_css_class }}">
    @include('includes.main.header')
    @include('includes.main.sidebar')
    <main id="main" class="main">
        @yield('content')
    </main><!-- End #main -->
    @include('includes.main.footer')
    @include('includes.main.footer-assets')
    @stack('footer-assets')
</body>

</html>