import React, {Fragment, useState, useCallback, useEffect} from 'react';
import {cursor} from '@airtable/blocks';
import {ViewType} from '@airtable/blocks/models';
import {
    initializeBlock,
    registerRecordActionDataCallback,
    useBase,
    useRecordById,
    useRecords,
    useLoadable,
    useSettingsButton,
    useWatchable,
    Box,
    Dialog,
    Heading,
    Link,
    Text,
    Switch
} from '@airtable/blocks/ui';

import {useSettings} from './settings';
import SettingsForm from './SettingsForm';



// How this app chooses a preview to show:
//
// Without a specified Table & Field:
//
//  - When the user selects a cell in grid view and the field's content is
//    a supported preview URL, the app uses this URL to construct an embed
//    URL and inserts this URL into an iframe.
//
// To Specify a Table & Field:
//
//  - The user may use "Settings" to toggle a specified table and specified
//    field constraint. If the constraint switch is set to "Yes",he user must
//    set a specified table and specified field for URL previews.
//
// With a specified table & specified field:
//
//  - When the user selects a cell in grid view and the active table matches
//    the specified table or when the user opens a record from a button field
//    in the specified table:
//    The app looks in the selected record for the
//    specified field containing a supported URL (e.g. https://www.youtube.com/watch?v=KYz2wyBy3kc),
//    and uses this URL to construct an embed URL and inserts this URL into
//    an iframe.
//
function UrlPreviewApp() {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    useSettingsButton(() => setIsSettingsOpen(!isSettingsOpen));

    const {
        isValid,
        settings: {
            umlDiagramServerUrl,         
            activities,
            applications,
            interfaces,
            actors
        },
    } = useSettings();

    // Caches the currently selected record and field in state. If the user
    // selects a record and a preview appears, and then the user de-selects the
    // record (but does not select another), the preview will remain. This is
    // useful when, for example, the user resizes the apps pane.
    const [selectedRecordId, setSelectedRecordId] = useState(null);
    const [selectedFieldId, setSelectedFieldId] = useState(null);

    const [recordActionErrorMessage, setRecordActionErrorMessage] = useState('');

    // cursor.selectedRecordIds and selectedFieldIds aren't loaded by default,
    // so we need to load them explicitly with the useLoadable hook. The rest of
    // the code in the component will not run until they are loaded.
    useLoadable(cursor);

    // Update the selectedRecordId and selectedFieldId state when the selected
    // record or field change.
    useWatchable(cursor, ['selectedRecordIds', 'selectedFieldIds'], () => {
        // If the update was triggered by a record being de-selected,
        // the current selectedRecordId will be retained.  This is
        // what enables the caching described above.
        if (cursor.selectedRecordIds.length > 0) {
            // There might be multiple selected records. We'll use the first
            // one.
            setSelectedRecordId(cursor.selectedRecordIds[0]);
        }
        if (cursor.selectedFieldIds.length > 0) {
            // There might be multiple selected fields. We'll use the first
            // one.
            setSelectedFieldId(cursor.selectedFieldIds[0]);
        }
    });

    // Close the record action error dialog whenever settings are opened or the selected record
    // is updated. (This means you don't have to close the modal to see the settings, or when
    // you've opened a different record.)
    useEffect(() => {
        setRecordActionErrorMessage('');
    }, [isSettingsOpen, selectedRecordId]);


    // This watch deletes the cached selectedRecordId and selectedFieldId when
    // the user moves to a new table or view. This prevents the following
    // scenario: User selects a record that contains a preview url. The preview appears.
    // User switches to a different table. The preview disappears. The user
    // switches back to the original table. Weirdly, the previously viewed preview
    // reappears, even though no record is selected.
    useWatchable(cursor, ['activeTableId', 'activeViewId'], () => {
        setSelectedRecordId(null);
        setSelectedFieldId(null);
    });

    const base = useBase();
    const activeTable = base.getTableByIdIfExists(cursor.activeTableId);

    useEffect(() => {
        // Display the settings form if the settings aren't valid.
        if (!isValid && !isSettingsOpen) {
            setIsSettingsOpen(true);
        }
    }, [isValid, isSettingsOpen]);

    // activeTable is briefly null when switching to a newly created table.
    if (!activeTable) {
        return null;
    }

    return (
        <Box>
            {isSettingsOpen ? (
                <SettingsForm setIsSettingsOpen={setIsSettingsOpen} />
            ) : (
                <RecordPreviewWithDialog
                    base={base}
                    activeTable={activeTable}
                    selectedRecordId={selectedRecordId}
                    selectedFieldId={selectedFieldId}
                    setIsSettingsOpen={setIsSettingsOpen}
                />
            )}
            {recordActionErrorMessage && (
                <Dialog onClose={() => setRecordActionErrorMessage('')} maxWidth={400}>
                    <Dialog.CloseButton />
                    <Heading size="small">Can&apos;t preview URL</Heading>
                    <Text variant="paragraph" marginBottom={0}>
                        {recordActionErrorMessage}
                    </Text>
                </Dialog>
            )}
        </Box>
    );
}

// Shows a preview, or a dialog that displays information about what
// kind of services (URLs) are supported by this app.
function RecordPreviewWithDialog({
    base,
    activeTable,
    selectedRecordId,
    selectedFieldId,
    setIsSettingsOpen,
}) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Close the dialog when the selected record is changed.
    // The new record might have a preview, so we don't want to hide it behind this dialog.
    useEffect(() => {
        setIsDialogOpen(false);
    }, [selectedRecordId]);
    return (
        <Fragment>
            <Box
                position="absolute"
                top={0}
                left={0}
                right={0}
                bottom={0}
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
            >
                <RecordPreview
                    base={base}
                    activeTable={activeTable}
                    selectedRecordId={selectedRecordId}
                    selectedFieldId={selectedFieldId}
                    setIsDialogOpen={setIsDialogOpen}
                    setIsSettingsOpen={setIsSettingsOpen}
                />
            </Box>

            {isDialogOpen && (
                <Dialog onClose={() => setIsDialogOpen(false)} maxWidth={400}>
                    <Dialog.CloseButton />
                    <Heading size="small">Supported services</Heading>
                    <Text marginTop={2}>Previews are supported for these services:</Text>
                    <Text marginTop={2}>
                        <Link
                            href="https://support.airtable.com/hc/en-us/articles/205752117-Creating-a-base-share-link-or-a-view-share-link"
                            target="_blank"
                        >
                            Airtable share links
                        </Link>
                        , Figma, SoundCloud, Spotify, Vimeo, YouTube, Loom share links, Google Drive
                        share links, Google Docs, Google Sheets, Google Slides
                    </Text>
                    <Link
                        marginTop={2}
                        href="https://airtable.com/shrQSwIety6rqfJZX"
                        target="_blank"
                    >
                        Request a new service
                    </Link>
                </Dialog>
            )}
        </Fragment>
    );
}

// Shows a preview, or a message about what the user should do to see a preview.
function RecordPreview({
    base,
    activeTable,
    selectedRecordId,
    selectedFieldId,
    setIsDialogOpen,
    setIsSettingsOpen,
}) {
    const {
        settings: {
            umlDiagramServerUrl, 
            showDebug,
            activities,
            applications,
            interfaces,
            actors,
            interactions
        },
    } = useSettings();

    const table = base.getTable('Interaction');

    // We use getFieldByIdIfExists because the field might be deleted.
    // Triggers a re-render if the record changes. Preview URL cell value
    // might have changed, or record might have been deleted.
    const selectedRecord = useRecordById(table, selectedRecordId ? selectedRecordId : '');

    // Triggers a re-render if the user switches table or view.
    // RecordPreview may now need to render a preview, or render nothing at all.
    useWatchable(cursor, ['activeTableId', 'activeViewId']);

    if (
        // activeViewId is briefly null when switching views
        selectedRecord === null && 1==2
//        (cursor.activeViewId === null ||
            //table.getViewById(cursor.activeViewId).type !== ViewType.GRID)
    ) {
        return <Text>Switch to a grid view to see previews</Text>;
    } else if (
        // selectedRecord will be null on app initialization, after
        // the user switches table or view, or if it was deleted.
        selectedRecord === null
    ) {
        return (
            <Fragment>
                <Text>Select an interaction cell to view it's UML sequence diagram</Text>
            </Fragment>
        );
    } else {
        // Using getCellValueAsString guarantees we get a string back. If
        // we use getCellValue, we might get back numbers, booleans, or
        // arrays depending on the field type.
        var previewUrl = umlDiagramServerUrl;

        // In this case, the FIELD_NAME field of the currently selected
        // record either contains no URL, or contains a that cannot be
        // resolved to a supported preview.
        if (!previewUrl) {
            return (
                <Fragment>
                    <Text>No preview</Text>
                    {viewSupportedURLsButton}
                </Fragment>
            );
        } else {

            var umlOutput = getSequenceDiagramScript(base, selectedRecord, 
                showDebug,
                activities, 
                applications,
                interfaces,
                actors,
                interactions);

            var umlOutputText = umlOutput.join('\r\n');
            previewUrl = previewUrl + '?title=' + encodeURIComponent(selectedRecord.name) + '&script=' + encodeURIComponent(umlOutputText);
            console.log('previewUrl=' + previewUrl);
            return (
                <iframe
                    // Using `key=previewUrl` will immediately unmount the
                    // old iframe when we're switching to a new
                    // preview. Otherwise, the old iframe would be reused,
                    // and the old preview would stay onscreen while the new
                    // one was loading, which would be a confusing user
                    // experience.
                    key={previewUrl}
                    style={{flex: 'auto', width: '100%'}}
                    src={previewUrl}
                    frameBorder="0"
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            );
        }
    }        
}


// Get main tables
function getSequenceDiagramScript(base, interaction, 
    showDebug,
    allActivities, 
    allApplications,
    allInterfaces,
    allActors,
    allInteractions)
{
    var debug = showDebug;
    var output = [];

    output.push('SequenceDiagram [frame=false framecolor=steelblue label="' + interaction.name  + '"] {');
    outputInteraction(interaction, 1);
    output.push('}');

    return output;

    function outputInteraction(interaction, indent)
    {
        if (debug) output.push('// Interaction : ' +interaction.name + ', display name ' + interaction.getCellValue('Display Name'));

        var activityLinks = interaction.getCellValue('Activities');
        if (activityLinks != null)
        {
            var activities = activityLinks.map(
                actLink => allActivities.find(a => a.id == actLink.id)
            ).sort((a,b) => (a.getCellValue('Sequence') > b.getCellValue('Sequence')) ? 1 : ((b.getCellValue('Sequence') > a.getCellValue('Sequence')) ? -1 : 0));        
        
            // Gather all the interactions from the activities
            var allInteractions = [];
            var active = []; // active lifelines
            
            activities.forEach(act => {
                var activity = getInteractions(act, indent, active);
                allInteractions = allInteractions.concat(activity);
            });


            // Get the set of lifelines, entities and actors from the interactions so we can declare them
            var declarations = [];
            allInteractions.forEach(f => {
                f.interactions.forEach(i => {
                    addEntity(declarations, {id: i.sourceId, name: i.sourceName, type: i.sourceType}, 0, i.debug)
                    addEntity(declarations, {id: i.destinationId, name: i.destinationName, type: i.destinationType}, 0, i.debug)
                });
            });

            // Output the declarations
            declarations.forEach(i=> {
                if (i.type == 'actor')
                {
                    output.push(getOutputPrefix(indent) + i.type + ' "'+ i.name + '" as ' + i.id + getOutputSuffix(i.debug));
                }
                else if (i.type == 'lifeline')
                {
                    output.push(getOutputPrefix(indent) + i.type + ' "' + i.name + '" as ' + i.id + getOutputSuffix(i.debug));
                }
                else if (i.type == 'entity')
                {
                    output.push(getOutputPrefix(indent) + i.type + ' "' + i.name + '" as ' + i.id + getOutputSuffix(i.debug));
                }
            });

            // Output the interactions
            allInteractions.forEach(f => {
                if (f.deactivate)
                {
                    f.deactivate.forEach(d=>{
                        output.push(getOutputPrefix(indent) + 'deactivate ' + d.id + getOutputSuffix(d.name));
                    })
                }
                f.interactions.forEach(i => {
                    output.push(getOutputPrefix(indent) + i.sourceId + ' --> ' + i.destinationId + getOutputSuffix(i.debug));
                    output.push(getOutputPrefix(indent) + 'activate ' + i.destinationId + getOutputSuffix(i.destinationName));
                });
            });
        }
    }

    function getInteractions(act, indent, active)
    {
        var interactions = [];
        if (debug) output.push('// Activity : ' + act.name + ': ' + act.getCellValue('Sequence'));
        var interaction = getInteraction(act, "Sub-Interaction");
        var actors  = getActors(act, 'Actors');
        var int = getInterface(act, 'Interface');
        var sequence = act.getCellValue('Sequence');

        if (interaction != null)
        {
            var previous = active.pop();
            if (previous)
            {
                active.push(previous);
                interactions.push({
                    sourceId: previous.id,
                    sourceName: previous.name,
                    sourceType: '???',
                    destinationId: interaction.id,
                    destinationName: interaction.name,
                    destinationType: 'lifeline',
                    messagePattern: 'refer', 
                    debug: previous.name + ' -see-> ' + interaction.name + '('+ sequence +')',
                });
            }
        }
        else if (actors != null)
        {
            var actorApplication = getApplication(act, 'Actor Application');
            var actorId = actors[0].id;
            var actorNames = actors.map(a => a.name).concat(', ');
            if (actorApplication != null)
            {
                interactions.push({
                    sourceId: actorId,
                    sourceName: actorNames,
                    sourceType: 'actor',
                    destinationId: actorApplication.id,
                    destinationName: actorApplication.name,
                    destinationType: 'lifeline',
                    messagePattern: 'simple', // because we allow interactions directly applications rather than interfaces we don't capture the message pattern
                    debug: actorNames + ' --> ' + actorApplication.name + '('+ sequence +')',
                });
            }
            else if (int != null)
            {
                var interfaceApplication = getApplication(int, 'Host Application');
                interactions.push({
                    sourceId: actorId,
                    sourceName: actorNames,
                    sourceType: 'actor',
                    destinationId: interfaceApplication.id,
                    destinationName: interfaceApplication.name,
                    destinationType: 'lifeline',
                    messagePattern: int.getCellValueAsString('Message Pattern'),
                    debug: actorNames + ' --> ' + interfaceApplication.name + '('+ sequence +')',
                });
            }
            else
            {
                output.push("// ERROR: unsupported actor interaction " + act.name);
            }
        }
        else if (int != null)
        {
            var interfaceApplication = getApplication(int, 'Host Application');
            var sourceInterface = getInterface(int, 'Source Interface');
            var sourceApplication = sourceInterface != null ? getApplication(sourceInterface, 'Host Application') : getApplication(int, 'Source Application');
            var destinationInterface = getInterface(int, 'Destination Interface');
            var destinationApplication = destinationInterface != null ? getApplication(destinationInterface, 'Host Application') : getApplication(int, 'Destination Application');
            
            if (sourceApplication != null)
            {
                if (sourceInterface != null && sourceInterface.getCellValueAsString('Message Pattern') == 'Data Store')
                {
                    interactions.push({
                        sourceId: sourceInterface.id,
                        sourceName: sourceInterface.name,
                        sourceType: 'entity',
                        destinationId: interfaceApplication.id,
                        destinationName: interfaceApplication.name,
                        destinationType: 'lifeline',
                        debug: sourceInterface.name + ' --> ' + interfaceApplication.name + ' ('+ sequence +')',
                    });
                }
                else
                {
                    interactions.push({
                        sourceId: sourceApplication.id,
                        sourceName: sourceApplication.name,
                        sourceType: 'lifeline',
                        destinationId: interfaceApplication.id,
                        destinationName: interfaceApplication.name,
                        destinationType: 'lifeline',
                        debug: sourceApplication.name + ' --> ' + interfaceApplication.name + ' ('+ sequence +')',
                    });
                }

            }
            if (destinationApplication != null)
            {
                if (destinationInterface != null && destinationInterface.getCellValueAsString('Message Pattern') == 'Data Store')
                {
                    interactions.push({
                        sourceId: interfaceApplication.id,
                        sourceName: interfaceApplication.name,
                        sourceType: 'lifeline',
                        destinationId: destinationInterface.id,
                        destinationName: destinationInterface.name,
                        destinationType: 'entity',
                        debug: interfaceApplication.name + ' --> ' + destinationInterface.name + ' ('+ sequence +')',
                    });
                }
                else
                {
                    interactions.push({
                        sourceId: interfaceApplication.id,
                        sourceName: interfaceApplication.name,
                        sourceType: 'lifeline',
                        destinationId: destinationApplication.id,
                        destinationName: destinationApplication.name,
                        destinationType: 'lifeline',
                        debug: interfaceApplication.name + ' --> ' + destinationApplication.name + ' ('+ sequence +')',
                    });
                }

            }
        }
        else
        {
            output.push("// ERROR: unsupported activity " + act.name);
        }

        var deactivate = [];
        do
        {
            var previous = active.pop();
            if (previous)
            {
                if (isSubSequence(previous.sequence, sequence))
                {
                    if (debug) output.push('// previous is part of sequence ' + previous.name);
                    addActivation(active, previous);
                }
                else 
                {
                    if (debug) output.push('// previous is not part of sequence ' + previous.name);
                    addActivation(deactivate, previous);
                }
            }
        } while (previous && !isSubSequence(previous.sequence, sequence));

        interactions.forEach(i => {
                var activation = {
                    id: i.destinationId,
                    name: i.destinationName, 
                    sequence: sequence,
            //     requestResponse: i.me
                };
                addActivation(active, activation)
            });

        if (debug)
        {
            output.push('// Active:');        
            active.forEach(i=>output.push('// ' +i.name));
            output.push('// Deactivate:');        
            deactivate.forEach(i=>output.push('// ' +i.name));
            output.push('//------------------------');
        }

        return {
                interactions: interactions,
                sequence: sequence,
                deactivate: deactivate
            };
    }

    function addEntity(entities, entity, sequence, debugText)
    {
        if (!entities.find(i => i.id == entity.id))
        {
            var result = {
                id: entity.id,
                name: entity.name,                
                type: entity.type,
                sequence: sequence,
                debug: debugText,
            };
            entities.push(result);                
        }
    }

    function addActivation(activations, activation)
    {
        if (!activations.find(i => i.id == activation.id))
        {
            var result = {
                id: activation.id,
                name: activation.name, 
                sequence: activation.sequence,
            };
            activations.push(result);                
        }
    }

    function getOutputPrefix(indent)
    {
        return ' '.repeat(indent*2);
    }

    function getOutputSuffix(debugText)
    {
        return (debugText != '' && debug ? ' // ' + debugText : '');
    }

    function getActors(record, column)
    {
        var links = record.getCellValue(column);
        if (links != null)
        {
            return links.map(l => allActors.find(i => i.id == l.id));
        }
        return null;
    }

    function getInterface(record, column)
    {
        var links = record.getCellValue(column);
        if (links != null)
        {
            return allInterfaces.find(i => i.id == links[0].id);
        }
        return null;
    }

    function getApplication(record, column)
    {
        var links = record.getCellValue(column);
        if (links != null)
        {
            return allApplications.find(i => i.id == links[0].id);
        }
        return null;
    }

    function getInteraction(record, column)
    {
        var links = record.getCellValue(column);
        if (links != null)
        {
            return allInteractions.find(i => i.id == links[0].id);
        }
        return null;
    }

    function decimalCount(number)
    {
        var decimals = 0;
        while (Math.round(number) != number)
        {
            number = number * 10;
            decimals++;
        }
        return decimals;
    }

    function isSubSequence(parent, child)
    {
        var parentOrder = Math.pow(10, -decimalCount(parent));
        var isSubSequence = false;
        var diff = child - parent;
        if (diff > 0 && diff < parentOrder)
        {
            isSubSequence = true;
        }
        return isSubSequence;
    }

}

initializeBlock(() => <UrlPreviewApp />);
