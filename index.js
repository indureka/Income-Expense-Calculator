// DOM Elements
document.addEventListener("DOMContentLoaded", () => {
    const transactionForm = document.getElementById('transaction-form');
    const transactionList = document.getElementById('transaction-list');
    const totalBalance = document.getElementById('total-balance');
    const totalIncome = document.getElementById('total-income');
    const totalExpense = document.getElementById('total-expense');
    const resetBtn = document.getElementById('resetBtn');
    const filterOptions = document.querySelectorAll('input[name="filter"]');
  
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    let filter = 'all';
  
    // Add Transaction
    transactionForm.addEventListener('submit', function(e) {
      e.preventDefault();
  
      const description = document.getElementById('description').value.trim();
      const amount = parseFloat(document.getElementById('amount').value);
      const type = document.getElementById('type').value;
  
      // Validation checks
      if (description === "") {
        alert("Description cannot be empty.");
        return;
      }
  
      if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid amount greater than zero.");
        return;
      }
  
      const transaction = {
        id: Date.now(),
        description,
        amount,
        type
      };

      // Update the localStorage
  
      transactions.push(transaction);
      localStorage.setItem('transactions', JSON.stringify(transactions));
  
      renderTransactions();
      transactionForm.reset();
    });
     
  
    // Render Transactions
    function renderTransactions() {
      transactionList.innerHTML = '';
  
      const filteredTransactions = transactions.filter(transaction => {
        if (filter === 'all') return true;
        return transaction.type === filter;
      });
  
      if (filteredTransactions.length === 0) {
        transactionList.innerHTML = '<li>No transactions to display.</li>';
     } else {
        filteredTransactions.forEach(transaction => {
            // Create an 'li' element
            const li = document.createElement('li');
            
            // Add transaction description and amount
            const transactionText = document.createTextNode(`${transaction.description}: ₹${transaction.amount.toFixed(2)}`);
            li.appendChild(transactionText);

            // Create a 'Delete' button
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.setAttribute('data-id', transaction.id);

            // Add an event listener for the delete button
            deleteBtn.addEventListener('click', deleteTransaction);

            // Append the button to the 'li' element
            li.appendChild(deleteBtn);

            // Append the 'li' element to the transaction list
            transactionList.appendChild(li);
        });
    }
  
      updateTotals();
    }
  
    // Delete Transaction
    function deleteTransaction(e) {
      const id = parseInt(e.target.getAttribute('data-id'));
      transactions = transactions.filter(transaction => transaction.id !== id);
      localStorage.setItem('transactions', JSON.stringify(transactions));
  
      renderTransactions();
    }
  
    // Update Totals
    function updateTotals() {
      const totalIncomeAmount = transactions
        .filter(t => t.type === 'income')
        .reduce((acc, t) => acc + t.amount, 0);
  
      const totalExpenseAmount = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => acc + t.amount, 0);
  
      const netBalance = totalIncomeAmount - totalExpenseAmount;
  
      totalIncome.textContent = `₹${totalIncomeAmount.toFixed(2)}`;
      totalExpense.textContent = `₹${totalExpenseAmount.toFixed(2)}`;
      totalBalance.textContent = `₹${netBalance.toFixed(2)}`;
    }
  
    // Handle Filter Change
    filterOptions.forEach(option => {
      option.addEventListener('change', function() {
        filter = this.value;
        renderTransactions();
      });
    });
  
    // Reset Button
    resetBtn.addEventListener('click', function() {
      localStorage.clear();
      location.reload();
    });
  
    // Initial Render
    renderTransactions();
  });
  