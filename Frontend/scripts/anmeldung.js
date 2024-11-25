document.getElementById('anmeldungForm').addEventListener('submit', function (event) {
    console.log("Form submit detected");
    event.preventDefault();

    // Werte aus dem Formular abrufen
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const priority = document.getElementById('priority').value;
    const service = document.getElementById('service').value;


    
    // Berechnung des Abholdatums
    const today = new Date();
    const pickupDays = priority === 'low' ? 12 : priority === 'standard' ? 7 : 5;
    const pickupDate = new Date(today);
    pickupDate.setDate(today.getDate() + pickupDays);



    // Berechnung der Preise
    let mandatoryPrice = 0;
    if (service === 'small_service') mandatoryPrice = 50;
    if (service === 'large_service') mandatoryPrice = 80;
    if (service === 'race_service') mandatoryPrice = 120;
    if (service === 'binding_setup') mandatoryPrice = 30;
    if (service === 'skin_cut') mandatoryPrice = 40;
    if (service === 'hot_waxing') mandatoryPrice = 25;



    const priorityPrice = priority === 'low' ? 0 : priority === 'standard' ? 20 : 40;
    const totalPrice = mandatoryPrice + priorityPrice;



    // Erstellung des Objekts für die Anmeldung
    const registration = {
        name,
        email,
        phone,
        priority,
        service,
        price: totalPrice,
        create_date: today.toISOString().split('T')[0],
        pickup_date: pickupDate.toISOString().split('T')[0]
    };



    // Aktualisiere den Output-Bereich
    updateOutput(registration);



    // Anfrage an den Server senden
    fetch('http://localhost:5000/api/registration', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(registration)
    })
        .then(response => response.json())
        .then(data => {
            console.log('Serverantwort:', data);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Es gab ein Problem mit der Anmeldung.');
        });
});





// Funktion zum Aktualisieren des Outputs
function updateOutput(data) {
    const outputContent = `
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>E-Mail:</strong> ${data.email}</p>
        <p><strong>Telefonnummer:</strong> ${data.phone || "Nicht angegeben"}</p>
        <p><strong>Priorität:</strong> ${getPriorityLabel(data.priority)}</p>
        <p><strong>Dienstleistung:</strong> ${getServiceLabel(data.service)}</p>
        <p><strong>Gesamtpreis:</strong> ${data.price} CHF</p>
        <p><strong>Erstellungsdatum:</strong> ${data.create_date}</p>
        <p><strong>Abholdatum:</strong> ${data.pickup_date}</p>
    `;



    // Aktualisiere den Inhalt des Modals
    document.getElementById('modalOutputContent').innerHTML = outputContent;



    // Öffne das Modal
    const modal = new bootstrap.Modal(document.getElementById('outputModal'));
    modal.show();
}





// Funktion zum Zurücksetzen des Formulars
function cancelTicket() {
    if (confirm("Möchten Sie wirklich abbrechen?")) {
        document.getElementById("anmeldungForm").reset(); // Formular zurücksetzen
        document.getElementById("outputContent").innerHTML = "Keine Anmeldung vorhanden."; // Ausgabe zurücksetzen
    }
}





// Funktion, um die Priorität in lesbaren Text umzuwandeln
function getPriorityLabel(priority) {
    switch (priority) {
        case 'low':
            return 'Tief (12 Tage)';
        case 'standard':
            return 'Standard (7 Tage)';
        case 'express':
            return 'Express (5 Tage)';
        default:
            return 'Unbekannt';
    }
}





// Funktion, um den Dienstleistungstyp in lesbaren Text umzuwandeln
function getServiceLabel(service) {
    switch (service) {
        case 'small_service':
            return 'Kleiner Service';
        case 'large_service':
            return 'Grosser Service';
        case 'race_service':
            return 'Rennski-Service';
        case 'binding_setup':
            return 'Bindung montieren und einstellen';
        case 'skin_cut':
            return 'Fell zuschneiden';
        case 'hot_waxing':
            return 'Heisswachsen';
        default:
            return 'Unbekannte Dienstleistung';
    }
}