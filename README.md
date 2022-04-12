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
<b>Operation    Method     Resource    Example         Remarks</b>
<hr>
Read – List      GET     Collection   GET /customers  Lists objects (additional query
                                                      string can be used for filtering and
                                                      sorting)
                                                      
</pre>
