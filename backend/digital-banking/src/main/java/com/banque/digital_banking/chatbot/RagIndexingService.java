package com.banque.digital_banking.chatbot;

import com.banque.digital_banking.entities.AccountOperation;
import com.banque.digital_banking.entities.BankAccount;
import com.banque.digital_banking.entities.CurrentAccount;
import com.banque.digital_banking.entities.SavingAccount;
import com.banque.digital_banking.repositories.AccountOperationRepository;
import com.banque.digital_banking.repositories.BankAccountRepository;
import com.banque.digital_banking.repositories.CustomerRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Indexe les données bancaires dans le VectorStore au démarrage de l'application.
 *
 * Utilise ApplicationReadyEvent (et non @PostConstruct) pour s'assurer que
 * les CommandLineRunner ont déjà inséré les données de test avant l'indexation.
 */
@Service
@Slf4j
@AllArgsConstructor
public class RagIndexingService {

    private final VectorStore vectorStore;
    private final CustomerRepository customerRepository;
    private final BankAccountRepository bankAccountRepository;
    private final AccountOperationRepository accountOperationRepository;

    @EventListener(ApplicationReadyEvent.class)
    @Transactional(readOnly = true)
    public void indexData() {
        log.info("Démarrage de l'indexation RAG des données bancaires...");
        try {
            List<Document> documents = new ArrayList<>();

            // ── Clients ─────────────────────────────────────────────────────────
            customerRepository.findAll().forEach(c -> {
                String text = String.format(
                    "Client %s (id=%d, email=%s).",
                    c.getName(), c.getId(), c.getEmail()
                );
                documents.add(new Document(text, Map.of(
                    "type",       "customer",
                    "customerId", c.getId()
                )));
            });

            // ── Comptes bancaires ────────────────────────────────────────────────
            bankAccountRepository.findAll().forEach(account -> {
                String text;
                Map<String, Object> meta;

                if (account instanceof CurrentAccount ca) {
                    text = String.format(
                        "Compte COURANT id=%s appartenant au client %s (id=%d) : " +
                        "solde=%.2f %s, découvert autorisé=%.2f %s, statut=%s.",
                        ca.getId(),
                        ca.getCustomer().getName(), ca.getCustomer().getId(),
                        ca.getBalance(), ca.getCurrency(),
                        ca.getOverDraft(), ca.getCurrency(),
                        ca.getStatus()
                    );
                    meta = Map.of(
                        "type",       "current-account",
                        "accountId",  ca.getId(),
                        "customerId", ca.getCustomer().getId()
                    );
                } else {
                    SavingAccount sa = (SavingAccount) account;
                    text = String.format(
                        "Compte ÉPARGNE id=%s appartenant au client %s (id=%d) : " +
                        "solde=%.2f %s, taux d'intérêt=%.2f%%, statut=%s.",
                        sa.getId(),
                        sa.getCustomer().getName(), sa.getCustomer().getId(),
                        sa.getBalance(), sa.getCurrency(),
                        sa.getInterestRate(),
                        sa.getStatus()
                    );
                    meta = Map.of(
                        "type",       "saving-account",
                        "accountId",  sa.getId(),
                        "customerId", sa.getCustomer().getId()
                    );
                }
                documents.add(new Document(text, meta));
            });

            // ── Opérations ───────────────────────────────────────────────────────
            SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy HH:mm");
            accountOperationRepository.findAll().forEach(op -> {
                BankAccount account = op.getBankAccount();
                String date = op.getOperationDate() != null
                        ? sdf.format(op.getOperationDate()) : "date inconnue";
                String text = String.format(
                    "Opération %s de %.2f MAD le %s sur le compte %s (client %s) : %s.",
                    op.getType(),
                    op.getAmount(),
                    date,
                    account.getId(),
                    account.getCustomer().getName(),
                    op.getDescription() != null ? op.getDescription() : "sans description"
                );
                documents.add(new Document(text, Map.of(
                    "type",        "operation",
                    "operationId", op.getId(),
                    "accountId",   account.getId(),
                    "customerId",  account.getCustomer().getId()
                )));
            });

            // ── Indexation en lot ────────────────────────────────────────────────
            if (!documents.isEmpty()) {
                vectorStore.add(documents);
                log.info("RAG indexé : {} documents ajoutés au VectorStore "
                         + "({} clients, {} comptes, {} opérations).",
                    documents.size(),
                    customerRepository.count(),
                    bankAccountRepository.count(),
                    accountOperationRepository.count()
                );
            } else {
                log.warn("Aucune donnée à indexer — la base est vide.");
            }

        } catch (Exception e) {
            log.warn("⚠️  Indexation RAG échouée — le chatbot IA sera indisponible. "
                   + "Cause : {}. "
                   + "Vérifiez que la variable d'environnement OPENAI_API_KEY est correctement définie.",
                   e.getMessage());
            log.debug("Détail de l'erreur d'indexation RAG :", e);
        }
    }
}
