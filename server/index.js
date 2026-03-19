import { OrderService } from "./server/src/oder_service.mjs";
import { OrderModel } from "./server/src/model/order.js";
import express from 'express'

const app = express();
const port = 4000;

const o = new OrderService()

o.addOrder(1111, "john", "param1")
o.addOrder(2222, "doe", "param2")
o.addOrder(3333, "max", "param3")

let newer = o.addOrder(4444, "min", "param3")


let order_list = o.getAllOrders()

app.post("/add-order", (res, req) => {
    res.get().json(newer)
})

app.get("/order", (req, res) => {
    res.set().json({
        id: order_list[0][1].order_id,
        name: order_list[0][1].order_name,
    })
})

app.get('/', (req, res) => {
    const code = res.statusCode;
    res.send(`
        <div style="
            display: flex; 
            flex-direction: column; 
            justify-content: center; 
            align-items: center; 
            height: 100vh; 
            font-family: sans-serif;
        ">
            <h2 style="color: ${code >= 400 ? 'red' : 'green'};">Status Code: ${code}</h2>
            <h2>Message: ${code >= 400 ? `Application Error: ${res.statusMessage || 'Internal Server Error'}` : 'Server Running!'}</h2>
        </div>
    `);
});

app.listen(port, () => {
    console.log(`Server running at http:localhost:${port}`);
});