package com.globalbooks.catalog;

import javax.jws.WebMethod;
import javax.jws.WebParam;
import javax.jws.WebResult;
import javax.jws.WebService;

@WebService(targetNamespace = "http://catalog.globalbooks.com/")
public interface CatalogService {

    @WebMethod(operationName = "lookupBook")
    @WebResult(name = "bookLookupResponse")
    Book lookupBook(@WebParam(name = "isbn") String isbn);
}
