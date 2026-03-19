# WSDL & UDDI Documentation

## GlobalBooks Inc. SOA Transition

### 1. WSDL Excerpt for CatalogService

```xml
<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http:schemas.xmlsoap.org/wsdl/"
             xmlns:soap="http:schemas.xmlsoap.org/wsdl/soap/"
             xmlns:tns="http:catalog.globalbooks.com/"
             xmlns:xsd="http:www.w3.org/2001/XMLSchema"
             targetNamespace="http:catalog.globalbooks.com/"
             name="CatalogService">

    <!-- 1. Types -->
    <types>
        <xsd:schema targetNamespace="http:catalog.globalbooks.com/">
            <xsd:element name="bookLookupRequest">
                <xsd:complexType>
                    <xsd:sequence>
                        <xsd:element name="isbn" type="xsd:string"/>
                    </xsd:sequence>
                </xsd:complexType>
            </xsd:element>
            <xsd:element name="bookLookupResponse">
                <xsd:complexType>
                    <xsd:sequence>
                        <xsd:element name="title" type="xsd:string"/>
                        <xsd:element name="price" type="xsd:double"/>
                        <xsd:element name="stock" type="xsd:int"/>
                    </xsd:sequence>
                </xsd:complexType>
            </xsd:element>
        </xsd:schema>
    </types>

    <!-- 2. Messages -->
    <message name="lookupBookInput">
        <part name="parameters" element="tns:bookLookupRequest"/>
    </message>
    <message name="lookupBookOutput">
        <part name="parameters" element="tns:bookLookupResponse"/>
    </message>

    <!-- 3. Port Type (Operations) -->
    <portType name="CatalogPortType">
        <operation name="lookupBook">
            <input message="tns:lookupBookInput"/>
            <output message="tns:lookupBookOutput"/>
        </operation>
    </portType>

    <!-- 4. Binding -->
    <binding name="CatalogSOAPBinding" type="tns:CatalogPortType">
        <soap:binding style="document" transport="http:schemas.xmlsoap.org/soap/http"/>
        <operation name="lookupBook">
            <soap:operation soapAction="http:catalog.globalbooks.com/lookupBook"/>
            <input>
                <soap:body use="literal"/>
            </input>
            <output>
                <soap:body use="literal"/>
            </output>
        </operation>
    </binding>

    <!-- 5. Service Endpoint -->
    <service name="CatalogService">
        <port name="CatalogPort" binding="tns:CatalogSOAPBinding">
            <soap:address location="http:localhost:8080/CatalogService/lookup"/>
        </port>
    </service>
</definitions>
```

### 2. UDDI Registry Metadata Entry

```xml
<businessEntity businessKey="urn:uuid:6a12bd22-921d-4eb4-b816-4f4c49d863e4">
    <name>GlobalBooks Inc.</name>
    <description>Global online bookstore expanding internationally.</description>
    
    <businessServices>
        <businessService serviceKey="urn:uuid:c8f8b0fa-d232-4d2c-8ff5-a13a48e7e1f9">
            <name>CatalogService</name>
            <description>Provides book lookup and price information.</description>
            
            <bindingTemplates>
                <bindingTemplate bindingKey="urn:uuid:14a6ee22-94b2-4d0f-8c38-89bd24dd585c">
                    <description>SOAP over HTTP endpoint for CatalogService.</description>
                    <accessPoint useType="endpoint">
                        http:localhost:8080/CatalogService/lookup
                    </accessPoint>
                    
                    <tModelInstanceDetails>
                        <!-- Reference to the WSDL -->
                        <tModelInstanceInfo tModelKey="urn:uuid:a14e6b12-9c1a-4c9f-818b-8df7d9d71c14">
                            <instanceDetails>
                                <overviewDoc>
                                    <overviewURL useType="wsdlInterface">
                                        http:localhost:8080/CatalogService/lookup?wsdl
                                    </overviewURL>
                                </overviewDoc>
                            </instanceDetails>
                        </tModelInstanceInfo>
                    </tModelInstanceDetails>
                    
                </bindingTemplate>
            </bindingTemplates>
            
        </businessService>
    </businessServices>
</businessEntity>
```
