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
