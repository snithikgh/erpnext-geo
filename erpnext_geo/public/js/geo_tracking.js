async function getEmployeeID() {
    try {
        let response = await fetch('/api/resource/Employee?filters=[["user_id","=","' + frappe.session.user + '"]]&fields=["name"]');
        let data = await response.json();
        if (data && data.data && data.data.length > 0) {
            return data.data[0].name;
        }
    } catch (error) {
        console.error("Failed to fetch employee ID:", error);
    }
    return null;
}

async function sendLocationToServer(employee_id, lat, long) {
    try {
        let response = await fetch('/api/method/erpnext_geo.erpnext_geo.log_employee_location', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                employee_id: employee_id,
                latitude: lat,
                longitude: long
            })
        });

        let result = await response.json();
        console.log("Location sent:", result);
    } catch (error) {
        console.error("Error sending location:", error);
    }
}

async function trackEmployeeLocation() {
    let employee_id = await getEmployeeID();
    if (!employee_id) {
        console.error("Employee ID not found. Cannot track location.");
        return;
    }

    setInterval(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const long = position.coords.longitude;
                    sendLocationToServer(employee_id, lat, long);
                },
                (error) => {
                    console.error("Geolocation error:", error);
                }
            );
        } else {
            console.error("Geolocation not supported.");
        }
    }, 5000); // every 5 seconds
}

// Start tracking on page ready
frappe.ready(() => {
    if (frappe.session.user !== "Guest") {
        trackEmployeeLocation();
    }
});
