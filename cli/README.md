# CLI

### Installation Instructions

1. Get NodeJS
2. Clone the codebase
   `git clone https://github.com/ntua/TL21-08.git`
3. Install required packages and create symbolic link
    ```
    cd TL21-08/cli
    npm install
    sudo npm link
    ```

### Correct Usage:

```
Usage: se2108 [options] [command]

Diode CLI Tool - softeng21-08

Options:
  -V, --version               output the version number
  -h, --help                  display help for command

Commands:
  login [options]             log in to use the CLI tool
  logout                      log out
  healthcheck                 database connection health check
  resetpasses                 wipe all pass events from the database and reset
                              admin credentials
  resetstations               reset station data to the initial sample dataset
  resetvehicles               reset vehicle data to the initial sample dataset
  passesperstation [options]  pass events at the specified toll station and
                              time period
  passesanalysis [options]    pass events by vehicles with tags of op2 at toll
                              stations of op1
  passescost [options]        summary of pass events of vehicles with tags of
                              op2 at toll stations of op1
  chargesby [options]         charges and pass events at toll stations of op1
                              from vehicles with tags of another operator
  settlements [options]       settlement management operations
  admin [options]             system administration operations
  help [command]              display help for command

```
