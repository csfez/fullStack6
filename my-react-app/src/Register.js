import React from "react"
import { useNavigate } from "react-router-dom"


import { useState ,useEffect } from "react";

//import ReactDOM from "react-dom/client";

// regex to match numbers between 1 and 10 digits long
const validPassword = /^\d{1,10}$/;

export default function Register() {
  // const https = require('https');

  const [inputs, setInputs] = useState({});
  const navigate = useNavigate();
  

const handleChange = ({target}) => {
    let isValid=true;
    const {name,value} = target;
    // if (name ==='submit')
    // {console.log('in handle change')}
    if (name ==='password'){
        isValid=  validPassword.test(value);
    }
    if (isValid) {
        setInputs(values => ({...values, [name]: value}))
    }

}


//submit
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(inputs);

    const data = JSON.stringify(inputs);

    try {
      const response = fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: data,
      });

      console.log(`Status: ${response.status}`);
      console.log("Response headers:", response.headers);

      const resData =response.json();

      if (response.status === 201) {
        const user = {
          id: resData.id,
          username: resData.username,
          password: resData.password,
        };

        console.log("User:", resData);
        alert("Welcome! You were registered successfully.");
        localStorage.setItem("currentUser", JSON.stringify(user));
        navigate(`/users/${user.username}`);
      } else {
        console.error(`Request failed with status code ${response.status}`);
        alert("Sorry, there was an error. Try again");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };
    // const options = {
    //   hostname: 'localhost',
    //   port: 3000,
    //   path: `/users`,
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Content-Length': data.length
    //   }
    // };

    // const req = https.request(options, (res) => {
    //   console.log(`Status: ${res.statusCode}`);
    //   console.log('Response headers:', res.headers);

    //   let resData = '';

    //   res.on('data', (chunk) => {
    //     resData += chunk;
    //   });

    //   res.on('end', () => {
    //     if (res.statusCode === 201) {
    //       const response = JSON.parse(resData);
    //       const user = { 'id': response.id, 'username': response.username, 'password': response.password };
    //       console.log('User:', response);
    //       alert('Welcome! You was registered successfully.');
    //       localStorage.setItem('currentUser', JSON.stringify(user));
    //       navigate(`/users/${user.username}`);
    //     } else {
    //       console.error(`Request failed with status code ${res.statusCode}`);
    //       alert("Sorry, there was an error. Try again")
    //     }

    //   });
    // });
    // req.on('error', (error) => {
    //   console.error('An error occurred:', error);
    // });
    // req.write(data);

    // req.end();

    
  
 

  return (
    <div className="login-container">
      <h1>WELCOME</h1>
      <form onSubmit={handleSubmit} className="login-form">
          <input 
            className="inputTypeIn"
            id="userNameInput"
            type="text" 
            name="username" 
            value={inputs.username || ""} 
            onChange={handleChange}
            placeholder="Enter your name:"
            required
          />
          <input
            id="passwordInput"
            className="inputTypeIn"
            maxLength={4} 
            type="password" 
            name="password" 
          value={inputs.password || ""} 
            onChange={handleChange}
            placeholder="Enter your password:"
          required
        />
        <input
            id="nameInput"
            className="inputTypeIn"
            type="text" 
            name="name" 
            value={inputs.name || ""} 
            onChange={handleChange}
            placeholder="Enter your name:"
          required
        />
        <input
            id="emailInput"
            className="inputTypeIn"
            type="email" 
            name="email" 
            value={inputs.email || ""} 
            onChange={handleChange}
            placeholder="Enter your email:"
          required
        />
        <input
            id="addressInput"
            className="inputTypeIn"
            type="text" 
            name="address" 
            value={inputs.address || ""} 
            onChange={handleChange}
            placeholder="Enter your address:"
          required
        />
        <input
            id="phoneInput"
            className="inputTypeIn"
            type="tel" 
            name="phone" 
            value={inputs.phone || ""} 
            onChange={handleChange}
            placeholder="Enter your phone:"
            pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
          required
        />
        <input
            id="websiteInput"
            className="inputTypeIn"
            type="text" 
            name="website" 
            value={inputs.website || ""} 
            onChange={handleChange}
            placeholder="Enter your website:"
          required
        />
        <input
            id="companyInput"
            className="inputTypeIn"
            type="text" 
            name="company" 
            value={inputs.company || ""} 
            onChange={handleChange}
            placeholder="Enter your company:"
          required
        />
        <input id="registerButton" type="submit" name="submit" value="REGISTER" />
    </form>
    </div>
    
  )
}

//id, name, username, email, address, phone, website, company