package com.banque.digital_banking.chatbot;

import lombok.AllArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Point d'entrée REST du chatbot bancaire.
 *
 * POST /api/chatbot/ask
 * Body  : { "question": "Quel est le solde du client Mohamed ?" }
 * Retour: { "answer":   "Le client Mohamed possède..." }
 *
 * Protégé par JWT : l'utilisateur doit être authentifié.
 */
@RestController
@RequestMapping("/api/chatbot")
@AllArgsConstructor
public class ChatbotController {

    private final ChatbotService chatbotService;

    record ChatRequest(String question) {}
    record ChatResponse(String answer)  {}

    @PostMapping("/ask")
    @PreAuthorize("isAuthenticated()")
    public ChatResponse ask(@RequestBody ChatRequest request) {
        String answer = chatbotService.ask(request.question());
        return new ChatResponse(answer);
    }
}
