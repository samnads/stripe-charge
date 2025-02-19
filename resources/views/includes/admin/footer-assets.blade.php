<script src="{{ asset('assets/user/vendor/apexcharts/apexcharts.min.js') }}"></script>
<script src="{{ asset('assets/user/vendor/bootstrap/js/bootstrap.bundle.min.js') }}"></script>
<script src="{{ asset('assets/user/vendor/chart.js/chart.umd.js') }}"></script>
<script src="{{ asset('assets/user/vendor/echarts/echarts.min.js') }}"></script>
<script src="{{ asset('assets/user/vendor/quill/quill.min.js') }}"></script>
<script src="{{ asset('assets/user/vendor/tinymce/tinymce.min.js') }}"></script>
<script src="{{ asset('assets/user/vendor/php-email-form/validate.js') }}"></script>
<script src="https://code.jquery.com/jquery-3.7.1.min.js"
    integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-validate/1.20.0/jquery.validate.min.js"
    integrity="sha512-WMEKGZ7L5LWgaPeJtw9MBM4i5w5OSBlSjTjCtSnvFJGSVD26gE5+Td12qN5pvWXhuWaWcVwF++F7aqu9cvqP0A=="
    crossorigin="anonymous" referrerpolicy="no-referrer"></script>
<script src="{{ asset('assets/user/js/jquery.toast.min.js') }}"></script>
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
<!---------------------------- DATA TABLE ------------------------------------------->
<script src="{{ asset('assets/user/vendor/datatables/datatables.js?v=') . config('version.js_user') }}"></script>
<!---------------------------- DATA TABLE END --------------------------------------->
<script src="{{ asset('assets/user/js/template.js?v=') . config('version.js_user') }}"></script>
<script src="{{ asset('assets/user/js/pace.min.js?v=') . config('version.js_user') }}"></script>
<script>
    let _base_url = "{{ url('') }}/";
    let _url = "{{ request()->url() }}";
    let _toast = {!! Session::get('toast') ? json_encode(Session::get('toast')) : 'null' !!};
</script>
<script src="{{ asset('assets/user/js/notifications.js?v=') . config('version.js_user') }}"></script>
<!-- user module main js -->
<script src="{{ asset('assets/user/js/main.js?v=') . config('version.js_user') }}"></script>
<script>
    $(window).on("load", function() {
        $('.table').closest(".col-12").addClass('table-mobile-scroll');
    });
</script>
