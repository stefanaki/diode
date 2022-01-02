pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

const responseJson = pm.response.json();

pm.test("Response body is in correct format", function () {
    pm.expect(responseJson.op_ID).to.be.a('string');
    pm.expect(responseJson.RequestTimestamp).to.be.a('string');
    pm.expect(responseJson.PeriodFrom).to.be.a('string');
    pm.expect(responseJson.PeriodTo).to.be.a('string');
    pm.expect(responseJson.PPOList).to.be.a('array');
});

pm.test("PPOList contains the right fields", function () {
    pm.expect(responseJson.PPOList[0]).to.have.keys(['VisitingOperator', 'NumberOfPasses', 'PassesCost']);
});

pm.test("PPOList fields are in the correct format", function () {
    pm.expect(responseJson.PPOList[0].VisitingOperator).to.be.a('string');
    pm.expect(responseJson.PPOList[0].NumberOfPasses).to.be.a('number');
    pm.expect(responseJson.PPOList[0].PassesCost).to.be.a('number');
});

let correctValues = [
  {
    VisitingOperator: "egnatia",
    NumberOfPasses: 33,
    PassesCost: 92.4
  },
  {
    VisitingOperator: "gefyra",
    NumberOfPasses: 35,
    PassesCost: 98
  },
  {
    VisitingOperator: "kentriki_odos",
    NumberOfPasses: 34,
    PassesCost: 95.2
  },
  {
    VisitingOperator: "moreas",
    NumberOfPasses: 40,
    PassesCost: 112
  },
  {
    VisitingOperator: "nea_odos",
    NumberOfPasses: 37,
    PassesCost: 103.6
  },
  {
    VisitingOperator: "olympia_odos",
    NumberOfPasses: 27,
    PassesCost: 75.6
  }
]

pm.test("Response has correct values", function() {
    pm.expect(responseJson.PPOList).to.be.eql(correctValues);
})
