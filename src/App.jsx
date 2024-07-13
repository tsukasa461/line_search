import { useEffect, useState } from "react";
import liff from "@line/liff";
import "./App.css";
import SearchForm from "./components/SearchForm";

function App() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    liff
      .init({
        liffId: import.meta.env.VITE_LIFF_ID
      })
      .then(() => {
        setMessage("LIFF init succeeded.");
      })
      .catch((e) => {
        setMessage("LIFF init failed.");
        setError(`${e}`);
      });
  });

  return (
    <div className="App">
      <SearchForm />
    </div>
  );
}

export default App;

liff.init({
  liffId: '2005806957-qwJxnNGN', // Use own liffId
})
  .then(() => {
      // start to use LIFF's api
  })
  .catch((err) => {
      console.log(err);
  });