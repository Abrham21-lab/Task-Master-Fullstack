import React, { useState } from "react";

function AuthLogin(){

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const login = async () => {

    const res = await fetch("http://localhost:5000/login",{

      method:"POST",

      headers:{
        "Content-Type":"application/json"
      },

      body:JSON.stringify({
        email,
        password
      })

    });

    const data = await res.json();

    alert(data.message);
  };

  return(

    <div style={{width:"300px", margin:"100px auto"}}>

      <h2>Login</h2>

      <input
        placeholder="Email"
        onChange={(e)=>setEmail(e.target.value)}
      />

      <br/><br/>

      <input
        type="password"
        placeholder="Password"
        onChange={(e)=>setPassword(e.target.value)}
      />

      <br/><br/>

      <button onClick={login}>Login</button>

    </div>

  );
}

export default AuthLogin;