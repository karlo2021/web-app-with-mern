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

## GraphQL

shortcomings of REST Api discussed previously have made it hard to use it when different clients access the same set of APIs. For example, how an object is
displayed in a mobile application and the same is displayed in a desktop browser can be quite different, and therefore, a more granular control as well as aggregation of different resources may work better. GraphQL was developed to address just these concerns.<br /> 
As a result, GraphQL is a far more elaborate specification, with the following salient features.

### Field Specification

Unlike REST APIs, where you have little control on what the server returns as part of an object, in GraphQL, the properties of an object that need to be returned must be specified. Specifying no fields of an object would, in a REST API, return the entire object. In contrast, in a GraphQL query, it is invalid to request nothing.<br/>
This lets the client control the amount of data that is transferred over the network, making it more efficient, especially for lighter front-ends such as mobile applications.

### Graph Based

REST APIs were resource based, whereas GraphQL is graph based. This means that relationships between objects are naturally handled in GraphQL APIs.
In the Issue Tracker application, you could think of Issues and Users having a relation: An issue is assigned to a user, and a user has one or more issues assigned to them. When querying for a user’s properties, GraphQL makes it natural to query for some properties associated with all the issues assigned to them as well.

### Single Endpoint

GraphQL API servers have a single endpoint in contrast to one endpoint per resource in REST. The name of the resource(s) or field(s) being accessed is supplied as part of the query itself. <br />
This makes it possible to use a single query for all the data that is required by a client. Due to the graph-based nature of the query, all related objects can be retrieved as part of a query for one object. Not only that, even unrelated objects can be queried in a single call to the API server. This obviates the need for
"aggregation" services whose job was to put together multiple API results into one bundle.

### Strongly Typed

GraphQL is a strongly typed query language. All fields and arguments have a type against which both queries and results can be validated and give descriptive error messages. In addition to types, it is also possible to specify which fields and arguments are required and which others are optional. All this is done using the
GraphQL schema language.<br />
The advantage of a strongly typed system is that it prevents errors. It supports the basic scalar types such as integer and string, objects composed of these
basic data types, and custom scalar types and enumerations.

### Introspection

A GraphQL server can be queried for the types it supports. This creates a powerful platform for tools and client software to build atop this information. We will be using one such tool, called the Apollo Playground, to test our APIs before integrating them into the application’s UI.

### Libraries

Parsing and dealing with the type system language (also called the GraphQL Schema Language) as well as the query language is hard to do on your own. Fortunately, there are tools and libraries available in most languages for this purpose.<br />
But these are very basic tools that lack some advanced support such as modularized schemas and seamless handling of custom scalar types. The package graphql-tools and the related apollo-server are built on top of GraphQL.js to add these advanced features. We will be using the advanced packages for the Issue Tracker application in this chapter For JavaScript on the back-end, there is a reference implementation of GraphQL called GraphQL.js. To tie this to Express and enable HTTP requests to be the transport mechanism for the API calls, there is a package called express-graphql. <br/>
For advanced features that you may need in your own specific application, do refer to the complete documentation of GraphQL at https://graphql.org and the tools at https://www.apollographql.com/docs/graphql-tools/.
