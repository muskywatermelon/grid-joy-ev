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
  const occupiedPoints = chargingPoints.filter((p) => p.availability === "Occupied").length;
  const maintenancePoints = chargingPoints.filter((p) => p.availability === "Maintenance").length;

  // Get total revenue from receipts
  const totalRevenue = receipts.reduce((sum, receipt) => sum + receipt.amount, 0);

  // Sort receipts by date (newest first) for recent receipts display
  const recentReceipts = [...receipts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

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
          <h3>Total Revenue</h3>
          <div className="value">₹{totalRevenue.toFixed(2)}</div>
        </div>
      </div>

      <div className="two-col-grid">
        <div className="content-card">
          <h3>Recent Receipts (Last 10)</h3>
          {recentReceipts.length === 0 ? (
            <p className="no-data">No receipts found</p>
          ) : (
            <div className="receipts-list">
              {recentReceipts.map((receipt) => (
                <div key={receipt.receipt_number} className="list-item receipt-item">
                  <div className="receipt-info">
                    <span className="receipt-number">{receipt.receipt_number}</span>
                    <span className="receipt-date">
                      {new Date(receipt.date).toLocaleDateString('en-IN')} • {receipt.time}
                    </span>
                  </div>
                  <strong className="receipt-amount">
                    ₹{receipt.amount.toFixed(2)}
                  </strong>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="content-card">
          <h3>Charging Point Status</h3>
          <div className="status-summary">
            <div className="status-item">
              <span className="status-label">Available:</span>
              <span className="status-value available">{availablePoints}</span>
            </div>
            <div className="status-item">
              <span className="status-label">Occupied:</span>
              <span className="status-value occupied">{occupiedPoints}</span>
            </div>
            <div className="status-item">
              <span className="status-label">Maintenance:</span>
              <span className="status-value maintenance">{maintenancePoints}</span>
            </div>
          </div>
          
          <div className="charging-points-details">
            <h4>Points by Location</h4>
            {chargingPoints.length === 0 ? (
              <p className="no-data">No charging points found</p>
            ) : (
              chargingPoints.map((point) => (
                <div key={point.id} className="list-item charging-item">
                  <div className="charging-info">
                    <span className="location-name">{point.location}</span>
                    <span className="charging-details">
                      {point.num_of_points} points • {point.max_voltage}V • {point.functionality}
                    </span>
                  </div>
                  <span className={`badge ${point.availability.toLowerCase()}`}>
                    {point.availability}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};