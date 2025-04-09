/**
 * LLM Interface Component
 * 
 * This module handles the interface for interacting with LLMs (Claude or GPT)
 * to help generate or complete code based on natural language instructions.
 */

import { setCode, getCode } from '../codeEditor/editors';
import { updatePreview } from '../preview/preview';
import { callLLMAPI } from '../../services/api/llm';

// Initialize the LLM interface
export function initializeLLMInterface(appState) {
  return new Promise((resolve) => {
    console.log('Initializing LLM interface...');
    
    // Create LLM interface container for desktop
    const llmContainer = document.createElement('div');
    llmContainer.id = 'llm-container';
    llmContainer.className = 'panel desktop-only';
    document.body.appendChild(llmContainer);
    
    // Create panel header
    const header = document.createElement('div');
    header.className = 'panel-header';
    
    const title = document.createElement('div');
    title.className = 'panel-title';
    title.textContent = 'AI Assistant';
    
    header.appendChild(title);
    
    // Create panel content
    const content = document.createElement('div');
    content.className = 'panel-content';
    
    // Add chat history area
    const chatHistory = document.createElement('div');
    chatHistory.id = 'chat-history';
    chatHistory.className = 'chat-history';
    content.appendChild(chatHistory);
    
    // Add input area
    const inputArea = document.createElement('div');
    inputArea.className = 'input-area';
    
    const promptInput = document.createElement('textarea');
    promptInput.id = 'prompt-input';
    promptInput.placeholder = 'Ask the AI to help with your code...';
    promptInput.rows = 3;
    
    const sendButton = document.createElement('button');
    sendButton.textContent = 'Send';
    sendButton.onclick = () => sendPrompt(promptInput.value, appState);
    
    inputArea.appendChild(promptInput);
    inputArea.appendChild(sendButton);
    content.appendChild(inputArea);
    
    llmContainer.appendChild(header);
    llmContainer.appendChild(content);
    
    // Create XR interface for LLM
    createXRLLMInterface(appState);
    
    // Add some instructional content
    addChatMessage('system', `
      I can help you build your web app by generating HTML, CSS, and JavaScript code.
      Try asking me to:
      - "Make a red button that says 'Click me'"
      - "Add a header with a gradient background"
      - "Create a function that shows an alert when a button is clicked"
    `);
    
    resolve();
  });
}

// Create XR interface for LLM
function createXRLLMInterface(appState) {
  const scene = document.querySelector('a-scene');
  
  // Create a entity for the LLM panel
  const llmPanel = document.createElement('a-entity');
  llmPanel.setAttribute('id', 'xr-llm-panel');
  llmPanel.setAttribute('position', '0 1.0 -1');
  llmPanel.setAttribute('class', 'interactive llm-panel');
  
  // Create panel background
  const background = document.createElement('a-plane');
  background.setAttribute('width', '1.2');
  background.setAttribute('height', '0.6');
  background.setAttribute('color', '#2d2d2d');
  llmPanel.appendChild(background);
  
  // Create title for the panel
  const title = document.createElement('a-text');
  title.setAttribute('value', 'AI ASSISTANT');
  title.setAttribute('position', '0 0.25 0.01');
  title.setAttribute('align', 'center');
  title.setAttribute('color', '#4a86e8');
  title.setAttribute('scale', '0.1 0.1 0.1');
  llmPanel.appendChild(title);
  
  // For XR, we'll need to implement a text input system
  // This is more complex and will be implemented later
  
  scene.appendChild(llmPanel);
}

// Send a prompt to the LLM
async function sendPrompt(prompt, appState) {
  if (!prompt.trim()) return;
  
  // Clear the input
  const promptInput = document.getElementById('prompt-input');
  if (promptInput) promptInput.value = '';
  
  // Add user message to chat
  addChatMessage('user', prompt);
  
  // Add thinking indicator
  const thinkingId = addChatMessage('system', 'Thinking...');
  
  try {
    // Get current code state to provide context to the LLM
    const context = {
      html: getCode('html', appState),
      css: getCode('css', appState),
      js: getCode('js', appState)
    };
    
    // Call LLM API
    const response = await callLLMAPI(prompt, context);
    
    // Remove thinking message
    removeChatMessage(thinkingId);
    
    // Add response to chat
    addChatMessage('assistant', response.message);
    
    // If there are code updates, apply them
    if (response.codeUpdates) {
      applyCodeUpdates(response.codeUpdates, appState);
    }
  } catch (error) {
    console.error('Error calling LLM API:', error);
    
    // Remove thinking message
    removeChatMessage(thinkingId);
    
    // Add error message
    addChatMessage('system', `Error: ${error.message}`);
  }
}

// Apply code updates from LLM
function applyCodeUpdates(codeUpdates, appState) {
  // Update HTML if provided
  if (codeUpdates.html) {
    setCode('html', codeUpdates.html, appState);
  }
  
  // Update CSS if provided
  if (codeUpdates.css) {
    setCode('css', codeUpdates.css, appState);
  }
  
  // Update JS if provided
  if (codeUpdates.js) {
    setCode('js', codeUpdates.js, appState);
  }
  
  // Update preview
  updatePreview(appState);
}

// Add a message to the chat history
function addChatMessage(role, content) {
  const chatHistory = document.getElementById('chat-history');
  if (!chatHistory) return;
  
  const messageId = `msg-${Date.now()}`;
  
  const messageDiv = document.createElement('div');
  messageDiv.id = messageId;
  messageDiv.className = `chat-message ${role}-message`;
  
  const messageContent = document.createElement('div');
  messageContent.className = 'message-content';
  messageContent.textContent = content;
  
  messageDiv.appendChild(messageContent);
  chatHistory.appendChild(messageDiv);
  
  // Scroll to bottom
  chatHistory.scrollTop = chatHistory.scrollHeight;
  
  return messageId;
}

// Remove a chat message by ID
function removeChatMessage(messageId) {
  if (!messageId) return;
  
  const message = document.getElementById(messageId);
  if (message) {
    message.remove();
  }
}
