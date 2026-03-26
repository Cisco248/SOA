package com.globalbooks.catalog;

import jakarta.jws.WebMethod;
import jakarta.jws.WebService;
import java.util.HashMap;
import java.util.Map;

import com.globalbooks.catalog.model.Book;

@WebService
public class CatalogService {

    private static final Map<String, Book> books = new HashMap<>();

    @WebMethod
    public void addBook(Book book) {
        if (book.getIsbn() == null || book.getIsbn().isEmpty())
            throw new Error("ISBN is required");
        if (book.getTitle() == null || book.getTitle().isEmpty())
            throw new Error("Name is required");
        if (book.getPrice() == 0)
            throw new Error("Price is required");

        books.put(book.getIsbn(), book);
    }

    @WebMethod
    public String getBook(String isbn) {
        if (isbn == null || isbn.isEmpty()) {
            return "Error: ISBN cannot be empty";
        }

        Book book = books.get(isbn);

        if (book == null) {
            return "Error: Book not found for ISBN " + isbn;
        }

        String details = book.getBookAsJson();
        return details;
    }

    @WebMethod
    public String getPrice(String isbn) {
        if (isbn == null || isbn.isEmpty()) {
            return "Error: ISBN cannot be empty";
        }

        Book book = books.get(isbn);

        if (book == null) {
            return "Error: Book not found";
        }

        return "Price: " + book.getPrice();
    }
}