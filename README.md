# designing components

Most beginners will have a bit of confusion between state and props This section is devoted to discussing some principles and best practices.

### State vs. Props

Both state and props hold model information, but they are different. The props are immutable, whereas state is not. Typically, state variables are passed down to child components as props because the children don’t maintain or modify them. They take in a read-only copy and use it only to render the view of the component. If any event in the child affects the parent’s state, the child calls a method defined in the parent. Access to this method should have been explicitly given by passing it as a callback via props.

Anything that can change due to an event anywhere in the component hierarchy qualifies as being part of the state.

Do not copy props into state, just because props are immutable. If you feel the need to do this, think of modifying the original state from which these props were derived. One exception is when props are used as initial values to the state, and the state is truly disjointed from the original state after the initialization.
<pre>
<b>Attribute                State                             Props</b>

Mutability         Can be changed using this.setState()   Cannot be changed

Ownership          Belongs to the component               Belongs to an ancestor the component gets a 
                                                          read-only copy
                                                                                
Information        Model information                      Model information

Affects            Rendering of the component             Rendering of the component

</pre>

### Component Hierarchy

Split the application into components and subcomponents. Decide on the granularity just as you would for splitting functions and objects. The component should
be self-contained with minimal and logical interfaces to the parent. If you find it doing too many things, just like in functions, it should probably be split into multiple components, so that it follows the Single Responsibility principle. If you are passing in too many props to a component, it is an indication that either the component needs to be split, or it need not exist: the parent itself could do the job.

### Communication

Communication between components depends on the direction. Parents communicate to children via props; when state changes, the props automatically change. Children communicate to parents via callbacks. Siblings and cousins can’t communicate with each other, so if there is a need, the information has to go up the hierarchy and then back down. This is called lifting the state up. This is what we did when we dealt with adding a new issue.

If there is a need to know the state of a child in a parent, you’re probably doing it wrong. Although React does offer a way using refs, you shouldn’t feel the need if you follow the one-way data flow strictly: state flows as props into children, events cause state changes, which flows back as props.

### Stateless Components

In a well-designed application, most components would be stateless functions of their properties. All states would be captured in a few components at the top of the hierarchy, from where the props of all the descendants are derived.
We did just that with the IssueList, where we kept the state. We converted all descendent components to stateless components, relying only on props passed down the hierarchy to render themselves.
 Sometimes, you may find that there is no logical common ancestor. In such cases, you may have to invent a new component just to hold the state, even though visually the component has nothing.
 
 ## Summary
 
 In this chapter, you learned how to use state and make changes to it on user interactions or other events. The more interesting aspect was how state values are propagated down the component hierarchy as props. You also had a glimpse of user interaction: the click of a button to add a new issue, and how that causes the state
to change, and in turn, how the props in the descendant components changed, causing them to rerender as well. Further, you learned how a child can communicate with its parent via callbacks. <br />
 We used simulated asynchronous calls and data local to the browser to achieve all this. In the next chapter, instead of using local data, we’ll fetch the data from the server. When an issue is added, we’ll send the data to the server to persist it.
