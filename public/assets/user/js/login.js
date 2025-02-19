let login_form = $('form[id="user-login-form"]');
let loading_button_html = `Please wait...`;
$(document).ready(function () {
    login_form_validator = login_form.validate({
        focusInvalid: true,
        errorClass: "text-danger small",
        ignore: [],
        rules: {
            "username": {
                required: true,
            },
            "password": {
                required: true,
            },
        },
        messages: {
            "username": {
                required: "Enter your username",
            },
            "password": {
                required: "Enter your password",
            },
        },
        errorPlacement: function (error, element) {
            if (element.attr("name") == "username") {
                error.insertAfter(element.parent());
            } else {
                error.insertAfter(element);
            }
        },
        submitHandler: function (form) {
            let submit_btn = $('button[type="submit"]', form);
            submit_btn.html(loading_button_html).prop("disabled", true);
            $.ajax({
                type: 'POST',
                url: _base_url + "login",
                dataType: 'json',
                data: login_form.serialize(),
                success: function (response) {
                    if (response.status == true) {
                        submit_btn.html('Logging in...').prop("disabled", true).removeClass('btn-info').addClass('btn-success');
                        location.href = response.redirect;
                    }
                    else {
                        submit_btn.html('Login').prop("disabled", false);
                        toast(response.error.title, response.error.content, response.error.type, { stack: 1, position: 'bottom-center', allowToastClose: false });
                    }
                },
                error: function (response) {
                    submit_btn.html('Login').prop("disabled", false);
                    //toast("Page Expired", "Reloading...", 'warning')
                },
            });
        }
    });
    // demo
    $('select[name="user-select"]', login_form).prop("disabled", false);
    $('input[name="username"]', login_form).prop("disabled", false);
});
/**
 * 
 * FOR DEMO ONLY
 * 
 * 
 */
$('select[name="user-select"]', login_form).change(function () {
    login_form_validator.resetForm();
    if (this.value) {
        login_form_validator.resetForm();
        $('input[name="username"]', login_form).val(this.value);
        $('input[name="username"]', login_form).attr('readonly', true);
    }
    else {
        login_form.trigger('reset');
        $('input[name="username"]', login_form).attr('readonly', false);
    }
});