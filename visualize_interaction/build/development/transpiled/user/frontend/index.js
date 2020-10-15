"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var _react = _interopRequireWildcard(require("react"));

var _blocks = require("@airtable/blocks");

var _models = require("@airtable/blocks/models");

var _ui = require("@airtable/blocks/ui");

var _settings = require("./settings");

var _SettingsForm = _interopRequireDefault(require("./SettingsForm"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

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
  var _useState = (0, _react.useState)(false),
      _useState2 = _slicedToArray(_useState, 2),
      isSettingsOpen = _useState2[0],
      setIsSettingsOpen = _useState2[1];

  (0, _ui.useSettingsButton)(function () {
    return setIsSettingsOpen(!isSettingsOpen);
  });

  var _useSettings = (0, _settings.useSettings)(),
      isValid = _useSettings.isValid,
      _useSettings$settings = _useSettings.settings,
      umlDiagramServerUrl = _useSettings$settings.umlDiagramServerUrl,
      activities = _useSettings$settings.activities,
      applications = _useSettings$settings.applications,
      interfaces = _useSettings$settings.interfaces,
      actors = _useSettings$settings.actors; // Caches the currently selected record and field in state. If the user
  // selects a record and a preview appears, and then the user de-selects the
  // record (but does not select another), the preview will remain. This is
  // useful when, for example, the user resizes the apps pane.


  var _useState3 = (0, _react.useState)(null),
      _useState4 = _slicedToArray(_useState3, 2),
      selectedRecordId = _useState4[0],
      setSelectedRecordId = _useState4[1];

  var _useState5 = (0, _react.useState)(null),
      _useState6 = _slicedToArray(_useState5, 2),
      selectedFieldId = _useState6[0],
      setSelectedFieldId = _useState6[1];

  var _useState7 = (0, _react.useState)(''),
      _useState8 = _slicedToArray(_useState7, 2),
      recordActionErrorMessage = _useState8[0],
      setRecordActionErrorMessage = _useState8[1]; // cursor.selectedRecordIds and selectedFieldIds aren't loaded by default,
  // so we need to load them explicitly with the useLoadable hook. The rest of
  // the code in the component will not run until they are loaded.


  (0, _ui.useLoadable)(_blocks.cursor); // Update the selectedRecordId and selectedFieldId state when the selected
  // record or field change.

  (0, _ui.useWatchable)(_blocks.cursor, ['selectedRecordIds', 'selectedFieldIds'], function () {
    // If the update was triggered by a record being de-selected,
    // the current selectedRecordId will be retained.  This is
    // what enables the caching described above.
    if (_blocks.cursor.selectedRecordIds.length > 0) {
      // There might be multiple selected records. We'll use the first
      // one.
      setSelectedRecordId(_blocks.cursor.selectedRecordIds[0]);
    }

    if (_blocks.cursor.selectedFieldIds.length > 0) {
      // There might be multiple selected fields. We'll use the first
      // one.
      setSelectedFieldId(_blocks.cursor.selectedFieldIds[0]);
    }
  }); // Close the record action error dialog whenever settings are opened or the selected record
  // is updated. (This means you don't have to close the modal to see the settings, or when
  // you've opened a different record.)

  (0, _react.useEffect)(function () {
    setRecordActionErrorMessage('');
  }, [isSettingsOpen, selectedRecordId]); // This watch deletes the cached selectedRecordId and selectedFieldId when
  // the user moves to a new table or view. This prevents the following
  // scenario: User selects a record that contains a preview url. The preview appears.
  // User switches to a different table. The preview disappears. The user
  // switches back to the original table. Weirdly, the previously viewed preview
  // reappears, even though no record is selected.

  (0, _ui.useWatchable)(_blocks.cursor, ['activeTableId', 'activeViewId'], function () {
    setSelectedRecordId(null);
    setSelectedFieldId(null);
  });
  var base = (0, _ui.useBase)();
  var activeTable = base.getTableByIdIfExists(_blocks.cursor.activeTableId);
  (0, _react.useEffect)(function () {
    // Display the settings form if the settings aren't valid.
    if (!isValid && !isSettingsOpen) {
      setIsSettingsOpen(true);
    }
  }, [isValid, isSettingsOpen]); // activeTable is briefly null when switching to a newly created table.

  if (!activeTable) {
    return null;
  }

  return /*#__PURE__*/_react.default.createElement(_ui.Box, null, isSettingsOpen ? /*#__PURE__*/_react.default.createElement(_SettingsForm.default, {
    setIsSettingsOpen: setIsSettingsOpen
  }) : /*#__PURE__*/_react.default.createElement(RecordPreviewWithDialog, {
    base: base,
    activeTable: activeTable,
    selectedRecordId: selectedRecordId,
    selectedFieldId: selectedFieldId,
    setIsSettingsOpen: setIsSettingsOpen
  }), recordActionErrorMessage && /*#__PURE__*/_react.default.createElement(_ui.Dialog, {
    onClose: function onClose() {
      return setRecordActionErrorMessage('');
    },
    maxWidth: 400
  }, /*#__PURE__*/_react.default.createElement(_ui.Dialog.CloseButton, null), /*#__PURE__*/_react.default.createElement(_ui.Heading, {
    size: "small"
  }, "Can't preview URL"), /*#__PURE__*/_react.default.createElement(_ui.Text, {
    variant: "paragraph",
    marginBottom: 0
  }, recordActionErrorMessage)));
} // Shows a preview, or a dialog that displays information about what
// kind of services (URLs) are supported by this app.


function RecordPreviewWithDialog(_ref) {
  var base = _ref.base,
      activeTable = _ref.activeTable,
      selectedRecordId = _ref.selectedRecordId,
      selectedFieldId = _ref.selectedFieldId,
      setIsSettingsOpen = _ref.setIsSettingsOpen;

  var _useState9 = (0, _react.useState)(false),
      _useState10 = _slicedToArray(_useState9, 2),
      isDialogOpen = _useState10[0],
      setIsDialogOpen = _useState10[1]; // Close the dialog when the selected record is changed.
  // The new record might have a preview, so we don't want to hide it behind this dialog.


  (0, _react.useEffect)(function () {
    setIsDialogOpen(false);
  }, [selectedRecordId]);
  return /*#__PURE__*/_react.default.createElement(_react.Fragment, null, /*#__PURE__*/_react.default.createElement(_ui.Box, {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  }, /*#__PURE__*/_react.default.createElement(RecordPreview, {
    base: base,
    activeTable: activeTable,
    selectedRecordId: selectedRecordId,
    selectedFieldId: selectedFieldId,
    setIsDialogOpen: setIsDialogOpen,
    setIsSettingsOpen: setIsSettingsOpen
  })), isDialogOpen && /*#__PURE__*/_react.default.createElement(_ui.Dialog, {
    onClose: function onClose() {
      return setIsDialogOpen(false);
    },
    maxWidth: 400
  }, /*#__PURE__*/_react.default.createElement(_ui.Dialog.CloseButton, null), /*#__PURE__*/_react.default.createElement(_ui.Heading, {
    size: "small"
  }, "Supported services"), /*#__PURE__*/_react.default.createElement(_ui.Text, {
    marginTop: 2
  }, "Previews are supported for these services:"), /*#__PURE__*/_react.default.createElement(_ui.Text, {
    marginTop: 2
  }, /*#__PURE__*/_react.default.createElement(_ui.Link, {
    href: "https://support.airtable.com/hc/en-us/articles/205752117-Creating-a-base-share-link-or-a-view-share-link",
    target: "_blank"
  }, "Airtable share links"), ", Figma, SoundCloud, Spotify, Vimeo, YouTube, Loom share links, Google Drive share links, Google Docs, Google Sheets, Google Slides"), /*#__PURE__*/_react.default.createElement(_ui.Link, {
    marginTop: 2,
    href: "https://airtable.com/shrQSwIety6rqfJZX",
    target: "_blank"
  }, "Request a new service")));
} // Shows a preview, or a message about what the user should do to see a preview.


function RecordPreview(_ref2) {
  var base = _ref2.base,
      activeTable = _ref2.activeTable,
      selectedRecordId = _ref2.selectedRecordId,
      selectedFieldId = _ref2.selectedFieldId,
      setIsDialogOpen = _ref2.setIsDialogOpen,
      setIsSettingsOpen = _ref2.setIsSettingsOpen;

  var _useSettings2 = (0, _settings.useSettings)(),
      _useSettings2$setting = _useSettings2.settings,
      umlDiagramServerUrl = _useSettings2$setting.umlDiagramServerUrl,
      showDebug = _useSettings2$setting.showDebug,
      activities = _useSettings2$setting.activities,
      applications = _useSettings2$setting.applications,
      interfaces = _useSettings2$setting.interfaces,
      actors = _useSettings2$setting.actors,
      interactions = _useSettings2$setting.interactions;

  var table = base.getTable('Interaction'); // We use getFieldByIdIfExists because the field might be deleted.
  // Triggers a re-render if the record changes. Preview URL cell value
  // might have changed, or record might have been deleted.

  var selectedRecord = (0, _ui.useRecordById)(table, selectedRecordId ? selectedRecordId : ''); // Triggers a re-render if the user switches table or view.
  // RecordPreview may now need to render a preview, or render nothing at all.

  (0, _ui.useWatchable)(_blocks.cursor, ['activeTableId', 'activeViewId']);

  if ( // activeViewId is briefly null when switching views
  selectedRecord === null && 1 == 2 //        (cursor.activeViewId === null ||
  //table.getViewById(cursor.activeViewId).type !== ViewType.GRID)
  ) {
      return /*#__PURE__*/_react.default.createElement(_ui.Text, null, "Switch to a grid view to see previews");
    } else if ( // selectedRecord will be null on app initialization, after
  // the user switches table or view, or if it was deleted.
  selectedRecord === null) {
    return /*#__PURE__*/_react.default.createElement(_react.Fragment, null, /*#__PURE__*/_react.default.createElement(_ui.Text, null, "Select an interaction cell to view it's UML sequence diagram"));
  } else {
    // Using getCellValueAsString guarantees we get a string back. If
    // we use getCellValue, we might get back numbers, booleans, or
    // arrays depending on the field type.
    var previewUrl = umlDiagramServerUrl; // In this case, the FIELD_NAME field of the currently selected
    // record either contains no URL, or contains a that cannot be
    // resolved to a supported preview.

    if (!previewUrl) {
      return /*#__PURE__*/_react.default.createElement(_react.Fragment, null, /*#__PURE__*/_react.default.createElement(_ui.Text, null, "No preview"), viewSupportedURLsButton);
    } else {
      var umlOutput = getSequenceDiagramScript(base, selectedRecord, showDebug, activities, applications, interfaces, actors, interactions);
      var umlOutputText = umlOutput.join('\r\n');
      previewUrl = previewUrl + '?script=' + encodeURIComponent(umlOutputText);
      console.log('previewUrl=' + previewUrl);
      return /*#__PURE__*/_react.default.createElement("iframe", {
        // Using `key=previewUrl` will immediately unmount the
        // old iframe when we're switching to a new
        // preview. Otherwise, the old iframe would be reused,
        // and the old preview would stay onscreen while the new
        // one was loading, which would be a confusing user
        // experience.
        key: previewUrl,
        style: {
          flex: 'auto',
          width: '100%'
        },
        src: previewUrl,
        frameBorder: "0",
        allow: "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture",
        allowFullScreen: true
      });
    }
  }
} // Get main tables


function getSequenceDiagramScript(base, interaction, showDebug, allActivities, allApplications, allInterfaces, allActors, allInteractions) {
  var debug = showDebug;
  var output = [];
  output.push('SequenceDiagram [frame=false framecolor=steelblue label="' + interaction.name + '"] {');
  outputInteraction(interaction, 1);
  output.push('}');
  return output;

  function outputInteraction(interaction, indent) {
    if (debug) output.push('// Interaction : ' + interaction.name + ', display name ' + interaction.getCellValue('Display Name'));
    var activityLinks = interaction.getCellValue('Activities');

    if (activityLinks != null) {
      var activities = activityLinks.map(function (actLink) {
        return allActivities.find(function (a) {
          return a.id == actLink.id;
        });
      }).sort(function (a, b) {
        return a.getCellValue('Sequence') > b.getCellValue('Sequence') ? 1 : b.getCellValue('Sequence') > a.getCellValue('Sequence') ? -1 : 0;
      }); // Gather all the interactions from the activities

      var allInteractions = [];
      var active = []; // active lifelines

      activities.forEach(function (act) {
        var activity = getInteractions(act, indent, active);
        allInteractions = allInteractions.concat(activity);
      }); // Get the set of lifelines, entities and actors from the interactions so we can declare them

      var declarations = [];
      allInteractions.forEach(function (f) {
        f.interactions.forEach(function (i) {
          addEntity(declarations, {
            id: i.sourceId,
            name: i.sourceName,
            type: i.sourceType
          }, 0, i.debug);
          addEntity(declarations, {
            id: i.destinationId,
            name: i.destinationName,
            type: i.destinationType
          }, 0, i.debug);
        });
      }); // Output the declarations

      declarations.forEach(function (i) {
        if (i.type == 'actor') {
          output.push(getOutputPrefix(indent) + i.type + ' "' + i.name + '" as ' + i.id + getOutputSuffix(i.debug));
        } else if (i.type == 'lifeline') {
          output.push(getOutputPrefix(indent) + i.type + ' "' + i.name + '" as ' + i.id + getOutputSuffix(i.debug));
        } else if (i.type == 'entity') {
          output.push(getOutputPrefix(indent) + i.type + ' "' + i.name + '" as ' + i.id + getOutputSuffix(i.debug));
        }
      }); // Output the interactions

      allInteractions.forEach(function (f) {
        if (f.deactivate) {
          f.deactivate.forEach(function (d) {
            output.push(getOutputPrefix(indent) + 'deactivate ' + d.id + getOutputSuffix(d.name));
          });
        }

        f.interactions.forEach(function (i) {
          output.push(getOutputPrefix(indent) + i.sourceId + ' --> ' + i.destinationId + getOutputSuffix(i.debug));
          output.push(getOutputPrefix(indent) + 'activate ' + i.destinationId + getOutputSuffix(i.destinationName));
        });
      });
    }
  }

  function getInteractions(act, indent, active) {
    var interactions = [];
    if (debug) output.push('// Activity : ' + act.name + ': ' + act.getCellValue('Sequence'));
    var interaction = getInteraction(act, "Sub-Interaction");
    var actors = getActors(act, 'Actors');
    var int = getInterface(act, 'Interface');
    var sequence = act.getCellValue('Sequence');

    if (interaction != null) {
      var previous = active.pop();

      if (previous) {
        active.push(previous);
        interactions.push({
          sourceId: previous.id,
          sourceName: previous.name,
          sourceType: '???',
          destinationId: interaction.id,
          destinationName: interaction.name,
          destinationType: 'lifeline',
          messagePattern: 'refer',
          debug: previous.name + ' -see-> ' + interaction.name + '(' + sequence + ')'
        });
      }
    } else if (actors != null) {
      var actorApplication = getApplication(act, 'Actor Application');
      var actorId = actors[0].id;
      var actorNames = actors.map(function (a) {
        return a.name;
      }).concat(', ');

      if (actorApplication != null) {
        interactions.push({
          sourceId: actorId,
          sourceName: actorNames,
          sourceType: 'actor',
          destinationId: actorApplication.id,
          destinationName: actorApplication.name,
          destinationType: 'lifeline',
          messagePattern: 'simple',
          // because we allow interactions directly applications rather than interfaces we don't capture the message pattern
          debug: actorNames + ' --> ' + actorApplication.name + '(' + sequence + ')'
        });
      } else if (int != null) {
        var interfaceApplication = getApplication(int, 'Host Application');
        interactions.push({
          sourceId: actorId,
          sourceName: actorNames,
          sourceType: 'actor',
          destinationId: interfaceApplication.id,
          destinationName: interfaceApplication.name,
          destinationType: 'lifeline',
          messagePattern: int.getCellValueAsString('Message Pattern'),
          debug: actorNames + ' --> ' + interfaceApplication.name + '(' + sequence + ')'
        });
      } else {
        output.push("// ERROR: unsupported actor interaction " + act.name);
      }
    } else if (int != null) {
      var interfaceApplication = getApplication(int, 'Host Application');
      var sourceInterface = getInterface(int, 'Source Interface');
      var sourceApplication = sourceInterface != null ? getApplication(sourceInterface, 'Host Application') : getApplication(int, 'Source Application');
      var destinationInterface = getInterface(int, 'Destination Interface');
      var destinationApplication = destinationInterface != null ? getApplication(destinationInterface, 'Host Application') : getApplication(int, 'Destination Application');

      if (sourceApplication != null) {
        if (sourceInterface != null && sourceInterface.getCellValueAsString('Message Pattern') == 'Data Store') {
          interactions.push({
            sourceId: sourceInterface.id,
            sourceName: sourceInterface.name,
            sourceType: 'entity',
            destinationId: interfaceApplication.id,
            destinationName: interfaceApplication.name,
            destinationType: 'lifeline',
            debug: sourceInterface.name + ' --> ' + interfaceApplication.name + ' (' + sequence + ')'
          });
        } else {
          interactions.push({
            sourceId: sourceApplication.id,
            sourceName: sourceApplication.name,
            sourceType: 'lifeline',
            destinationId: interfaceApplication.id,
            destinationName: interfaceApplication.name,
            destinationType: 'lifeline',
            debug: sourceApplication.name + ' --> ' + interfaceApplication.name + ' (' + sequence + ')'
          });
        }
      }

      if (destinationApplication != null) {
        if (destinationInterface != null && destinationInterface.getCellValueAsString('Message Pattern') == 'Data Store') {
          interactions.push({
            sourceId: interfaceApplication.id,
            sourceName: interfaceApplication.name,
            sourceType: 'lifeline',
            destinationId: destinationInterface.id,
            destinationName: destinationInterface.name,
            destinationType: 'entity',
            debug: interfaceApplication.name + ' --> ' + destinationInterface.name + ' (' + sequence + ')'
          });
        } else {
          interactions.push({
            sourceId: interfaceApplication.id,
            sourceName: interfaceApplication.name,
            sourceType: 'lifeline',
            destinationId: destinationApplication.id,
            destinationName: destinationApplication.name,
            destinationType: 'lifeline',
            debug: interfaceApplication.name + ' --> ' + destinationApplication.name + ' (' + sequence + ')'
          });
        }
      }
    } else {
      output.push("// ERROR: unsupported activity " + act.name);
    }

    var deactivate = [];

    do {
      var previous = active.pop();

      if (previous) {
        if (isSubSequence(previous.sequence, sequence)) {
          if (debug) output.push('// previous is part of sequence ' + previous.name);
          addActivation(active, previous);
        } else {
          if (debug) output.push('// previous is not part of sequence ' + previous.name);
          addActivation(deactivate, previous);
        }
      }
    } while (previous && !isSubSequence(previous.sequence, sequence));

    interactions.forEach(function (i) {
      var activation = {
        id: i.destinationId,
        name: i.destinationName,
        sequence: sequence //     requestResponse: i.me

      };
      addActivation(active, activation);
    });

    if (debug) {
      output.push('// Active:');
      active.forEach(function (i) {
        return output.push('// ' + i.name);
      });
      output.push('// Deactivate:');
      deactivate.forEach(function (i) {
        return output.push('// ' + i.name);
      });
      output.push('//------------------------');
    }

    return {
      interactions: interactions,
      sequence: sequence,
      deactivate: deactivate
    };
  }

  function addEntity(entities, entity, sequence, debugText) {
    if (!entities.find(function (i) {
      return i.id == entity.id;
    })) {
      var result = {
        id: entity.id,
        name: entity.name,
        type: entity.type,
        sequence: sequence,
        debug: debugText
      };
      entities.push(result);
    }
  }

  function addActivation(activations, activation) {
    if (!activations.find(function (i) {
      return i.id == activation.id;
    })) {
      var result = {
        id: activation.id,
        name: activation.name,
        sequence: activation.sequence
      };
      activations.push(result);
    }
  }

  function getOutputPrefix(indent) {
    return ' '.repeat(indent * 2);
  }

  function getOutputSuffix(debugText) {
    return debugText != '' && debug ? ' // ' + debugText : '';
  }

  function getActors(record, column) {
    var links = record.getCellValue(column);

    if (links != null) {
      return links.map(function (l) {
        return allActors.find(function (i) {
          return i.id == l.id;
        });
      });
    }

    return null;
  }

  function getInterface(record, column) {
    var links = record.getCellValue(column);

    if (links != null) {
      return allInterfaces.find(function (i) {
        return i.id == links[0].id;
      });
    }

    return null;
  }

  function getApplication(record, column) {
    var links = record.getCellValue(column);

    if (links != null) {
      return allApplications.find(function (i) {
        return i.id == links[0].id;
      });
    }

    return null;
  }

  function getInteraction(record, column) {
    var links = record.getCellValue(column);

    if (links != null) {
      return allInteractions.find(function (i) {
        return i.id == links[0].id;
      });
    }

    return null;
  }

  function decimalCount(number) {
    var decimals = 0;

    while (Math.round(number) != number) {
      number = number * 10;
      decimals++;
    }

    return decimals;
  }

  function isSubSequence(parent, child) {
    var parentOrder = Math.pow(10, -decimalCount(parent));
    var isSubSequence = false;
    var diff = child - parent;

    if (diff > 0 && diff < parentOrder) {
      isSubSequence = true;
    }

    return isSubSequence;
  }
}

(0, _ui.initializeBlock)(function () {
  return /*#__PURE__*/_react.default.createElement(UrlPreviewApp, null);
});