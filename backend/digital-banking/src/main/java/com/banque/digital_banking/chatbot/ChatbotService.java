package com.banque.digital_banking.chatbot;

import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.vectorstore.QuestionAnswerAdvisor;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.stereotype.Service;

/**
 * Service de chatbot RAG (Retrieval-Augmented Generation).
 *
 * Pour chaque question, le QuestionAnswerAdvisor :
 *  1. cherche les 4 documents les plus proches dans le VectorStore,
 *  2. les injecte comme contexte dans le prompt OpenAI,
 *  3. le modèle répond uniquement à partir de ce contexte.
 */
@Service
@Slf4j
public class ChatbotService {

    private final ChatClient chatClient;

    public ChatbotService(ChatClient.Builder chatClientBuilder, VectorStore vectorStore) {
        this.chatClient = chatClientBuilder
            .defaultSystem("""
                Tu es un assistant bancaire intelligent.
                Réponds uniquement à partir des informations fournies dans le contexte.
                Si la réponse n'est pas dans le contexte, dis clairement que tu ne sais pas.
                Réponds en français, de manière concise et professionnelle.
                """)
            .defaultAdvisors(
                QuestionAnswerAdvisor.builder(vectorStore)
                    .searchRequest(SearchRequest.builder().topK(4).build())
                    .build()
            )
            .build();
    }

    /**
     * Pose une question au chatbot RAG.
     *
     * Retourne un message d'erreur convivial si OpenAI est indisponible
     * (clé manquante, quota dépassé, coupure réseau…) plutôt que de
     * propager l'exception aux couches supérieures.
     *
     * @param question la question de l'utilisateur
     * @return la réponse générée par le modèle, ou un message d'erreur
     */
    public String ask(String question) {
        try {
            return chatClient.prompt()
                    .user(question)
                    .call()
                    .content();
        } catch (Exception e) {
            log.error("Erreur lors de l'appel au chatbot IA : {}", e.getMessage());
            return "❌ Le chatbot est temporairement indisponible. "
                 + "Vérifiez que la variable d'environnement OPENAI_API_KEY est correctement définie.";
        }
    }
}
