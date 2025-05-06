class ChatWidget {
    constructor() {
        this.faqData = [];
        this.isOpen = false;
        
        // Get existing elements
        this.chatIcon = document.querySelector('.chat-icon');
        this.widget = document.querySelector('.chat-widget');
        this.faqContainer = document.querySelector('.faq-container');
        
        // Only initialize if we have the elements (means we're on homepage)
        if (this.chatIcon && this.widget) {
            this.init();
            this.setupEventListeners();
        }
    }

    async init() {
        try {
            const response = await fetch('faq.json');
            this.faqData = await response.json();
            this.displayFAQs();
        } catch (error) {
            console.error('Error initializing chat widget:', error);
        }
    }

    setupEventListeners() {
        // Setup chat icon click
        this.chatIcon.addEventListener('click', () => this.toggleChat());
        // Add touchstart for mobile reliability
        this.chatIcon.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.toggleChat();
        }, {passive: false});
        
        // Event delegation for close button (works for dynamic content)
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('close-chat')) {
                console.log('Close button clicked (delegated)');
                this.isOpen = false;
                this.widget.classList.remove('active');
                this.widget.style.display = '';
            }
        });
        document.addEventListener('touchend', (e) => {
            if (e.target.classList.contains('close-chat')) {
                e.preventDefault();
                console.log('Close button touchend (delegated)');
                this.isOpen = false;
                this.widget.classList.remove('active');
                this.widget.style.display = '';
            }
        }, {passive: false});
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        this.widget.classList.toggle('active', this.isOpen);
        // Optionally, for desktop fallback:
        if (window.innerWidth > 768) {
            this.widget.style.display = this.isOpen ? 'flex' : 'none';
        } else {
            this.widget.style.display = '';
        }
    }

    displayFAQs() {
        // Clear existing content
        this.faqContainer.innerHTML = '';
        
        // Create FAQ items
        this.faqData.forEach((faq, index) => {
            const faqItem = document.createElement('div');
            faqItem.className = 'faq-item';
            
            const question = document.createElement('button');
            question.className = 'faq-question';
            question.textContent = faq.question;
            question.addEventListener('click', () => this.toggleAnswer(index));
            
            const answer = document.createElement('div');
            answer.className = 'faq-answer';
            answer.textContent = faq.answer;
            answer.id = `faq-answer-${index}`;
            
            faqItem.appendChild(question);
            faqItem.appendChild(answer);
            this.faqContainer.appendChild(faqItem);
        });
    }

    toggleAnswer(index) {
        const answer = document.getElementById(`faq-answer-${index}`);
        const question = answer.previousElementSibling;
        
        // Close other answers
        document.querySelectorAll('.faq-answer').forEach((el, i) => {
            if (i !== index) {
                el.classList.remove('visible');
                el.previousElementSibling.classList.remove('active');
            }
        });
        
        // Toggle current answer
        answer.classList.toggle('visible');
        question.classList.toggle('active');
    }
}

// Initialize the chat widget when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ChatWidget();
});

document.addEventListener('DOMContentLoaded', function () {
  var chatWidget = document.querySelector('.chat-widget');
  var closeBtn = document.querySelector('.close-chat');
  var chatIcon = document.querySelector('.chat-icon');

  if (closeBtn && chatWidget) {
    closeBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      chatWidget.style.display = 'none';
      chatWidget.classList.remove('active');
    });
  }

  if (chatIcon && chatWidget) {
    chatIcon.addEventListener('click', function (e) {
      e.stopPropagation();
      chatWidget.style.display = 'flex';
      chatWidget.classList.add('active');
    });
  }
}); 