#!/bin/bash

printf "softeng21-08 Installation Script\n\n"

# CLI
cd ./cli

# Install dependencies
printf "Installing CLI dependencies... "
if npm install --silent > /dev/null 2>&1
then
    printf "\u2714\n"
else
    printf "Error while installing NPM modules. Make sure Node.js and NPM are installed.\n"
    exit 1
fi

# Create symbolic link "se2108"
printf "Creating 'se2108' symbolic link... "
npm link --silent > /dev/null 2>&1
printf "\u2714\n"

# CLI testing tool
cd ../test-cli

# Install dependencies
printf "Installing CLI testing tool dependencies... "
npm install --silent > /dev/null 2>&1
printf "\u2714\n"

# Create symbolic link "cli-test"
printf "Creating 'cli-test' symbolic link... "
npm link --silent > /dev/null 2>&1
printf "\u2714\n"

# Docker containers for Back-end, Front-end, MySQL, Redis
cd ..
printf "Building Docker containers... "
if docker compose build > /dev/null 2>&1
then
    printf "\u2714\n"
else
    printf "\u2714\nError while building Docker containers. Make sure Docker is installed and running."
    exit 1
fi

printf "\nDone. Type 'docker compose up' to run the application.\n"

exit 0
