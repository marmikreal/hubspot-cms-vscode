import * as vscode from 'vscode';
import { Portal } from './types';
import { COMMANDS } from './constants';

const { findConfig, loadConfig, validateConfig } = require('@hubspot/cli-lib');
const { setConfig, setConfigPath } = require('@hubspot/cli-lib/lib/config');

const onLoadPath = (configPath: string) => {
  vscode.commands.executeCommand(
    'setContext',
    'hubspot.configPath',
    configPath
  );
  if (!configPath) {
    vscode.commands.executeCommand(COMMANDS.CONFIG_SET_DEFAULT_ACCOUNT, null);
    setConfig(null);
    setConfigPath(null);
  }
};

export const loadHubspotConfigFile = (rootPath: string) => {
  if (!rootPath) {
    return;
  }

  console.log(`Root path: ${rootPath}`);

  const path = findConfig(rootPath);
  onLoadPath(path);

  console.log(`Path: ${path}`);

  if (!path) {
    return;
  }

  const config = loadConfig(path);

  if (!validateConfig()) {
    throw new Error(`Invalid config could not be loaded: ${path}`);
  } else {
    console.log(
      'loadedHubspotConfig',
      config.defaultPortal,
      JSON.stringify(config.portals.map((p: Portal) => p.name))
    );
    vscode.commands.executeCommand(COMMANDS.ON_CONFIG_UPDATED);
    return path;
  }
};

export const initializeConfig = (rootPath: string) => {
  const configPath = loadHubspotConfigFile(rootPath);

  if (configPath) {
    console.log(`HubSpot config loaded from: ${configPath}`);
    vscode.commands.executeCommand(
      COMMANDS.ON_CONFIG_FOUND,
      rootPath,
      configPath
    );
  } else {
    console.log(`No config found. Config path: ${configPath}`);
  }
};
