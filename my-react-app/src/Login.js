import React from "react"
import { Link,useNavigate } from "react-router-dom"


import { useState ,useEffect } from "react";
// import { response } from "express";

//import ReactDOM from "react-dom/client";

// regex to match numbers between 1 and 10 digits long
const validPassword = /^\d{1,10}$/;

export default function Login() {
//   const https = require('https');

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
  const handleSubmit =  (event) => {
    event.preventDefault();
    console.log(inputs);
    let userName=inputs.username;
    let password=inputs.password;
    console.log(userName);

    

//   const options = {
//       hostname: 'localhost',
//       port: 3000,
//       path: `/users_password?&username=${userName}&password=${password}`,
//       method: 'GET',
//     };

//   const req = https.request(options, (res) => {
//     console.log(`Status: ${res.statusCode}`);
//     console.log('Response headers:', res.headers);

//     let data = '';

//     res.on('data', (chunk) => {
//       data += chunk;
//     });

//     res.on('end', () => {
//       if (res.statusCode === 200) {
//         const user = JSON.parse(data);
//         console.log('User:', user);
//         alert('You are logged in');
//         localStorage.setItem('currentUser', JSON.stringify(user));
//         navigate(`/users/${user.username}`);
//       } else if(res.statusCode === 404){
//         console.error(`Request failed with status code ${res.statusCode}`);
//         alert('Username or password is wrong');
//         setInputs(values => ({...values, ['password']: ""}))
//       } else {
//         console.error(`Request failed with status code ${res.statusCode}`);
//         alert("Sorry, there was an error. Try again")
//       }

//     });
//   });
//     req.on('error', (error) => {
//       console.error('An error occurred:', error);
//   });

//   req.end();

  const requestOptions = {
    method: 'GET',
  };

        fetch(`http://localhost:3001/users_password?&username=${userName}&password=${password}`,requestOptions)
        .then(res=>{
            console.log(`Status: ${res.statusCode}`);
            console.log('Response headers:', res.headers);
            if (res.ok) {
                return res.json();
              }  else if(res.statusCode === 404){
                console.error(`Request failed with status code ${res.statusCode}`);
                alert('Username or password is wrong');
                setInputs(values => ({...values, ['password']: ""}))
                throw new Error('Username or password is wrong');

            } else {
                console.error(`Request failed with status code ${res.statusCode}`);
                alert("Sorry, there was an error. Try again");
                throw new Error('Sorry, there was an error. Try again');

              }
        })
        .then(user=>{
            // const user = JSON.parse(data);
            console.log('User:', user);
            alert('You are logged in');
            localStorage.setItem('currentUser', JSON.stringify(user));
            navigate(`/users/${user.username}`);
        })
        .catch(error=>{
            console.error('An error occurred:', error);
        })
       
        
      
    };

        
      
      // fetch(`/users?username=${userName}`)
      // .then(response => {
      //   if(response.ok){
      //     return response.json();  
      //   }
      //   throw new Error('Request failed!');
      // }, networkError => {
      //   console.log(networkError.message);
      // }).then(jsonResponse => {
      //   if (jsonResponse.length != 0) { // if the username exists
      //     let userPassword = jsonResponse[0].address.geo.lat.slice(-4);
      //     console.log(jsonResponse[0].address.geo.lat.slice(-4));
      //     if (userPassword == password) {
      //       alert('You are logged in');
      //       let user = { id: jsonResponse[0].id, name: jsonResponse[0].name };
      //       localStorage.setItem('currentUser', JSON.stringify(user));
      //     //  navigate(`/users/${jsonResponse[0].id}`);
      //     }
      //     else {
      //       alert('The password you entered is wrong');
      //       setInputs(values => ({...values, ['password']: ""}))
      //     }
      //   }
      //   else {
      //     alert('The username you entered is wrong');
      //   }
      // })

 


//   useEffect(() => {
//     console.log('useefect');
    
// },[inputs]);

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
        <input id="submitButton" type="submit" name="submit" value="LOG IN" />
    </form>
    </div>
    
  )
}
