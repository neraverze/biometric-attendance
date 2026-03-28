const db = SpreadsheetDB.init("1HQT-FfXFSpsG_tTUDt36jZ8-RO4SiEa_Mp00vgVVfg0");

function doPost(e) {
    var action = e.parameter.action;

    if (!action) return buildResponse("Invalid URL Formatting");

    switch (action) {
        case "polling":
            var contents = JSON.parse(e.postData.contents);
            var result = parsePolling(contents);
            return buildResponse(
                (message = result.message),
                (ok = result.status),
            );
        case "startAttendance":
            var contents = JSON.parse(e.postData.contents);
            var result = startAttendance(contents);
            return buildResponse(
                (message = result.message),
                (ok = result.status),
            );
    }
}

function buildResponse(message = "Unauthorized", ok = "failed") {
    return ContentService.createTextOutput(
        JSON.stringify({
            status: ok,
            message: message,
        }),
    ).setMimeType(ContentService.MimeType.JSON);
}
