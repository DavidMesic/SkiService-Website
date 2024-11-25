document.getElementById('registrationForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const priority = document.getElementById('priority').value;
    const service = document.getElementById('service').value;
    
    const today = new Date();
    const pickupDays = priority === 'low' ? 12 : priority === 'standard' ? 7 : 5;
    const pickupDate = new Date(today);
    pickupDate.setDate(today.getDate() + pickupDays);

    const registration = {
        name,
        email,
        phone,
        priority,
        service,
        create_date: today.toISOString().split('T')[0],
        pickup_date: pickupDate.toISOString().split('T')[0]
    };



    

    fetch('http://localhost:5000/api/registrations', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(registration)
    })
    .then(response => response.json())
    .then(data => {
        alert('Service-Anmeldung erfolgreich!');
        console.log(data);
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Es gab ein Problem mit der Anmeldung.');
    });
});