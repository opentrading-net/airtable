import {useBase, useGlobalConfig, useRecords} from '@airtable/blocks/ui';

export const ConfigKeys = {
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
function getSettings(globalConfig, base) {
    const umlDiagramServerUrl = 'https://docs.opentrading.net/umlDiagram'; //globalConfig.get(ConfigKeys.UML_DIAGRAM_SERVER_URL);
    const showDebug = globalConfig.get(ConfigKeys.SHOW_DEBUG);


    var activityTable = base.getTable("Activity");
    var activities = useRecords(activityTable);
    var applicationTable = base.getTable('Application');
    var applications = useRecords(applicationTable);
    var interfaceTable = base.getTable('Interface');
    var interfaces = useRecords(interfaceTable);
    var actorTable = base.getTable('Actor');
    var actors = useRecords(actorTable);
    var interactionTable = base.getTable('Interaction');
    var interactions = useRecords(interactionTable);

    return {
        umlDiagramServerUrl,
        showDebug,
        activities,
        applications,
        interfaces,
        actors,
        interactions
    };
}

/**
 * Wraps the settings with validation information
 * @param {object} settings - The object returned by getSettings
 * @returns {{settings: *, isValid: boolean}|{settings: *, isValid: boolean, message: string}}
 */
function getSettingsValidationResult(settings) {
    const {umlDiagramServerUrl} = settings;
    let isValid = true;
    let message = null;
    if (!umlDiagramServerUrl) {
        // If diagram url not specicifed
        isValid = false;
        message = (message == null ? '' : message) + 'Please select a field for previews';
    } 

    return {
        isValid,
        message,
        settings,
    };
}

/**
 * A React hook to validate and access settings configured in SettingsForm.
 * @returns {{settings: *, isValid: boolean, message: string}|{settings: *, isValid: boolean}}
 */
export function useSettings() {
    const base = useBase();
    const globalConfig = useGlobalConfig();
    const settings = getSettings(globalConfig, base);
    return getSettingsValidationResult(settings);
}
