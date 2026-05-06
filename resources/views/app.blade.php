<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    {{-- Force Light Mode --}}
    <script>
        document.documentElement.classList.remove('dark');
    </script>

    <style>
        body {
            min-height: 100vh;
            background-color: #ffffff;
            color: #111827;
        }

        .inc-thin {
            font-family: "Nunito", sans-serif;
            font-weight: 100;
            font-style: normal;
        }

        .inc-extralight {
            font-family: "Nunito", sans-serif;
            font-weight: 200;
            font-style: normal;
        }

        .inc-light {
            font-family: "Nunito", sans-serif;
            font-weight: 300;
            font-style: normal;
        }

        .inc-regular {
            font-family: "Nunito", sans-serif;
            font-weight: 400;
            font-style: normal;
        }

        .inc-medium {
            font-family: "Nunito", sans-serif;
            font-weight: 500;
            font-style: normal;
        }

        .inc-semibold {
            font-family: "Nunito", sans-serif;
            font-weight: 600;
            font-style: normal;
        }

        .inc-bold {
            font-family: "Nunito", sans-serif;
            font-weight: 700;
            font-style: normal;
        }

        .inc-extrabold {
            font-family: "Nunito", sans-serif;
            font-weight: 800;
            font-style: normal;
        }
    </style>

    <title inertia>{{ config('app.name', 'Laravel') }}</title>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

    <link href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap"
        rel="stylesheet">

    @viteReactRefresh
    @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
    @inertiaHead

    <link rel="icon" href="/storage/logos/logo.png" type="image/icon type">

</head>

<body class="font-sans antialiased">
    @inertia
</body>

</html>