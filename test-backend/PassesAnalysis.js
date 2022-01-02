pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

const responseJson = pm.response.json();

pm.test("Response body is in correct format", function () {
    pm.expect(responseJson.op1_ID).to.be.a('string');
    pm.expect(responseJson.op2_ID).to.be.a('string');
    pm.expect(responseJson.RequestTimestamp).to.be.a('string');
    pm.expect(responseJson.PeriodFrom).to.be.a('string');
    pm.expect(responseJson.PeriodTo).to.be.a('string');
    pm.expect(responseJson.NumberOfPasses).to.be.a('number');
    pm.expect(responseJson.PassesList).to.be.a('array');
});

pm.test("PassesList contains the right fields", function () {
    pm.expect(responseJson.PassesList[0]).to.have.keys(['PassIndex', 'PassID', 'StationID', 'TimeStamp', 'VehicleID', 'Charge']);
});

pm.test("PassesList fields are in the correct format", function () {
    pm.expect(responseJson.PassesList[0].PassID).to.be.a('string');
    pm.expect(responseJson.PassesList[0].TimeStamp).to.be.a('string');
    pm.expect(responseJson.PassesList[0].VehicleID).to.be.a('string');
    pm.expect(responseJson.PassesList[0].StationID).to.be.a('string');
    pm.expect(responseJson.PassesList[0].Charge).to.be.a('number');
    pm.expect(responseJson.PassesList[0].PassIndex).to.be.a('number');
});

pm.test("Response has correct values", function() {
    pm.expect(responseJson.op1_ID).to.be.eql('aodos');
    pm.expect(responseJson.op2_ID).to.be.eql('egnatia');
    pm.expect(responseJson.PeriodFrom).to.be.eql('2021-01-15 00:00:00');
    pm.expect(responseJson.PeriodTo).to.be.eql('2021-05-20 00:00:00');
    pm.expect(responseJson.NumberOfPasses).to.be.eql(34);
});