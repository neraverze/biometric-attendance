# Biometric Attendance + Geofencing

## Backend Parameters
1. User sends a POST request to sign-in with payload data.
2. POST sign-in will contain the biometric encrypted key for later usage, and the id of the employee.
3. Another POST request will be to add a Work Location.
4. Another GET request will be to mark attendance.
5. During marking of attendance, every time attendance will start, then frontend will be sending the lat long input every 5 mins or so.
6. At the end of the day, the average evaluation will be done, and hours calculated will be shown.

For starting the attendance & polling, 
    Post Data Contents,
        internId, lat, long, status => bounded, unbounded

        Bounded means that the device is still within the boundaries.
        Unbounded means that the device is outside the boundary.

POST ROUTE,
    action => logIn, polling
