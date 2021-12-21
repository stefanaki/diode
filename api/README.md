# Back-end

Στον κατάλογο `TL21-08/backend/routes` έχουν ορισθεί όλα τα endpoints που έχουμε εκτεθειμένα στους καταναλωτές του REST API της εφαρμογής. Με βάση το base URL `https://localhost:9103/interoperability/api` μπορεί κανείς να έχει πρόσβαση στα παρακάτω routes:

-   `PassesRoutes.js`
    -   `/PassesPerStation/:stationID/:date_from/:date_to`
    -   `/PassesAnalysis/:op1_ID/:op2_ID/:date_from/:date_to`
    -   `/PassesCost/:op1_ID/:op2_ID/:date_from/:date_to`
    -   `/ChargesBy/:op_ID/:date_from/:date_to`
-   `AdminRoutes.js`
    -   `/admin/healthcheck`
    -   `/admin/resetpasses`
    -   `/admin/resetstations`
    -   `/admin/resetvehicles`
-   `AuthRoutes.js`
    -   `/login`
    -   `/logout`

Περισσότερα για τη σωστή χρήση του API μπορείτε να διαβάσετε στο Postman documentation που βρίσκεται στον κατάλογο `TL21-08/doc`.
