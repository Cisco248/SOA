package interfaces;

import javax.jws.WebMethod;
import javax.jws.WebParam;
import javax.jws.WebResult;
import javax.jws.WebService;

import model.Book;

@WebService(targetNamespace = "http://catalog.globalbooks.com/")
public interface CatalogService {

    @WebMethod(operationName = "lookupBook")
    @WebResult(name = "bookLookupResponse")
    Book lookupBook(@WebParam(name = "isbn") String isbn);
}
