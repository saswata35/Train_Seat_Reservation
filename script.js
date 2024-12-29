// Seat layout initialization (11 rows, 7 seats per row, last row has 3 seats)
const seats = [
    [0, 0, 0, 0, 0, 0, 0],  // Row 1
    [0, 0, 0, 0, 0, 0, 0],  // Row 2
    [0, 0, 0, 0, 0, 0, 0],  // Row 3
    [0, 0, 0, 0, 0, 0, 0],  // Row 4
    [0, 0, 0, 0, 0, 0, 0],  // Row 5
    [0, 0, 0, 0, 0, 0, 0],  // Row 6
    [0, 0, 0, 0, 0, 0, 0],  // Row 7
    [0, 0, 0, 0, 0, 0, 0],  // Row 8
    [0, 0, 0, 0, 0, 0, 0],  // Row 9
    [0, 0, 0, 0, 0, 0, 0],  // Row 10
    [0, 0, 0, 0, 0, 0, 0],  // Row 11
    [0, 0, 0] 
];

document.addEventListener('DOMContentLoaded', function () {
    const bookBtn = document.getElementById('book-btn');
    const seatsInput = document.getElementById('seats');
    const seatLayout = document.querySelector('.seat-layout');

    // Function to render the seat layout
    function renderSeatLayout() {
        seatLayout.innerHTML = '';
        seats.forEach((row, rowIndex) => {
            row.forEach((seat, seatIndex) => {
                const seatElement = document.createElement('div');
                seatElement.classList.add('seat');
                if (seat === 0) {
                    seatElement.classList.add('available');
                    seatElement.textContent = rowIndex * 7 + seatIndex + 1;
                } else {
                    seatElement.classList.add('booked');
                }
                seatLayout.appendChild(seatElement);
            });
        });
    }

    // Function to handle seat booking
    function bookSeats(requestedSeats) {
        let bookedSeats = [];

        // Step 1: Try to find `requestedSeats` consecutive seats in any row
        for (let rowIndex = 0; rowIndex < 11; rowIndex++) {
            let availableSeats = findConsecutiveSeats(seats[rowIndex], requestedSeats);
            if (availableSeats.length > 0) {
                // Book the seats
                availableSeats.forEach(seatIndex => {
                    seats[rowIndex][seatIndex] = 1; // Mark as booked
                    bookedSeats.push(rowIndex * 7 + seatIndex + 1);
                });
                break;
            }
        }

        // Step 2: If no consecutive seats found, book nearby seats
        if (bookedSeats.length === 0) {
            bookedSeats = bookNearbySeats(requestedSeats);
        }

        renderSeatLayout();
        return bookedSeats;
    }

    // Function to find consecutive seats in a row
    function findConsecutiveSeats(row, requestedSeats) {
        let availableSeats = [];
        for (let i = 0; i <= row.length - requestedSeats; i++) {
            if (row.slice(i, i + requestedSeats).every(seat => seat === 0)) {
                availableSeats = Array.from({ length: requestedSeats }, (_, idx) => i + idx);
                break;
            }
        }
        return availableSeats;
    }

    // Function to book nearby seats if consecutive ones aren't available
    function bookNearbySeats(requestedSeats) {
        let bookedSeats = [];
        let remainingSeats = requestedSeats;
        for (let rowIndex = 0; rowIndex < 11; rowIndex++) {
            for (let seatIndex = 0; seatIndex < seats[rowIndex].length; seatIndex++) {
                if (seats[rowIndex][seatIndex] === 0) {
                    seats[rowIndex][seatIndex] = 1;
                    bookedSeats.push(rowIndex * 7 + seatIndex + 1);
                    remainingSeats--;
                    if (remainingSeats === 0) break;
                }
            }
            if (remainingSeats === 0) break;
        }
        return bookedSeats;
    }

    // Render initial seat layout
    renderSeatLayout();

    // Handle booking button click
    bookBtn.addEventListener('click', () => {
        const requestedSeats = parseInt(seatsInput.value);
        if (requestedSeats < 1 || requestedSeats > 7) {
            alert('Please enter a valid number of seats (1-7)');
        } else {
            const bookedSeats = bookSeats(requestedSeats);
            if (bookedSeats.length > 0) {
                alert(`Successfully booked seats: ${bookedSeats.join(', ')}`);
            } else {
                alert('Sorry, no available seats.');
            }
        }
    });
});
