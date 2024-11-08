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
          alert(data.message);
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
};

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
        console.log('Transaction added successfully:', data);
        changeUser();
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

