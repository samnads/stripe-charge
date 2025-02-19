<script src="{{ asset('assets/user/vendor/apexcharts/apexcharts.min.js') }}"></script>
<script src="{{ asset('assets/user/vendor/bootstrap/js/bootstrap.bundle.min.js') }}"></script>
<script src="{{ asset('assets/user/vendor/chart.js/chart.umd.js') }}"></script>
<script src="{{ asset('assets/user/vendor/echarts/echarts.min.js') }}"></script>
<script src="{{ asset('assets/user/vendor/quill/quill.min.js') }}"></script>
<script src="{{ asset('assets/user/vendor/simple-datatables/simple-datatables.js') }}"></script>
<script src="{{ asset('assets/user/vendor/tinymce/tinymce.min.js') }}"></script>
<script src="{{ asset('assets/user/vendor/php-email-form/validate.js') }}"></script>
<script src="https://code.jquery.com/jquery-3.7.1.min.js"
    integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-validate/1.20.0/jquery.validate.min.js"
    integrity="sha512-WMEKGZ7L5LWgaPeJtw9MBM4i5w5OSBlSjTjCtSnvFJGSVD26gE5+Td12qN5pvWXhuWaWcVwF++F7aqu9cvqP0A=="
    crossorigin="anonymous" referrerpolicy="no-referrer"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-toast-plugin/1.3.2/jquery.toast.min.js"
    integrity="sha512-zlWWyZq71UMApAjih4WkaRpikgY9Bz1oXIW5G0fED4vk14JjGlQ1UmkGM392jEULP8jbNMiwLWdM8Z87Hu88Fw=="
    crossorigin="anonymous" referrerpolicy="no-referrer"></script>
<script src="{{ asset('assets/user/js/pace.min.js?v=') . config('version.js_user') }}"></script>
<!-- Template Main JS File -->
<script>
    _base_url = "{{url('')}}/";
    let _toast = {!! Session::get('toast') ? json_encode(Session::get('toast')) : 'null' !!};
</script>
<script src="{{ asset('assets/user/js/main.js?v=') . config('version.js_user') }}"></script>