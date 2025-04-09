/**
 * Code Editor Components
 * 
 * This module handles the creation and management of the code editor panels
 * for HTML, CSS, and JavaScript. It uses CodeMirror for the editor functionality.
 */

import { createCodePanel } from '../xr/scene';
import { basicSetup } from 'codemirror';
import { EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { javascript } from '@codemirror/lang-javascript';

// Editor instances
let htmlEditor, cssEditor, jsEditor;

// Initialize all code editors
export function initializeCodeEditors(appState) {
  return new Promise((resolve) => {
    console.log('Initializing code editors...');
    
    // Create editor containers in DOM
    const editorsContainer = document.createElement('div');
    editorsContainer.id = 'editors-container';
    editorsContainer.className = 'desktop-only';
    document.body.appendChild(editorsContainer);
    
    // Create HTML editor
    const htmlContainer = createEditorContainer('html', 'HTML');
    editorsContainer.appendChild(htmlContainer);
    
    // Create CSS editor
    const cssContainer = createEditorContainer('css', 'CSS');
    editorsContainer.appendChild(cssContainer);
    
    // Create JS editor
    const jsContainer = createEditorContainer('js', 'JavaScript');
    editorsContainer.appendChild(jsContainer);
    
    // Set up CodeMirror instances
    setupCodeMirror(appState);
    
    // Create XR panels for editors
    createXREditorPanels(appState);
    
    resolve();
  });
}

// Create a container for each editor
function createEditorContainer(id, title) {
  const container = document.createElement('div');
  container.className = 'panel editor-panel';
  container.id = `${id}-editor-container`;
  
  const header = document.createElement('div');
  header.className = 'panel-header';
  
  const titleElem = document.createElement('div');
  titleElem.className = 'panel-title';
  titleElem.textContent = title;
  
  const actions = document.createElement('div');
  actions.className = 'panel-actions';
  
  // Add a toggle visibility button
  const toggleBtn = document.createElement('button');
  toggleBtn.textContent = 'Hide';
  toggleBtn.onclick = () => {
    const content = container.querySelector('.panel-content');
    if (content.style.display === 'none') {
      content.style.display = 'block';
      toggleBtn.textContent = 'Hide';
    } else {
      content.style.display = 'none';
      toggleBtn.textContent = 'Show';
    }
  };
  
  actions.appendChild(toggleBtn);
  header.appendChild(titleElem);
  header.appendChild(actions);
  
  const content = document.createElement('div');
  content.className = 'panel-content';
  
  const editorDiv = document.createElement('div');
  editorDiv.id = `${id}-editor`;
  editorDiv.className = 'code-editor';
  content.appendChild(editorDiv);
  
  container.appendChild(header);
  container.appendChild(content);
  
  return container;
}

// Set up CodeMirror for each editor
function setupCodeMirror(appState) {
  // HTML Editor
  htmlEditor = new EditorView({
    state: EditorState.create({
      doc: appState.currentProject.html,
      extensions: [
        basicSetup,
        html(),
        EditorView.updateListener.of(update => {
          if (update.docChanged) {
            appState.currentProject.html = update.state.doc.toString();
            // Update preview
            updatePreview(appState);
          }
        })
      ]
    }),
    parent: document.getElementById('html-editor')
  });
  
  // CSS Editor
  cssEditor = new EditorView({
    state: EditorState.create({
      doc: appState.currentProject.css,
      extensions: [
        basicSetup,
        css(),
        EditorView.updateListener.of(update => {
          if (update.docChanged) {
            appState.currentProject.css = update.state.doc.toString();
            // Update preview
            updatePreview(appState);
          }
        })
      ]
    }),
    parent: document.getElementById('css-editor')
  });
  
  // JavaScript Editor
  jsEditor = new EditorView({
    state: EditorState.create({
      doc: appState.currentProject.js,
      extensions: [
        basicSetup,
        javascript(),
        EditorView.updateListener.of(update => {
          if (update.docChanged) {
            appState.currentProject.js = update.state.doc.toString();
            // Update preview
            updatePreview(appState);
          }
        })
      ]
    }),
    parent: document.getElementById('js-editor')
  });
}

// Create 3D panels for editors in XR
function createXREditorPanels(appState) {
  const scene = document.querySelector('a-scene');
  
  // Create HTML panel
  const htmlPanel = createCodePanel(
    'html',
    '-0.5 1.6 -1',
    '0 0 0',
    appState.currentProject.html
  );
  scene.appendChild(htmlPanel);
  
  // Create CSS panel
  const cssPanel = createCodePanel(
    'css',
    '0.5 1.6 -1',
    '0 0 0',
    appState.currentProject.css
  );
  scene.appendChild(cssPanel);
  
  // Create JS panel
  const jsPanel = createCodePanel(
    'js',
    '0 1.6 -1',
    '0 0 0',
    appState.currentProject.js
  );
  scene.appendChild(jsPanel);
}

// Update the preview when code changes
function updatePreview(appState) {
  // This function will be called when any editor content changes
  // The actual preview update logic is in preview.js
  const event = new CustomEvent('code-changed', {
    detail: {
      html: appState.currentProject.html,
      css: appState.currentProject.css,
      js: appState.currentProject.js
    }
  });
  window.dispatchEvent(event);
}

// Get current code for a specific language
export function getCode(language, appState) {
  return appState.currentProject[language];
}

// Set code for a specific language
export function setCode(language, code, appState) {
  if (appState.currentProject[language] === undefined) {
    console.error(`Invalid language: ${language}`);
    return;
  }
  
  appState.currentProject[language] = code;
  
  // Update the editor
  let editor;
  switch (language) {
    case 'html':
      editor = htmlEditor;
      break;
    case 'css':
      editor = cssEditor;
      break;
    case 'js':
      editor = jsEditor;
      break;
  }
  
  if (editor) {
    const transaction = editor.state.update({
      changes: {
        from: 0,
        to: editor.state.doc.length,
        insert: code
      }
    });
    editor.dispatch(transaction);
  }
  
  // Update preview
  updatePreview(appState);
}
