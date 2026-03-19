import { filterOrders } from "../helpers/filter.js";
import { orders } from "../repository/order.mjs";
import { showToast } from "../helpers/toast.mjs";

function saveOrder() {
    const customer = document.getElementById("newCustomer").value.trim();
    const product = document.getElementById("newProduct").value.trim();
    const amount =
        parseFloat(document.getElementById("newAmount").value) || 0;
    const priority = document.getElementById("newPriority").value;
    const date = document.getElementById("newDate").value;

    if (!customer || !product) {
        showToast("⚠ CUSTOMER AND PRODUCT REQUIRED", "red");
        return;
    }

    const newOrder = {
        id: "ORD-" + orderCounter++,
        customer,
        product,
        date,
        amount,
        status: "PENDING",
        priority,
        urgent: priority === "HIGH",
    };

    orders.unshift(newOrder);
    renderOrders(orders);
    closeModal();
    showToast("✔ ORDER " + newOrder.id + " CREATED");

    Reset
    [
        "newCustomer",
        "newCustId",
        "newProduct",
        "newAmount",
        "newNotes",
    ].forEach((id) => (document.getElementById(id).value = ""));
}

function viewOrder(id) {
    showToast("◉ VIEWING ORDER " + id);
}

function editOrder(id) {
    showToast("✎ EDIT ORDER " + id + " — COMING SOON");
}

function cancelOrder(id) {
    const o = orders.find((x) => x.id === id);
    if (o) {
        o.status = "CANCELLED";
        o.urgent = false;
    }
    filterOrders();
    showToast("✕ ORDER " + id + " CANCELLED", "red");
}
