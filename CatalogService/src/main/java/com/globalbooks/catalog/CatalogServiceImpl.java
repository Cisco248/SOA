package com.globalbooks.catalog;

import javax.jws.HandlerChain;
import javax.jws.WebService;
import java.util.HashMap;
import java.util.Map;

@WebService(
    endpointInterface = "com.globalbooks.catalog.CatalogService",
    portName = "CatalogPort",
    serviceName = "CatalogService",
    targetNamespace = "http://catalog.globalbooks.com/"
)
@HandlerChain(file = "handlers.xml")
public class CatalogServiceImpl implements CatalogService {

    private static final Map<String, Book> mockDatabase = new HashMap<>();

    static {
        // Mock inventory entries mapping ISBN to Book specs
        mockDatabase.put("978-0134685991", new Book("Effective Java", 45.00, 150));
        mockDatabase.put("978-0321125217", new Book("Domain-Driven Design", 55.00, 42));
        mockDatabase.put("978-0132350884", new Book("Clean Code", 40.00, 300));
        mockDatabase.put("111-2223334445", new Book("SOA Principles", 65.50, 10));
    }

    @Override
    public Book lookupBook(String isbn) {
        if (isbn == null || !mockDatabase.containsKey(isbn)) {
            // Returns an empty default or handles missing in a primitive way
            return new Book("Unknown Title", 0.0, 0);
        }
        return mockDatabase.get(isbn);
    }
}
