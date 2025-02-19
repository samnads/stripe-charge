/***************************************************************************
 *                                                                         *
 *                                                                         *
 *                                                                         *
 *                         Coder : Samnad S                                *
 *                                                                         *
 *                                                                         *
 *                                                                         *
|**************************************************************************/
let new_booking_form = $('form[id="new-booking"]');
let last_checked = null;
persons = $('[name="persons"]', new_booking_form).val();
$(document).ready(function () {
    $(".pickup_date").flatpickr({
        altInput: true,
        altFormat: "d/m/Y",
        dateFormat: "Y-m-d",
        minDate: "today",
        onChange: function (selectedDates, date, instance) {
            availability_ui();
        }
    });
    $('[name="seats[]"]', new_booking_form).change(function (event) {
        let checks = $('[name="seats[]"]:checked', new_booking_form).length - 1;
        if ($(this).is(':checked')) {
            if (persons == checks) {
                $(last_checked).prop('checked', false);
            }
            last_checked = this;
        }
        checks = $('[name="seats[]"]:checked', new_booking_form).length;
        if (persons == checks) {
            $('[type="submit"]', new_booking_form).attr('disabled', false);
        }
        else {
            $('[type="submit"]', new_booking_form).attr('disabled', true);
        }
    });
    $('[name="persons"]', new_booking_form).change(function (event) {
        if (persons > this.value) {
            $('[name="seats[]"]', new_booking_form).prop('checked', false);
        }
        persons = $('[name="persons"]', new_booking_form).val();
        $('[name="seats[]"]', new_booking_form).trigger('change');
    });
    new_booking_form_validator = new_booking_form.validate({
        focusInvalid: true,
        errorClass: "text-danger small",
        ignore: [],
        rules: {
            "persons": {
                required: true,
            },
        },
        messages: {
        },
        errorPlacement: function (error, element) {
            if (element.hasClass("flatpickr-input") || element.hasClass("tomselected")) {
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
                url: _base_url + "booking",
                dataType: 'json',
                data: new_booking_form.serialize(),
                success: function (response) {
                    if (response.status == true) {
                        Swal.fire({
                            title: response.message.title,
                            text: response.message.content,
                            icon: response.message.type,
                            confirmButtonText: "OK",
                            allowOutsideClick: false,
                            didOpen: () => Swal.getConfirmButton().blur()
                        }).then((result) => {
                            if (result.isConfirmed) {
                                location.reload();
                            }
                        });
                    }
                    else {
                        submit_btn.prop("disabled", false)
                        toast(response.error.title, response.error.content, response.error.type, { stack: 1, position: 'bottom-center', allowToastClose: false });
                    }
                },
                error: function (response) {
                    submit_btn.prop("disabled", false);
                },
            });
        }
    });
    $('[name="time"]', new_booking_form).change(function () {
        $('[name="seats[]"]', new_booking_form).prop('checked', false);
        availability_ui();
    });
    availability_ui();
});
function availability_ui() {
    $.ajax({
        type: 'GET',
        url: _base_url + "availability",
        dataType: 'json',
        data: {
            date: $('[name="date"]', new_booking_form).val(),
            time: $('[name="time"]', new_booking_form).val()
        },
        success: function (response) {
            if (response.status == true) {
                //bookings = response.data.bookings;
                $('[name="seats[]"]', new_booking_form).attr('disabled', false);
                $.each(response.data.booking_seats, function (index, booking_seat) {
                    $('[name="seats[]"][value="' + booking_seat.seat_id + '"]', new_booking_form).attr('disabled', true);
                });
            }
            else {
                alert('Ajax Error !');
            }
        },
        error: function (response) {
            alert('Ajax Error !');
        },
    });
}