let new_booking_form = $('form[id="new-booking"]');
$(document).ready(function () {
    $(".pickup_date").flatpickr({
        altInput: true,
        altFormat: "d/m/Y",
        dateFormat: "Y-m-d",
        minDate: "today",
        onChange: function (selectedDates, date, instance) {
            table_update();
        }
    });
    $('[name="time"]', new_booking_form).change(function () {
        table_update();
    });
    table_update();
});
function table_update() {
    $.ajax({
        type: 'GET',
        url: _base_url + "admin/report",
        dataType: 'json',
        data: {
            date: $('[name="date"]', new_booking_form).val(),
            time: $('[name="time"]', new_booking_form).val()
        },
        success: function (response) {
            if (response.status == true) {
                let html = ``;
                $.each(response.data.bookings, function (index, booking) {
                    html += `<tr>
                                                <td>${index + 1}</td>
                                                <td>${booking.user}</td>
                                                <td>${booking.seats.length}</td>
                                            </tr>`;
                });
                if (response.data.bookings.length == 0){
                    html = `<tr class="text-center"><td colspan="3">No Bookings !</td></tr>`;
                }
                $('#report').html(html);
                $('#available').html(response.data.seats_available);
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