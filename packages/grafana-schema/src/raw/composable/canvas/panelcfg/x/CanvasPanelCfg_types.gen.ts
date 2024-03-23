// Code generated - EDITING IS FUTILE. DO NOT EDIT.
//
// Generated by:
//     public/app/plugins/gen.go
// Using jennies:
//     TSTypesJenny
//     PluginTsTypesJenny
//
// Run 'make gen-cue' from repository root to regenerate.

import * as ui from '@grafana/schema';

export const pluginVersion = "11.0.0-pre";

export enum HorizontalConstraint {
  Center = 'center',
  Left = 'left',
  LeftRight = 'leftright',
  Right = 'right',
  Scale = 'scale',
}

export enum VerticalConstraint {
  Bottom = 'bottom',
  Center = 'center',
  Scale = 'scale',
  Top = 'top',
  TopBottom = 'topbottom',
}

export interface Constraint {
  horizontal?: HorizontalConstraint;
  vertical?: VerticalConstraint;
}

export interface Placement {
  bottom?: number;
  height?: number;
  left?: number;
  right?: number;
  rotation?: number;
  top?: number;
  width?: number;
}

export enum BackgroundImageSize {
  Contain = 'contain',
  Cover = 'cover',
  Fill = 'fill',
  Original = 'original',
  Tile = 'tile',
}

export interface BackgroundConfig {
  color?: ui.ColorDimensionConfig;
  image?: ui.ResourceDimensionConfig;
  size?: BackgroundImageSize;
}

export interface LineConfig {
  color?: ui.ColorDimensionConfig;
  radius?: number;
  width?: number;
}

export enum HttpRequestMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
}

export interface ConnectionCoordinates {
  x: number;
  y: number;
}

export enum ConnectionPath {
  Straight = 'straight',
}

export interface CanvasConnection {
  color?: ui.ColorDimensionConfig;
  path: ConnectionPath;
  size?: ui.ScaleDimensionConfig;
  source: ConnectionCoordinates;
  target: ConnectionCoordinates;
  targetName?: string;
  vertices?: Array<ConnectionCoordinates>;
}

export const defaultCanvasConnection: Partial<CanvasConnection> = {
  vertices: [],
};

export interface CanvasElementOptions {
  background?: BackgroundConfig;
  border?: LineConfig;
  /**
   * TODO: figure out how to define this (element config(s))
   */
  config?: unknown;
  connections?: Array<CanvasConnection>;
  constraint?: Constraint;
  name: string;
  placement?: Placement;
  type: string;
}

export const defaultCanvasElementOptions: Partial<CanvasElementOptions> = {
  connections: [],
};

export interface Options {
  /**
   * Enable infinite pan
   */
  infinitePan: boolean;
  /**
   * Enable inline editing
   */
  inlineEditing: boolean;
  /**
   * Enable pan and zoom
   */
  panZoom: boolean;
  /**
   * The root element of canvas (frame), where all canvas elements are nested
   * TODO: Figure out how to define a default value for this
   */
  root: {
    /**
     * Name of the root element
     */
    name: string;
    /**
     * Type of root element (frame)
     */
    type: 'frame';
    /**
     * The list of canvas elements attached to the root element
     */
    elements: Array<CanvasElementOptions>;
  };
  /**
   * Show all available element types
   */
  showAdvancedTypes: boolean;
}

export const defaultOptions: Partial<Options> = {
  infinitePan: true,
  inlineEditing: true,
  panZoom: true,
  showAdvancedTypes: true,
};
