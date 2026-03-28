const db = SpreadsheetDB.init("1HQT-FfXFSpsG_tTUDt36jZ8-RO4SiEa_Mp00vgVVfg0");

function doPost(e) {
    var action = e.parameter.action;

    if (!action) return returnHTTPSStatusCode("Invalid URL Formatting");

    switch (action) {
        case "polling":
            var contents = JSON.parse(e.postData.contents);
            var result = parsePolling(contents);
            return returnHTTPSStatusCode(
                (message = result.message),
                (status = result.status),
            );
    }
}

function returnHTTPSStatusCode(message = "Unauthorized", status = "failed") {
    return ContentService.createTextOutput(
        JSON.stringify({
            status: status,
            message: message,
        }),
    );
}
