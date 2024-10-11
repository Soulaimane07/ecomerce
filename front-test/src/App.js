import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';

function App() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3005/products')
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);


  const Checkout = async (product) => {
    const stripe = await loadStripe("pk_test_51Q8qAoJ2dBuX1qSzZIuQ2vlF38gmOEpXlX2OP13d7ywhEnLE57JRZcbaBGESvhqyCXwxnmZee6e4XntfBSTmo80x00oPfJgyfM");

    const headers = { "Content-Type": "application/json" };

    const response = await fetch('http://localhost:3005/checkout', {
      method: "POST",
      headers: headers,
      body: JSON.stringify({...product, quantity: 2}) 
    });

    const session = await response.json();

    const result = await stripe.redirectToCheckout({
      sessionId: session.id
    });

    if (result.error) {
      console.log(result.error);
    }
  };

  return (
    <div className="App">
      <h1>Products</h1>

      {products.map((item, key) => (
        <div key={key}>
          <img className='image' src={`http://localhost:3005/${item.image}`} alt={item.title} />
          <h2>{item.title}</h2>
          <p>Price: ${item.price}</p>
          <button onClick={()=> Checkout(item)}>Checkout</button>
        </div>
      ))}
    </div>
  );
}

export default App;
