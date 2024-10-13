import { Card, Table, Button, Modal, Badge } from "react-bootstrap";
import { useEffect, useState } from "react";
import { AdminLayout } from "@layout";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";

const ElsaAccountHistory = () => {
  const router = useRouter();
  const { accountId } = router.query; // Get the account ID from the URL
  const [account, setAccount] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchElsaAccountHistory = async () => {
    try {
      const response = await axios.get(`/api/elsa-accounts?id=${accountId}`);
      console.log(response)
      if (response.status === 200) {
        setAccount(response.data);
        setHistory(response.data.history);
      }
    } catch (error) {
      console.error("Error fetching account history:", error.message);
      setError("Failed to fetch account history. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accountId) {
      fetchElsaAccountHistory();
    }
  }, [accountId]);

  return (
    <AdminLayout>
      <ToastContainer />
      {loading && <div>Loading...</div>}
      {error && <div className="text-danger">{error}</div>}
      {!loading && (
        <>
          <Card>
            <Card.Header className="d-flex align-items-center">
              <div className="w-50">
                History for {account?.student?.name} ({account.email})
              </div>
              <Button
                variant="secondary"
                onClick={() => router.push("/students/elsa_accounts")}
                className="ms-auto"
              >
                Back to Accounts
              </Button>
            </Card.Header>
            <Card.Body>
              <h5>Account Details</h5>
              <Table bordered>
                <tbody>
                  <tr>
                    <th>Email</th>
                    <td>{account.email}</td>
                  </tr>
                  <tr>
                    <th>Student Name</th>
                    <td>{account?.student?.name}</td>
                  </tr>
                  <tr>
                    <th>Subscription Status</th>
                    <td>
                      <Badge
                        bg={
                          account.subscriptionStatus === "active"
                            ? "success"
                            : account.subscriptionStatus === "expired"
                            ? "danger"
                            : "warning"
                        }
                      >
                        {account.subscriptionStatus}
                      </Badge>
                    </td>
                  </tr>
                  <tr>
                    <th>Monthly Cost</th>
                    <td>${account.monthlyCost}</td>
                  </tr>
                  <tr>
                    <th>Comments</th>
                    <td>{account.comment}</td>
                  </tr>
                </tbody>
              </Table>

              <h5>Subscription History</h5>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Status</th>
                    <th>Cost</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((record, index) => (
                    <tr key={index}>
                      <td>{record?.student?.name}</td>
                      <td>
                        <Badge
                          bg={
                            "danger"
                          }
                        >
                          Expired
                        </Badge>
                      </td>
                      <td>${record?.monthlyCost}</td>
                      <td>{new Date(record?.subscriptionPeriod?.startDate).toLocaleDateString()}</td>
                      <td>{new Date(record?.subscriptionPeriod?.endDate).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              <h5>Payment History</h5>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Payment Status</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((payment, index) => (
                    <tr key={index}>
                      <td>{new Date(payment.paymentDate).toLocaleDateString()}</td>
                      <td>${payment.amount}</td>
                      <td>{payment.paymentStatus}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </>
      )}
    </AdminLayout>
  );
};

export default ElsaAccountHistory;
