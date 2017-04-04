# README

## Usage

Run Unit Tests (Karma): `npm test`

Run Unit Tests single run (Karma): `npm run test-single-run`

Run E2E Tests (Protractor): `npm run protractor`

Run single E2E Test Specs (Protractor): `protractor e2e-tests/protractor.conf.js --specs e2e-tests/scenarios_view_name.js`

Run Webserver: `npm start`

Run Sonar Scanner: `sonar-scanner` (You have to install sonar-scanner and SonarQube local)

## Build Pipeline

CI/CD: [travis-ci](https://travis-ci.org/rocketvoip/rocketvoip-frontend)

Code Quality: [SonarQube](https://sonarqube.com/dashboard/index/ch.zhaw.psit4:rocketvoip-frontend)

Coverage: [Coveralls](https://coveralls.io/github/rocketvoip/rocketvoip-frontend)

## Heroku
Deployment: [Heroku](https://rocketvoip-frontend.herokuapp.com/app)

## Build Status
Master: [![Build Status](https://travis-ci.org/rocketvoip/rocketvoip-frontend.svg?branch=master)](https://travis-ci.org/rocketvoip/rocketvoip-frontend)
 [![Quality Gate](https://sonarqube.com/api/badges/gate?key=ch.zhaw.psit4:rocketvoip-frontend)](https://sonarqube.com/dashboard/index/ch.zhaw.psit4:rocketvoip-frontend)
[![Coverage Status](https://coveralls.io/repos/github/rocketvoip/rocketvoip-frontend/badge.svg?branch=master)](https://coveralls.io/github/rocketvoip/rocketvoip-frontend?branch=master)
