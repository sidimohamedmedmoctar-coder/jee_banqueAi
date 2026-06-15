package com.banque.digital_banking.chatbot;

import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.ai.vectorstore.SimpleVectorStore;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Déclare le VectorStore en mémoire (SimpleVectorStore).
 * Spring AI 1.0.x ne fournit pas d'auto-configuration pour SimpleVectorStore :
 * il faut le déclarer explicitement avec l'EmbeddingModel OpenAI injecté.
 */
@Configuration
public class ChatbotConfig {

    @Bean
    public SimpleVectorStore vectorStore(EmbeddingModel embeddingModel) {
        return SimpleVectorStore.builder(embeddingModel).build();
    }
}
