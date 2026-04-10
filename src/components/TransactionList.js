import React from "react";

export default function TransactionList({
    transactions,
    deleteTx,
    setEditTx,
}) {
    return (
        <div>
            <h3>Transactions</h3>
            <ul>
                {transactions.map((tx) => (
                    <li key={tx.id} className={tx.type}>
                        <span>
                            {tx.text || "No Title"} - ₹
                            {typeof tx.amount === "number" ? tx.amount : 0}
                        </span>

                        <div>
                            <button onClick={() => setEditTx(tx)}>✏️</button>
                            <button onClick={() => deleteTx(tx.id)}>❌</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}