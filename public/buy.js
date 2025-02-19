const appearance = {
    theme: 'stripe'
}; 
var elements = stripe.elements({ stripe, appearance });
var card = elements.create('card', {
    hidePostalCode: true,
    style: {
        base: {
            color: '#32325d',
            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
            fontSmoothing: 'antialiased',
            fontSize: '16px',
            '::placeholder': {
                color: '#aab7c4'
            }
        },
        invalid: {
            color: '#e54242',
            iconColor: '#e54242'
        }
    }
});
card.mount('#card-element');

var form = document.getElementById('payment-form');

form.addEventListener('submit', function (event) {
    event.preventDefault();

    stripe.createPaymentMethod('card', card).then(function (result) {
        if (result.error) {
            // Display error to the user
            document.getElementById('card-errors').textContent = result.error.message;
        } else {
            // Send the payment method ID to your server
            fetch('/charge', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify({
                    payment_method_id: result.paymentMethod.id,
                    amount: product.price
                })
            }).then(function (response) {
                return response.json();
            }).then(function (data) {
                // Handle success or failure response from the server
                if(data.message){
                    Swal.fire({
                        title: data.message,
                        icon: "success",
                        draggable: false
                    }).then((result) => {
                        /* Read more about isConfirmed, isDenied below */
                        if (result.isConfirmed) {
                            location.href = _base_url;
                        }
                    });
                }
                else{
                    Swal.fire({
                        title: data.error,
                        icon: "error",
                        draggable: false
                    });
                }
            });
        }
    });
});