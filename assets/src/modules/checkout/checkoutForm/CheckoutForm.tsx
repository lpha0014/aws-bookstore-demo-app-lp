import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { get, post } from 'aws-amplify/api';
import './checkoutForm.css';
import supportedCards from '../../../images/supportedCards.png';

export function CheckoutForm() {
  const [card, setCard] = useState('1010101010101010');
  const [expDate, setExpDate] = useState('');
  const [ccv, setCcv] = useState('123');
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await get({ apiName: 'cart', path: '/cart' }).response;
        setOrders(await res.body.json() as any || []);
      } catch (e) { alert(e); }
      setIsLoading(false);
    })();
  }, []);

  const orderTotal = orders.reduce((t, b) => t + b.price * b.quantity, 0).toFixed(2);

  const onCheckout = async () => {
    await post({ apiName: 'orders', path: '/orders', options: { body: { books: orders } } }).response;
    navigate('/checkout-confirm');
  };

  if (isLoading) return null;

  return (
    <div className="well-bs col-md-12 full-page no-padding-top">
      <div className="white-box no-margin-top">
        <div className="checkout">
          <img src={supportedCards} alt="Supported cards" />
          <Form>
            <Form.Group controlId="card" className="mb-3">
              <Form.Label>Card number</Form.Label>
              <Form.Control type="text" value={card} onChange={(e) => setCard(e.target.value)} />
            </Form.Group>
            <div className="form-row">
              <Form.Group controlId="expDate" className="mb-3">
                <Form.Label>Expiration date</Form.Label>
                <Form.Control type="date" value={expDate} onChange={(e) => setExpDate(e.target.value)} />
              </Form.Group>
              <Form.Group controlId="ccv" className="mb-3">
                <Form.Label>CCV</Form.Label>
                <Form.Control type="text" value={ccv} onChange={(e) => setCcv(e.target.value)} />
              </Form.Group>
            </div>
          </Form>
        </div>
      </div>
      <div className="float-end">
        <Button variant="dark" onClick={onCheckout}>{`Pay ($${orderTotal})`}</Button>
      </div>
    </div>
  );
}

export default CheckoutForm;
