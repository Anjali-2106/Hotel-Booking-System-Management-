document.addEventListener('DOMContentLoaded', function() {
    // Handle room type from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const roomType = urlParams.get('room');
    
    if (roomType && document.getElementById('roomType')) {
        document.getElementById('roomType').value = roomType;
        updateBookingSummary();
    }
    
    // Booking form submission
    const bookingForm = document.getElementById('reservationForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const formData = {
                roomType: document.getElementById('roomType').value,
                checkIn: document.getElementById('checkIn').value,
                checkOut: document.getElementById('checkOut').value,
                adults: document.getElementById('adults').value,
                children: document.getElementById('children').value,
                fullName: document.getElementById('fullName').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                specialRequests: document.getElementById('specialRequests').value
            };
            
            // Validate dates
            if (new Date(formData.checkIn) >= new Date(formData.checkOut)) {
                alert('Check-out date must be after check-in date');
                return;
            }
            
            // Save to session storage and redirect
            sessionStorage.setItem('bookingDetails', JSON.stringify(formData));
            window.location.href = 'confirmation.html';
        });
    }
    
    // Update booking summary on form changes
    if (document.getElementById('reservationForm')) {
        const formInputs = document.querySelectorAll('#reservationForm input, #reservationForm select');
        formInputs.forEach(input => {
            input.addEventListener('change', updateBookingSummary);
        });
    }
    
    // Set minimum date for check-in (today)
    const today = new Date().toISOString().split('T')[0];
    const checkInInput = document.getElementById('checkIn');
    if (checkInInput) {
        checkInInput.min = today;
    }
    
    // Update check-out min date when check-in changes
    if (checkInInput && document.getElementById('checkOut')) {
        checkInInput.addEventListener('change', function() {
            document.getElementById('checkOut').min = this.value;
        });
    }
});

function updateBookingSummary() {
    const summaryDiv = document.getElementById('summaryContent');
    if (!summaryDiv) return;
    
    const roomType = document.getElementById('roomType').value;
    const checkIn = document.getElementById('checkIn').value;
    const checkOut = document.getElementById('checkOut').value;
    const adults = document.getElementById('adults').value;
    const children = document.getElementById('children').value;
    
    if (!roomType || !checkIn || !checkOut) {
        summaryDiv.innerHTML = '<p>Select a room and dates to see your booking details.</p>';
        return;
    }
    
    // Calculate nights
    const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
    
    // Get room price
    let roomName, price;
    switch(roomType) {
        case 'deluxe':
            roomName = 'Deluxe Room';
            price = 199;
            break;
        case 'executive':
            roomName = 'Executive Suite';
            price = 299;
            break;
        case 'presidential':
            roomName = 'Presidential Suite';
            price = 499;
            break;
        default:
            roomName = 'Room';
            price = 0;
    }
    
    const total = price * nights;
    
    // Format dates
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const checkInDate = new Date(checkIn).toLocaleDateString('en-US', options);
    const checkOutDate = new Date(checkOut).toLocaleDateString('en-US', options);
    
    // Update summary
    summaryDiv.innerHTML = `
        <h4>${roomName}</h4>
        <p><strong>Check-In:</strong> ${checkInDate}</p>
        <p><strong>Check-Out:</strong> ${checkOutDate}</p>
        <p><strong>Nights:</strong> ${nights}</p>
        <p><strong>Guests:</strong> ${adults} adults, ${children} children</p>
        <hr>
        <p><strong>Price per night:</strong> $${price}</p>
        <p><strong>Total:</strong> $${total}</p>
    `;
}