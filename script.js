const transactions = JSON.parse(localStorage.getItem('transactions')) || [];

const list = document.getElementById("transactionList");
const form = document.getElementById("transactionForm");
const status = document.getElementById("status");
const balance = document.getElementById('balance');
const income = document.getElementById('income');
const expense = document.getElementById('expense');

form.addEventListener('submit', addTransaction);

function updateTotal() {
    const incomeTotal = transactions
        .filter(trx => trx.type === "income")
        .reduce((total, trx) => total + trx.amount, 0);

    const expenseTotal = transactions
        .filter(trx => trx.type === "expense")
        .reduce((total, trx) => total + trx.amount, 0);

    const balanceTotal = incomeTotal - expenseTotal;

    balance.textContent = `₹${balanceTotal.toFixed(2)}`;
    income.textContent = `₹${incomeTotal.toFixed(2)}`;
    expense.textContent = `₹${expenseTotal.toFixed(2)}`;
}

function renderList() {
    list.innerHTML = "";

    if (transactions.length === 0) {
        status.textContent = 'No transactions';
        return;
    } else {
        status.textContent = "";
    }

    transactions.forEach(({ id, name, date, amount, type }) => {
        const li = document.createElement('li');

        li.innerHTML = `
        <div class="name">
            <h4>${name}</h4>
            <p>${new Date(date).toLocaleDateString()}</p>
        </div>

        <div class="amount ${type}">
            <span>₹${amount.toFixed(2)}</span>
        </div>

         <div class="action">
            <svg xmlns="http://www.w3.org/2000/svg" 
                 fill="none" 
                 viewBox="0 0 24 24" 
                 stroke-width="1.5" 
                 stroke="currentColor" 
                 width="24" height="24" 
                 class="delete-icon"
                 onclick="deleteTransaction(${id})">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
        </div>
        `;

        list.appendChild(li);
    });

    updateTotal();
}

function deleteTransaction(id) {
    const index = transactions.findIndex(trx => trx.id === id);
    if (index > -1) {
        transactions.splice(index, 1);
    }
    saveTransactions();
    renderList();
}

function addTransaction(e) {
    e.preventDefault();

    const formData = new FormData(this);
    const isIncome = document.getElementById('type').checked;  // Fix type selection

    transactions.push({
        id: transactions.length + 1,
        name: formData.get("name"),
        amount: parseFloat(formData.get("amount")),
        date: new Date(formData.get("date")),
        type: isIncome ? 'income' : 'expense',
    });

    this.reset();
    saveTransactions();
    renderList();
}

function saveTransactions() {
    transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

renderList();
