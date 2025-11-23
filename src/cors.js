import React,{useState, useEffect} from 'react'

const Cors_test=()=>{
  const [email,setEmail]=useState('')
  const [username, setUsername]=useState('')
  const [users, setUsers]= useState([])
  const [msg ,setMsg]=useState('login for get users details')

   const login=async()=>{
    const res=await fetch("http://localhost:5000/mongo/login",{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({username,email})

    })
   const data=await res.json()
   if(data.token){
    localStorage.setItem('token', data.token);
    setMsg('login Successfull');
    fetchUsers(data.token)
    
   }
   else{
    setMsg(data.message || 'Login failed');
   }
   }

   const fetchUsers=async(token)=>{
    const res= await fetch("http://localhost:5000/mongo/users",{
      headers:{Authorization:`Bearer ${ token}`}
    })
    const data=await res.json();
    setUsers(data);
   }


  return (
    <div>
      <h2>Login</h2>
      <input value={username} placeholder='  enter your username' onChange={e=>setUsername(e.target.value)}/>
      <input value={email} placeholder='  enter your email' onChange={e=>setEmail(e.target.value)}/>
      <button onClick={login}> login & fetch users</button>
      <p>{msg}</p>
      <ul>
        {users.map(u=>(
          <li key={u.id}>{u.username} ({u.email})</li>
        ))}
      </ul>

    </div>
  )
}

export default Cors_test