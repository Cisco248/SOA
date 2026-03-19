import React from "react";

interface Props {}

// class ExternalModel {
//   constructor() {}

//   /**
//    * @param {string} [model_id] - place the model class name
//    * @param {number} [order_count] - generate automatic counting
//    * @param {date} [create_date] - stamped create date
//    */
//   Open(model_id) {
//     const order_count = 0;
//     const id = document.getElementById(model_id);
//     const order_id = document.getElementById("newOrderId");
//     const time_count = document.getElementById("newDate");

//     if (id) {
//       id.classList.add("open");
//       order_count++;
//       order_id.value = "ORD-" + order_count;
//       time_count.value = new Date().toISOString().slice(0, 10);

//       console.log(id);
//     } else {
//       Error("id not found!");
//     }
//   }

//   /**
//    *
//    */
//   Close(model_id) {
//     const id = document.getElementById(model_id);
//     if (id) {
//       id.classList.remove("open");
//     } else {
//       showToast("Task is processing Please Wait!");
//     }
//   }
// }

// function openModal() {
//   document.getElementById("modal").classList.add("open");
//   document.getElementById("newOrderId").value = "ORD-" + orderCounter;
//   document.getElementById("newDate").value = new Date()
//     .toISOString()
//     .slice(0, 10);
// }

// function closeModal() {
//   document.getElementById("modal").classList.remove("open");
// }

const PopUp = (props: Props) => {
  return (
    <div id="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <span className="modal-title"> New Order</span>
          <button
            className="modal-close"
            //   onClick="closeModal()"
          >
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
                placeholder="Auto-generated"
                readOnly
              />
            </div>
            <div className="field">
              <label className="field-label">Date</label>
              <input
                className="field-input"
                id="newDate"
                type="date"
                placeholder="Add Date"
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
              />
            </div>
            <div className="field">
              <label className="field-label">Customer ID</label>
              <input
                className="field-input"
                id="newCustId"
                placeholder="e.g. C-0091"
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
              />
            </div>
            <div className="field">
              <label className="field-label">Priority</label>
              <select className="field-select" id="newPriority">
                <option value="LOW">Low</option>
                <option value="MEDIUM" selected>
                  Medium
                </option>
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
              ></textarea>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button
            className="btn btn-ghost"
            //   onClick="closeModal()"
          >
            Cancel
          </button>
          <button
            className="btn btn-primary"
            //   onClick="saveOrder()"
          >
            ⊕ Save Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopUp;
