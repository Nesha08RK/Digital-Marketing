// Digital Marketing AI Chatbot
class DigitalMarketingChatbot {
    constructor() {
        this.conversationHistory = [];
        this.isTyping = false;
        this.currentTheme = localStorage.getItem('theme') || 'light';
        
        this.initializeElements();
        this.setupEventListeners();
        this.applyTheme();
    }

    initializeElements() {
        // Core elements
        this.messageInput = document.getElementById('messageInput');
        this.sendBtn = document.getElementById('sendBtn');
        this.voiceBtn = document.getElementById('voiceBtn');
        this.chatMessages = document.getElementById('chatMessages');
        this.typingIndicator = document.getElementById('typingIndicator');
        this.welcomeSection = document.getElementById('welcomeSection');
        
        // Modals
        this.helpModal = document.getElementById('helpModal');
        
        // Buttons
        this.themeToggle = document.getElementById('themeToggle');
        this.helpBtn = document.getElementById('helpBtn');
        this.closeHelpModal = document.getElementById('closeHelpModal');
        
        // Quick action buttons
        this.quickActionBtns = document.querySelectorAll('.quick-action-btn');
    }

    setupEventListeners() {
        // Send message
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        this.messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Auto-resize textarea
        this.messageInput.addEventListener('input', () => this.autoResizeTextarea());

        // Voice input
        this.voiceBtn.addEventListener('click', () => this.startVoiceInput());

        // Theme toggle
        this.themeToggle.addEventListener('click', () => this.toggleTheme());

        // Help modal
        this.helpBtn.addEventListener('click', () => this.showModal(this.helpModal));
        this.closeHelpModal.addEventListener('click', () => this.hideModal(this.helpModal));



        // Quick action buttons
        this.quickActionBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const prompt = btn.getAttribute('data-prompt');
                this.messageInput.value = prompt;
                this.sendMessage();
            });
        });

        // Close modals on backdrop click
        this.helpModal.addEventListener('click', (e) => {
            if (e.target === this.helpModal) {
                this.hideModal(this.helpModal);
            }
        });

        // Close modals on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideModal(this.helpModal);
            }
        });
    }

    async sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message || this.isTyping) return;

        // Add user message to chat
        this.addMessageToChat('user', message);
        this.messageInput.value = '';
        this.autoResizeTextarea();

        // Hide welcome section after first message
        if (this.welcomeSection.style.display !== 'none') {
            this.welcomeSection.style.display = 'none';
        }

        // Show typing indicator
        this.showTypingIndicator();

        try {
            // Add to conversation history
            this.conversationHistory.push({ role: 'user', parts: [{ text: message }] });

            // Call NIM API
            const response = await this.callNIMAPI(message);
            
            // Add AI response to conversation history
            this.conversationHistory.push({ role: 'model', parts: [{ text: response }] });

            // Add AI message to chat
            this.addMessageToChat('assistant', response);

        } catch (error) {
            console.error('Error calling NIM API:', error);
            const errorMessage = 'Sorry, I encountered an error. Please check your internet connection and try again.';
            this.addMessageToChat('assistant', errorMessage);
        } finally {
            this.hideTypingIndicator();
        }
    }

    async callNIMAPI(message) {
        // Call our local server instead of NIM API directly
        const response = await fetch('http://localhost:3000/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`API Error: ${errorData.error?.message || response.statusText}`);
        }

        const data = await response.json();
        return data.reply;
    }

    buildPrompt(message) {
        return `You are a Digital Marketing AI Assistant, an expert in all aspects of digital marketing. You provide practical, actionable advice on:

- SEO (Search Engine Optimization)
- Social Media Marketing
- Google Ads & PPC
- Content Marketing
- Email Marketing
- Analytics & Conversion Tracking
- Marketing Strategy
- Brand Building
- Lead Generation
- Marketing Automation

Please provide:
1. Clear, actionable advice
2. Specific examples when possible
3. Step-by-step guidance when appropriate
4. Latest industry trends and best practices
5. Practical tips that can be implemented immediately

User Question: ${message}

Please respond in a helpful, professional tone with practical digital marketing advice.`;
    }

    addMessageToChat(role, content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${role}`;
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.innerHTML = role === 'user' ? '👤' : '🤖';
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.innerHTML = this.formatMessage(content);
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(messageContent);
        
        this.chatMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    formatMessage(content) {
        // Convert markdown-like formatting to HTML
        return content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code>$1</code>')
            .replace(/\n/g, '<br>');
    }

    showTypingIndicator() {
        this.isTyping = true;
        this.typingIndicator.style.display = 'flex';
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    hideTypingIndicator() {
        this.isTyping = false;
        this.typingIndicator.style.display = 'none';
    }

    startVoiceInput() {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            alert('Speech recognition is not supported in this browser.');
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        
        recognition.onstart = () => {
            this.voiceBtn.style.color = '#ef4444';
            this.voiceBtn.innerHTML = '<i class="fas fa-stop"></i>';
        };
        
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            this.messageInput.value = transcript;
            this.autoResizeTextarea();
        };
        
        recognition.onend = () => {
            this.voiceBtn.style.color = '';
            this.voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
        };
        
        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            this.voiceBtn.style.color = '';
            this.voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
        };
        
        recognition.start();
    }

    autoResizeTextarea() {
        this.messageInput.style.height = 'auto';
        this.messageInput.style.height = Math.min(this.messageInput.scrollHeight, 120) + 'px';
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', this.currentTheme);
        this.applyTheme();
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        
        const icon = this.themeToggle.querySelector('i');
        if (this.currentTheme === 'dark') {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
    }

    showModal(modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    hideModal(modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }



    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Add notification styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 1001;
            animation: slideInRight 0.3s ease;
            max-width: 300px;
        `;
        
        if (type === 'success') {
            notification.style.backgroundColor = '#10b981';
        } else if (type === 'error') {
            notification.style.backgroundColor = '#ef4444';
        } else {
            notification.style.backgroundColor = '#3b82f6';
        }
        
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Utility methods
    clearChat() {
        this.chatMessages.innerHTML = '';
        this.conversationHistory = [];
        this.welcomeSection.style.display = 'block';
    }

    exportChat() {
        const chatData = {
            timestamp: new Date().toISOString(),
            conversation: this.conversationHistory
        };
        
        const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `digital-marketing-chat-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }
}

// Add notification animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// Initialize the chatbot when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new DigitalMarketingChatbot();
});
