package com.globalbooks.catalog.model;

public class Book {
    private String isbn;
    private String title;
    private double price;
    private int quantity;

    public Book(String isbn, String title, double price, int quantity) {
        this.isbn = isbn;
        this.title = title;
        this.price = price;
        this.quantity = quantity;
    }

    public String getIsbn() {
        return this.isbn;
    }

    public String getTitle() {
        return this.title;
    }

    public double getPrice() {
        return this.price;
    }

    public int getQuantity() {
        return this.quantity;
    }

    public String getBookAsJson() {
        return String.format("""
                {
                    "isbn": "%s",
                    "title": "%s",
                    "price": %f,
                    "quantity": %d
                }
                """, this.isbn, this.title, this.price, this.quantity);
    }
}