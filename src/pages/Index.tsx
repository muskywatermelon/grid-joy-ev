import { useState } from "react";
import { Dashboard } from "@/components/Dashboard";
import { DataTable } from "@/components/DataTable";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCompanies, Company } from "@/hooks/useCompanies";
import { useCustomers, Customer } from "@/hooks/useCustomers";
import { useEVInfo, EVInfo } from "@/hooks/useEVInfo";
import { useChargingPoints, ChargingPoint } from "@/hooks/useChargingPoints";
import { useReceipts, Receipt } from "@/hooks/useReceipts";
import { CompanyForm } from "@/components/CompanyForm";
import { CustomerForm } from "@/components/CustomerForm";
import { EVForm } from "@/components/EVForm";
import { ChargingPointForm } from "@/components/ChargingPointForm";
import { ReceiptForm } from "@/components/ReceiptForm";
import "./styles.css";

type TabType = "dashboard" | "companies" | "customers" | "vehicles" | "charging" | "receipts";

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const companies = useCompanies();
  const customers = useCustomers();
  const evInfo = useEVInfo();
  const chargingPoints = useChargingPoints();
  const receipts = useReceipts();

  const handleAdd = () => {
    setEditingItem(null);
    setModalOpen(true);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingItem(null);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;

      case "companies":
        return (
          <DataTable
            title="Companies"
            columns={[
              { key: "id", label: "ID" },
              { key: "company_name", label: "Company Name" },
              { key: "branch", label: "Branch" },
            ]}
            data={companies.companies}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={(item) => companies.deleteCompany(item.id)}
            getRowKey={(item) => item.id}
            searchTerm={searchTerm}
          />
        );

      case "customers":
        return (
          <DataTable
            title="Customers"
            columns={[
              { key: "id", label: "ID" },
              { key: "name", label: "Name" },
              { key: "phone_no", label: "Phone" },
              { key: "address", label: "Address" },
            ]}
            data={customers.customers}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={(item) => customers.deleteCustomer(item.id)}
            getRowKey={(item) => item.id}
            searchTerm={searchTerm}
          />
        );

      case "vehicles":
        return (
          <DataTable
            title="EV Information"
            columns={[
              { key: "num_plate", label: "Number Plate" },
              { key: "company_id", label: "Company ID" },
              { key: "specs", label: "Specs" },
              { key: "model", label: "Model" },
              { key: "battery_time", label: "Battery Time" },
              { key: "volt_req", label: "Voltage" },
              { key: "cost", label: "Cost" },
            ]}
            data={evInfo.evInfo}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={(item) => evInfo.deleteEVInfo(item.num_plate)}
            getRowKey={(item) => item.num_plate}
            searchTerm={searchTerm}
          />
        );

      case "charging":
        return (
          <DataTable
            title="Charging Points"
            columns={[
              { key: "location", label: "Location" },
              { key: "company_id", label: "Company ID" },
              { key: "num_of_points", label: "Points" },
              { key: "availability", label: "Status" },
              { key: "functionality", label: "Type" },
              { key: "max_voltage", label: "Max Voltage" },
            ]}
            data={chargingPoints.chargingPoints}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={(item) => item.id && chargingPoints.deleteChargingPoint(item.id)}
            getRowKey={(item) => item.id || ""}
            searchTerm={searchTerm}
          />
        );

      case "receipts":
        return (
          <DataTable
            title="Receipts"
            columns={[
              { key: "receipt_number", label: "Receipt #" },
              { key: "company_id", label: "Company ID" },
              { key: "amount", label: "Amount" },
              { key: "date", label: "Date" },
              { key: "time", label: "Time" },
            ]}
            data={receipts.receipts}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={(item) => receipts.deleteReceipt(item.receipt_number)}
            getRowKey={(item) => item.receipt_number}
            searchTerm={searchTerm}
          />
        );

      default:
        return <Dashboard />;
    }
  };

  const renderForm = () => {
    switch (activeTab) {
      case "companies":
        return (
          <CompanyForm
            company={editingItem as Company}
            onSubmit={(data) => {
              if (editingItem) {
                companies.updateCompany(data as any);
              } else {
                companies.addCompany(data);
              }
              handleCloseModal();
            }}
            onCancel={handleCloseModal}
          />
        );

      case "customers":
        return (
          <CustomerForm
            customer={editingItem as Customer}
            onSubmit={(data) => {
              if (editingItem) {
                customers.updateCustomer(data as any);
              } else {
                customers.addCustomer(data);
              }
              handleCloseModal();
            }}
            onCancel={handleCloseModal}
          />
        );

      case "vehicles":
        return (
          <EVForm
            ev={editingItem as EVInfo}
            onSubmit={(data) => {
              if (editingItem) {
                evInfo.updateEVInfo(data);
              } else {
                evInfo.addEVInfo(data);
              }
              handleCloseModal();
            }}
            onCancel={handleCloseModal}
          />
        );

      case "charging":
        return (
          <ChargingPointForm
            chargingPoint={editingItem as ChargingPoint}
            onSubmit={(data) => {
              if (editingItem) {
                chargingPoints.updateChargingPoint(data as any);
              } else {
                chargingPoints.addChargingPoint(data);
              }
              handleCloseModal();
            }}
            onCancel={handleCloseModal}
          />
        );

      case "receipts":
        return (
          <ReceiptForm
            receipt={editingItem as Receipt}
            onSubmit={(data) => {
              if (editingItem) {
                receipts.updateReceipt(data);
              } else {
                receipts.addReceipt(data);
              }
              handleCloseModal();
            }}
            onCancel={handleCloseModal}
          />
        );
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1>⚡ EV Charging Point Manager</h1>
        <input
          type="text"
          className="search-box"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="nav-tabs">
        <button
          className={`tab-button ${activeTab === "dashboard" ? "active" : ""}`}
          onClick={() => setActiveTab("dashboard")}
        >
          📊 Dashboard
        </button>
        <button
          className={`tab-button ${activeTab === "companies" ? "active" : ""}`}
          onClick={() => setActiveTab("companies")}
        >
          🏢 Companies
        </button>
        <button
          className={`tab-button ${activeTab === "customers" ? "active" : ""}`}
          onClick={() => setActiveTab("customers")}
        >
          👥 Customers
        </button>
        <button
          className={`tab-button ${activeTab === "vehicles" ? "active" : ""}`}
          onClick={() => setActiveTab("vehicles")}
        >
          🚗 EV Info
        </button>
        <button
          className={`tab-button ${activeTab === "charging" ? "active" : ""}`}
          onClick={() => setActiveTab("charging")}
        >
          📍 Charging Points
        </button>
        <button
          className={`tab-button ${activeTab === "receipts" ? "active" : ""}`}
          onClick={() => setActiveTab("receipts")}
        >
          🧾 Receipts
        </button>
      </div>

      {renderContent()}

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit Record" : "Add New Record"}</DialogTitle>
          </DialogHeader>
          {renderForm()}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;