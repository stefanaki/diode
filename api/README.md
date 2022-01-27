# Back-end

In the directory `TL21-08/backend/routes` have been defined all the endpoints that are exposed to the consumers of the application's REST API. Using the base URL `https://localhost:9103/interoperability/api` user may execute the following endpoints:

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
-   `SettlementRoutes.js`
    -   `/GetSettlements/:date_from/:date_to`
    -   `/CreateSettlement`
    -   `/VerifySettlement`

Check out the [API documentation](../doc) for more.