class Transaction {
  constructor(price, type, date, userId) {
    this.price = price;
    this.type = type;
    this.date = date;
    this.userId = userId;
  }
}
class User{
    constructor(name,budget){
        this.name=name;
        this.budget=budget;
    }
}

let userId;

const changeUser = ()=>{
  userId = document.getElementById("userinput").value;
  fetch(`/ExpenseTracker2/php/selectuser.php?user_id=${userId}`)
  .then(response => {
      if (response.ok) {
          return response.json();
      } else {
          throw new Error("Failed to retrieve user data.");
      }
  })
  .then(data => {
      if (data.message === "not found") {
        console.log("not found");
      } else {
          console.log("User data loaded:", data);
          document.getElementById("budgetDisplay").innerText = `Budget: ${data.budget}`;
          document.getElementById("usernamedisplay").innerText = `Name: ${data.name}`;
      }
  })
  .catch(error => {
      console.error("Error loading user data:", error);
  });
}

const createUser = ()=>{
  let username = document.getElementById("usernamecreate").value;
  let budget = document.getElementById("budgetcreate").value;
  document.getElementById("budgetDisplay").innerText = `Budget: ${budget}`;
  document.getElementById("usernamedisplay").innerText = `Name: ${username}`;
  let newuser= new User(username,budget);
  fetch('/ExpenseTracker2/php/createuser.php', {
    method: 'POST',
    headers:{
        'Content-Type': 'application/json'
    },
    body:JSON.stringify(newuser)
})
.then(response => {
    if (response.ok) {
        return response.json();
    } else {
        throw new Error("Failed to retrieve user data.");
    }
})
.then(data => {
    userId = data.data.user_id;
})
}

const changeBudget = () => {
    if (!userId) {
        console.error("User ID is not set. Create or select a user first.");
        return;
      }
    const budget = document.getElementById("budgetInput").value;
    document.getElementById("budgetDisplay").innerText = `Budget: ${budget}`;
    console.log(userId);

    const data = {
        user_id: userId,
        budget: budget
    };

    fetch('/ExpenseTracker2/php/updatebudget.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error("Failed to update budget.");
        }
    })
    .then(data => {
        console.log("Budget updated successfully:", data);
    })
    .catch(error => {
        console.error("Error:", error);
    });
}

function addTransaction() {
    if (!userId) {
        console.error("User ID is not set. Create or select a user first.");
        return;
    }

    const price = document.getElementById('price').value;
    const type = document.getElementById('type').value;
    const date = document.getElementById('date').value;
    const transaction = new Transaction(price, type, date, userId);


    fetch('/ExpenseTracker2/php/createtransaction.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(transaction)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        getTransactions();
        changeUser();
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

const getTransactions = ()=>{
    if (!userId) {
        console.error("User ID is not set. Create or select a user first.");
        return;
    }
    let tableBody = document.getElementById("transactionsDetail");
    tableBody.innerHTML = "";
    fetch(`/ExpenseTracker2/php/gettransactions.php?userId=${userId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('response was not ok');
            }
            return response.json();
        })
        .then(data => {
            
            data.forEach(element => {
                let tablerow = `<tr>
                <td>${element.price}</td>
                <td>${element.type}</td>
                <td>${element.date}</td>
                <td><button type="button" onclick="deleteTransaction(${element.id})">delete</button></td>
            </tr>`;
            tableBody.innerHTML += tablerow;       
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

const deleteTransaction = (id) => {
    if (!id) {
        console.error("ID is required to delete a transaction.");
        return;
    }

    fetch('/ExpenseTracker2/php/deletetransaction.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: id })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Response was not ok');
        }
        return response.json();
    })
    .then(data => {
        getTransactions();
        console.log('Transaction deleted:');
    })
    .catch(error => {
        console.error('Error:', error);
    });
};


function showTransactions(transactions) {
    let tableBody = document.getElementById("transactionsDetail");
    tableBody.innerHTML = "";

    transactions.forEach(transaction => {
        let tablerow = `<tr>
                <td>${transaction.price}</td>
                <td>${transaction.type}</td>
                <td>${transaction.date}</td>
                <td><button type="button" onclick="deleteTransaction(${transaction.id})">Delete</button></td>
            </tr>`;
        tableBody.innerHTML += tablerow;
    });
}

function applyFilters() {
    const filterType = document.getElementById('filterType').value;
    const filterDate = document.getElementById('filterDate').value;
    const minPrice = document.getElementById('minPrice').value;
    const maxPrice = document.getElementById('maxPrice').value;

    let url = `/ExpenseTracker2/php/gettransactions.php?userId=${userId}`;

    if (filterType) url += `&type=${filterType}`;
    if (filterDate) url += `&date=${filterDate}`;
    if (minPrice) url += `&minPrice=${minPrice}`;
    if (maxPrice) url += `&maxPrice=${maxPrice}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data && data.length > 0) {
                showTransactions(data);
            } else {
                console.log("No transactions found");
            }
        })
        .catch(error => {
            console.error("Error fetching filtered transactions:", error);
        });
}

function showTransactions(transactions) {
    let tableBody = document.getElementById("transactionsDetail");
    tableBody.innerHTML = "";

    transactions.forEach(transaction => {
        let tablerow = `<tr>
                <td>${transaction.price}</td>
                <td>${transaction.type}</td>
                <td>${transaction.date}</td>
                <td><button type="button" onclick="deleteTransaction(${transaction.id})">Delete</button></td>
            </tr>`;
        tableBody.innerHTML += tablerow;
    });
}