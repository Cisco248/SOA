import { useState } from "react";
import { Order } from "../constants/constant";
import "./_popup.scss";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (order: Order) => void;
  nextId: string;
}

const PopUp = ({ onClose, onSubmit, nextId }: Props) => {
  const [formData, setFormData] = useState({
    customer: "",
    custId: "",
    product: "",
    amount: "",
    priority: "MEDIUM" as Order["priority"],
    notes: "",
    date: new Date().toISOString().slice(0, 10),
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { id, value } = e.target;
    const keyMap: Record<string, string> = {
      newCustomer: "customer",
      newCustId: "custId",
      newProduct: "product",
      newAmount: "amount",
      newPriority: "priority",
      newNotes: "notes",
      newDate: "date",
    };

    const key = keyMap[id];
    if (key) {
      setFormData((prev) => ({ ...prev, [key]: value }));
    }
  };

  const handleSubmit = () => {
    if (!formData.customer || !formData.product) {
      alert("Customer and Product are required!");
      return;
    }

    const newOrder: Order = {
      id: nextId,
      customer: formData.customer,
      product: formData.product,
      date: formData.date,
      amount: parseFloat(formData.amount) || 0,
      status: "PENDING",
      priority: formData.priority,
      urgent: formData.priority === "HIGH",
    };

    onSubmit(newOrder);
  };

  return (
    <div
      id="modal-overlay"
      className="open"
      onClick={(e) => {
        if ((e.target as HTMLElement).id === "modal-overlay") onClose();
      }}
    >
      <div className="modal">
        <div className="modal-header">
          <span className="modal-title"> New Order</span>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="modal-body">
          <div className="form-row">
            <div className="field">
              <label className="field-label">Order ID</label>
              <input
                className="field-input"
                id="newOrderId"
                value={nextId}
                readOnly
              />
            </div>
            <div className="field">
              <label className="field-label">Date</label>
              <input
                className="field-input"
                id="newDate"
                type="date"
                value={formData.date}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="field">
              <label className="field-label">Customer Name</label>
              <input
                className="field-input"
                id="newCustomer"
                placeholder="Full name"
                value={formData.customer}
                onChange={handleChange}
              />
            </div>
            <div className="field">
              <label className="field-label">Customer ID</label>
              <input
                className="field-input"
                id="newCustId"
                placeholder="e.g. C-0091"
                value={formData.custId}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-row single">
            <div className="field">
              <label className="field-label">Product / Description</label>
              <input
                className="field-input"
                id="newProduct"
                placeholder="Product name or SKU"
                value={formData.product}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="field">
              <label className="field-label">Amount ($)</label>
              <input
                className="field-input"
                id="newAmount"
                type="number"
                placeholder="0.00"
                value={formData.amount}
                onChange={handleChange}
              />
            </div>
            <div className="field">
              <label className="field-label">Priority</label>
              <select
                className="field-select"
                id="newPriority"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
          </div>
          <div className="form-row single">
            <div className="field">
              <label className="field-label">Notes</label>
              <textarea
                className="field-textarea"
                id="newNotes"
                placeholder="Order notes or special instructions..."
                value={formData.notes}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSubmit}>
            ⊕ Save Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopUp;
