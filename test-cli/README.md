# test-cli

### Installation Instructions

1. Get Node.js
2. Clone the codebase    
   `$ git clone https://github.com/ntua/TL21-08.git`
3. Install required packages and create symbolic link
    ```
    $ cd TL21-08/test-cli
    $ npm install
    $ sudo npm link
    ```

#### `$ cli-test successful [options]`:
```
--username <username>      Username  
--passw <password>         Password  
--station <stationID>      Station ID
--op1 <operatorID>         Operator ID 1
--op2 <operatorID>         Operator ID 2
--datefrom <date>          Date from
--dateto <date>            Date to
--format <format>          Response format
--rounds <numberOfRounds>  Number of rounds
```

#### `$ cli-test failed [options]`:
```
  --rounds <numberOfRounds>  Number of rounds
```