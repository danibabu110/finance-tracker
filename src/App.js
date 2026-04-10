import React, { useState, useEffect } from "react";
import AddTransaction from "./components/AddTransaction";
import TransactionList from "./components/TransactionList";
import Summary from "./components/Summary";
import Insights from "./components/Insights";
import ChartComponent from "./components/ChartComponent";
import Login from "./components/Login";

import { auth, db } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

import "./styles.css";

function App() {
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [editTx, setEditTx] = useState(null);

  // 🔐 Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  // 📥 Fetch ALL and filter manually (🔥 FIX)
  const fetchData = async () => {
    try {
      const snapshot = await getDocs(collection(db, "transactions"));

      const data = snapshot.docs.map((docItem) => ({
        id: docItem.id,
        ...docItem.data(),
      }));

      // 🔥 FILTER USER DATA HERE
      const userData = data.filter((t) => t.userId === user?.uid);

      console.log("Fetched:", userData);

      setTransactions(userData);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  // 📦 Fetch when user changes
  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  // ➕ ADD (FIXED)
  const addTransaction = async (tx) => {
    try {
      const newData = {
        ...tx,
        userId: user.uid,
      };

      console.log("Saving to Firebase:", newData);

      await addDoc(collection(db, "transactions"), newData);

      fetchData(); // 🔥 FORCE REFRESH
    } catch (error) {
      console.error("Add error:", error);
    }
  };

  // ❌ DELETE
  const deleteTx = async (id) => {
    await deleteDoc(doc(db, "transactions", id));
    fetchData();
  };

  // ✏️ UPDATE
  const updateTransaction = async (updatedTx) => {
    await updateDoc(doc(db, "transactions", updatedTx.id), updatedTx);
    fetchData();
    setEditTx(null);
  };

  if (!user) return <Login />;

  return (
    <div className="container">
      <h1>💰 Finance Tracker</h1>

      <button onClick={() => signOut(auth)}>Logout</button>

      <Summary transactions={transactions} />

      <ChartComponent transactions={transactions} />

      <AddTransaction
        addTransaction={addTransaction}
        editTx={editTx}
        updateTransaction={updateTransaction}
      />

      <TransactionList
        transactions={transactions}
        deleteTx={deleteTx}
        setEditTx={setEditTx}
      />

      <Insights transactions={transactions} />
    </div>
  );
}

export default App;