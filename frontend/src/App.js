import { useEffect, useState } from "react";

function App() {
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("http://<EC2-IP>:5000/api")
      .then(res => res.json())
      .then(data => setMsg(data.message));
  }, []);

  return (
    <div>
      <h1>Frontend</h1>
      <h2>{msg}</h2>
    </div>
  );
}

export default App;
