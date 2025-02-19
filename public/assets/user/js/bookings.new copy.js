/***************************************************************************
 *                                                                         *
 *                                                                         *
 *                                                                         *
 *                         Coder : Samnad S                                *
 *                                                                         *
 *                                                                         *
 *                                                                         *
|**************************************************************************/
let customer_quick_add_popup = new bootstrap.Modal(document.querySelector('.modal.customer-quick-add'), {
    backdrop: 'static',
    keyboard: true
});
let customer_quick_add_form = $('form[id="customer-quick-add"]');
let new_booking_form = $('form[id="new-booking"]');
let customer_select_tom = new TomSelect('#select-booking-customer', {
    maxItems: 1,
    plugins: ['clear_button'],
    valueField: 'id',
    labelField: 'name',
    searchField: 'name',
    create: function (input, callback) {
        customer_quick_add_form_validator.resetForm();
        customer_quick_add_form.trigger('reset');
        $('[name="name"]', customer_quick_add_form).val(input);
        customer_type_id_select.clear();
        customer_quick_add_popup.show();
    },
    // fetch remote data
    load: function (query, callback) {
        var url = _base_url + 'customer/search/booking?q=' + encodeURIComponent(query);
        fetch(url)
            .then(response => response.json())
            .then(json => {
                callback(json.items);
            }).catch(() => {
                callback();
            });
    },
    // custom rendering functions for options and items
    render: {
        option_create: function (data, escape) {
            return '<div class="create bg-secondary text-light"><i class="bi bi-person-plus-fill"></i>&nbsp;&nbsp;Add <strong>' + escape(data.input) + '</strong>&hellip;</div>';
        },
        option: function (item, escape) {
            return `<div class="py-2 d-flex">
							${escape(item.name)}
						</div>`;
        },
        no_results: function (data, escape) {
            return '<div class="no-results">No customer found for "' + escape(data.input) + '"</div>';
        },
        item: function (item, escape) {
            $('#customer-name').html(escape(item.name));
            $('#customer-email').html(escape(item.email));
            $('#customer-mobile').html(escape(item.mobile_number_cc + '-' + item.mobile_number));
            $('#customer-preview-div').show();
            //$('#select-booking-customer').valid();
            return `<div>${escape(item.name)}</div>`;

        }
    },
    onItemRemove: function (values) {
        $('#customer-preview-div').hide();
    },
    onOptionAdd: function (values) {
        //customer_select_tom.close();
    }
});
let customer_type_id_select = new TomSelect('#customer-quick-add [name="customer_type_id"]', {
    create: false,
    allowEmptyOption: false,
    plugins: ['clear_button'],
    sortField: {
        field: "text",
        direction: "asc"
    }
});
let customer_source_id_select = new TomSelect('#customer-quick-add [name="customer_source_id"]', {
    create: false,
    allowEmptyOption: false,
    plugins: ['clear_button'],
    sortField: {
        field: "text",
        direction: "asc"
    }
});
let loading_button_html = 'loading';
$(".pickup_date").flatpickr({
    altInput: true,
    altFormat: "d/m/Y",
    dateFormat: "Y-m-d",
    minDate: "today"
});
$(document).ready(function () {
    customer_quick_add_form_validator = customer_quick_add_form.validate({
        focusInvalid: true,
        ignore: [],
        rules: {
            "name": {
                required: true,
            },
            "customer_type_id": {
                required: true,
            },
            "customer_source_id": {
                required: true,
            },
            "dealer_name": {
                required: true,
            },
            "mobile_number": {
                required: true,
                intlTelNumber: true
            },
            "email": {
                required: true,
            }
        },
        messages: {},
        errorPlacement: function (error, element) {
            if (element.attr("name") == "mobile_number") {
                error.insertAfter(element.parent());
            }
            else if (element.attr("name") == "customer_type_id" || element.attr("name") == "customer_source_id") {
                $(element).parent().append(error);
            } else {
                error.insertAfter(element);
            }
        },
        submitHandler: function (form) {
            let submit_btn = $('button[type="submit"]', form);
            submit_btn.prop("disabled", true);
            $.ajax({
                type: 'POST',
                url: _base_url + "customer/quick-add",
                dataType: 'json',
                data: customer_quick_add_form.serialize(),
                success: function (response) {
                    if (response.status == true) {
                        customer_quick_add_popup.hide();
                        submit_btn.prop("disabled", false);
                        customer_select_tom.addOption(response.data.customer);
                        customer_select_tom.setValue([response.data.customer.id], true);
                        toast(response.message.title, response.message.content, response.message.type);
                    } else {
                        toastStatusFalse(response);
                        submit_btn.prop("disabled", false);
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    submit_btn.prop("disabled", false);
                    ajaxError(XMLHttpRequest);
                },
            });
        }
    });
    $('[name="customer_type_id"]', customer_quick_add_form).change(function (event) {
        if(this.value == 2){
            $('[name="dealer_name"]',customer_quick_add_form).closest('div').show(200);
        }
        else{
            $('[name="dealer_name"]',customer_quick_add_form).closest('div').hide(200);
        }
    });
    new_booking_form_validator = new_booking_form.validate({
        focusInvalid: true,
        ignore: [],
        rules: {
            "customer_id": {
                required: true,
            },
            "payment_mode_id": {
                required: true,
            },
            "transport_carrier_type_id": {
                required: true,
            },
            "pickup_date": {
                required: true,
            },
            "sales_amount": {
                required: true,
            },
            "dispatcher_amount": {
                required: true,
            }
        },
        messages: {
        },
        errorPlacement: function (error, element) {
            if (element.hasClass("iti__tel-input")) {
                error.insertAfter(element.parent());
            }
            else if (element.hasClass("flatpickr-input") || element.hasClass("tomselected")) {
                $(element).parent().append(error);
            } else {
                error.insertAfter(element);
            }
        },
        submitHandler: function (form) {
            let submit_btn = $('button[type="submit"]', form);
            submit_btn.html('Sending...').prop("disabled", true);
            var formData = new FormData($('form[id="new-booking"]')[0]);
            $.ajax({
                type: 'POST',
                url: _base_url + "booking",
                data: formData,
                contentType: false,
                processData: false,
                success: function (response) {
                    if (response.status == true) {
                        //submit_btn.html('Send Request').prop("disabled", false);
                        //return false;
                        Swal.fire({
                            title: response.message.title,
                            text: response.message.content,
                            icon: response.message.type,
                            confirmButtonText: "OK",
                            allowOutsideClick: false,
                            didOpen: () => Swal.getConfirmButton().blur()
                        }).then((result) => {
                            if (result.isConfirmed) {
                                afterAjaxSuccess(response);
                            }
                        });
                    }
                    else {
                        submit_btn.html('Send Request').prop("disabled", false);
                        toastStatusFalse(response);
                    }
                },
                error: function (response) {
                    submit_btn.html('Send Request').prop("disabled", false);
                    toast(response.responseJSON.exception, response.statusText, 'error');
                },
            });
        }
    });
    dynamicVehicleRefresh();
    vehicleAdded();
});
/*$('[name="p_zip_code"]', new_booking_form).change(function () {
    let postal_code = this.value;
    if (postal_code) {
        $.ajax({
            type: 'GET',
            url: _base_url + 'google-api/maps/postal-code/USA/' + postal_code,
            dataType: 'json',
            cache: true,
            success: function (response) {
                if (response.status == "OK") {
                    $('[name="p_state"]', new_booking_form).val(response.results[0].address_components[3].long_name);
                    $('[name="p_city"]', new_booking_form).val(response.results[0].address_components[1].long_name);
                } else {
                    toast("Zip Code API Error !", response.error_message, 'warning');
                }
            },
            error: function (response) {
                ajaxError(response);
            },
        });
    }
});
$('[name="d_zip_code"]', new_booking_form).change(function () {
    let postal_code = this.value;
    if (postal_code) {
        $.ajax({
            type: 'GET',
            url: _base_url + 'google-api/maps/postal-code/USA/' + postal_code,
            dataType: 'json',
            cache: true,
            success: function (response) {
                if (response.status == "OK") {
                    $('[name="d_state"]', new_booking_form).val(response.results[0].address_components[3].long_name);
                    $('[name="d_city"]', new_booking_form).val(response.results[0].address_components[1].long_name);
                } else {
                    toast("Zip Code API Error !", response.error_message, 'warning');
                }
            },
            error: function (response) {
                ajaxError(response);
            },
        });
    }
});*/
let vehicle_row = $('#booking-vehicle')[0].outerHTML; // for dynamic vehicles
$('button[data-action="add-vehicle"]', new_booking_form).click(function () {
    vehicle_index += 1;
    $('#vehicles', new_booking_form).append(vehicle_row);
    toast(null, 'Vehicle Added !', 'info', { allowToastClose: false, loader: true, hideAfter: 1500 });
    dynamicVehicleRefresh();
    vehicleAdded();
});
function vehicleRemoveHandler() {
    $('button[data-action="remove-vehicle"]', new_booking_form).off('click');
    $('button[data-action="remove-vehicle"]', new_booking_form).click(function () {
        $(this).closest('.row-vehicle').remove();
        toast(null, 'Vehicle Removed !', 'info', { allowToastClose: false, loader: true, hideAfter: 1500 });
        dynamicVehicleRefresh();
        renderQuickVehiclScrollButtons();
        addressCopy();
    });
}
let vehicle_index = 1;
// pickup numbers
let p_mobile_number_1_ele = [];
let p_mobile_number_2_ele = [];
let p_mobile_number_1_iti = [];
let p_mobile_number_2_iti = [];
// delivery numbers
let d_mobile_number_1_ele = [];
let d_mobile_number_2_ele = [];
let d_mobile_number_1_iti = [];
let d_mobile_number_2_iti = [];
// dates
let pickup_date_times = [];
let delivery_date_times = [];
function vehicleAdded() {
    let index = vehicle_index;
    let vehicle = $('.row-vehicle')[$('.row-vehicle').length - 1];
    $(vehicle).attr('id', 'booking-vehicle-' + index);
    $('[name="vehicle_rows[]"]', vehicle).val(index);
    /**
     * Vehicle Details Form Fields
     */
    // Vehicle Brand
    $('[name="vehicles[][vehicle_brand]"]', vehicle).each(function () {
        $(this).attr('name', 'vehicles[' + index + '][vehicle_brand]');
        $(this).attr('id', 'vehicle_brand' + index);
        $(this).siblings('label').attr('for', 'vehicle_brand' + index);
        $(this).rules("add", {
            required: true
        });
    });
    // Model Name
    $('[name="vehicles[][vehicle_model]"]', vehicle).each(function () {
        $(this).attr('name', 'vehicles[' + index + '][vehicle_model]');
        $(this).attr('id', 'vehicle_model' + index);
        $(this).siblings('label').attr('for', 'vehicle_model' + index);
        $(this).rules("add", {
            required: true
        });
    });
    // Make Year
    $('[name="vehicles[][vehicle_make_year]"]', vehicle).each(function () {
        $(this).attr('name', 'vehicles[' + index + '][vehicle_make_year]');
        $(this).attr('id', 'vehicle_make_year' + index);
        $(this).siblings('label').attr('for', 'vehicle_make_year' + index);
        $(this).rules("add", {
            required: true
        });
    });
    // Licence Number
    $('[name="vehicles[][licence_number]"]', vehicle).each(function () {
        $(this).attr('name', 'vehicles[' + index + '][licence_number]');
        $(this).attr('id', 'licence_number' + index);
        $(this).siblings('label').attr('for', 'licence_number' + index);
        $(this).rules("add", {
            required: false
        });
    });
    // VIN Number
    $('[name="vehicles[][vin_number]"]', vehicle).each(function () {
        $(this).attr('name', 'vehicles[' + index + '][vin_number]');
        $(this).attr('id', 'vin_number' + index);
        $(this).siblings('label').attr('for', 'vin_number' + index);
        $(this).rules("add", {
            required: true,
            minlength: 17,
            maxlength: 17
        });
        $(this).keyup(function () {
            $(this).val(function () {
                return this.value.toUpperCase();
            })
        });
    });
    // Color
    $('[name="vehicles[][color_name]"]', vehicle).each(function () {
        $(this).attr('name', 'vehicles[' + index + '][color_name]');
        $(this).attr('id', 'color_name' + index);
        $(this).siblings('label').attr('for', 'color_name' + index);
        $(this).rules("add", {
            required: false
        });
    });
    // Brakes
    $('[name="vehicles[][pickup_vehicle_brakes]"]', vehicle).each(function () {
        $(this).attr('name', 'vehicles[' + index + '][pickup_vehicle_brakes]');
        $(this).attr('id', 'pickup_vehicle_brakes' + index);
        $(this).siblings('label').attr('for', 'pickup_vehicle_brakes' + index);
        $(this).rules("add", {
            required: true
        });
    });
    // Running Condition
    $('[name="vehicles[][pickup_vehicle_running_condition]"]', vehicle).each(function () {
        $(this).attr('name', 'vehicles[' + index + '][pickup_vehicle_running_condition]');
        $(this).attr('id', 'pickup_vehicle_running_condition' + index);
        $(this).siblings('label').attr('for', 'pickup_vehicle_running_condition' + index);
        $(this).rules("add", {
            required: true
        });
    });
    // Rolls
    $('[name="vehicles[][pickup_vehicle_rolls]"]', vehicle).each(function () {
        $(this).attr('name', 'vehicles[' + index + '][pickup_vehicle_rolls]');
        $(this).attr('id', 'pickup_vehicle_rolls' + index);
        $(this).siblings('label').attr('for', 'pickup_vehicle_rolls' + index);
        $(this).rules("add", {
            required: true
        });
    });
    // Powered By
    $('[name="vehicles[][pickup_vehicle_powered_by]"]', vehicle).each(function () {
        $(this).attr('name', 'vehicles[' + index + '][pickup_vehicle_powered_by]');
        $(this).attr('id', 'pickup_vehicle_powered_by' + index);
        $(this).siblings('label').attr('for', 'pickup_vehicle_powered_by' + index);
        $(this).rules("add", {
            required: true
        });
    });
    // Additional Vehicle Information
    $('[name="vehicles[][v_additional_info]"]', vehicle).each(function () {
        $(this).attr('name', 'vehicles[' + index + '][v_additional_info]');
        $(this).attr('id', 'v_additional_info' + index);
        $(this).siblings('label').attr('for', 'v_additional_info' + index);
        $(this).rules("add", {
            required: false
        });
    });
    /**
     * Pickup Address Form Fields
     */
    $('[name="p_contact_name"]', vehicle).each(function () {
        $(this).attr('name', 'vehicles[' + index + '][p_contact_name]');
        $(this).attr('id', 'p_contact_name' + index);
        $(this).siblings('label').attr('for', 'p_contact_name' + index);
        $(this).rules("add", {
            required: true
        });
    });
    $('[name="p_email"]', vehicle).each(function () {
        $(this).attr('name', 'vehicles[' + index + '][p_email]');
        $(this).attr('id', 'p_email' + index);
        $(this).siblings('label').attr('for', 'p_email' + index);
        $(this).rules("add", {
            required: true
        });
    });
    $('[name="p_mobile_number_1_cc"]', vehicle).each(function () {
        $(this).attr('name', 'vehicles[' + index + '][p_mobile_number_1_cc]');
        $(this).attr('id', 'p_mobile_number_1_cc' + index);
        $(this).siblings('label').attr('for', 'p_mobile_number_1_cc' + index);
        $(this).rules("add", {
            required: true
        });
    });
    $('[name="p_mobile_number_1"]', vehicle).each(function () {
        $(this).attr('name', 'vehicles[' + index + '][p_mobile_number_1]');
        $(this).attr('id', 'p_mobile_number_1' + index);
        $(this).siblings('label').attr('for', 'p_mobile_number_1' + index);
        $(this).rules("add", {
            required: true,
            intlTelNumber: true
        });
    });
    // International Telephone Input for p_mobile_number_1 && p_mobile_number_1_cc
    p_mobile_number_1_ele[index] = document.getElementById('p_mobile_number_1' + index);
    p_mobile_number_1_iti[index] = window.intlTelInput(p_mobile_number_1_ele[index], {
        containerClass: "w-100",
        formatAsYouType: false,
        initialCountry: intlTelInputConfig.initialCountry,
        onlyCountries: intlTelInputConfig.onlyCountries,
        nationalMode: true,
        strictMode: true,
        separateDialCode: true,
        utilsScript: "./utils.js",
    });
    $('#p_mobile_number_1_cc' + index).val(p_mobile_number_1_iti[index].getSelectedCountryData().dialCode);
    p_mobile_number_1_ele[index].addEventListener("countrychange", function () {
        $('#p_mobile_number_1_cc' + index, vehicle).val(p_mobile_number_1_iti[index].getSelectedCountryData().dialCode);
    });
    //
    $('[name="p_mobile_number_2_cc"]', vehicle).each(function () {
        $(this).attr('name', 'vehicles[' + index + '][p_mobile_number_2_cc]');
        $(this).attr('id', 'p_mobile_number_2_cc' + index);
        $(this).siblings('label').attr('for', 'p_mobile_number_2_cc' + index);
        $(this).rules("add", {
            required: false
        });
    });
    $('[name="p_mobile_number_2"]', vehicle).each(function () {
        $(this).attr('name', 'vehicles[' + index + '][p_mobile_number_2]');
        $(this).attr('id', 'p_mobile_number_2' + index);
        $(this).siblings('label').attr('for', 'p_mobile_number_2' + index);
        $(this).rules("add", {
            required: false,
            intlTelNumber: true
        });
    });
    // International Telephone Input for p_mobile_number_2 && p_mobile_number_2_cc
    p_mobile_number_2_ele[index] = document.getElementById('p_mobile_number_2' + index);
    p_mobile_number_2_iti[index] = window.intlTelInput(p_mobile_number_2_ele[index], {
        containerClass: "w-100",
        formatAsYouType: false,
        initialCountry: intlTelInputConfig.initialCountry,
        onlyCountries: intlTelInputConfig.onlyCountries,
        nationalMode: true,
        strictMode: true,
        separateDialCode: true,
        utilsScript: "./utils.js",
    });
    $('#p_mobile_number_2_cc' + index).val(p_mobile_number_2_iti[index].getSelectedCountryData().dialCode);
    p_mobile_number_2_ele[index].addEventListener("countrychange", function () {
        $('#p_mobile_number_2_cc' + index, vehicle).val(p_mobile_number_2_iti[index].getSelectedCountryData().dialCode);
    });
    $('[name="p_state"]', vehicle).each(function () {
        $(this).attr('name', 'vehicles[' + index + '][p_state]');
        $(this).attr('id', 'p_state' + index);
        $(this).siblings('label').attr('for', 'p_state' + index);
        $(this).rules("add", {
            required: true
        });
    });
    $('[name="p_city"]', vehicle).each(function () {
        $(this).attr('name', 'vehicles[' + index + '][p_city]');
        $(this).attr('id', 'p_city' + index);
        $(this).siblings('label').attr('for', 'p_city' + index);
        $(this).rules("add", {
            required: true
        });
    });
    $('[name="vehicles[][p_date_time]"]', vehicle).each(function () {
        $(this).attr('name', 'vehicles[' + index + '][p_date_time]');
        $(this).attr('id', 'p_date_time' + index);
        $(this).siblings('label').attr('for', 'p_date_time' + index);
        $(this).rules("add", {
            required: true
        });
        pickup_date_times[index] = $(this).flatpickr({
            altInput: true,
            altFormat: "d/m/Y H:i K",
            dateFormat: "Y-m-d H:i:00",
            minDate: "today",
            enableTime: true,
            defaultHour: 10
        });
    });
    $('[name="vehicles[][p_location]"]', vehicle).each(function () {
        $(this).attr('name', 'vehicles[' + index + '][p_location]');
        $(this).attr('id', 'p_location' + index);
        $(this).siblings('label').attr('for', 'p_location' + index);
        $(this).rules("add", {
            required: true
        });
    });
    $('[name="p_zip_code"]', vehicle).each(function () {
        $(this).attr('name', 'vehicles[' + index + '][p_zip_code]');
        $(this).attr('id', 'p_zip_code' + index);
        $(this).siblings('label').attr('for', 'p_zip_code' + index);
        $(this).rules("add", {
            required: true
        });
        $(this, vehicle).change(function () {
            let postal_code = this.value;
            if (postal_code) {
                $.ajax({
                    type: 'GET',
                    url: _base_url + 'google-api/maps/postal-code/USA/' + postal_code,
                    dataType: 'json',
                    cache: true,
                    success: function (response) {
                        if (response.status == "OK") {
                            $('#p_state' + index, vehicle).val(response.results[0].address_components[3].long_name);
                            $('#p_city' + index, vehicle).val(response.results[0].address_components[1].long_name);
                        } else {
                            toast("Zip Code API Error !", response.error_message, 'warning');
                        }
                    },
                    error: function (response) {
                        ajaxError(response);
                    },
                });
            }
        });
    });
    $('[name="p_address"]', vehicle).each(function () {
        $(this).attr('name', 'vehicles[' + index + '][p_address]');
        $(this).attr('id', 'p_address' + index);
        $(this).siblings('label').attr('for', 'p_address' + index);
        $(this).rules("add", {
            required: true
        });
    });
    $('[name="p_additional_info"]', vehicle).each(function () {
        $(this).attr('name', 'vehicles[' + index + '][p_additional_info]');
        $(this).attr('id', 'p_additional_info' + index);
        $(this).siblings('label').attr('for', 'p_additional_info' + index);
        $(this).rules("add", {
            required: false
        });
    });
    /**
     * Delivery Address Form Fields
     */
    $('[name="d_contact_name"]', vehicle).each(function () {
        $(this).attr('name', 'vehicles[' + index + '][d_contact_name]');
        $(this).attr('id', 'd_contact_name' + index);
        $(this).siblings('label').attr('for', 'd_contact_name' + index);
        $(this).rules("add", {
            required: true
        });
    });
    $('[name="d_email"]', vehicle).each(function () {
        $(this).attr('name', 'vehicles[' + index + '][d_email]');
        $(this).attr('id', 'd_email' + index);
        $(this).siblings('label').attr('for', 'd_email' + index);
        $(this).rules("add", {
            required: true
        });
    });
    $('[name="d_mobile_number_1_cc"]', vehicle).each(function () {
        $(this).attr('name', 'vehicles[' + index + '][d_mobile_number_1_cc]');
        $(this).attr('id', 'd_mobile_number_1_cc' + index);
        $(this).siblings('label').attr('for', 'd_mobile_number_1_cc' + index);
        $(this).rules("add", {
            required: true
        });
    });
    $('[name="d_mobile_number_1"]', vehicle).each(function () {
        $(this).attr('name', 'vehicles[' + index + '][d_mobile_number_1]');
        $(this).attr('id', 'd_mobile_number_1' + index);
        $(this).siblings('label').attr('for', 'd_mobile_number_1' + index);
        $(this).rules("add", {
            required: true,
            intlTelNumber: true
        });
    });
    // International Telephone Input for d_mobile_number_1 && d_mobile_number_1_cc
    d_mobile_number_1_ele[index] = document.getElementById('d_mobile_number_1' + index);
    d_mobile_number_1_iti[index] = window.intlTelInput(d_mobile_number_1_ele[index], {
        containerClass: "w-100",
        formatAsYouType: false,
        initialCountry: intlTelInputConfig.initialCountry,
        onlyCountries: intlTelInputConfig.onlyCountries,
        nationalMode: true,
        strictMode: true,
        separateDialCode: true,
        utilsScript: "./utils.js",
    });
    $('#d_mobile_number_1_cc' + index).val(d_mobile_number_1_iti[index].getSelectedCountryData().dialCode);
    d_mobile_number_1_ele[index].addEventListener("countrychange", function () {
        $('#d_mobile_number_1_cc' + index, vehicle).val(d_mobile_number_1_iti[index].getSelectedCountryData().dialCode);
    });
    $('[name="d_mobile_number_2_cc"]', vehicle).each(function () {
        $(this).attr('name', 'vehicles[' + index + '][d_mobile_number_2_cc]');
        $(this).attr('id', 'd_mobile_number_2_cc' + index);
        $(this).siblings('label').attr('for', 'd_mobile_number_2_cc' + index);
        $(this).rules("add", {
            required: false
        });
    });
    $('[name="d_mobile_number_2"]', vehicle).each(function () {
        $(this).attr('name', 'vehicles[' + index + '][d_mobile_number_2]');
        $(this).attr('id', 'd_mobile_number_2' + index);
        $(this).siblings('label').attr('for', 'd_mobile_number_2' + index);
        $(this).rules("add", {
            required: false,
            intlTelNumber: true
        });
    });
    // International Telephone Input for d_mobile_number_1 && d_mobile_number_1_cc
    d_mobile_number_2_ele[index] = document.getElementById('d_mobile_number_2' + index);
    d_mobile_number_2_iti[index] = window.intlTelInput(d_mobile_number_2_ele[index], {
        containerClass: "w-100",
        formatAsYouType: false,
        initialCountry: intlTelInputConfig.initialCountry,
        onlyCountries: intlTelInputConfig.onlyCountries,
        nationalMode: true,
        strictMode: true,
        separateDialCode: true,
        utilsScript: "./utils.js",
    });
    $('#d_mobile_number_2_cc' + index).val(d_mobile_number_2_iti[index].getSelectedCountryData().dialCode);
    d_mobile_number_2_ele[index].addEventListener("countrychange", function () {
        $('#d_mobile_number_2_cc' + index, vehicle).val(d_mobile_number_2_iti[index].getSelectedCountryData().dialCode);
    });
    $('[name="d_state"]', vehicle).each(function () {
        $(this).attr('name', 'vehicles[' + index + '][d_state]');
        $(this).attr('id', 'd_state' + index);
        $(this).siblings('label').attr('for', 'd_state' + index);
        $(this).rules("add", {
            required: true
        });
    });
    $('[name="d_city"]', vehicle).each(function () {
        $(this).attr('name', 'vehicles[' + index + '][d_city]');
        $(this).attr('id', 'd_city' + index);
        $(this).siblings('label').attr('for', 'd_city' + index);
        $(this).rules("add", {
            required: true
        });
    });
    $('[name="vehicles[][d_date_time]"]', vehicle).each(function () {
        $(this).attr('name', 'vehicles[' + index + '][d_date_time]');
        $(this).attr('id', 'd_date_time' + index);
        $(this).siblings('label').attr('for', 'd_date_time' + index);
        $(this).rules("add", {
            required: true
        });
        delivery_date_times[index] = $(this).flatpickr({
            altInput: true,
            altFormat: "d/m/Y H:i K",
            dateFormat: "Y-m-d H:i:00",
            minDate: "today",
            enableTime: true,
            defaultHour: 10
        });
    });
    $('[name="vehicles[][d_location]"]', vehicle).each(function () {
        $(this).attr('name', 'vehicles[' + index + '][d_location]');
        $(this).attr('id', 'd_location' + index);
        $(this).siblings('label').attr('for', 'd_location' + index);
        $(this).rules("add", {
            required: true
        });
    });
    $('[name="d_zip_code"]', vehicle).each(function () {
        $(this).attr('name', 'vehicles[' + index + '][d_zip_code]');
        $(this).attr('id', 'd_zip_code' + index);
        $(this).siblings('label').attr('for', 'd_zip_code' + index);
        $(this).rules("add", {
            required: true
        });
        $(this, vehicle).change(function () {
            let postal_code = this.value;
            if (postal_code) {
                $.ajax({
                    type: 'GET',
                    url: _base_url + 'google-api/maps/postal-code/USA/' + postal_code,
                    dataType: 'json',
                    cache: true,
                    success: function (response) {
                        if (response.status == "OK") {
                            $('#d_state' + index, vehicle).val(response.results[0].address_components[3].long_name);
                            $('#d_city' + index, vehicle).val(response.results[0].address_components[1].long_name);
                        } else {
                            toast("Zip Code API Error !", response.error_message, 'warning');
                        }
                    },
                    error: function (response) {
                        ajaxError(response);
                    },
                });
            }
        });
    });
    $('[name="d_address"]', vehicle).each(function () {
        $(this).attr('name', 'vehicles[' + index + '][d_address]');
        $(this).attr('id', 'd_address' + index);
        $(this).siblings('label').attr('for', 'd_address' + index);
        $(this).rules("add", {
            required: true
        });
    });
    $('[name="d_additional_info"]', vehicle).each(function () {
        $(this).attr('name', 'vehicles[' + index + '][d_additional_info]');
        $(this).attr('id', 'd_additional_info' + index);
        $(this).siblings('label').attr('for', 'd_additional_info' + index);
        $(this).rules("add", {
            required: false
        });
    });
    /**
     * Auction Form Fields
     */
    // Auction Toggle
    $('[name="vehicles[][pickup_vehicle_is_in_auction]"]', vehicle).each(function (index2) {
        $(this).attr('name', 'vehicles[' + index + '][pickup_vehicle_is_in_auction]');
        $(this).attr('id', 'pickup_vehicle_is_in_auction' + index + '_' + index2);
        $(this).siblings('label').attr('for', 'pickup_vehicle_is_in_auction' + index + '_' + index2);
        $(this, vehicle).click(function () {
            if (this.value == 9) { // Yes
                $('.auction-details', vehicle).show();
            }
            else {
                $('.auction-details', vehicle).hide();
            }
        });
        $(this, vehicle).rules("add", {
            required: true
        });
    });
    // auction_name
    $('[name="vehicles[][auction_auction_name]"]', vehicle).each(function () {
        $(this).attr('name', 'vehicles[' + index + '][auction_auction_name]');
        $(this).attr('id', 'auction_auction_name' + index);
        $(this).siblings('label').attr('for', 'auction_auction_name' + index);
        $(this).rules("add", {
            required: false
        });
    });
    // buyer_name
    $('[name="vehicles[][auction_buyer_name]"]', vehicle).each(function () {
        $(this).attr('name', 'vehicles[' + index + '][auction_buyer_name]');
        $(this).attr('id', 'auction_buyer_name' + index);
        $(this).siblings('label').attr('for', 'auction_buyer_name' + index);
        $(this).rules("add", {
            required: false
        });
    });
    // buyer_mobile_cc
    $('[name="vehicles[][auction_buyer_mobile_cc]"]', vehicle).each(function () {
        $(this).attr('name', 'vehicles[' + index + '][auction_buyer_mobile_cc]');
        $(this).attr('id', 'auction_buyer_mobile_cc' + index);
        $(this).siblings('label').attr('for', 'auction_buyer_mobile_cc' + index);
        $(this).rules("add", {
            required: false
        });
    });
    // auction_buyer_mobile
    $('[name="vehicles[][auction_buyer_mobile]"]', vehicle).each(function () {
        $(this).attr('name', 'vehicles[' + index + '][auction_buyer_mobile]');
        $(this).attr('id', 'auction_buyer_mobile' + index);
        $(this).siblings('label').attr('for', 'auction_buyer_mobile' + index);
        $(this).rules("add", {
            required: false
        });
    });
    // auction_stock_number
    $('[name="vehicles[][auction_stock_number]"]', vehicle).each(function () {
        $(this).attr('name', 'vehicles[' + index + '][auction_stock_number]');
        $(this).attr('id', 'auction_stock_number' + index);
        $(this).siblings('label').attr('for', 'auction_stock_number' + index);
        $(this).rules("add", {
            required: false
        });
    });
    // auction_gate_pass_no
    $('[name="vehicles[][auction_gate_pass_no]"]', vehicle).each(function () {
        $(this).attr('name', 'vehicles[' + index + '][auction_gate_pass_no]');
        $(this).attr('id', 'auction_gate_pass_no' + index);
        $(this).siblings('label').attr('for', 'auction_gate_pass_no' + index);
        $(this).rules("add", {
            required: false
        });
    });
    // auction_gate_pin
    $('[name="vehicles[][auction_gate_pin]"]', vehicle).each(function () {
        $(this).attr('name', 'vehicles[' + index + '][auction_gate_pin]');
        $(this).attr('id', 'auction_gate_pin' + index);
        $(this).siblings('label').attr('for', 'auction_gate_pin' + index);
        $(this).rules("add", {
            required: false
        });
    });
    // auction_pickup_slip_no
    $('[name="vehicles[][auction_pickup_slip_no]"]', vehicle).each(function () {
        $(this).attr('name', 'vehicles[' + index + '][auction_pickup_slip_no]');
        $(this).attr('id', 'auction_pickup_slip_no' + index);
        $(this).siblings('label').attr('for', 'auction_pickup_slip_no' + index);
        $(this).rules("add", {
            required: false
        });
    });
    // auction_addditional_info
    $('[name="vehicles[][auction_addditional_info]"]', vehicle).each(function () {
        $(this).attr('name', 'vehicles[' + index + '][auction_addditional_info]');
        $(this).attr('id', 'auction_addditional_info' + index);
        $(this).siblings('label').attr('for', 'auction_addditional_info' + index);
        $(this).rules("add", {
            required: false
        });
    });
    // auction_gate_pass_file
    $('[name="vehicles[][auction_gate_pass_file]"]', vehicle).each(function () {
        $(this).attr('name', 'vehicles[' + index + '][auction_gate_pass_file]');
        $(this).attr('id', 'auction_gate_pass_file' + index);
        $(this).siblings('label').attr('for', 'auction_gate_pass_file' + index);
        $(this).rules("add", {
            required: false
        });
    });
    // auction_gate_pass_file_name
    $('[name="vehicles[][auction_gate_pass_file_name]"]', vehicle).each(function () {
        $(this).attr('name', 'vehicles[' + index + '][auction_gate_pass_file_name]');
        $(this).attr('id', 'auction_gate_pass_file_name' + index);
        $(this).siblings('label').attr('for', 'auction_gate_pass_file_name' + index);
        $(this).rules("add", {
            required: false
        });
    });
    // auction_pickup_slip_file
    $('[name="vehicles[][auction_pickup_slip_file]"]', vehicle).each(function () {
        $(this).attr('name', 'vehicles[' + index + '][auction_pickup_slip_file]');
        $(this).attr('id', 'auction_pickup_slip_file' + index);
        $(this).siblings('label').attr('for', 'auction_pickup_slip_file' + index);
        $(this).rules("add", {
            required: false
        });
    });
    // auction_pickup_slip_file_name
    $('[name="vehicles[][auction_pickup_slip_file_name]"]', vehicle).each(function () {
        $(this).attr('name', 'vehicles[' + index + '][auction_pickup_slip_file_name]');
        $(this).attr('id', 'auction_pickup_slip_file_name' + index);
        $(this).siblings('label').attr('for', 'auction_pickup_slip_file_name' + index);
        $(this).rules("add", {
            required: false
        });
    });
    renderQuickVehiclScrollButtons();
    addressCopy();
    $(vehicle).show();
}
function addressCopy() {
    $('[name="vehicle_rows[]"]', new_booking_form).each(function (i, vehicle_row_main_elem) {
        let vehicle_row_main = $(vehicle_row_main_elem).val();
        let vehicle_main = $(this).closest('.row-vehicle');
        let pickup_copy_buttons = $('.pickup-copy-buttons .dropdown-menu', vehicle_main);
        let delivery_copy_buttons = $('.delivery-copy-buttons .dropdown-menu', vehicle_main);
        pickup_copy_buttons.html('');
        delivery_copy_buttons.html('');
        $('[name="vehicle_rows[]"]', new_booking_form).each(function (address_i, vehicle_row_elem) {
            let vehicle_row = $(vehicle_row_elem).val();
            let vehicle = $(this).closest('.row-vehicle');
            if (vehicle_row_main != vehicle_row) {
                pickup_copy_buttons.append(`<li data-action="copy-pickup" data-copy-from="${vehicle_row}" role="button"><a class="dropdown-item">Vehicle ${address_i + 1}</a></li>`);
            }
            if (vehicle_row_main != vehicle_row) {
                delivery_copy_buttons.append(`<li data-action="copy-delivery" data-copy-from="${vehicle_row}" role="button"><a class="dropdown-item">Vehicle ${address_i + 1}</a></li>`);
            }
        });
        if ($('.pickup-copy-buttons').length == 1) {
            $('.pickup-copy-buttons').hide();
        }
        else {
            $('.pickup-copy-buttons').show();
        }
        if ($('.delivery-copy-buttons').length == 1) {
            $('.delivery-copy-buttons').hide();
        }
        else {
            $('.delivery-copy-buttons').show();
        }
    });
    $('[data-action="copy-pickup"]', new_booking_form).off('click');
    $('[data-action="copy-pickup"]', new_booking_form).click(function () {
        let from_row_id = $(this).attr('data-copy-from');
        let to_row_id = $('[name="vehicle_rows[]"]', $(this).closest('.row-vehicle')).val();
        // start copy field values
        $(`[name="vehicles[${to_row_id}][p_contact_name]"]`).val($(`[name="vehicles[${from_row_id}][p_contact_name]"]`).val());
        $(`[name="vehicles[${to_row_id}][p_email]"]`).val($(`[name="vehicles[${from_row_id}][p_email]"]`).val());
        $(`[name="vehicles[${to_row_id}][p_zip_code]"]`).val($(`[name="vehicles[${from_row_id}][p_zip_code]"]`).val());
        $(`[name="vehicles[${to_row_id}][p_state]"]`).val($(`[name="vehicles[${from_row_id}][p_state]"]`).val());
        $(`[name="vehicles[${to_row_id}][p_city]"]`).val($(`[name="vehicles[${from_row_id}][p_city]"]`).val());
        $(`[name="vehicles[${to_row_id}][p_location]"]`).val($(`[name="vehicles[${from_row_id}][p_location]"]`).val());
        $(`[name="vehicles[${to_row_id}][p_address]"]`).val($(`[name="vehicles[${from_row_id}][p_address]"]`).val());
        $(`[name="vehicles[${to_row_id}][p_additional_info]"]`).val($(`[name="vehicles[${from_row_id}][p_additional_info]"]`).val());
        p_mobile_number_1_iti[to_row_id].setCountry(p_mobile_number_1_iti[from_row_id].getSelectedCountryData().iso2);
        $(`[name="vehicles[${to_row_id}][p_mobile_number_1]"]`).val($(`[name="vehicles[${from_row_id}][p_mobile_number_1]"]`).val());
        p_mobile_number_2_iti[to_row_id].setCountry(p_mobile_number_2_iti[from_row_id].getSelectedCountryData().iso2);
        $(`[name="vehicles[${to_row_id}][p_mobile_number_2]"]`).val($(`[name="vehicles[${from_row_id}][p_mobile_number_2]"]`).val());
        pickup_date_times[to_row_id].setDate($(`[name="vehicles[${from_row_id}][p_date_time]"]`).val());
    });
    $('[data-action="copy-delivery"]', new_booking_form).off('click');
    $('[data-action="copy-delivery"]', new_booking_form).click(function () {
        let from_row_id = $(this).attr('data-copy-from');
        let to_row_id = $('[name="vehicle_rows[]"]', $(this).closest('.row-vehicle')).val();
        // start copy field values
        $(`[name="vehicles[${to_row_id}][d_contact_name]"]`).val($(`[name="vehicles[${from_row_id}][d_contact_name]"]`).val());
        $(`[name="vehicles[${to_row_id}][d_email]"]`).val($(`[name="vehicles[${from_row_id}][d_email]"]`).val());
        $(`[name="vehicles[${to_row_id}][d_zip_code]"]`).val($(`[name="vehicles[${from_row_id}][d_zip_code]"]`).val());
        $(`[name="vehicles[${to_row_id}][d_state]"]`).val($(`[name="vehicles[${from_row_id}][d_state]"]`).val());
        $(`[name="vehicles[${to_row_id}][d_city]"]`).val($(`[name="vehicles[${from_row_id}][d_city]"]`).val());
        $(`[name="vehicles[${to_row_id}][d_location]"]`).val($(`[name="vehicles[${from_row_id}][d_location]"]`).val());
        $(`[name="vehicles[${to_row_id}][d_address]"]`).val($(`[name="vehicles[${from_row_id}][d_address]"]`).val());
        $(`[name="vehicles[${to_row_id}][d_additional_info]"]`).val($(`[name="vehicles[${from_row_id}][d_additional_info]"]`).val());
        d_mobile_number_1_iti[to_row_id].setCountry(d_mobile_number_1_iti[from_row_id].getSelectedCountryData().iso2);
        $(`[name="vehicles[${to_row_id}][d_mobile_number_1]"]`).val($(`[name="vehicles[${from_row_id}][d_mobile_number_1]"]`).val());
        d_mobile_number_2_iti[to_row_id].setCountry(d_mobile_number_2_iti[from_row_id].getSelectedCountryData().iso2);
        $(`[name="vehicles[${to_row_id}][d_mobile_number_2]"]`).val($(`[name="vehicles[${from_row_id}][d_mobile_number_2]"]`).val());
        delivery_date_times[to_row_id].setDate($(`[name="vehicles[${from_row_id}][d_date_time]"]`).val());
    });
}
function renderQuickVehiclScrollButtons() {
    $('[data-action="quick-vehicle-scroll"]').remove();
    $('.row-vehicle', new_booking_form).each(function (index, vehicle) {
        let id = $('[name="vehicle_rows[]"]', vehicle).val();
        $('#bottom-nav-buttons').append(`<li class="nav-item pe-2" data-action="quick-vehicle-scroll"><a href="#booking-vehicle-` + id + `" class="btn btn-sm border"><i class="ri-car-fill"></i> ` + (index + 1) + `</a></li>`);
    });
}
function dynamicVehicleRefresh() {
    // Show Count
    $('.row-vehicle', new_booking_form).each(function (index) {
        $('.vehicle-sl-no', this).html(index + 1);
        $('.vehicle-sl-no-total', this).html($('.row-vehicle', new_booking_form).length);
    });
    $('button[data-action="remove-vehicle"]', new_booking_form).attr('disabled', $('.row-vehicle', new_booking_form).length == 1);
    vehicleRemoveHandler();
}