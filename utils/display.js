#!/usr/bin/env node

/**
 * Copyright (c) 2018-present, Kaios, Inc.
 */

const chalk = require("chalk");

const icons = {
  success: ["smile", ":open_mouth:"],
  error: ["disappointed", "broken_heart"],
  info: ["book", "pensive"]
};

const banner = (msg, icons = []) =>
  `.,.  .,. 
.,,  .,, 
.,,.,,   \t${msg}
.,, .,,. 
.,,   ,,.
`;

const successMessage = message => chalk.green(message);
const warningMessage = message => chalk.yellow(message);
const infoMessage = message => chalk.magenta(message);
const errorMessage = message => chalk.red(message);

const successLog = message => console.log(successMessage(message));
const warningLog = message => console.log(warningMessage(message));
const errorLog = message => console.log(errorMessage(message));
const infoLog = message => console.log(infoMessage(message));

const successBanner = msg => console.log(successMessage(banner(msg || "SUCCESS", icons.success)));
const warningBanner = msg => console.log(warningMessage(banner(msg || "WARNING")));
const errorBanner = msg => console.log(errorMessage(banner(msg || "ERROR", icons.error)));
const infoBanner = msg => console.log(infoMessage(banner(msg || "INFO", icons.info)));

module.exports = {
  successMessage,
  warningMessage,
  errorMessage,
  infoMessage,

  successLog,
  warningLog,
  errorLog,
  infoLog,

  warningBanner,
  errorBanner,
  successBanner,
  infoBanner
};
