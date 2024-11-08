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

const changeUser = ()=>{
  let userId = document.getElementById("userinput").value;
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
}