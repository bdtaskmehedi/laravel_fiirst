<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8"/>
    <title> @yield('title') | nishue</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta content="BDTASK Limited" name="description"/>
    <meta content="Design Monks" name="author"/>
    <!-- App favicon -->
    @include('layouts.head-css')
</head>

<body class="auth-body-bg">
<div class="container-fluid p-0">
    <div class="row g-0">
        <div class="col-xl-6 offset-md-3">
            <div class="auth-full-page-content p-md-5 p-4">
                <div class="w-100">
                    <div class="d-flex flex-column h-100">
                        @yield('content')
                    </div>
                </div>
            </div>
        </div>
        <!-- end col -->
    </div>
    <!-- end row -->
</div>
<!-- end container-fluid -->

@include('layouts.vendor-scripts')
</body>
</html>
