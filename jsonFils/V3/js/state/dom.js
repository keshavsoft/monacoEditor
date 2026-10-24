/**
 * @file dom.js
 * @description Safe DOM selection utility helpers.
 * Provides concise and null-safe wrappers around document.getElementById
 * and querySelector to eliminate boilerplate throughout UI modules.
 * Used by all rendering and event handling files.
 */

export const $ = (id) => document.getElementById(id);

export const $$ = (selector, parent = document) => Array.from(parent.querySelectorAll(selector));
