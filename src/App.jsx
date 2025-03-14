import axios from "axios";
import { useState } from "react";
import * as XLSX from 'xlsx';

 function App() {

  const [msg, setmsg] = useState("");
  const [status, setstatus] = useState(false);
  const [emails, setEmails] = useState([]);
  const [sentEmails, setSentEmails] = useState(0);

  // ✅ Handle Text Area
  function handlemsg(e) {
    setmsg(e.target.value);
  }

  // ✅ Handle File Upload
  function handlefile(event) {
    const file = event.target.files[0];

    // ✅ Read File
    const reader = new FileReader();
    reader.onload = function(e) {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });

      // ✅ Get First Sheet
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      // ✅ Convert Sheet to JSON
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      // ✅ Extract Emails (Assume 1st Column is Email)
      const extractedEmails = jsonData.slice(1).map(row => row[0]); // Skip header
      console.log("Emails:", extractedEmails);
      setEmails(extractedEmails);
    }

    // ✅ Read File as Binary String
    reader.readAsBinaryString(file);
  }

  // ✅ Send Emails Function
  function send() {
    if (emails.length === 0) {
      alert("❌ Please upload a file with valid emails");
      return;
    }

    setstatus(true);
    axios.post("http://localhost:5000/sendmail", {
      msg: msg,
      emailList: emails
    })
    .then(res => {
      alert("✅ Emails sent successfully!");
      setmsg("");
      setEmails([]);
      setSentEmails(res.data.successCount);
      setstatus(false);
    })
    .catch(err => {
      alert("❌ Failed to send emails");
      console.log(err);
      setstatus(false);
    });
  }

  return (
    <div className="bg-black h-screen flex justify-center items-center p-5">
      <div className="border-2 border-pink-400 rounded-lg p-5 text-center shadow-xl bg-gray-800 w-[90%] max-w-[500px] max-h-[90%] overflow-auto">
        <h1 className="text-pink-400 text-2xl font-medium mb-2">
          📧 BulkMail
        </h1>
        <p className="text-pink-400 font-medium mb-2">
          We can help your business with sending multiple emails at once
        </p>

        {/* ✅ Textarea */}
        <textarea 
          onChange={handlemsg} 
          value={msg}
          className="border rounded-md border-white w-full h-32 p-3 text-white bg-gray-900 mb-4 resize-none"
          placeholder="Enter your message..."
        ></textarea>

        {/* ✅ File Input */}
        <input onChange={handlefile}
          type="file" 
          className="border border-white text-white bg-gray-900 rounded-md w-full p-2 mb-4"
        />

        {/* ✅ Total Emails Count */}
        <p className="text-pink-400 font-medium mb-4">
          Total Emails in the file: {emails.length}
        </p>

        {/* ✅ Send Button */}
        <button onClick={send}
          className="bg-pink-400 p-2 text-white font-medium rounded-md w-full hover:bg-pink-500 transition-all"
        >
         {status ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}

export default App;
l
