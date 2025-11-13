import { useCompanies } from "@/hooks/useCompanies";
import { useCustomers } from "@/hooks/useCustomers";
import { useEVInfo } from "@/hooks/useEVInfo";
import { useChargingPoints } from "@/hooks/useChargingPoints";
import { useReceipts } from "@/hooks/useReceipts";

export const Dashboard = () => {
  const { companies } = useCompanies();
  const { customers } = useCustomers();
  const { evInfo } = useEVInfo();
  const { chargingPoints } = useChargingPoints();
  const { receipts } = useReceipts();

  const availablePoints = chargingPoints.filter((p) => p.availability === "Available").length;

  return (
    <div>
      <div className="dashboard-grid">
        <div className="stat-card blue">
          <h3>Total Companies</h3>
          <div className="value">{companies.length}</div>
        </div>
        <div className="stat-card green">
          <h3>Total Customers</h3>
          <div className="value">{customers.length}</div>
        </div>
        <div className="stat-card purple">
          <h3>Registered Vehicles</h3>
          <div className="value">{evInfo.length}</div>
        </div>
        <div className="stat-card orange">
          <h3>Charging Points</h3>
          <div className="value">{chargingPoints.length}</div>
        </div>
        <div className="stat-card pink">
          <h3>Total Receipts</h3>
          <div className="value">{receipts.length}</div>
        </div>
        <div className="stat-card teal">
          <h3>Available Points</h3>
          <div className="value">{availablePoints}</div>
        </div>
      </div>

      <div className="two-col-grid">
        <div className="content-card">
          <h3>Recent Receipts</h3>
          {receipts.slice(0, 5).map((receipt) => (
            <div key={receipt.receipt_number} className="list-item">
              <span>{receipt.receipt_number}</span>
              <strong style={{ color: "#10b981" }}>
                ₹{receipt.amount.toFixed(2)}
              </strong>
            </div>
          ))}
        </div>

        <div className="content-card">
          <h3>Charging Point Status</h3>
          {chargingPoints.slice(0, 5).map((point) => (
            <div key={point.id} className="list-item">
              <span>{point.location}</span>
              <span className={`badge ${point.availability.toLowerCase()}`}>
                {point.availability}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};