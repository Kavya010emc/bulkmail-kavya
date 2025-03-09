import { useState } from "react";
import axios from "axios";

function App() {
  const [msg, setmsg] = useState('');
  const [sub, setsub] = useState('');
  const [emailList, setemailList] = useState([]);
  const [status, setstatus] = useState(false);
  const [showsuccess, setshowsuccess] = useState(false);

  const handleFile = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target.result;
      const emails = text.split('\n').filter(email => email.includes("@"));
      setemailList(emails);
    };

    reader.readAsText(file);
  };

  const send = () => {
    if (msg.trim() === '' || sub.trim() === '') {
      alert('Please fill all the fields');
      return;
    }

    setstatus(true);

    axios.post('https://bulkmail-backend-kavya.vercel.app/mail', {
      msg: msg,
      sub: sub,
      emailList: emailList
    })
    .then((response) => {
      if (response.data === true) {
        setshowsuccess(true);
        alert("✅ Emails sent successfully!");
      } else {
        alert("❌ Failed to send emails.");
      }
      setstatus(false);
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("❌ Failed to send emails.");
      setstatus(false);
    });

    setmsg('');
    setsub('');
    setemailList([]);
  }

  return (
    <div className="App">
      <h1>Bulk Mail Sender</h1>
      <textarea 
        value={msg} 
        onChange={(e) => setmsg(e.target.value)} 
        placeholder="Enter your message"
      />
      <input 
        type="text" 
        value={sub} 
        onChange={(e) => setsub(e.target.value)} 
        placeholder="Subject"
      />
      <input 
        type="file" 
        onChange={handleFile} 
      />
      <button onClick={send}>
        {status ? "Sending..." : "Send Emails"}
      </button>
      {showsuccess && <p>✅ Emails sent successfully!</p>}
    </div>
  );
}

export default App;