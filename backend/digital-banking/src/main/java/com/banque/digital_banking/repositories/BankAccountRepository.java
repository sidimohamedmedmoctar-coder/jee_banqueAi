package com.banque.digital_banking.repositories;

import com.banque.digital_banking.entities.BankAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface BankAccountRepository extends JpaRepository<BankAccount, String> {

    List<BankAccount> findByCustomerId(Long customerId);

    @Query("SELECT COALESCE(SUM(b.balance), 0) FROM BankAccount b")
    double sumAllBalances();

    @Query("SELECT COUNT(b) FROM CurrentAccount b")
    long countCurrentAccounts();

    @Query("SELECT COUNT(b) FROM SavingAccount b")
    long countSavingAccounts();
}
