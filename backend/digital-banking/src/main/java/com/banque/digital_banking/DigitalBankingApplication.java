package com.banque.digital_banking;

import com.banque.digital_banking.entities.AccountOperation;
import com.banque.digital_banking.entities.CurrentAccount;
import com.banque.digital_banking.entities.Customer;
import com.banque.digital_banking.entities.SavingAccount;
import com.banque.digital_banking.enums.AccountStatus;
import com.banque.digital_banking.enums.OperationType;
import com.banque.digital_banking.repositories.AccountOperationRepository;
import com.banque.digital_banking.repositories.BankAccountRepository;
import com.banque.digital_banking.repositories.CustomerRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.Date;
import java.util.List;
import java.util.Random;
import java.util.UUID;

@SpringBootApplication
public class DigitalBankingApplication {

	public static void main(String[] args) {
		SpringApplication.run(DigitalBankingApplication.class, args);
	}

	@Bean
	CommandLineRunner initData(CustomerRepository customerRepo,
							   BankAccountRepository accountRepo,
							   AccountOperationRepository operationRepo) {
		return args -> {
			Random random = new Random();

			List<String> names = List.of("Mohamed", "Hassan", "Imane");

			for (String name : names) {
				// Créer le client
				Customer customer = customerRepo.save(
						Customer.builder()
								.name(name)
								.email(name.toLowerCase() + "@bank.ma")
								.build()
				);

				// CurrentAccount
				CurrentAccount current = new CurrentAccount();
				current.setId(UUID.randomUUID().toString());
				current.setCreatedAt(new Date());
				current.setBalance(Math.round(random.nextDouble() * 90000 + 10000));
				current.setCurrency("MAD");
				current.setStatus(AccountStatus.ACTIVATED);
				current.setCustomer(customer);
				current.setOverDraft(9000);
				accountRepo.save(current);

				// SavingAccount
				SavingAccount saving = new SavingAccount();
				saving.setId(UUID.randomUUID().toString());
				saving.setCreatedAt(new Date());
				saving.setBalance(Math.round(random.nextDouble() * 90000 + 10000));
				saving.setCurrency("MAD");
				saving.setStatus(AccountStatus.ACTIVATED);
				saving.setCustomer(customer);
				saving.setInterestRate(5.5);
				accountRepo.save(saving);

				// 5 opérations par compte
				for (var account : List.of(current, saving)) {
					for (int i = 0; i < 5; i++) {
						OperationType type = random.nextBoolean() ? OperationType.CREDIT : OperationType.DEBIT;
						double amount = Math.round(random.nextDouble() * 9900 + 100);

						operationRepo.save(
								AccountOperation.builder()
										.operationDate(new Date())
										.amount(amount)
										.type(type)
										.description(type.name() + " de " + amount + " MAD")
										.bankAccount(account)
										.build()
						);
					}
				}
			}

			// Résumé au démarrage
			System.out.println("=== Données initialisées ===");
			customerRepo.findAll().forEach(c ->
					System.out.println("Client: " + c.getName() + " | " + c.getEmail())
			);
			System.out.println("Comptes créés : " + accountRepo.count());
			System.out.println("Opérations créées : " + operationRepo.count());
		};
	}
}

