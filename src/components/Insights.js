import React from "react";

export default function Insights({ transactions }) {
    const totalExpense = transactions
        .filter((t) => t.type === "expense")
        .reduce((acc, t) => acc + t.amount, 0);

    const foodExpense = transactions
        .filter((t) => t.category === "food")
        .reduce((acc, t) => acc + t.amount, 0);

    let message = "Good job managing finances! 👍";

    if (foodExpense > 0.4 * totalExpense && totalExpense !== 0) {
        message = "⚠️ High spending on food. Try to reduce.";
    }

    return (
        <div>
            <h3>Insights</h3>
            <p>{message}</p>
        </div>
    );
}