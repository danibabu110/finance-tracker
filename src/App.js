import React, { useState, useEffect, useCallback } from "react";
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
  query,
  where,
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

  // 📥 Fetch Data (✅ FIXED + OPTIMIZED)
  const fetchData = useCallback(async () => {
    if (!user) return;

    try {
      const q = query(
        collection(db, "transactions"),
        where("userId", "==", user.uid)
      );

      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((docItem) => ({
        id: docItem.id,
        ...docItem.data(),
      }));

      console.log("Fetched:", data);

      setTransactions(data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  }, [user]);

  // 📦 Fetch when user changes
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ➕ ADD
  const addTransaction = async (tx) => {
    try {
      const newData = {
        ...tx,
        userId: user.uid,
      };

      console.log("Saving to Firebase:", newData);

      await addDoc(collection(db, "transactions"), newData);

      fetchData();
    } catch (error) {
      console.error("Add error:", error);
    }
  };

  // ❌ DELETE
  const deleteTx = async (id) => {
    try {
      await deleteDoc(doc(db, "transactions", id));
      fetchData();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  // ✏️ UPDATE
  const updateTransaction = async (updatedTx) => {
    try {
      await updateDoc(doc(db, "transactions", updatedTx.id), updatedTx);
      fetchData();
      setEditTx(null);
    } catch (error) {
      console.error("Update error:", error);
    }
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