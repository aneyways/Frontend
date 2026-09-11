import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllProducts } from '../../services/api';
import type { Product } from '../../types/product.types';
import styles from './Quiz.module.css';

// ─── Вопросы ───
const QUESTIONS = [
  {
    id: 'place',
    question: 'Where do you listen to music?',
    options: [
      { value: 'home',    label: 'At home'},
      { value: 'outside', label: 'Outside'},
      { value: 'gym',     label: 'At the gym'},
      { value: 'studio',  label: 'In the studio'},
    ],
  },
  {
    id: 'priority',
    question: "What matters most to you?",
    options: [
      { value: 'bass',    label: 'Bass' },
      { value: 'detail',  label: 'Details'},
      { value: 'comfort', label: 'Comfort'},
      { value: 'noise',   label: 'Noise cancellation'},
    ],
  },
  {
    id: 'genre',
    question: 'What genre do you listen to most?',
    options: [
      { value: 'pop',       label: 'Pop'},
      { value: 'rock',      label: 'Rock'},
      { value: 'hiphop',    label: 'Hip-Hop'},
      { value: 'classical', label: 'Classical'},
    ],
  },
  {
    id: 'budget',
    question: "What's your budget?",
    options: [
      { value: 'low',    label: 'Up to 1 500 MDL'},
      { value: 'mid',    label: '1 500 – 4 000 MDL' },
      { value: 'high',   label: '4 000 – 8 000 MDL'},
      { value: 'ultra',  label: '8 000+ MDL'},
    ],
  },
];

// ─── Определяем профиль по ответам ───
type Answers = Record<string, string>;

interface SoundProfile {
  title: string;
  subtitle: string;
  description: string;
  filter: (p: Product) => boolean;
}

function getProfile(answers: Answers): SoundProfile {
  const { place, priority, genre, budget } = answers;

  const budgetRange = {
    low:   [0,      1500],
    mid:   [1500,   4000],
    high:  [4000,   8000],
    ultra: [8000, 999999],
  }[budget] ?? [0, 999999];

  const inBudget = (p: Product) =>
    p.price >= budgetRange[0] && p.price <= budgetRange[1];

  // Studio listener
  if (place === 'studio' || priority === 'detail' || genre === 'classical') {
    return {
      title: 'Studio Listener',
      subtitle: 'You hear what others miss.',
      description: 'You need precise, flat-response audio that reveals every detail in the mix. Studio-grade headphones or reference monitors are your match.',
      filter: p => inBudget(p),
    };
  }

  // Bass Lover
  if (priority === 'bass' || genre === 'hiphop' || genre === 'pop') {
    return {
      title: 'Bass Lover',
      subtitle: 'You feel the music.',
      description: 'Deep, punchy bass and an energetic sound signature. You want headphones that hit hard and make every beat feel physical.',
      filter: p => inBudget(p),
    };
  }

  // Active Listener
  if (place === 'gym' || place === 'outside') {
    return {
      title: 'Active Listener',
      subtitle: 'Music keeps you moving.',
      description: 'Durability, secure fit and great sound on the go. You need gear that keeps up with your lifestyle.',
      filter: p => inBudget(p),
    };
  }

  // Silent Zone
  if (priority === 'noise') {
    return {
      title: 'Silent Zone',
      subtitle: 'Block the world out.',
      description: 'Active noise cancellation is your priority. Whether working or commuting, you need total isolation.',
      filter: p => inBudget(p),
    };
  }

  // Comfort King
  return {
    title: 'Comfort Seeker',
    subtitle: 'Hours of listening, zero fatigue.',
    description: 'Long listening sessions require lightweight, breathable headphones with a wide soundstage and balanced tuning.',
    filter: p => inBudget(p),
  };
}

// ─── Компонент ───
export default function Quiz() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'intro' | number | 'result'>('intro');
  const [answers, setAnswers] = useState<Answers>({});
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [profile, setProfile] = useState<SoundProfile | null>(null);

  const currentQuestion = typeof step === 'number' ? QUESTIONS[step] : null;
  const progress = typeof step === 'number'
    ? ((step) / QUESTIONS.length) * 100
    : step === 'result' ? 100 : 0;

  const handleAnswer = async (questionId: string, value: string) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);

    if (typeof step === 'number' && step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      // Последний вопрос — считаем результат
      const p = getProfile(newAnswers);
      setProfile(p);
      setStep('result');
      setLoadingProducts(true);
      try {
        const all = await getAllProducts();
        const matched = all.filter(p.filter).slice(0, 4);
        setProducts(matched.length > 0 ? matched : all.slice(0, 4));
      } catch {
        setProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    }
  };

  const handleBack = () => {
    if (step === 'result') {
      setStep(QUESTIONS.length - 1);
      setProfile(null);
      setProducts([]);
    } else if (typeof step === 'number' && step > 0) {
      setStep(step - 1);
    }
  };

  const handleRestart = () => {
    setStep('intro');
    setAnswers({});
    setProfile(null);
    setProducts([]);
  };

  const priceFormatted = (price: number) =>
    new Intl.NumberFormat('ro-MD', {
      style: 'decimal', minimumFractionDigits: 0,
    }).format(price) + ' MDL';

  // ─── Intro ───
  if (step === 'intro') {
    return (
      <div className={styles.page}>
        <div className={styles.intro}>
          <span className={styles.eyebrow}>Personalised for you</span>
          <h1 className={styles.introTitle}>Find Your<br />Perfect Sound.</h1>
          <p className={styles.introSub}>
            Answer 4 quick questions and we'll match you with the ideal audio gear from our catalogue.
          </p>
          <button className={styles.startBtn} onClick={() => setStep(0)}>
            Start Quiz →
          </button>
        </div>
      </div>
    );
  }

  // ─── Result ───
  if (step === 'result' && profile) {
    return (
      <div className={styles.page}>
        <div className={styles.result}>

          <div className={styles.resultProfile}>
            <span className={styles.eyebrow}>Your sound profile</span>
            <h1 className={styles.resultTitle}>{profile.title}</h1>
            <p className={styles.resultSubtitle}>{profile.subtitle}</p>
            <p className={styles.resultDesc}>{profile.description}</p>
          </div>

          <div className={styles.recommendations}>
            <p className={styles.recLabel}>Recommended for you</p>

            {loadingProducts ? (
              <div className={styles.recGrid}>
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className={styles.recSkeleton} />
                ))}
              </div>
            ) : products.length === 0 ? (
              <p className={styles.noProducts}>
                No products available yet — check back soon.
              </p>
            ) : (
              <div className={styles.recGrid}>
                {products.map(p => (
                  <div
                    key={p.id}
                    className={styles.recCard}
                    onClick={() => navigate(`/catalog/${p.id}`)}
                  >
                    <div className={styles.recImgWrap}>
                      <img
                        src={p.images?.[0]?.url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80'}
                        alt={p.name}
                        className={styles.recImg}
                      />
                    </div>
                    <div className={styles.recInfo}>
                      <p className={styles.recCategory}>{p.category ?? 'Audio'}</p>
                      <h3 className={styles.recName}>{p.name}</h3>
                      <p className={styles.recPrice}>{priceFormatted(p.price)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={styles.resultActions}>
            <button className={styles.catalogBtn} onClick={() => navigate('/catalog')}>
              Browse Full Catalogue →
            </button>
            <button className={styles.restartBtn} onClick={handleRestart}>
              Retake Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Question ───
  if (!currentQuestion) return null;

  return (
    <div className={styles.page}>
      <div className={styles.quiz}>

        {/* Progress */}
        <div className={styles.progressWrap}>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }} />
          </div>
          <span className={styles.progressLabel}>
            {typeof step === 'number' ? step + 1 : QUESTIONS.length} / {QUESTIONS.length}
          </span>
        </div>

        {/* Question */}
        <div className={styles.questionWrap}>
          <h2 className={styles.question}>{currentQuestion.question}</h2>
        </div>

        {/* Options */}
        <div className={styles.options}>
          {currentQuestion.options.map(opt => (
            <button
              key={opt.value}
              className={`${styles.option} ${
                answers[currentQuestion.id] === opt.value ? styles.optionSelected : ''
              }`}
              onClick={() => handleAnswer(currentQuestion.id, opt.value)}
            >
              <span className={styles.optionLabel}>{opt.label}</span>
            </button>
          ))}
        </div>

        {/* Back */}
        {typeof step === 'number' && step > 0 && (
          <button className={styles.backBtn} onClick={handleBack}>
            ← Back
          </button>
        )}
      </div>
    </div>
  );
}