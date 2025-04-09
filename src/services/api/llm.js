/**
 * LLM API Service
 * 
 * This module handles communication with the LLM API (Claude or GPT)
 * to generate code based on natural language instructions.
 */

import axios from 'axios';

// Call the LLM API with a prompt and context
export async function callLLMAPI(prompt, context) {
  try {
    console.log('Calling LLM API with prompt:', prompt);
    
    // For the MVP, we'll use a mock implementation that returns predefined responses
    // In a real implementation, this would make an API call to Claude or GPT
    
    // In production, use environment variables for the API key
    // const apiKey = process.env.LLM_API_KEY;
    
    // Example of how the actual API call might look:
    /*
    const response = await axios.post('https://api.anthropic.com/v1/messages', {
      model: 'claude-3-opus-20240229',
      max_tokens: 4000,
      messages: [
        {
          role: 'user',
          content: formatPrompt(prompt, context)
        }
      ]
    }, {
      headers: {
        'x-api-key': apiKey,
        'content-type': 'application/json'
      }
    });
    
    return processResponse(response.data);
    */
    
    // For now, use mock responses
    return mockLLMResponse(prompt, context);
  } catch (error) {
    console.error('Error calling LLM API:', error);
    throw new Error('Failed to get response from AI assistant. Please try again.');
  }
}

// Format the prompt with context for the LLM
function formatPrompt(prompt, context) {
  return `
You are an AI assistant helping a user build a web application in CodeCrafter XR.
The user is building an HTML/CSS/JavaScript web app and needs your help with coding.

Here is the current state of their code:

HTML:
\`\`\`html
${context.html}
\`\`\`

CSS:
\`\`\`css
${context.css}
\`\`\`

JavaScript:
\`\`\`javascript
${context.js}
\`\`\`

The user is asking you to: "${prompt}"

Please provide:
1. A helpful explanation of what you're going to do
2. The complete updated code for any files you're modifying

Format your response with clear section headers for HTML, CSS, and JavaScript changes.
If you're not changing a particular file, say "No changes to [file type]."

For example:
HTML Changes:
\`\`\`html
<updated html code>
\`\`\`

CSS Changes:
\`\`\`css
<updated css code>
\`\`\`

JavaScript Changes:
No changes to JavaScript.
`;
}

// Process the response from the LLM
function processResponse(apiResponse) {
  // This would parse the actual API response
  // For now, we're just using the mock response
  
  // The real implementation would extract the message and code updates from the API response
  return {
    message: apiResponse.message,
    codeUpdates: apiResponse.codeUpdates
  };
}

// Mock responses for demo purposes
function mockLLMResponse(prompt, context) {
  // Convert prompt to lowercase for easier matching
  const promptLower = prompt.toLowerCase();
  
  // Define some simple patterns to match against
  if (promptLower.includes('red button') && promptLower.includes('hello')) {
    return {
      message: "I'll add a red button that says 'Hello' to your HTML and style it with CSS.",
      codeUpdates: {
        html: context.html.replace('</body>', '  <button id="hello-button">Hello</button>\n</body>'),
        css: context.css + '\n\n#hello-button {\n  background-color: red;\n  color: white;\n  padding: 10px 20px;\n  border: none;\n  border-radius: 5px;\n  font-size: 16px;\n  cursor: pointer;\n}\n\n#hello-button:hover {\n  background-color: darkred;\n}'
      }
    };
  } else if (promptLower.includes('click') && promptLower.includes('handler')) {
    return {
      message: "I'll add a click event handler to the button that logs a message to the console.",
      codeUpdates: {
        js: context.js.replace('document.addEventListener("DOMContentLoaded", function() {', 'document.addEventListener("DOMContentLoaded", function() {\n  // Add click handler to button\n  const button = document.getElementById("hello-button");\n  if (button) {\n    button.addEventListener("click", function() {\n      console.log("Button clicked!");\n    });\n  }')
      }
    };
  } else if (promptLower.includes('header') || promptLower.includes('heading')) {
    return {
      message: "I'll add a header with a gradient background to your page.",
      codeUpdates: {
        html: context.html.replace('<body>', '<body>\n  <header>\n    <h1>My Awesome Web App</h1>\n  </header>'),
        css: context.css + '\n\nheader {\n  background: linear-gradient(to right, #4a86e8, #6d9eeb);\n  padding: 20px;\n  color: white;\n  text-align: center;\n  box-shadow: 0 2px 5px rgba(0,0,0,0.2);\n}'
      }
    };
  } else {
    // Generic response for unrecognized prompts
    return {
      message: "I'm not sure how to help with that specific request. Could you try asking for something like adding a button, creating a header, or implementing a click handler?",
      codeUpdates: null
    };
  }
}
