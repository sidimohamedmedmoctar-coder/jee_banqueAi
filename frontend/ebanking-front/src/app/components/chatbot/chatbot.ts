import { Component, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { ChatbotService } from '../../services/chatbot';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

@Component({
  selector: 'app-chatbot',
  standalone: false,
  templateUrl: './chatbot.html',
  styleUrl: './chatbot.css',
})
export class Chatbot implements AfterViewChecked {

  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  messages: Message[] = [
    { sender: 'bot', text: '👋 Bonjour ! Je suis votre assistant bancaire IA. Comment puis-je vous aider ?' }
  ];

  isOpen  = false;
  loading = false;
  inputText = '';

  constructor(private chatbotService: ChatbotService) {}

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  toggleWindow(): void {
    this.isOpen = !this.isOpen;
  }

  sendMessage(): void {
    const text = this.inputText.trim();
    if (!text || this.loading) return;

    // Afficher le message utilisateur
    this.messages.push({ sender: 'user', text });
    this.inputText = '';
    this.loading   = true;

    this.chatbotService.ask(text).subscribe({
      next: (res) => {
        this.messages.push({ sender: 'bot', text: res.answer });
        this.loading = false;
      },
      error: () => {
        this.messages.push({
          sender: 'bot',
          text: '❌ Une erreur est survenue. Vérifiez que le serveur est démarré.'
        });
        this.loading = false;
      }
    });
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  private scrollToBottom(): void {
    try {
      const el = this.messagesContainer?.nativeElement;
      if (el) el.scrollTop = el.scrollHeight;
    } catch { /* ignore */ }
  }
}
