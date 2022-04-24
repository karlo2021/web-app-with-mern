# Proxy Based Architecture

If you had your Network tab open in the Developer Console while testing, you would have noticed that there are two calls to /graphql instead of just one. The HTTP method for the first call is OPTIONS. The reason is that the API call is to a host (http://localhost:3000) that is different from the origin of the application (http:// localhost:8000). Due to the Same-origin policy, such requests are normally blocked by the browser unless the server specifically allows it.

The Same-origin policy exists to prevent malicious websites from gaining unauthorized access to the
application. The gist of it is that since cookies set by one origin are automatically attached with any request to that origin, it is possible that a malicious website can make a call to the origin from the browser and the browser will attach the cookie.

Say you are logged into a bank’s website. In another browser tab, you are browsing some news website
that has some malicious JavaScript running in it, maybe via an advertisement on the website. If this
malicious JavaScript makes an Ajax call to the bank’s website and the cookies are sent as part of the request, the malicious JavaScript can end up impersonating you and maybe even transferring funds to the hacker’s account!
So, browsers prevent this by requiring that such requests be explicitly permitted. The kind of requests
that can be permitted is controlled by the Same-origin policy as well as parameters controlled by the server, which determines if the request can be allowed. This mechanism is called cross-origin resource sharing or CORS for short. The Apollo GraphQL server, by default, allows unauthenticated requests across origins. The following headers in the response to the OPTIONS request shows this:

<pre>
Access-Controll-Allow-Headers: content-type
Access-Controll-Allow-Methods: GET,HEAD,PUT,PATCH,POST,DELETE
Access-Controll-Allow-Origin: *
</pre>

Let’s disable the default behavior of the Apollo server (using, of course, an environment variable) and
check out the new behavior of the API server. Let’s call this environment variable ENABLE_CORS and set the api/.env file to false (the default being true, the current behavior).

```
...
## ENABLE CORS (default: true)
ENABLE_CORS=false
...
```

Now, in server.js in the API, let’s look for this environment variable and set an option called cors to
true or false, depending on this variable. The changes to api/server.js are shown:

<pre>
...
const app = express();

<b>const enableCors = (process.env.ENABLE_CORS || 'true') == 'true';
console.log('CORS settings:', enableCors);</b>
server.applyMiddleware({ app, path: '/graphql'<b>, cors: enableCors</b> });
...
</pre>

If you test the application, you will find that the OPTION request fails with an HTTP response of 405.
Now, the application is safe from malicious cross-site attacks. But this also means that we need some other mechanism to make API calls.

![405-error](./resources/405-error.JPG)

I’ll discuss CORS in more detail and why it’s safe to enable CORS at the current stage of the application, where all resources are publicly available without authentication. But let’s also look at alternatives for the sake of security. In this section, we’ll change the UI to make even API requests to the UI server, where we will install a proxy so that any request to /graphql is routed to the API server. This new architecture is depicted in Figure 7-4.

