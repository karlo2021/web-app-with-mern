"use strict";

var continents = ['Africa', 'America', 'Asia', 'Australia', 'Europe'];
var helloContinent = Array.from(continents, function (c) {
  return "Hello ".concat(c, "!");
});
var message = helloContinent.join(' ');
var element = /*#__PURE__*/React.createElement("div", {
  type: "Outer div"
}, /*#__PURE__*/React.createElement("h3", null, message));
ReactDOM.render(element, document.getElementById('context'));