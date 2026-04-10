import React, { useState, useEffect } from "react";

export default function AddTransaction({
    addTransaction,
    editTx,
    updateTransaction,
}) {
    const [text, setText] = useState("");
    const [amount, setAmount] = useState("");
    const [type, setType] = useState("expense");
    const [category, setCategory] = useState("food");

    useEffect(() => {
        if (editTx) {
            setText(editTx.text || "");
            setAmount(editTx.amount?.toString() || "");
            setType(editTx.type || "expense");
            setCategory(editTx.category || "food");
        }
    }, [editTx]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!text.trim()) {
            alert("Enter title");
            return;
        }

        if (!amount || isNaN(amount)) {
            alert("Enter valid amount");
            return;
        }

        const newData = {
            text: text.trim(),
            amount: parseFloat(amount),
            type: type === "income" ? "income" : "expense", // 🔥 FIX
            category,
        };

        console.log("Saving:", newData);

        if (editTx) {
            updateTransaction({ ...editTx, ...newData });
        } else {
            addTransaction(newData);
        }

        setText("");
        setAmount("");
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                placeholder="Title"
                value={text}
                onChange={(e) => setText(e.target.value)}
            />

            <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />

            <select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
            </select>

            <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="food">Food</option>
                <option value="rent">Rent</option>
                <option value="travel">Travel</option>
            </select>

            <button>{editTx ? "Update" : "Add"}</button>
        </form>
    );
}