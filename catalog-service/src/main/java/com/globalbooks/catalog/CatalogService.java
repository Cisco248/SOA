package com.globalbooks.catalog;

import jakarta.jws.WebMethod;
import jakarta.jws.WebService;
import java.util.HashMap;
import java.util.Map;

@WebService
public class CatalogService {

    private static final Map<String, String> books = new HashMap<>();

    static {
        books.put("111", "Clean Code - ");
        books.put("222", "Atomic Habits - ");
        books.put("333", "Design Patterns - ");
    }

    // public void addBook(String isbn, String name, Number price) {
    //     if (isbn == null || isbn.isEmpty()) throw new Error("ISBN is required");
    //     if (name == null || name.isEmpty()) throw new Error("Name is required");
    //     if (price == null || price.floatValue() == 0) throw new Error("Price is required");

    //     books.put(isbn, name);
    // }

    @WebMethod
    public String getBook(String isbn) {
        if (isbn == null || isbn.isEmpty()) {
            return "Error: ISBN cannot be empty";
        }

        String book = books.get(isbn);

        if (book == null) {
            return "Error: Book not found";
        }

        return "Book: " + book + " | ISBN: " + isbn;
    }

    @WebMethod
    public String getPrice(String isbn) {
        if (isbn == null || isbn.isEmpty()) {
            return "Error: ISBN cannot be empty";
        }

        Object book = books.get(isbn);

        if (book == null) {
            return "Error: Book not found";
        }

        return "Book" + book;
    }
}