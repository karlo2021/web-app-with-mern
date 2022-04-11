# designing components

Most beginners will have a bit of confusion between state and props This section is devoted to discussing some principles and best practices.

### State vs. Props

Both state and props hold model information, but they are different. The props are immutable, whereas state is not. Typically, state variables are passed down to child components as props because the children don’t maintain or modify them. They take in a read-only copy and use it only to render the view of the component. If any event in the child affects the parent’s state, the child calls a method defined in the parent. Access to this method should have been explicitly given by passing it as a callback via props.

Anything that can change due to an event anywhere in the component hierarchy qualifies as being part of the state.

Do not copy props into state, just because props are immutable. If you feel the need to do this, think of modifying the original state from which these props were derived. One exception is when props are used as initial values to the state, and the state is truly disjointed from the original state after the initialization.

<b>Attribute`                `State`                             `Props</b>
<hr>
Mutability         Can be changed using this.setState()   Cannot be changed

Ownership          Belongs to the component               Belongs to an ancestor the component gets a 
                                                          read-only copy
                                                                                
Information        Model information                      Model information

Affects            Rendering of the component             Rendering of the component


