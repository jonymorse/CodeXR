/**
 * Live Preview Component
 * 
 * This module handles the live preview of the web application being built.
 * It creates an iframe that renders the HTML, CSS, and JavaScript in real-time.
 */

// Initialize the preview component
export function initializePreview(appState) {
  return new Promise((resolve) => {
    console.log('Initializing preview...');
    
    // Create preview container in DOM for desktop mode
    const previewContainer = document.createElement('div');
    previewContainer.id = 'preview-container';
    previewContainer.className = 'panel desktop-only';
    document.body.appendChild(previewContainer);
    
    // Create panel header
    const header = document.createElement('div');
    header.className = 'panel-header';
    
    const title = document.createElement('div');
    title.className = 'panel-title';
    title.textContent = 'Live Preview';
    
    const actions = document.createElement('div');
    actions.className = 'panel-actions';
    
    // Add a refresh button
    const refreshBtn = document.createElement('button');
    refreshBtn.textContent = 'Refresh';
    refreshBtn.onclick = () => updatePreview(appState);
    
    actions.appendChild(refreshBtn);
    header.appendChild(title);
    header.appendChild(actions);
    
    // Create panel content with iframe
    const content = document.createElement('div');
    content.className = 'panel-content';
    
    const iframe = document.createElement('iframe');
    iframe.id = 'preview-iframe';
    iframe.sandbox = 'allow-scripts allow-same-origin';
    iframe.style.width = '100%';
    iframe.style.height = '400px';
    iframe.style.border = 'none';
    content.appendChild(iframe);
    
    previewContainer.appendChild(header);
    previewContainer.appendChild(content);
    
    // Create XR preview panel
    createXRPreviewPanel(appState);
    
    // Listen for code changes
    window.addEventListener('code-changed', (event) => {
      updatePreview(appState);
    });
    
    // Initial preview update
    updatePreview(appState);
    
    resolve();
  });
}

// Create a 3D panel for preview in XR
function createXRPreviewPanel(appState) {
  const scene = document.querySelector('a-scene');
  
  // Create a entity for the preview panel
  const previewPanel = document.createElement('a-entity');
  previewPanel.setAttribute('id', 'xr-preview-panel');
  previewPanel.setAttribute('position', '0 1.6 -1.5');
  previewPanel.setAttribute('class', 'interactive preview-panel');
  
  // Create panel background
  const background = document.createElement('a-plane');
  background.setAttribute('width', '1.6');
  background.setAttribute('height', '1');
  background.setAttribute('color', '#2d2d2d');
  previewPanel.appendChild(background);
  
  // Create title for the panel
  const title = document.createElement('a-text');
  title.setAttribute('value', 'PREVIEW');
  title.setAttribute('position', '0 0.45 0.01');
  title.setAttribute('align', 'center');
  title.setAttribute('color', '#4a86e8');
  title.setAttribute('scale', '0.1 0.1 0.1');
  previewPanel.appendChild(title);
  
  // For XR, we'll use a texture or custom component to show the preview
  // This is more complex and will be implemented later
  
  scene.appendChild(previewPanel);
}

// Update the preview iframe with current code
export function updatePreview(appState) {
  const iframe = document.getElementById('preview-iframe');
  if (!iframe) return;
  
  // Get content from app state
  const { html, css, js } = appState.currentProject;
  
  // Create a blob with the combined content
  const content = `
    ${html}
    <style>${css}</style>
    <script>${js}</script>
  `;
  
  const blob = new Blob([content], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  
  // Update the iframe src
  iframe.src = url;
  
  // Also update XR preview if it exists
  updateXRPreview(appState);
}

// Update the XR preview panel
function updateXRPreview(appState) {
  // This will be implemented in a more complex way
  // For now, this is just a placeholder
  console.log('XR preview update requested');
  
  // In a real implementation, we might:
  // 1. Update a texture with a screenshot of the preview
  // 2. Use a custom A-Frame component to render HTML
  // 3. Create a 3D representation of the web app
}

// Export a standalone version of the web app
export function exportWebApp(appState) {
  const { html, css, js } = appState.currentProject;
  
  // Create a full HTML document
  const fullHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CodeCrafter XR Project</title>
  <style>
${css}
  </style>
</head>
<body>
${html.replace(/<!DOCTYPE html>|<html>|<\/html>|<head>.*<\/head>|<body>|<\/body>/gi, '')}
  <script>
${js}
  </script>
</body>
</html>
  `;
  
  return fullHTML;
}
