import { useState } from "react";
import axios from "axios";

function App() {
  const [msg, setMsg] = useState('');
  const [sub, setSub] = useState('');
  const [emailList, setEmailList] = useState([]);
  const [status, setStatus] = useState(false);

  // ✅ Handle File Upload (Extract Emails)
  const handleFile = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const emails = e.target.result.split('\n').filter(email => email.includes("@"));
      setEmailList(emails);
    };

    reader.readAsText(file);
  };

  // ✅ Handle Send Mail Button
  const sendMail = () => {
    if (!msg || !sub || emailList.length === 0) {
      alert("⚠️ Please fill all fields and upload a file.");
      return;
    }

    setStatus(true);
    axios.post('https://bulkmail-backend-kavya.vercel.app/mail', {
      msg,
      sub,
      emailList
    }).then(() => {
      alert("✅ Emails sent successfully!");
      setStatus(false);
    }).catch(() => {
      alert("❌ Failed to send emails.");
      setStatus(false);
    });

    // ✅ Reset form fields
    setMsg('');
    setSub('');
    setEmailList([]);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6">📧 Bulk Mail Sender</h1>

      <textarea
        className="border p-2 mb-3 w-80 rounded-md text-black"
        placeholder="Enter your message"
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
      />

      <input
        className="border p-2 mb-3 w-80 rounded-md text-black"
        type="text"
        placeholder="Subject"
        value={sub}
        onChange={(e) => setSub(e.target.value)}
      />

      <input
        className="border p-2 mb-3 w-80 rounded-md text-black"
        type="file"
        onChange={handleFile}
      />

      <button
        className={`px-6 py-2 rounded-md ${status ? 'bg-gray-500' : 'bg-pink-500'}`}
        onClick={sendMail}
        disabled={status}
      >
        {status ? "Sending..." : "Send Emails"}
      </button>
    </div>
  );
}

export default App;