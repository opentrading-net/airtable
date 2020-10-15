import PropTypes from 'prop-types';
import React from 'react';
import {
    useGlobalConfig,
    Box,
    Button,
    FormField,
    Heading,
    Text,
    Input,
    Switch
} from '@airtable/blocks/ui';

import {useSettings, ConfigKeys} from './settings';

function SettingsForm({setIsSettingsOpen}) {
    const globalConfig = useGlobalConfig();
    const {
        isValid,
        message,
        settings: {umlDiagramServerUrl, showDebug},
    } = useSettings();

    const canUpdateSettings = globalConfig.hasPermissionToSet();

    return (
        <Box
            position="absolute"
            top={0}
            bottom={0}
            left={0}
            right={0}
            display="flex"
            flexDirection="column"
        >
            <Box flex="auto" padding={4} paddingBottom={2}>
                <Heading marginBottom={3}>Settings</Heading>
                <Input
                    value={umlDiagramServerUrl}
                    onChange={
                        value => {
                        globalConfig.setAsync(ConfigKeys.UML_DIAGRAM_SERVER_URL, value);
                    }}
                    label="URL of UML diagram server"
                />
                <Switch
                    value={showDebug}
                    onChange={
                        value => {
                        globalConfig.setAsync(ConfigKeys.SHOW_DEBUG, value);
                    }}
                    label="Show debug"
                    width="320px"
                />
            </Box>
            <Box display="flex" flex="none" padding={3} borderTop="thick">
                <Box
                    flex="auto"
                    display="flex"
                    alignItems="center"
                    justifyContent="flex-end"
                    paddingRight={2}
                >
                    <Text textColor="light">{message}</Text>
                </Box>
                <Button
                    disabled={!isValid}
                    size="large"
                    variant="primary"
                    onClick={() => setIsSettingsOpen(false)}
                >
                    Done
                </Button>
            </Box>
        </Box>
    );
}

SettingsForm.propTypes = {
    setIsSettingsOpen: PropTypes.func.isRequired,
};

export default SettingsForm;
