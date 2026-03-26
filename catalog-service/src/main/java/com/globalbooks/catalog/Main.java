package com.globalbooks.catalog;

import com.globalbooks.catalog.model.Book;

import jakarta.xml.ws.Endpoint;

public class Main {
    public static void main(String[] args) {
        CatalogService service = new CatalogService();

        Book book1 = new Book("978-0134685991", "Effective Java", 45.50, 4);
        Book book2 = new Book("978-0132350884", "Clean Code", 38.99, 10);
        Book book3 = new Book("978-0201633610", "Design Patterns", 54.20, 2);

        service.addBook(book1);
        service.addBook(book2);
        service.addBook(book3);

        String url = "http://localhost:8080/api/v1/book-catalog";
        Endpoint.publish(url, service);
        System.out.println("SOAP service running at " + url + "?wsdl");
    }
}