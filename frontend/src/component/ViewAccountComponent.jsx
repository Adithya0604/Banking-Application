import React, { useState, useEffect } from "react";
import { fetchWithAuth } from "../utlis/fetchWithAuth";

function ViewAccountComponent() {
  const [accounts, setAccounts] = useState([]);
  const [showDetails, setShowDetails] = useState({});
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  useEffect(() => {
    async function loadAccounts() {
      try {
        setLoading(true);
        const data = await fetchWithAuth(
          "http://localhost:8003/api/user/Accounts/"
        );

        const accountsData = Array.isArray(data)
          ? data : data.accounts || [data];

        setAccounts(accountsData);
      } catch (err) {
        console.error("Failed to load accounts:", err);
        setError("Failed to load accounts. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadAccounts();
  }, []);

  const handleToggle = (id) => {
    setShowDetails((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (loading) return <p>Loading accounts...</p>;
  if (error) return <p>{error}</p>;

  if (accounts.length === 0) return <p>No accounts found.</p>;

  return (
    <>
      {accounts.map((account) => {
        const maskedAccount = account.accountNumber
          ? account.accountNumber
              .slice(-6)
              .padStart(account.accountNumber.length, "X")
          : "N/A";

        return (
          <div
            key={account._id}
            onClick={() => handleToggle(account._id)}
            style={{
              border: "1px solid gray",
              padding: "10px",
              margin: "10px",
              cursor: "pointer",
            }}
          >
            <div>
              <p>Account Number: {maskedAccount}</p>
              <p>Amount: {account.balance ?? "N/A"}</p>
            </div>
            {showDetails[account._id] && (
              <div>
                <p>Type: {account.accountType ?? "N/A"}</p>
                <p>Branch: {account.branch ?? "N/A"}</p>
                <p>IFSCCODE: {account.ifscCode ?? "N/A"}</p>
                <p>Status: {account.accountStatus ?? "N/A"}</p>
                <p>Last Transaction: {account.lastTransactionDate ?? "N/A"}</p>
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}

export default ViewAccountComponent;

// state vaibles like account sdetails and which account card is open
// and using this useeffect hook for getting eh details of the user from account creeateion one . when the user will login then he will get the access tokenand refersh toekn from that tokens help we are getting the details of the user account
// and save the data
// when the user will click on that or toggle onthat card account then we know that thisis treu or false ok

// we will get the account of that partuci;lar user by array of objects then we can map that and get allt he detaild from that ans good to go
