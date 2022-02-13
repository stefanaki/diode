#!/bin/bash

# CLI
cd ./cli

# Install dependencies
npm install

# Create symbolic link "se2108"
npm link

# CLI testing tool
cd ../test-cli

# Install dependencies
npm install

# Create symbolic link "cli-test"
npm link

# Docker containers for Back-end, Front-end, MySQL, Redis
cd ..
docker compose build

# Run
docker compose up -d