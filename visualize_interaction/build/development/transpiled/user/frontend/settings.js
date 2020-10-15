"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useSettings = useSettings;
exports.ConfigKeys = void 0;

var _ui = require("@airtable/blocks/ui");

var ConfigKeys = {
  UML_DIAGRAM_SERVER_URL: 'umlDiagramServerUrl',
  SHOW_DEBUG: 'showDebug'
};
/**
 * Return settings from GlobalConfig with defaults, and converts them to Airtable objects.
 * @param {object} globalConfig
 * @param {Base} base - The base being used by the app in order to convert id's to objects
 * @returns {{
 *     umlDiagramServerUrl: http://localhost:8080,
 *     interactionTable: Table 
 * }}
 */

exports.ConfigKeys = ConfigKeys;

function getSettings(globalConfig, base) {
  var umlDiagramServerUrl = 'https://docs.opentrading.net/umlDiagram'; //globalConfig.get(ConfigKeys.UML_DIAGRAM_SERVER_URL);

  var showDebug = globalConfig.get(ConfigKeys.SHOW_DEBUG);
  var activityTable = base.getTable("Activity");
  var activities = (0, _ui.useRecords)(activityTable);
  var applicationTable = base.getTable('Application');
  var applications = (0, _ui.useRecords)(applicationTable);
  var interfaceTable = base.getTable('Interface');
  var interfaces = (0, _ui.useRecords)(interfaceTable);
  var actorTable = base.getTable('Actor');
  var actors = (0, _ui.useRecords)(actorTable);
  var interactionTable = base.getTable('Interaction');
  var interactions = (0, _ui.useRecords)(interactionTable);
  return {
    umlDiagramServerUrl: umlDiagramServerUrl,
    showDebug: showDebug,
    activities: activities,
    applications: applications,
    interfaces: interfaces,
    actors: actors,
    interactions: interactions
  };
}
/**
 * Wraps the settings with validation information
 * @param {object} settings - The object returned by getSettings
 * @returns {{settings: *, isValid: boolean}|{settings: *, isValid: boolean, message: string}}
 */


function getSettingsValidationResult(settings) {
  var umlDiagramServerUrl = settings.umlDiagramServerUrl;
  var isValid = true;
  var message = null;

  if (!umlDiagramServerUrl) {
    // If diagram url not specicifed
    isValid = false;
    message = (message == null ? '' : message) + 'Please select a field for previews';
  }

  return {
    isValid: isValid,
    message: message,
    settings: settings
  };
}
/**
 * A React hook to validate and access settings configured in SettingsForm.
 * @returns {{settings: *, isValid: boolean, message: string}|{settings: *, isValid: boolean}}
 */


function useSettings() {
  var base = (0, _ui.useBase)();
  var globalConfig = (0, _ui.useGlobalConfig)();
  var settings = getSettings(globalConfig, base);
  return getSettingsValidationResult(settings);
}