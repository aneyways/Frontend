import Hero from '../../components/Hero/Hero';
import FeaturedProducts from '../../components/FeaturedProducts/FeaturedProducts';
import Categories from '../../components/Categories/Categories';
import WhyUs from '../../components/WhyUs/WhyUs';
import styles from './Home.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <Hero />
      <FeaturedProducts />
      <Categories />
      <WhyUs />
    </main>
  );
}