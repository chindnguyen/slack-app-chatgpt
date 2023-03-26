import type { NextPage } from "next";
import {useState} from "react";
const Home: NextPage = () => {
    const [message, setMessage] = useState('')
    function submitHandler() {
        console.log();
        fetch('/api/chatgpt', {
            method: 'POST',
            body: JSON.stringify({message: 'write an email for BFCM 2023'}),
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
    var d = new Date()

  // @ts-ignore
    return <div>
      <button onClick={submitHandler}>Click</button>
  </div>;
};

export default Home;
