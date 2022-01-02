pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

const responseJson = pm.response.json();

pm.test("Response body is in correct format", function () {
    pm.expect(responseJson.status).to.be.a('string');
});

pm.test("Response has correct values", function() {
    pm.expect(responseJson.status).to.be.eql('OK');
});
