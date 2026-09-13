import { type FormEvent, type ReactNode, useMemo, useState } from 'react';
import {
  ArrowRight,
  AudioLines,
  Check,
  CircleUserRound,
  Clock3,
  Gamepad2,
  Headphones,
  Heart,
  Laptop,
  Mail,
  MapPin,
  Menu,
  Minus,
  Phone,
  Plus,
  Search,
  Send,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Star,
  Trash2,
  Truck,
  Wrench,
  X,
} from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Link, Route, Switch, useLocation } from 'wouter';

type Category = 'Phones' | 'Laptops' | 'Audio' | 'Gaming' | 'Smart home';
type ProductArt = 'phone' | 'laptop' | 'headphones' | 'console' | 'speaker';
type Product = {
  id: string;
  name: string;
  category: Category;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  blurb: string;
  art: ProductArt;
  badge?: string;
  color: string;
  specs: string[];
};
type CartItem = { product: Product; quantity: number };

const products: Product[] = [
  { id: 'pixel-9a', name: 'Google Pixel 9a', category: 'Phones', price: 399, oldPrice: 449, rating: 4.8, reviews: 128, blurb: 'The easy-to-love phone with a brilliant camera.', art: 'phone', badge: 'Hot right now', color: 'coral', specs: ['6.3" OLED display', 'Tensor G4 processor', 'All-day battery'] },
  { id: 'k-air-14', name: 'K-Air 14 Laptop', category: 'Laptops', price: 749, rating: 4.7, reviews: 86, blurb: 'Light on your lap. Serious about getting things done.', art: 'laptop', badge: 'K-Tech pick', color: 'mint', specs: ['14" 2.8K display', '16GB RAM / 512GB SSD', 'Up to 14 hours battery'] },
  { id: 'sony-ult', name: 'Sony ULT WEAR', category: 'Audio', price: 129, oldPrice: 159, rating: 4.6, reviews: 211, blurb: 'Big bass, soft cushions, no airport drama.', art: 'headphones', badge: 'Save £30', color: 'sand', specs: ['Noise cancelling', '30-hour battery', 'Multipoint Bluetooth'] },
  { id: 'switch-oled', name: 'Nintendo Switch OLED', category: 'Gaming', price: 299, rating: 4.9, reviews: 304, blurb: 'The living room console that goes wherever you do.', art: 'console', color: 'blue', specs: ['7" OLED screen', '64GB internal storage', 'Handheld and TV modes'] },
  { id: 'nest-mini', name: 'Nest Mini (2nd gen)', category: 'Smart home', price: 34.99, oldPrice: 49.99, rating: 4.5, reviews: 178, blurb: 'A small speaker with a surprisingly big helpful streak.', art: 'speaker', badge: 'Save £15', color: 'peach', specs: ['Room-filling sound', 'Voice-controlled', 'Made with recycled materials'] },
  { id: 'iphone-15', name: 'Apple iPhone 15', category: 'Phones', price: 699, rating: 4.8, reviews: 92, blurb: 'Colourful, capable and ready for your camera roll.', art: 'phone', color: 'blue', specs: ['6.1" Super Retina display', 'A16 Bionic chip', '48MP main camera'] },
  { id: 'zenbook-14', name: 'ASUS Zenbook 14', category: 'Laptops', price: 899, rating: 4.7, reviews: 61, blurb: 'A polished everyday laptop with room to grow.', art: 'laptop', color: 'sand', specs: ['14" OLED display', 'Intel Core Ultra 7', '16GB RAM / 1TB SSD'] },
  { id: 'sonos-era', name: 'Sonos Era 100', category: 'Audio', price: 199, oldPrice: 249, rating: 4.8, reviews: 117, blurb: 'Room-filling stereo from a speaker that fits anywhere.', art: 'speaker', badge: 'Save £50', color: 'coral', specs: ['Stereo sound', 'Wi-Fi and Bluetooth', 'Trueplay tuning'] },
  { id: 'xbox-series-s', name: 'Xbox Series S', category: 'Gaming', price: 249, rating: 4.7, reviews: 144, blurb: 'Next-gen fun without next-gen fuss.', art: 'console', color: 'mint', specs: ['1440p gaming', '512GB custom SSD', 'Xbox Game Pass ready'] },
  { id: 'ring-doorbell', name: 'Ring Video Doorbell', category: 'Smart home', price: 89, rating: 4.4, reviews: 198, blurb: 'A little more peace of mind at the front door.', art: 'speaker', color: 'blue', specs: ['1080p HD video', 'Two-way talk', 'Motion alerts'] },
];

const formatPrice = (price: number) => `£${price.toLocaleString('en-GB', { minimumFractionDigits: price % 1 ? 2 : 0, maximumFractionDigits: 2 })}`;

function ArtObject({ type }: { type: ProductArt }) {
  return <div className={`art-object art-${type}`} aria-hidden="true" />;
}

function Brand() {
  return (
    <Link href="/" className="brand" data-testid="link-brand">
      <span className="brand-mark">K</span>
      <span>K-Tech</span>
    </Link>
  );
}

function Header({ cartCount, onCart, search, setSearch }: { cartCount: number; onCart: () => void; search: string; setSearch: (value: string) => void }) {
  const [location, setLocation] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const nav = [
    { href: '/', label: 'Home' },
    { href: '/shop', label: 'Shop' },
    { href: '/services', label: 'Services' },
    { href: '/about', label: 'Our story' },
    { href: '/contact', label: 'Contact' },
  ];
  return (
    <>
      <div className="topbar">
        <div className="container topbar-inner">
          <span><strong>Free UK delivery</strong> on orders over £50</span>
          <span>Need a hand? Real people, based in the UK.</span>
        </div>
      </div>
      <header className="site-header">
        <div className="container nav-row">
          <Brand />
          <nav className={`nav-links ${mobileOpen ? 'mobile-visible' : ''}`} aria-label="Main navigation">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className={`nav-link ${location === item.href ? 'active' : ''}`} data-testid={`link-nav-${item.label.toLowerCase().replaceAll(' ', '-')}`} onClick={() => setMobileOpen(false)}>
                {item.label}
              </Link>
            ))}
          </nav>
          <label className="header-search" data-testid="search-header">
            <Search size={16} />
            <input aria-label="Search products" placeholder="Search products" value={search} onChange={(event) => setSearch(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') setLocation('/shop'); }} />
          </label>
          <button className="cart-button" onClick={onCart} data-testid="button-open-cart" aria-label={`Open cart with ${cartCount} items`}>
            <ShoppingBag size={19} />
            <span className="cart-count" data-testid="text-cart-count">{cartCount}</span>
          </button>
          <button className="icon-button mobile-menu" onClick={() => setMobileOpen((open) => !open)} data-testid="button-mobile-menu" aria-label="Toggle menu">
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>
    </>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <Brand />
          <p>Current tech, calmly explained. K-Tech is the UK electronics shop for good advice and devices that earn their place.</p>
        </div>
        <div>
          <h4>Explore</h4>
          <div className="footer-links"><Link href="/shop">Shop all</Link><Link href="/shop">Phones</Link><Link href="/shop">Laptops</Link><Link href="/shop">Audio</Link></div>
        </div>
        <div>
          <h4>Help</h4>
          <div className="footer-links"><Link href="/services">Device services</Link><Link href="/contact">Contact us</Link><Link href="/contact">Delivery & returns</Link><Link href="/about">Why K-Tech</Link></div>
        </div>
        <div>
          <h4>Stay in the loop</h4>
          <p>One useful email a month. New kit, honest guides and the odd good deal.</p>
          <Link href="/contact" className="button button-primary">Join the list <ArrowRight size={15} /></Link>
        </div>
      </div>
      <div className="container footer-bottom"><span>© 2024 K-Tech Electronics Ltd.</span><span>Built for better tech decisions in Britain.</span></div>
    </footer>
  );
}

function TrustStrip() {
  const trust = [
    [Truck, 'Free delivery over £50', 'To UK mainland addresses'],
    [ShieldCheck, 'Two-year warranty', 'Included on every device'],
    [Headphones, 'Human help', 'No scripts, no showroom pressure'],
    [Wrench, 'Set-up support', 'We can get you going'],
  ];
  return <div className="trust-strip"><div className="container trust-grid">{trust.map(([Icon, title, caption], index) => <div className="trust-item" key={title as string} data-testid={`trust-item-${index}`}><Icon size={21} className="trust-icon" /><div><strong>{title as string}</strong><span>{caption as string}</span></div></div>)}</div></div>;
}

function ProductCard({ product, onQuickAdd, onOpen }: { product: Product; onQuickAdd: (product: Product) => void; onOpen: (product: Product) => void }) {
  const [saved, setSaved] = useState(false);
  return (
    <article className="product-card fade-up" data-testid={`card-product-${product.id}`}>
      <div className={`product-art art-bg-${product.color}`} onClick={() => onOpen(product)} role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === 'Enter') onOpen(product); }} data-testid={`button-view-product-${product.id}`}>
        {product.badge && <span className="product-badge">{product.badge}</span>}
        <button className="icon-button wishlist" onClick={(event) => { event.stopPropagation(); setSaved((current) => !current); }} aria-label={`${saved ? 'Remove' : 'Save'} ${product.name}`} data-testid={`button-save-${product.id}`}><Heart size={16} fill={saved ? 'currentColor' : 'none'} /></button>
        <ArtObject type={product.art} />
      </div>
      <div className="product-info">
        <div>
          <span className="product-kicker">{product.category} · {product.badge ? 'Featured' : 'Available now'}</span>
          <h3>{product.name}</h3>
          <p>{product.blurb}</p>
        </div>
        <div className="price">{product.oldPrice && <span className="old-price">{formatPrice(product.oldPrice)}</span>}{formatPrice(product.price)}</div>
      </div>
      <div className="rating"><Star size={13} /><span>{product.rating} · {product.reviews} reviews</span></div>
      <div className="product-stock"><span /> Ready to dispatch from the UK</div>
      <button className="quick-add" onClick={() => onQuickAdd(product)} data-testid={`button-add-product-${product.id}`}>Add to basket <Plus size={14} /></button>
    </article>
  );
}

function ProductModal({ product, onClose, onAdd }: { product: Product; onClose: () => void; onAdd: (product: Product) => void }) {
  return (
    <div className="modal-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }} data-testid="modal-product">
      <div className="product-modal">
        <div className={`modal-art art-bg-${product.color}`}><ArtObject type={product.art} /></div>
        <div className="modal-copy">
          <button className="icon-button" onClick={onClose} data-testid="button-close-product"><X size={18} /></button>
          <span className="eyebrow">{product.category}</span>
          <h2>{product.name}</h2>
          <p>{product.blurb} A dependable bit of kit, selected by the K-Tech team because it makes everyday tech feel refreshingly straightforward.</p>
          <ul className="spec-list">{product.specs.map((spec) => <li key={spec}><Check size={15} />{spec}</li>)}</ul>
          <div className="modal-price">{formatPrice(product.price)}</div>
          <button className="button button-primary" onClick={() => { onAdd(product); onClose(); }} data-testid={`button-modal-add-${product.id}`}>Add to basket <ShoppingBag size={16} /></button>
        </div>
      </div>
    </div>
  );
}

function CartDrawer({ open, items, onClose, onChange, onRemove }: { open: boolean; items: CartItem[]; onClose: () => void; onChange: (id: string, amount: number) => void; onRemove: (id: string) => void }) {
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  return (
    <div className={`cart-overlay ${open ? 'open' : ''}`} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }} data-testid="drawer-cart">
      <aside className="cart-drawer">
        <div className="cart-head"><h2>Your basket <span className="muted">({items.reduce((sum, item) => sum + item.quantity, 0)})</span></h2><button className="icon-button" onClick={onClose} data-testid="button-close-cart"><X size={18} /></button></div>
        {items.length === 0 ? <div className="cart-empty"><ShoppingBag size={33} /><h3>Your basket is waiting</h3><p>Good choices start with a little browsing.</p><Link href="/shop" onClick={onClose} className="button button-primary" data-testid="link-empty-cart-shop">Browse the shop</Link></div> : <>
          <div className="cart-items">{items.map((item) => <div className="cart-item" key={item.product.id} data-testid={`row-cart-${item.product.id}`}>
            <div className="cart-thumb"><ArtObject type={item.product.art} /></div>
            <div><h3>{item.product.name}</h3><p>{formatPrice(item.product.price)} each</p><div className="qty-control"><button onClick={() => onChange(item.product.id, -1)} data-testid={`button-decrease-${item.product.id}`}><Minus size={12} /></button><span data-testid={`text-quantity-${item.product.id}`}>{item.quantity}</span><button onClick={() => onChange(item.product.id, 1)} data-testid={`button-increase-${item.product.id}`}><Plus size={12} /></button></div></div>
            <div className="cart-item-price"><div>{formatPrice(item.product.price * item.quantity)}</div><button className="quick-add" onClick={() => onRemove(item.product.id)} aria-label={`Remove ${item.product.name}`} data-testid={`button-remove-${item.product.id}`}><Trash2 size={14} /></button></div>
          </div>)}</div>
          <div className="cart-summary"><div className="subtotal-row"><span>Subtotal</span><strong data-testid="text-cart-subtotal">{formatPrice(subtotal)}</strong></div><small>Delivery calculated at checkout. No surprises.</small><button className="button button-primary" onClick={() => window.alert('Demo checkout: your basket is ready to go.')} data-testid="button-checkout">Continue to checkout <ArrowRight size={16} /></button></div>
        </>}
      </aside>
    </div>
  );
}

function Home({ onAdd, onOpen }: { onAdd: (product: Product) => void; onOpen: (product: Product) => void }) {
  const featured = products.slice(0, 4);
  return <main>
    <section className="hero"><div className="container hero-grid"><div className="hero-copy fade-up"><span className="eyebrow">Good tech. No hard sell.</span><h1>Find your next <em>favourite</em> device.</h1><p>Current electronics, picked by people who use them. Shop with confidence, get honest advice and skip the intimidating showroom experience.</p><div className="hero-actions"><Link href="/shop" className="button button-primary" data-testid="link-hero-shop">Shop the latest <ArrowRight size={16} /></Link><Link href="/services" className="button button-quiet" data-testid="link-hero-services">Get set up</Link></div><div className="hero-note"><span className="hero-note-mark"><Check size={15} /></span><span><b>4.8/5 from 1,200+ customers</b><br />Friendly help, right when you need it.</span></div></div><div className="product-stage fade-up delay-2"><div className="stage-glow" /><div className="stage-card"><small>New arrival</small><strong>Pixel 9a<br />in Aloe</strong></div><div className="stage-device" /><div className="stage-spec"><Sparkles size={15} /><span><b>48MP</b><br />camera that just works</span></div></div></div></section>
    <TrustStrip />
    <section className="section-pad"><div className="container"><div className="section-head"><div><span className="eyebrow">Start somewhere good</span><h2>Tech, in plain English.</h2></div><p>Whether you need a phone that keeps up, a laptop for the commute or a speaker that fills the kitchen, we have a sensible place to start.</p></div><div className="category-grid">
      {[{ title: 'Phones', copy: 'Cameras, batteries and bright ideas.', icon: Smartphone }, { title: 'Laptops', copy: 'Lightweight power for real life.', icon: Laptop }, { title: 'Audio', copy: 'Make space for better sound.', icon: AudioLines }, { title: 'Gaming', copy: 'More play, less faff.', icon: Gamepad2 }].map(({ title, copy, icon: Icon }) => <Link className="category-card" href={`/shop?category=${title}`} key={title} data-testid={`link-category-${title.toLowerCase()}`}><h3>{title}</h3><p>{copy}</p><Icon size={42} strokeWidth={1.4} /><span className="category-pill">Explore <ArrowRight size={14} /></span></Link>)}
    </div></div></section>
    <section className="section-pad" style={{ paddingTop: 15 }}><div className="container"><div className="section-head"><div><span className="eyebrow">The good stuff</span><h2>Popular for a reason.</h2></div><Link className="button button-quiet" href="/shop" data-testid="link-view-all-products">View all products <ArrowRight size={15} /></Link></div><div className="product-grid">{featured.map((product) => <ProductCard key={product.id} product={product} onQuickAdd={onAdd} onOpen={onOpen} />)}</div></div></section>
    <section className="section-pad"><div className="container"><div className="split-callout"><div className="split-callout-copy"><span className="eyebrow">The K-Tech difference</span><h2>We help you buy the right thing.</h2><p>Not the biggest thing. Not yesterday's thing with a discount sticker. Just the right device for how you actually live, with help that carries on after the receipt.</p><Link href="/about" className="button button-dark" data-testid="link-home-story">Why we do it <ArrowRight size={16} /></Link></div><div className="callout-visual"><div className="callout-chip"><strong>Setup, sorted.</strong><span>Friendly help from £19</span></div><div className="callout-device" /></div></div></div></section>
  </main>;
}

function Shop({ search, setSearch, onAdd, onOpen }: { search: string; setSearch: (value: string) => void; onAdd: (product: Product) => void; onOpen: (product: Product) => void }) {
  const initialCategory = new URLSearchParams(window.location.search).get('category');
  const [category, setCategory] = useState(initialCategory && ['Phones', 'Laptops', 'Audio', 'Gaming', 'Smart home'].includes(initialCategory) ? initialCategory : 'All');
  const [sort, setSort] = useState('featured');
  const categories = ['All', 'Phones', 'Laptops', 'Audio', 'Gaming', 'Smart home'];
  const filtered = useMemo(() => products.filter((product) => (category === 'All' || product.category === category) && `${product.name} ${product.category} ${product.blurb}`.toLowerCase().includes(search.toLowerCase())).sort((a, b) => sort === 'low' ? a.price - b.price : sort === 'high' ? b.price - a.price : 0), [category, search, sort]);
  return <main><section className="page-hero"><div className="container"><span className="eyebrow">The shop</span><h1>Good kit, clearly chosen.</h1><p>From pocket-sized problem solvers to home tech that earns its plug socket. Every product is here because we'd happily recommend it to a friend.</p></div></section><section className="section-pad"><div className="container"><div className="shop-toolbar"><div className="filter-group">{categories.map((item) => <button key={item} className={`filter-chip ${category === item ? 'active' : ''}`} onClick={() => setCategory(item)} data-testid={`button-filter-${item.toLowerCase().replaceAll(' ', '-')}`}>{item}</button>)}</div><label><span className="sr-only">Sort products</span><select className="sort-select" value={sort} onChange={(event) => setSort(event.target.value)} data-testid="select-sort"><option value="featured">Sort: Featured</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option></select></label></div>{filtered.length ? <div className="product-grid">{filtered.map((product) => <ProductCard key={product.id} product={product} onQuickAdd={onAdd} onOpen={onOpen} />)}</div> : <div className="empty-state" data-testid="empty-shop"><Search size={30} /><h3>No tech under that search.</h3><p>Try a broader search, or take another look at the full range.</p><button className="button button-primary" onClick={() => { setCategory('All'); setSearch(''); }} data-testid="button-reset-filters">Show everything</button></div>}</div></section></main>;
}

function Services() {
  const serviceItems = [
    [Wrench, 'Device set-up', 'From unboxing to updates, we get your new device feeling like yours.', 'from £19'],
    [ShieldCheck, 'Tech health check', 'A calm second opinion on a device that is slow, stuck or acting strange.', 'from £25'],
    [CircleUserRound, 'Move your data', 'Photos, contacts and the important bits moved safely to your new device.', 'from £29'],
    [Headphones, 'One-to-one advice', 'A 30-minute chat about what you actually need, without the sales pitch.', '£15 / 30 min'],
  ] as const;
  return <main><section className="page-hero"><div className="container"><span className="eyebrow">Support, without the jargon</span><h1>Make the most of your tech.</h1><p>New device? Old device? Somewhere in between? Our friendly support team can help you set up, sort out and feel more confident with the tech you already own.</p></div></section><section className="section-pad"><div className="container service-grid"><div><span className="eyebrow">Choose your kind of help</span><div className="service-list">{serviceItems.map(([Icon, title, copy, price]) => <div className="service-card" key={title}><span className="service-icon"><Icon size={20} /></span><div><h3>{title}</h3><p>{copy}</p></div><span className="price">{price}</span></div>)}</div></div><aside className="side-note"><Sparkles size={24} color="#ffad96" /><h2>Good advice is part of the product.</h2><p>Book in at our Manchester help desk, or start with a message. We will tell you what is worth fixing, what is worth replacing and what can wait.</p><Link href="/contact" className="button button-primary" data-testid="link-services-contact">Talk to our team <ArrowRight size={15} /></Link></aside></div></section><section className="section-pad" style={{ paddingTop: 0 }}><div className="container"><div className="section-head"><div><span className="eyebrow">How it works</span><h2>Three easy steps.</h2></div></div><div className="process">{[['01', 'Tell us what is going on', 'A quick message or a visit is enough. No technical vocabulary required.'], ['02', 'Get a clear plan', 'We explain your options, the cost and what we would do ourselves.'], ['03', 'Leave feeling sorted', 'We fix, set up or point you in the right direction. No mystery invoice.']].map(([number, title, copy]) => <div className="process-step" key={number}><b>{number}</b><h3>{title}</h3><p>{copy}</p></div>)}</div></div></section></main>;
}

function About() {
  const values = [[Sparkles, 'Curious, not flashy', 'We keep up with what is new, then recommend what is actually useful.'], [ShieldCheck, 'Straight with you', 'No inflated specs. No pressure. Just the trade-offs you need to choose well.'], [Headphones, 'Properly human', 'Our people are here to make tech feel less intimidating, not more impressive.'], [Heart, 'In it for the long run', 'A good sale ends with a good device in a good home, not a box in a cupboard.']];
  return <main><section className="section-pad"><div className="container story-grid"><div><span className="eyebrow">A little about us</span><h2>Technology should feel like a helpful neighbour.</h2><p>K-Tech started in a small Manchester shop after our founders spent too many Saturdays watching people get talked into devices they did not need.</p><p>We built a different kind of electronics retailer: current kit, fair prices and a real person who can explain the difference between “nice to have” and “will change your Tuesday”.</p><Link href="/shop" className="button button-primary" data-testid="link-about-shop">Find your next device <ArrowRight size={15} /></Link></div><div className="story-art"><div className="story-sticker"><b>Since 2011</b><span>Manchester, UK</span></div><div className="story-phone" /></div></div></section><section className="section-pad" style={{ paddingTop: 20 }}><div className="container"><div className="section-head"><div><span className="eyebrow">What we believe</span><h2>Small principles. Better shopping.</h2></div></div><div className="values-grid">{values.map(([Icon, title, copy]) => <div className="value-card" key={title as string}><Icon size={20} /><h3>{title as string}</h3><p>{copy as string}</p></div>)}</div></div></section></main>;
}

function Contact() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', topic: 'A product question', message: '' });
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setSent(true); };
  const update = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));
  return <main><section className="page-hero"><div className="container"><span className="eyebrow">We are listening</span><h1>Ask away.</h1><p>Product question, delivery wobble or just not sure where to start? Send a note and a real member of the team will get back to you within one working day.</p></div></section><section className="section-pad"><div className="container contact-grid"><div><span className="eyebrow">Find us here</span><h2 className="display" style={{ fontSize: '2.6rem', lineHeight: .95, letterSpacing: '-.07em', margin: '12px 0 0' }}>Friendly help,<br />three ways.</h2><div className="contact-details"><div className="contact-detail"><MapPin size={20} /><div><strong>Manchester help desk</strong><span>18 Tib Street, Northern Quarter<br />Manchester M4 1NB</span></div></div><div className="contact-detail"><Mail size={20} /><div><strong>Email</strong><span>hello@k-tech.co.uk<br />Replies within one working day</span></div></div><div className="contact-detail"><Phone size={20} /><div><strong>Phone</strong><span>0161 555 0148<br />Mon–Sat, 9am–5:30pm</span></div></div><div className="contact-detail"><Clock3 size={20} /><div><strong>Help desk hours</strong><span>Monday–Saturday<br />10am–6pm</span></div></div></div></div><div className="form-card"><h2>Send us a message</h2>{sent ? <div className="success-message" data-testid="status-contact-success"><Check size={18} /><span>Thanks, {form.name || 'there'} — your message is in. We will be in touch within one working day.</span></div> : <form onSubmit={submit}><div className="form-grid"><div className="field"><label htmlFor="name">Your name</label><input id="name" required value={form.name} onChange={(event) => update('name', event.target.value)} placeholder="What should we call you?" data-testid="input-contact-name" /></div><div className="field"><label htmlFor="email">Email address</label><input id="email" type="email" required value={form.email} onChange={(event) => update('email', event.target.value)} placeholder="you@example.com" data-testid="input-contact-email" /></div><div className="field full"><label htmlFor="topic">What can we help with?</label><select id="topic" value={form.topic} onChange={(event) => update('topic', event.target.value)} data-testid="select-contact-topic"><option>A product question</option><option>Delivery or returns</option><option>Device support</option><option>Something else</option></select></div><div className="field full"><label htmlFor="message">Your message</label><textarea id="message" required value={form.message} onChange={(event) => update('message', event.target.value)} placeholder="Tell us a little more..." data-testid="textarea-contact-message" /></div></div><button type="submit" className="button button-primary" data-testid="button-submit-contact">Send message <Send size={15} /></button></form>}</div></div></section></main>;
}

function Layout({ children, cartCount, onCart, search, setSearch, items, onCloseCart, cartOpen, onChangeQuantity, onRemove, onAdd, selectedProduct, setSelectedProduct }: { children: ReactNode; cartCount: number; onCart: () => void; search: string; setSearch: (value: string) => void; items: CartItem[]; onCloseCart: () => void; cartOpen: boolean; onChangeQuantity: (id: string, amount: number) => void; onRemove: (id: string) => void; onAdd: (product: Product) => void; selectedProduct: Product | null; setSelectedProduct: (product: Product | null) => void }) {
  return <div className="site-wrap"><Header cartCount={cartCount} onCart={onCart} search={search} setSearch={setSearch} />{children}<Footer /><CartDrawer open={cartOpen} items={items} onClose={onCloseCart} onChange={onChangeQuantity} onRemove={onRemove} />{selectedProduct && <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} onAdd={onAdd} />}</div>;
}

const queryClient = new QueryClient();

function Router({ onAdd, onOpen, search, setSearch }: { onAdd: (product: Product) => void; onOpen: (product: Product) => void; search: string; setSearch: (value: string) => void }) {
  return <ErrorBoundary resetKey={window.location.pathname}><Switch><Route path="/" component={() => <Home onAdd={onAdd} onOpen={onOpen} />} /><Route path="/shop" component={() => <Shop search={search} setSearch={setSearch} onAdd={onAdd} onOpen={onOpen} />} /><Route path="/services" component={Services} /><Route path="/about" component={About} /><Route path="/contact" component={Contact} /><Route component={NotFound} /></Switch></ErrorBoundary>;
}

function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const addToCart = (product: Product) => { setCart((current) => { const existing = current.find((item) => item.product.id === product.id); return existing ? current.map((item) => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item) : [...current, { product, quantity: 1 }]; }); setCartOpen(true); };
  const changeQuantity = (id: string, amount: number) => setCart((current) => current.flatMap((item) => item.product.id === id ? (item.quantity + amount > 0 ? [{ ...item, quantity: item.quantity + amount }] : []) : [item]));
  const removeFromCart = (id: string) => setCart((current) => current.filter((item) => item.product.id !== id));
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  return <QueryClientProvider client={queryClient}><TooltipProvider><Layout cartCount={cartCount} onCart={() => setCartOpen(true)} search={search} setSearch={setSearch} items={cart} onCloseCart={() => setCartOpen(false)} cartOpen={cartOpen} onChangeQuantity={changeQuantity} onRemove={removeFromCart} onAdd={addToCart} selectedProduct={selectedProduct} setSelectedProduct={setSelectedProduct}><Router onAdd={addToCart} onOpen={setSelectedProduct} search={search} setSearch={setSearch} /></Layout><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;