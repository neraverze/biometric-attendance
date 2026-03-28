const TOLERANCE_DISTANCE = 0.2; // 200meters

function parsePolling(data) {
    try {
        // Writting the Polling Data
        var body = {
            internId: data.internId,
            lat: data.lat,
            long: data.long,
            boundStatus: data.status,
            time: new Date().toISOString(),
        };
        db.createRowFromObject("polling", body, "pollingId");

        // check for boundedness
        if (data.status === "unbounded") {
            var row = getAttendanceData(data.internId, new Date().getDate());

            // Row will always be present because polling will not start until attendance is started
            row["numberOfTimesUnbounded"] += 1;
            row["totalUnboundedTime"] += 5; // adding 5 minutes

            db.updateRowFromObject("attendance", row, "attendanceId");
        }

        return {
            message: "Poll Noted",
            status: "success",
        };
    } catch (err) {
        return {
            message: err.message,
            status: "failed",
        };
    }
}

// Start Attendance
function startAttendance(data) {
    try {
        var body = {
            startTime: new Date().toISOString(),
            date: new Date().toISOString(),
            locationId: data.locationId,
            internId: data.internId,
            numberOfTimesUnbounded: 0,
            totalUnboundedTime: 0,
        };

        db.createRowFromObject("attendance", body, "attendanceId");

        return {
            message: "Attendance Started",
            status: "success",
        };
    } catch (err) {
        return {
            message: err.message || "Something Went Wrong",
            status: "failed",
        };
    }
}

// Stop Attendance
function stopAttendance(data) {
    try {
        // Fetching the existing row
        var date = new Date().getDate();
        var row = getAttendanceData(data.internId, date);

        if (!row)
            return {
                message: "Intern not found or attendance not started.",
                status: "failed",
            };

        // Updating the counters
        var startTime = new Date(row.startTime).getTime();
        var endTime = new Date().getTime();

        // Time Elapsed
        var totalTime = (endTime - startTime) / (60 * 1000);

        row["totalTime"] = totalTime;
        row["endTime"] = new Date().toISOString();
        row["totalBoundedTime"] = totalTime - row["totalUnboundedTime"];

        db.updateRowFromObject("attendance", row, "attendanceId");

        return {
            message: "Attendance stopped for today.",
            status: "success",
        };
    } catch (err) {
        return {
            message: err.message || "Something went wrong.",
            status: "failed",
        };
    }
}

// Update Attendance
function updateAttendance(internId, data) {
    try {
        var row = getAttendanceData(internId, data.date);

        if (!row) return "Intern not found.";

        var keys = Object.keys(data);
        keys.forEach((key) => {
            row[key] = data[key];
        });

        db.updateRowFromObject("attendance", row, "attendanceId");
        return "Data updated.";
    } catch (err) {
        return err.message || "Something went wrong.";
    }
}

// Get Data of a particular date of an intern from attendance sheet
function getAttendanceData(internId, date) {
    var rows = db.getRowsByCriteria("attendance", { internId: internId });
    var foundRow = {};
    rows.forEach((row) => {
        const inDate = new Date(row.date);
        const dateA = inDate.getDate();
        if (dateA == date) {
            foundRow = row;
            return;
        }
    });

    return foundRow;
}

// register new location
function registerNewLocation(data) {
    var intern = db.findRowAsObject("interns", { internId: data.internId });
    if (!intern)
        return {
            message: "Intern not found.",
            status: "failed",
        };

    // check for existing locations
    var found = existingLocations(data.internId, data.lat, data.long);
    if (found)
        return {
            message: "Work location already exists.",
            status: "failed",
        };

    // adding the location
    db.createRowFromObject(
        "locations",
        { lat: data.lat, long: data.long, internId: data.internId },
        "locationId",
    );

    return {
        message: "Work location added successfully.",
        status: "success",
    };
}

// find existing locations
function existingLocations(internId, lat, long) {
    var rows = db.getRowsByCriteria("locations", { internId: internId });
    var found = false;
    for (const row of rows) {
        found = compareCoordinates(lat, long, row.lat, row.long);
        if (found) break;
    }

    return found;
}

// Compare Coordinates
function compareCoordinates(lat1, lon1, lat2, lon2) {
    var distance = calculateDistance(lat1, lon1, lat2, lon2);
    if (distance <= TOLERANCE_DISTANCE) return true;
    else return false;
}

// Haversine Function
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers

    // Function to convert degrees to radians
    function toRad(degree) {
        return (degree * Math.PI) / 180;
    }

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) *
            Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; // Distance in kilometers
    return distance;
}
