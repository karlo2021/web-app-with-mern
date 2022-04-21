# Architecture and ESLint

In this chapter and the next, we’ll take a break from adding features. Instead, we’ll get a bit more organized in preparation for when the application grows larger and larger. 
In this chapter, we’ll look again at the architecture and make it more flexible so that it can cater to larger applications with lots of traffic. We’ll use a package called dotenv to help us run the same code on different environments using different configurations for each environment, such as development and production. 
Finally, we’ll add checks to verify that the code we write follows standards and good practices and catches possible bugs earlier in the testing cycle. We’ll use ESLint for this purpose.

## UI Server

Until now, we did not pay too much attention to the architecture of the application and the one and only
server dealt with two functions. The Express server not only serves static content, but also serves API calls. The architecture is depicted:

