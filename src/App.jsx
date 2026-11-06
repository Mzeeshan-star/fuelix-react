import React, { useEffect, useRef, useState } from 'react';
import Storefront from './components/Storefront';
import { initChocolate } from './chocolate';

const flavours = [
  { name: 'Chocolate Crunch', color: '#ff5a19', label: 'THE ORIGINAL', description: 'Deep cocoa flavour meets crisp, golden bites. A chocolate-forward concept for your post-workout pause.' },
  { name: 'Peanut Butter', color: '#cbd768', label: 'THE SMOOTH OPERATOR', description: 'Roasted peanut character and a smooth centre. A nutty concept for days that ask a little more.' },
  { name: 'Cookies & Cream', color: '#bca0d3', label: 'THE CROWD FAVOURITE', description: 'Cookie-inspired crunch and a creamy vanilla-style centre. A playful concept for your everyday routine.' },
];
const PRICE = 450;
function initialCart() {
  try {
    const saved = JSON.parse(localStorage.getItem('fuelixBag') || '[0,0,0]');
    if (Array.isArray(saved) && saved.length === 3 && saved.every(n => Number.isInteger(n) && n >= 0 && n <= 99)) return saved;
  } catch { /* Start empty if browser storage is unavailable. */ }
  return [0, 0, 0];
}
export default function App() {
  const [selected, setSelected] = useState(0);
  const [cart, setCart] = useState(initialCart);
  const [bagOpen, setBagOpen] = useState(false);
  const [detail, setDetail] = useState(null);
  const [toast, setToast] = useState('');
  const [receipt, setReceipt] = useState(null);
  const bagRef = useRef(null), detailRef = useRef(null);
  const count = cart.reduce((a, b) => a + b, 0);
  const selectFlavour = index => setSelected(index);
  useEffect(() => {
    document.documentElement.style.setProperty('--accent', flavours[selected].color);
    window.fuelixFlavour = selected;
    window.dispatchEvent(new CustomEvent('flavourchange', { detail: selected }));
  }, [selected]);
  useEffect(() => { try { localStorage.setItem('fuelixBag', JSON.stringify(cart)); } catch {} }, [cart]);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(''), 2200);
    return () => clearTimeout(timer);
  }, [toast]);
  useEffect(() => {
    const cleanup = initChocolate();
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('shown'); observer.unobserve(entry.target); }
    }), { threshold: .12 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    const hero = document.querySelector('.hero'), product = document.querySelector('#product');
    const move = e => { if (!matchMedia('(prefers-reduced-motion: reduce)').matches) product.style.transform = `rotateY(${(e.clientX / innerWidth - .5) * 18}deg) rotateX(${-(e.clientY / innerHeight - .5) * 12}deg)`; };
    const leave = () => product.style.transform = 'none';
    hero.addEventListener('pointermove', move); hero.addEventListener('pointerleave', leave);
    return () => { cleanup?.(); observer.disconnect(); hero.removeEventListener('pointermove', move); hero.removeEventListener('pointerleave', leave); };
  }, []);
  useEffect(() => {
    const active = bagOpen ? bagRef.current : detail !== null ? detailRef.current : null;
    if (!active) return;
    const previous = document.activeElement;
    active.querySelector('button')?.focus();
    const keydown = e => {
      if (e.key === 'Escape') { setBagOpen(false); setDetail(null); }
      if (e.key === 'Tab') {
        const controls = [...active.querySelectorAll('button:not(:disabled), a[href], input:not(:disabled)')];
        const first = controls[0], last = controls.at(-1);
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
        if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener('keydown', keydown);
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', keydown); document.body.style.overflow = oldOverflow; previous?.focus(); };
  }, [bagOpen, detail]);
  const changeQuantity = (i, delta) => setCart(previous => previous.map((n, j) => j === i ? Math.min(99, Math.max(0, n + delta)) : n));
  const add = i => { changeQuantity(i, 1); setSelected(i); setReceipt(null); setToast(flavours[i].name + ' added to bag'); };
  const completeDemo = () => { if (!count) return; setReceipt({ count, total: count * PRICE }); setCart([0, 0, 0]); };
  function Flavours() {
    return <section className="flavours" id="flavours">
      <div className="section-top"><div><div className="eyebrow">Choose your obsession</div><h2>THREE FLAVOURS.<br />ZERO BORING.</h2></div><p className="muted">Your gym bag’s newest essential.<br />Pick a flavour. Make your next move.</p></div>
      <div className="flavour-grid">{flavours.map((flavour, i) => <article className={`card ${selected === i ? 'active' : ''}`} key={flavour.name}>
        <div className="card-art" style={{ background: ['#e1dacf', '#dfdac3', '#d8d3df'][i] }}><div className="mini" style={{ '--c': flavour.color }}><strong>FUELIX</strong></div></div>
        <div className="card-label">0{i + 1} / {flavour.label}</div><h3>{flavour.name}</h3>
        <div className="card-bottom"><span>Rs. {PRICE}* / bar</span><button className="add" onClick={() => add(i)}>ADD TO BAG +</button></div>
        <button className="detail-btn" onClick={() => { setSelected(i); setDetail(i); }}>EXPLORE FLAVOUR ↗</button>
      </article>)}</div>
      <p className="concept">*Concept store. Prices, pack weights and product details are illustrative. No payment or real orders.</p>
    </section>;
  }
  return <>
    <Storefront count={count} setBagOpen={setBagOpen} selectFlavour={selectFlavour} flavours={flavours} selected={selected} Flavours={Flavours} />
    {bagOpen && <div className="modal-backdrop" onClick={() => setBagOpen(false)}>
      <aside className="drawer open" ref={bagRef} role="dialog" aria-modal="true" aria-label="Shopping bag" onClick={e => e.stopPropagation()}>
        <button className="close" aria-label="Close bag" onClick={() => setBagOpen(false)}>×</button><h2>YOUR FUEL.</h2>
        {count ? cart.map((quantity, i) => quantity > 0 && <div className="cart-row" key={flavours[i].name}><div>{flavours[i].name}<br /><small>Rs. {PRICE} / bar</small><div className="qty"><button onClick={() => changeQuantity(i, -1)} aria-label={`Decrease ${flavours[i].name} quantity`}>−</button><span>{quantity}</span><button onClick={() => changeQuantity(i, 1)} aria-label={`Increase ${flavours[i].name} quantity`}>+</button></div></div><strong>Rs. {quantity * PRICE}</strong></div>) : <p>Your bag is waiting for its first flavour.</p>}
        <p>Demo total: Rs. {count * PRICE}</p><div className="cart-actions"><button className="cta" disabled={!count} onClick={completeDemo}>Complete demo order ↗</button><button className="add" disabled={!count} onClick={() => { setCart([0, 0, 0]); setReceipt(null); }}>Clear bag</button></div>
        {receipt && <p className="order-message" role="status">Demo complete ✓<br />{receipt.count} bar(s) · Rs. {receipt.total}<br />No payment was taken. No real order was placed.</p>}
        <p className="muted">Demo only. No payment, delivery or real order.</p><button className="cta" onClick={() => setBagOpen(false)}>Keep exploring ↗</button>
      </aside></div>}
    {detail !== null && <div className="modal-backdrop centered" onClick={() => setDetail(null)}><section className="details" role="dialog" aria-modal="true" aria-label="Flavour details" ref={detailRef} onClick={e => e.stopPropagation()}>
      <button className="close" aria-label="Close flavour details" onClick={() => setDetail(null)}>×</button><div className="eyebrow">Get to know your fuel</div><h2>{flavours[detail].name}</h2><p className="muted">{flavours[detail].description}</p><p className="muted">Illustrative 60g bar · Rs. {PRICE}<br />Concept formulation. Final nutrition and allergen information are not available.</p><button className="cta" onClick={() => { add(detail); setDetail(null); setBagOpen(true); }}>Add to bag +</button>
    </section></div>}
    <div className={`toast ${toast ? 'show' : ''}`} role="status">{toast}</div>
  </>;
}
