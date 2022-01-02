pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

const responseJson = pm.response.json();

pm.test("Response body is in correct format", function () {
    pm.expect(responseJson.Station).to.be.a('string');
    pm.expect(responseJson.StationOperator).to.be.a('string');
    pm.expect(responseJson.RequestTimestamp).to.be.a('string');
    pm.expect(responseJson.PeriodFrom).to.be.a('string');
    pm.expect(responseJson.PeriodTo).to.be.a('string');
    pm.expect(responseJson.NumberOfPasses).to.be.a('number');
    pm.expect(responseJson.PassesList).to.be.a('array');
});

pm.test("PassesList contains the right fields", function () {
    pm.expect(responseJson.PassesList[0]).to.have.keys(['PassIndex', 'PassID', 'PassTimeStamp', 'VehicleID', 'TagProvider', 'PassType', 'PassCharge']);
});

pm.test("PassesList fields are in the correct format", function () {
    pm.expect(responseJson.PassesList[0].PassID).to.be.a('string');
    pm.expect(responseJson.PassesList[0].PassTimeStamp).to.be.a('string');
    pm.expect(responseJson.PassesList[0].VehicleID).to.be.a('string');
    pm.expect(responseJson.PassesList[0].TagProvider).to.be.a('string');
    pm.expect(responseJson.PassesList[0].PassCharge).to.be.a('number');
    pm.expect(responseJson.PassesList[0].PassIndex).to.be.a('number');
});

pm.test("Response has correct values", function() {
    pm.expect(responseJson.Station).to.be.eql('olympia_odos tolls station 02');
    pm.expect(responseJson.StationOperator).to.be.eql('olympia_odos');
    pm.expect(responseJson.PeriodFrom).to.be.eql('2021-01-09 00:00:00');
    pm.expect(responseJson.PeriodTo).to.be.eql('2021-07-09 00:00:00');
    pm.expect(responseJson.NumberOfPasses).to.be.eql(63);
});