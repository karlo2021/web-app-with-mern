const continents = ['Africa','America','Asia','Australia','Europe'];

const helloContinent = Array.from(continents, c => `Hello ${c}!`);
const message = helloContinent.join(' ');

const element = (
    <div type='Outer div'>
        <h3>{message}</h3>
    </div>
);

ReactDOM.render(element, document.getElementById('context'));
