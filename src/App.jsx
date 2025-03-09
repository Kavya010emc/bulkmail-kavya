import { useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

function App() {
  const [msg, setmsg] = useState("");
  const [emails, setEmails] = useState([]);
  const [status, setstatus] = useState(false);
  const [sentEmails, setSentEmails] = useState(0);

  // ✅ Handle Text Area
  function handlemsg(e) {
    setmsg(e.target.value);
  }

  // ✅ Handle File Upload
  function handleFile(event) {
    const file = event.target.files[0];

    const reader = new FileReader();
    reader.onload = function (e) {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "binary" });

      // ✅ Extract First Sheet
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      // ✅ Convert Sheet To JSON
      const emails = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      // ✅ Extract Emails Only
      const emailList = emails.flat().filter(email => email.includes("@"));
      console.log(emailList);

      // ✅ Set Emails State
      setEmails(emailList);
    };

    reader.readAsBinaryString(file);
  }

  // ✅ Send Bulk Emails
  async function send() {
    if (emails.length === 0) {
      alert("No emails found! Please upload a valid file.");
      return;
    }

    setstatus(true);

    // ✅ Loop through emails and send one by one
    for (let i = 0; i < emails.length; i++) {
      await axios.post(
  'https://bulkmail-backend-kavya-7u21.vercel.app/send-mail', // Your backend URL
  { email }, // Your email data
  { withCredentials: true }
)

      // ✅ Update Progress
      setSentEmails(i + 1);
    }

    alert("✅ All emails sent successfully!");
    setstatus(false);
  }

  return (
    <>
      <div className="min-h-screen bg-gray-950 flex justify-center items-center">
        <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-lg p-6 w-[400px] h-fit">
          <h1 className="text-2xl text-pink-500 font-bold text-center mb-4">
            BulkMail
          </h1>
          <p className="text-center font-medium text-pink-400 text-sm">
            We can help your business with sending multiple emails at once
          </p>
          <br />

          {/* Email Textarea */}
          <div className="bg-gray-800 items-center border border-gray-800 rounded-md flex p-4">
            <textarea
              onChange={handlemsg}
              value={msg}
              className="w-full h-20 py-2 text-gray-300 bg-gray-800 border-none outline-none resize-none"
              placeholder="Enter your email text here..."
            />
          </div>
          <br />

          {/* File Upload */}
          <div>
            <input
              type="file"
              onChange={handleFile}
              className="border-white border bg-gray-800 text-gray-500 border-dashed py-3 px-4 w-full rounded-md"
            />
          </div>

          <p className="text-center font-medium text-pink-400 mt-2 text-sm">
            Total Emails in the file: {emails.length}
          </p>

          {/* ✅ Centering the Button */}
          <div className="flex justify-center mt-4">
            <button
              onClick={send}
              className="bg-pink-500 text-white p-2 font-medium rounded-md w-[150px] hover:bg-pink-600 transition-all duration-200"
            >
               {status?"Sending...":"Send"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
