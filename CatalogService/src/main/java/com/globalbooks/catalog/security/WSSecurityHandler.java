package com.globalbooks.catalog.security;

import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import javax.xml.namespace.QName;
import javax.xml.soap.SOAPEnvelope;
import javax.xml.soap.SOAPException;
import javax.xml.soap.SOAPHeader;
import javax.xml.soap.SOAPMessage;
import javax.xml.ws.handler.MessageContext;
import javax.xml.ws.handler.soap.SOAPHandler;
import javax.xml.ws.handler.soap.SOAPMessageContext;
import javax.xml.ws.soap.SOAPFaultException;
import java.util.Set;

/**
 * A simpler interceptor to artificially enforce WS-Security UsernameToken without complex Metro configs.
 */
public class WSSecurityHandler implements SOAPHandler<SOAPMessageContext> {

    @Override
    public boolean handleMessage(SOAPMessageContext context) {
        Boolean isOutbound = (Boolean) context.get(MessageContext.MESSAGE_OUTBOUND_PROPERTY);
        
        // We only authenticate INBOUND messages
        if (!isOutbound) {
            try {
                SOAPMessage message = context.getMessage();
                SOAPEnvelope envelope = message.getSOAPPart().getEnvelope();
                SOAPHeader header = envelope.getHeader();
                
                if (header == null) {
                    throwFault("Security header is missing. Must provide WS-Security UsernameToken.");
                }
                
                // Extremely naive parsing of the Security header
                String username = extractElementValue(header, "Username");
                String password = extractElementValue(header, "Password");
                
                if (!"admin".equals(username) || !"secret123".equals(password)) {
                    throwFault("Invalid WS-Security credentials.");
                }
                
            } catch (SOAPException e) {
                throw new RuntimeException("SOAP Exception in security handler", e);
            }
        }
        return true;
    }

    private String extractElementValue(Node node, String targetNodeName) {
        NodeList childNodes = node.getChildNodes();
        for (int i = 0; i < childNodes.getLength(); i++) {
            Node child = childNodes.item(i);
            if (targetNodeName.equals(child.getLocalName())) {
                return child.getTextContent();
            }
            String value = extractElementValue(child, targetNodeName);
            if (value != null) {
                return value;
            }
        }
        return null;
    }

    private void throwFault(String reason) {
        try {
            javax.xml.soap.SOAPFactory factory = javax.xml.soap.SOAPFactory.newInstance();
            javax.xml.soap.SOAPFault fault = factory.createFault(reason, new QName("http://schemas.xmlsoap.org/soap/envelope/", "Client"));
            throw new SOAPFaultException(fault);
        } catch (SOAPException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public boolean handleFault(SOAPMessageContext context) { return true; }

    @Override
    public void close(MessageContext context) {}

    @Override
    public Set<QName> getHeaders() { return null; }
}
