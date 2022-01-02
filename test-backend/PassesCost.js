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
    pm.expect(responseJson.PassesCost).to.be.a('number');
});

pm.test("Response has correct values", function() {
    pm.expect(responseJson.op1_ID).to.be.eql('aodos');
    pm.expect(responseJson.op2_ID).to.be.eql('egnatia');
    pm.expect(responseJson.PeriodFrom).to.be.eql('2021-01-01 00:00:00');
    pm.expect(responseJson.PeriodTo).to.be.eql('2021-10-20 00:00:00');
    pm.expect(responseJson.NumberOfPasses).to.be.eql(82);
    pm.expect(responseJson.PassesCost).to.be.eql(229.6);
});