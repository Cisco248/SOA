package com.globalbooks.catalog;

import jakarta.xml.ws.Endpoint;

public class Main {
    public static void main(String[] args) {
        CatalogService service = new CatalogService();

        String url = "http://localhost:8080/catalog";
        Endpoint.publish(url, service);
        System.out.println("SOAP service running at " + url + "?wsdl");
    }
}