"use client";
import {Button} from "@/components/ui/button";
import {useState} from "react";
import {Input} from "@/components/ui/input";
import {authClient} from "@/lib/auth-client";
export default function Home() {
  const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { data: session} = authClient.useSession() 

    const onsubmit = ()=>{
      authClient.signUp.email({ email, password, name },{
        onError: ()=>{
          window.alert("Error creating user");
        },
        onSuccess: ()=>{
          window.alert("User created successfully");
        }
      })

    }

    const onLogin = ()=>{
      authClient.signIn.email({ email, password },{
        onError: ()=>{
          window.alert("Error logging in");
        },
        onSuccess: ()=>{
          window.alert("Logged in successfully");
        }
      })
    }
    if(session){
      return(
      <div className="flex flex-col p-4 gap-4">
        <div>Logged in as {session.user.name} ({session.user.email})</div>
        <Button onClick={()=>authClient.signOut()}>Sign Out</Button>
      </div>)
    }
  return (
    <div className="flex flex-col gap-y-10">
    <div className="flex flex-col gap-4">
      <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <Button onClick={onsubmit}>Create User</Button>
      <div className="flex flex-col gap-4">
      <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <Button onClick={onLogin}>Login</Button>
    </div>
    </div>
    </div>
    );
}
