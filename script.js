function toggleModalIncome() {
  const modal = document.getElementById('modalIncome');

  modal.classList.toggle('active');
}

function toggleModalExpense() {
  const modal = document.getElementById('modalExpense');

  modal.classList.toggle('active');
}

function getTransactions(){
  return JSON.parse(localStorage.getItem("transactions")) || [] 
}

function buildHTMLTransaction(transaction, index) {
  const typeTransaction = transaction.amount > 0 ? 'income' : 'expense';
  const amountFormatted = formatCurrency(transaction.amount, typeTransaction);
  const html = `
    <tr>
      <td class="description">${transaction.description}</td>
      <td class="${typeTransaction}">${amountFormatted}</td>
      <td class="date">${transaction.date}</td>
      <td>
        <img src="./assets/minus.svg" alt="Remover Transação" onclick="removeTransaction(${index})"/>
      </td>
    </tr>
  ` 
  return html;
}

function addTransaction(transaction, index) {
  console.log(transaction);
  const tbody = document.querySelector('#data-table tbody');
  const item = document.createElement('tr')
  item.innerHTML = buildHTMLTransaction(transaction, index);
  item.dataset.index = index;

  tbody.appendChild(item);
}

function init(){
  const transactions = getTransactions()
  document.getElementById('msg').innerText = '';
  
  if(transactions.length == 0){
    document.getElementById('msg').innerText = 'Não há nenhuma transação ainda.';
  }
  else{
    transactions.forEach((transaction,index) => addTransaction(transaction,index))
  }
  
  updateBalance(transactions);
}

function setTransactions(transactions) {
  localStorage.setItem("transactions", JSON.stringify(transactions))
}

function reload(transactions) {
  document.querySelector('#data-table tbody').innerHTML = '';
  init(transactions); 
}

function formatValues(amount, date){

  const amountFormatted = amount * 100;

  const dateFormatted = date.split('-');

  return {
    amount: amountFormatted,
    date: `${dateFormatted[2]}/${dateFormatted[1]}/${dateFormatted[0]}`
  }
  
}

function clearFields(typeTransaction) {
  document.getElementById(`description${typeTransaction}`).value = '';
  document.getElementById(`amount${typeTransaction}`).value = '';
  document.getElementById(`date${typeTransaction}`).value = '';
}

function newTransaction(transaction){
  transactions = getTransactions();
  transactions.push(transaction);

  setTransactions(transactions)

  reload(transactions);

  clearFields(transaction.typeTransaction);

  document.getElementById('modalIncome').classList.remove('active')
  document.getElementById('modalExpense').classList.remove('active')
}

function submitForm(event, typeTransaction) {
  console.log(typeTransaction);
  event.preventDefault();
  const description = document.getElementById(`description${typeTransaction}`).value;
  let amount = Number(document.getElementById(`amount${typeTransaction}`).value);
  const date = document.getElementById(`date${typeTransaction}`).value;

  typeTransaction === 'Expense' ? amount = -Math.abs(amount) : '';

  console.log(amount);

  const values = {
    ...formatValues(amount, date),
    description,
    typeTransaction
  }

  newTransaction(values);
}

function removeTransaction(index) {
  const transactions = getTransactions()
  transactions.splice(index, 1)

  setTransactions(transactions);

  reload(transactions);
}

function formatCurrency(amountTransaction, typeTransaction) {
  const signalAmount = typeTransaction === 'income' ? '' : '-';
  let value = Math.abs(amountTransaction) / 100;

  value = value.toLocaleString("pt-BR", {
    style: 'currency',
    currency: 'BRL'
  })

  if(value === 'R$ 0,00'){
    return `${value}`;
  }

  return `${signalAmount} ${value}`;
}

function incomes(transactions) {
  let totalIncomes = 0;
  transactions.forEach(transaction => {
    if(transaction.amount > 0){
      totalIncomes+=transaction.amount;
    }
  })
  return totalIncomes;
}

function expenses(transactions) {
  let totalExpense = 0;
  transactions.forEach(transaction => {
    if(transaction.amount < 0){
      totalExpense+=transaction.amount;
    }
  })
  return totalExpense;

}

function updateBalance(transactions) {
  document.querySelector('.card.total').classList.remove('negative')
  document.querySelector('.card.total').classList.remove('positive')

  const incomesValue = incomes(transactions);
  const expenseValue = expenses(transactions);

  const totalIncomes = formatCurrency(incomesValue,'income');
  const totalExpense = formatCurrency(expenseValue, 'expense');

  const total = incomesValue + expenseValue;

  if(total > 0){
    document.querySelector('.card.total').classList.add('positive')
    document.querySelector('.card.total').classList.remove('negative')
  }
  else if(total < 0){
    document.querySelector('.card.total').classList.remove('positive')
    document.querySelector('.card.total').classList.add('negative')
  }

  document.getElementById('valueIncome').innerHTML = totalIncomes;
  document.getElementById('valueExpense').innerHTML = totalExpense;

  const typeTotal = incomesValue > Math.abs(expenseValue) ? 'income' : 'expense'
  document.getElementById('valueTotal').innerHTML = formatCurrency(total, typeTotal);

}

init();

/* function mask(elemento) { 
  var valor = elemento.value;

  valor = valor + '';
  valor = parseInt(valor.replace(/[\D]+/g, ''));
  valor = valor + '';
  valor = valor.replace(/([0-9]{2})$/g, ",$1");

  if (valor.length > 6) {
      valor = valor.replace(/([0-9]{3}),([0-9]{2}$)/g, ".$1,$2");
  }

  elemento.value = valor;
  if(valor == 'NaN') elemento.value = '';
} */

/* let elemento = document.getElementById('amountExpense')

elemento.addEventListener('keyup',function() {
  

}) */