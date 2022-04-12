# REST Api

REST (short for representational state transfer) is an architectural pattern for application programming interfaces (APIs). There are other older patterns such as SOAP and XMLRPC, but of late, the REST pattern has gained popularity.

### Resource Based 

The APIs are resource based (as opposed to action based). Thus, API names like getSomething or saveSomething are not normal in REST APIs. In fact, there are no API names in the conventional sense, because APIs are formed by a combination of resources and actions. There are really only resource names
called endpoints.<br/>
Resources are accessed based on a Uniform Resource Identifier (URI), also known as an endpoint. Resources are nouns (not verbs). You typically use two URIs per resource: one for the collection (like /customers) and one for an individual object (like /customers/1234), where 1234 uniquely identifies a customer.
Resources can also form a hierarchy. For example, the collection of orders of a customer is identified by /customers/1234/orders, and an order of that customer is identified by /customers/1234/orders/43.

### HTTP Methods as Actions
To access and manipulate the resources, you use HTTP methods. While resources were nouns, the HTTP methods are verbs that operate on them. They map to CRUD (Create, Read, Update, Delete) operations on the resource. Table 5-1 shows commonly used mapping of CRUD operations to HTTP methods and resources.

<pre>
<b>Operation    Method     Resource    Example             Remarks</b>
<hr>
Read – List      GET     Collection   GET /customers      Lists objects (additional query
                                                          string can be used for filtering and
                                                          sorting)
Read             GET        Object    GET/customers/1234  Returns a single object (query string
                                                          may be used to specify which fields)
Create           POST     Collection  POST /customers     Creates an object with the values
                                                          specified in the body                                     
Update           PUT      Object      PUT /               Replaces the object with the one
                                      customers/1234      specified in the body     
Update           PATCH    Object      PATCH /             Modifies some properties of the
                                      customers/1234      object, as specified in the body 
Delete           DELETE   Object      DELETE /            Deletes the object
                                      customers/1234
<hr>
</pre>

Some other operations such as DELETE and PUT in the collection may also be used to delete and modify the entire collection in one shot, but this is not common usage. HEAD and OPTIONS are also valid verbs that give out information about the resources rather than actual data. They are used mainly for APIs that are externally exposed and consumed by many different clients.<br />

•	 Filtering, sorting, and paginating a list of objects. The query string is commonly used in an implementation-specific way to specify these.<br/>
•	 Specifying which fields to return in a READ operation.<br/>
•	 If there are embedded objects, specifying which of those to expand in a READ operation.<br/>
•	 Specifying which fields to modify in a PATCH operation.<br/>
•	 Representation of objects. You are free to use JSON, XML, or any other representation for the objects in both READ and WRITE operations.<br/>
