function calculateTime(time) {
    const [hours, minutes, seconds] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;
    const formattedTime = `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
    return formattedTime;
}
function calculateTravelTime(ms){
    const totalMinutes = Math.floor(ms / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours} hr ${minutes} min`;
}
/* ON THE MAIN PAGE
document.getElementById('oldForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const origin = document.getElementById('from').value;
    const destination = document.getElementById('to').value;
    const departureDate = document.getElementById('depart-date').value;
    const adults = document.getElementById('adults').value;

    // Save form data to localStorage
    localStorage.setItem('formData', JSON.stringify({ origin, destination, departureDate, adults }));

    // Navigate to the new page
    window.location.href = 'newPage.html';
});
*/
document.addEventListener('DOMContentLoaded', () => {
    const formData = JSON.parse(localStorage.getItem('formData'));
    if (formData) {
        document.getElementById('from').value = formData.origin;
        document.getElementById('to').value = formData.destination;
        document.getElementById('depart-date').value = formData.departureDate;
        document.getElementById('adults').value = formData.adults;

        // Optionally, submit the form automatically
        document.getElementById('searchForm').submit();
    }
});
const fromSearch = document.getElementById('from');
fromSearch.addEventListener('input', async (event) => {
    const suggestionsContainer = document.getElementById('suggestions');

    const origin = event.target.value;
    if(!origin || origin==""){
        suggestionsContainer.style.display = 'none';
        return;
    }
    suggestionsContainer.style.display = 'block';
    try {
      const response = await fetch(`api/flight/autocomplete?query=${origin}`);
      if (response.ok) {
        const data = await response.json();
        suggestionsContainer.innerHTML = '';

        data.forEach(el => {
            const suggestionItem = document.createElement('div');
            suggestionItem.classList.add('suggestion-item');
            suggestionItem.textContent = `${el.city}, ${el.name} (${el.iata_code})`;
            suggestionItem.addEventListener('click', () => {
                fromSearch.value = el.iata_code;
                suggestionsContainer.innerHTML = '';
                suggestionsContainer.style.display='none';
            });
            suggestionsContainer.appendChild(suggestionItem);
        });
      } else {
        const errorData = await response.json();
        alert(errorData.message);
      }
    } catch (error) {
      console.log('Error:', error);
    }
  });
  const toSearch = document.getElementById('to');
  toSearch.addEventListener('input', async (event) => {
    const origin = event.target.value;
    const suggestionsContainer = document.getElementById('suggestions2');
    if(!origin|| origin==""){
        suggestionsContainer.style.display = 'none';
        return;
    }
    suggestionsContainer.style.display = 'block';
    try {
      const response = await fetch(`api/flight/autocomplete?query=${origin}`);
      if (response.ok) {
        const data = await response.json();
        suggestionsContainer.innerHTML = '';

        data.forEach(el => {
            const suggestionItem = document.createElement('div');
            suggestionItem.classList.add('suggestion-item');
            suggestionItem.textContent = `${el.city}, ${el.name} (${el.iata_code})`;
            suggestionItem.addEventListener('click', () => {
                toSearch.value = el.iata_code;
                suggestionsContainer.innerHTML = '';
                suggestionsContainer.style.display='none';

            });
            suggestionsContainer.appendChild(suggestionItem);
        });
      } else {
        const errorData = await response.json();
        alert(errorData.message);
      }
    } catch (error) {
      console.log('Error:', error);
    }
  });

document.getElementById('searchForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const origin = document.getElementById('from').value;
    const destination = document.getElementById('to').value;
    const departureDate = document.getElementById('depart-date').value;
    const adults = 1;
    try {
      const response = await fetch('api/flight/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ origin, destination, departureDate, adults })
      });

      if (response.ok) {
        const data = await response.json();
        const flightResults = document.getElementById('flight-results');
        flightResults.innerHTML = '';
        data.departureFlights.forEach(flight => {
          const flightElement = document.createElement('div');
          flightElement.innerHTML = `
          <div class="main-content">

                  <div class="flight-info">
            <div class="flight-logo">
                <!-- Logo placeholder -->
                <!-- <img src="path/to/logo.png" alt="Airline Logo" style="width: 100%; height: 100%;"> -->
            </div>
            <div class="flight-details">
                <div class="flight-times">
                    <span>${calculateTime(flight.departure_time)} – ${calculateTime(flight.arrival_time)}</span>
                    <span style="font-size: 14px; color: #ccc;">${flight.airline_name}</span>
                </div>
                <div class="flight-duration">
                    <span> ${calculateTravelTime(flight.travel_time)}</span>
                    <span style="font-size: 14px; color: #ccc;">${origin}-${destination}</span>

                </div>
                <div class="flight-type">
                    <span>Nonstop</span>
                </div>
                <div class="flight-price">
                    ₹ ${flight.price}
                </div>
            </div>
        </div>
        </div>
          `;
          flightResults.appendChild(flightElement);
        });
        // Redirect to the desired page after successful search
        // window.location.href = '/search'; // Change this to your desired route
      } else {
        const errorData = await response.json();
        alert(errorData.message); // Display error message
      }
    } catch (error) {
      console.log('Error:', error);
    }
  });