

document.getElementById('regPass').addEventListener('keyup', function (event) {
  var input = event.target;
  var password = document.getElementById("regPass").value;
  var strengthBar = document.getElementById('password-strength-bar');
    if (password.length == 0) {
      strengthBar.style.width = '0';
      return;
    }

    // Regular Expressions and Criteria Messages
    var passed = 0;
    var messages = [];
    if (password.length >= 8) {
        passed += 1;
    } else {
        messages.push("at least 8 characters");
    }
    if (/[A-Z]/.test(password)) {
        passed += 1;
    } else {
        messages.push("an uppercase letter");
    }
    if (/[a-z]/.test(password)) {
        passed += 1;
    } else {
        messages.push("a lowercase letter");
    }
    if (/\d/.test(password)) {
        passed += 1;
    } else {
        messages.push("a number");
    }
    if (/[$@$!%*#?&]/.test(password)) {
        passed += 1;
    } else {
        messages.push("a special character (e.g., $@!%*#?&)");
    }

    // Display status
    switch (passed) {
        case 0:
           strengthBar.style.width = '0';
            strengthBar.style.backgroundColor = 'red';
            passwordText.textContent = '';
        case 1:
            strengthBar.style.width = '20%';
            strengthBar.style.backgroundColor = 'red';
            input.setCustomValidity(messages.join(", "));
            break;
        case 2:
            strengthBar.style.width = '40%';
            strengthBar.style.backgroundColor = 'orange';
            input.setCustomValidity( messages.join(", "));
            break;
        case 3:
            strengthBar.style.width = '60%';
            strengthBar.style.backgroundColor = 'yellow';
            input.setCustomValidity( messages.join(", "));
            break;
        case 4:
            strengthBar.style.width = '80%';
            strengthBar.style.backgroundColor = 'blue';
            input.setCustomValidity(messages.join(", "));
            break;
        case 5:
            strengthBar.style.width = '100%';
            strengthBar.style.backgroundColor = 'green';
            input.setCustomValidity('');

            break;
        default:
          input.setCustomValidity('');
          break;
    }
});
document.getElementById('name').addEventListener('keyup', function (event) {
  var input = event.target;
  var pattern = /^[A-Za-z\s ]+$/;
  var isValid = pattern.test(input.value);

  if (!isValid) {
      input.setCustomValidity('Only letters are allowed');
  } else {
      input.setCustomValidity('');
  }
});
const apiUrl = "/"
document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPass').value;

    try {
      const response = await fetch(apiUrl+'auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        // Redirect to the desired page after successful login
        window.location.href = '/protected'; // Change this to your desired route
      } else {
        const errorData = await response.json();
        alert(errorData.message); // Display error message
      }
    } catch (error) {
      console.error('Error:', error);
    }
  });

  document.getElementById('registerForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('regEmail').value;
    const number = document.getElementById('regNumber').value;
    const password = document.getElementById('regPass').value;
    const confirmPassword = document.getElementById('confirmPass').value;

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const response = await fetch(apiUrl+'auth/register', {
        method: 'POST',
        headers: {  
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, number, password })
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        window.location.href = '/protected'; // Change this to your desired route
        // Redirect to the desired page after successful registration // Change this to your desired route
      } else {
        const errorData = await response.json();
        alert(errorData.message); // Display error message
      }
    } catch (error) {
      console.error('Error:', error);
    }
  });