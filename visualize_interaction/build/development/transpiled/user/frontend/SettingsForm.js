"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

var _ui = require("@airtable/blocks/ui");

var _settings = require("./settings");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function SettingsForm(_ref) {
  var setIsSettingsOpen = _ref.setIsSettingsOpen;
  var globalConfig = (0, _ui.useGlobalConfig)();

  var _useSettings = (0, _settings.useSettings)(),
      isValid = _useSettings.isValid,
      message = _useSettings.message,
      _useSettings$settings = _useSettings.settings,
      umlDiagramServerUrl = _useSettings$settings.umlDiagramServerUrl,
      showDebug = _useSettings$settings.showDebug;

  var canUpdateSettings = globalConfig.hasPermissionToSet();
  return /*#__PURE__*/_react.default.createElement(_ui.Box, {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    display: "flex",
    flexDirection: "column"
  }, /*#__PURE__*/_react.default.createElement(_ui.Box, {
    flex: "auto",
    padding: 4,
    paddingBottom: 2
  }, /*#__PURE__*/_react.default.createElement(_ui.Heading, {
    marginBottom: 3
  }, "Settings"), /*#__PURE__*/_react.default.createElement(_ui.Input, {
    value: umlDiagramServerUrl,
    onChange: function onChange(value) {
      globalConfig.setAsync(_settings.ConfigKeys.UML_DIAGRAM_SERVER_URL, value);
    },
    label: "URL of UML diagram server"
  }), /*#__PURE__*/_react.default.createElement(_ui.Switch, {
    value: showDebug,
    onChange: function onChange(value) {
      globalConfig.setAsync(_settings.ConfigKeys.SHOW_DEBUG, value);
    },
    label: "Show debug",
    width: "320px"
  })), /*#__PURE__*/_react.default.createElement(_ui.Box, {
    display: "flex",
    flex: "none",
    padding: 3,
    borderTop: "thick"
  }, /*#__PURE__*/_react.default.createElement(_ui.Box, {
    flex: "auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingRight: 2
  }, /*#__PURE__*/_react.default.createElement(_ui.Text, {
    textColor: "light"
  }, message)), /*#__PURE__*/_react.default.createElement(_ui.Button, {
    disabled: !isValid,
    size: "large",
    variant: "primary",
    onClick: function onClick() {
      return setIsSettingsOpen(false);
    }
  }, "Done")));
}

SettingsForm.propTypes = {
  setIsSettingsOpen: _propTypes.default.func.isRequired
};
var _default = SettingsForm;
exports.default = _default;