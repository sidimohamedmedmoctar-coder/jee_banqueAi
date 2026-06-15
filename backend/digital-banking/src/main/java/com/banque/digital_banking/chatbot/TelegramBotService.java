package com.banque.digital_banking.chatbot;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;
import org.telegram.telegrambots.bots.TelegramLongPollingBot;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.objects.Update;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;

/**
 * Bot Telegram bancaire basé sur le mécanisme de long polling.
 *
 * Le starter telegrambots-spring-boot-starter détecte automatiquement
 * tous les beans LongPollingBot et les enregistre auprès de l'API Telegram.
 *
 * Ce bean n'est instancié QUE si telegram.bot.enabled=true.
 * Sans cette condition, le backend démarre normalement même si
 * TELEGRAM_BOT_TOKEN / TELEGRAM_BOT_USERNAME ne sont pas définis.
 *
 * Pour activer le bot :
 *   Windows PowerShell :
 *     $env:TELEGRAM_ENABLED="true"
 *     $env:TELEGRAM_BOT_TOKEN="123456:ABC..."
 *     $env:TELEGRAM_BOT_USERNAME="banque_ai_bot"
 *   Linux / macOS :
 *     export TELEGRAM_ENABLED=true
 *     export TELEGRAM_BOT_TOKEN="123456:ABC..."
 *     export TELEGRAM_BOT_USERNAME="banque_ai_bot"
 */
@Component
@ConditionalOnProperty(name = "telegram.bot.enabled", havingValue = "true")
@Slf4j
public class TelegramBotService extends TelegramLongPollingBot {

    /** Injecté depuis application.properties → variable d'env TELEGRAM_BOT_USERNAME */
    @Value("${telegram.bot.username}")
    private String botUsername;

    /** Conservé pour getBotToken() — aussi passé à super() */
    private final String botToken;

    private final ChatbotService chatbotService;

    /**
     * Le token doit être transmis au constructeur de TelegramLongPollingBot
     * (DefaultAbsSender le stocke en interne pour signer les requêtes HTTPS).
     * On l'injecte via @Value directement dans les paramètres du constructeur.
     */
    public TelegramBotService(
            @Value("${telegram.bot.token}") String botToken,
            ChatbotService chatbotService) {
        super(botToken);
        this.botToken      = botToken;
        this.chatbotService = chatbotService;
    }

    // ── Identité du bot ──────────────────────────────────────────────────────

    @Override
    public String getBotUsername() {
        return botUsername;
    }

    @Override
    public String getBotToken() {
        return botToken;
    }

    // ── Traitement des messages entrants ─────────────────────────────────────

    @Override
    public void onUpdateReceived(Update update) {
        if (!update.hasMessage() || !update.getMessage().hasText()) {
            return; // ignorer les mises à jour sans texte (stickers, photos…)
        }

        String text   = update.getMessage().getText().trim();
        String chatId = update.getMessage().getChatId().toString();
        String user   = update.getMessage().getFrom().getFirstName();

        log.info("Message Telegram reçu de {} (chatId={}) : {}", user, chatId, text);

        try {
            String answer;

            if ("/start".equals(text)) {
                answer = String.format(
                    "👋 Bonjour %s ! Je suis votre assistant bancaire Banque AI.\n\n" +
                    "Posez-moi une question sur les clients, leurs comptes ou leurs opérations.\n\n" +
                    "Exemple : \"Quel est le solde du client Mohamed ?\"",
                    user
                );
            } else {
                answer = chatbotService.ask(text);
            }

            execute(SendMessage.builder()
                    .chatId(chatId)
                    .text(answer)
                    .build());

        } catch (TelegramApiException e) {
            log.error("Erreur Telegram API (chatId={}) : {}", chatId, e.getMessage(), e);
        } catch (Exception e) {
            log.error("Erreur inattendue lors du traitement du message : {}", e.getMessage(), e);
            try {
                execute(SendMessage.builder()
                        .chatId(chatId)
                        .text("❌ Une erreur est survenue. Veuillez réessayer.")
                        .build());
            } catch (TelegramApiException ex) {
                log.error("Impossible d'envoyer le message d'erreur : {}", ex.getMessage());
            }
        }
    }
}
