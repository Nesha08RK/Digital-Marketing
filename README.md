# 🚀 Digital Marketing AI Chatbot

A modern, intelligent chatbot specifically designed for digital marketing professionals. Built with HTML, CSS, JavaScript, and powered by Google's Gemini AI API.

## ✨ Features

- **🤖 AI-Powered Responses**: Expert advice on all digital marketing topics
- **🎨 Modern UI/UX**: Clean, responsive design with dark/light theme support
- **📱 Mobile-Friendly**: Fully responsive design for all devices
- **🎤 Voice Input**: Speech-to-text functionality for hands-free interaction
- **💬 Quick Actions**: Pre-built prompts for common marketing questions
- **🔒 Privacy-First**: No data stored on servers, conversations stay local
- **⚡ Real-time Chat**: Instant responses with typing indicators

## 🎯 Digital Marketing Expertise

The chatbot specializes in:

- **SEO (Search Engine Optimization)**
- **Social Media Marketing**
- **Google Ads & PPC**
- **Content Marketing**
- **Email Marketing**
- **Analytics & Conversion Tracking**
- **Marketing Strategy**
- **Brand Building**
- **Lead Generation**
- **Marketing Automation**

## 🚀 Quick Start

### 1. Prerequisites

- Node.js (version 16 or higher)
- Google Gemini API key

### 2. Get Your Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

### 3. Setup

1. **Clone or download the project files**
2. **Navigate to the project directory:**
   ```bash
   cd digital-marketing-ai
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Create environment file:**
   ```bash
   # Create a .env file in the project root
   echo "GEMINI_API_KEY=your_actual_api_key_here" > .env
   echo "PORT=3000" >> .env
   ```

5. **Start the server:**
   ```bash
   npm start
   ```

6. **Open your browser:**
   Navigate to `http://localhost:3000`

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
# Google Gemini API Key (Required)
GEMINI_API_KEY=your_gemini_api_key_here

# Server Configuration
PORT=3000

# Optional: Enable debug logging
DEBUG=false
```

### API Key Setup

You can set your API key in two ways:

1. **Environment Variable** (Recommended):
   - Add `GEMINI_API_KEY=your_key` to your `.env` file
   - Restart the server

2. **In-Browser**:
   - The chatbot will prompt you to enter your API key
   - Enter it in the setup modal
   - The key is stored locally in your browser

## 📁 Project Structure

```
digital-marketing-ai/
├── gemini-chatbot.html      # Main chatbot interface
├── gemini-styles.css        # Styling and themes
├── gemini-chatbot.js        # Chatbot functionality
├── server.js                # Express server with Gemini API
├── package.json             # Dependencies and scripts
├── .env                     # Environment variables (create this)
└── README.md               # This file
```

## 🎨 Customization

### Themes

The chatbot supports both light and dark themes:
- Click the moon/sun icon in the header to toggle
- Theme preference is saved in local storage

### Styling

Modify `gemini-styles.css` to customize:
- Colors and themes
- Layout and spacing
- Typography and animations
- Responsive breakpoints

### Functionality

Extend `gemini-chatbot.js` to add:
- New chat features
- Additional API integrations
- Custom response handling
- Enhanced UI interactions

## 🔌 API Integration

### Gemini API Endpoint

The chatbot communicates with Google's Gemini API:

```javascript
POST https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent
```

### Request Format

```json
{
  "contents": [{
    "role": "user",
    "parts": [{ "text": "Your marketing question here" }]
  }],
  "generationConfig": {
    "temperature": 0.7,
    "maxOutputTokens": 1024
  }
}
```

### Response Format

```json
{
  "candidates": [{
    "content": {
      "parts": [{ "text": "AI response here" }]
    }
  }]
}
```

## 🚀 Deployment

### Local Development

```bash
npm start
# Server runs on http://localhost:3000
```

### Production Deployment

1. **Set environment variables** on your hosting platform
2. **Install dependencies**: `npm install --production`
3. **Start the server**: `npm start`
4. **Configure reverse proxy** (nginx, Apache) if needed

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 🛠️ Troubleshooting

### Common Issues

1. **"Missing Gemini API key" error:**
   - Ensure your `.env` file contains `GEMINI_API_KEY=your_key`
   - Restart the server after adding the key

2. **API rate limiting:**
   - Check your Gemini API quota
   - Implement rate limiting if needed

3. **CORS errors:**
   - The server includes CORS middleware
   - Ensure your domain is allowed

4. **Voice input not working:**
   - Check browser compatibility
   - Ensure microphone permissions are granted

### Debug Mode

Enable debug logging by setting `DEBUG=true` in your `.env` file.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

- **Documentation**: Check this README first
- **Issues**: Open a GitHub issue for bugs
- **Questions**: Use GitHub discussions for help

## 🔮 Future Enhancements

- [ ] Multi-language support
- [ ] Chat history export
- [ ] Integration with marketing tools
- [ ] Advanced analytics dashboard
- [ ] Custom training data support
- [ ] Team collaboration features

---
