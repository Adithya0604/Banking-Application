import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../utlis/fetchWithAuth";

function ViewTransferComponent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [Info, setInfo] = useState([]);

  const url = "http://localhost:8003/api/user/ViewTransaction/";

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await fetchWithAuth(url);
        if (!result.ok) {
          throw new Error("Failed to fetch the details");
        }
        const data = await result.json();
        setInfo(data.transaction);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <h1>Loading...</h1>;
  if (error) return <h1>{error.message}</h1>;

  return (
    <div className="table-container">
      <table className="styled-table">
        <caption>Transactions</caption>
        <thead>
          <tr>
            <th>ID</th>
            <th>Sender_Number</th>
            <th>Receiver_Number</th>
            <th>Amount</th>
            <th>Transaction_Status</th>
          </tr>
        </thead>
        <tbody>
          {Info.map((eachItem, index) => (
            <tr key={index}>
              <td>{eachItem.Id}</td>
              <td>{eachItem.Sender_Number}</td>
              <td>{eachItem.Reciver_Number}</td>
              <td>{eachItem.Amount}</td>
              <td>{eachItem.Transaction_Status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ViewTransferComponent;
