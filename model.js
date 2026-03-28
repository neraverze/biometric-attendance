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
