import React from "react";

export default function Summary({ transactions }) {
    const income = transactions
        .filter((t) => t.type === "income")
        .reduce((acc, t) => acc + Number(t.amount || 0), 0);

    const expense = transactions
        .filter((t) => t.type === "expense")
        .reduce((acc, t) => acc + Number(t.amount || 0), 0);

    return (
        <div>
            <h3>Balance: ₹{income - expense}</h3>
            <p>Income: ₹{income}</p>
            <p>Expense: ₹{expense}</p>
        </div>
    );
}