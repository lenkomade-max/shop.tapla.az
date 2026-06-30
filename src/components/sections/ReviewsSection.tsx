'use client';

import React, { useState } from 'react';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Heading } from '@/components/ui/Heading';
import { ReviewCard } from '@/components/cards/ReviewCard';
import { Review } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Star, CheckCircle, Camera, MessageSquarePlus, Filter, SlidersHorizontal } from 'lucide-react';
import { clsx } from 'clsx';

interface ReviewsSectionProps {
  initialReviews: Review[];
}

export function ReviewsSection({ initialReviews }: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [isWriteReviewOpen, setIsWriteReviewOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState('highest');
  const [filterCategory, setFilterCategory] = useState('all');

  // New review form states
  const [newName, setNewName] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newLocation, setNewLocation] = useState('');
  const [newProductCategory, setNewProductCategory] = useState('Notebook');
  const [newUsagePurpose, setNewUsagePurpose] = useState('İş / Təhsil');

  const handleWriteReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newTitle || !newComment) {
      alert('Zəhmət olmasa ulduz işarəsi olan bütün sahələri doldurun!');
      return;
    }

    const brandNewReview: Review = {
      id: `rev-custom-${Math.random().toString(36).substr(2, 9)}`,
      reviewerName: newName,
      rating: newRating,
      title: newTitle,
      comment: newComment,
      date: 'Bugün',
      location: newLocation || 'Bakı',
      productCategory: newProductCategory,
      usagePurpose: newUsagePurpose,
      verifiedBuyer: true,
      likes: 0,
      dislikes: 0,
    };

    setReviews([brandNewReview, ...reviews]);
    setIsWriteReviewOpen(false);
    
    // Reset states
    setNewName('');
    setNewTitle('');
    setNewComment('');
    setNewRating(5);
    setNewLocation('');
  };

  const filteredReviews = reviews
    .filter(r => filterCategory === 'all' || r.productCategory?.toLowerCase().includes(filterCategory.toLowerCase()))
    .sort((a, b) => {
      if (sortOrder === 'highest') return b.rating - a.rating;
      if (sortOrder === 'lowest') return a.rating - b.rating;
      return 0; // fallback default
    });

  return (
    <Section id="reviews" py="sm" variant="neutral">
      <Container>
        {/* Section Title */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-8">
          <span className="text-[10px] tracking-[0.25em] font-bold text-neutral-400 uppercase">
            MÜŞTƏRİ MƏMNUNİYYƏTİ
          </span>
          <Heading level={2} align="center" className="font-serif">
            MÜŞTƏRİ RƏYLƏRİ
          </Heading>
          <p className="text-xs sm:text-sm text-neutral-500 font-sans max-w-lg mx-auto leading-relaxed">
            Həqiqi müştərilərimizin TAPLA MARKETPLACE-də aldıqları məhsullar haqqında rəyləri.
          </p>
        </div>

        {/* REVIEW DASHBOARD SNAPSHOT */}
        <div className="bg-white border border-neutral-100 p-6 sm:p-8 md:p-10 shadow-xs mb-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center font-sans">
          
          {/* Left Column: Average Ratings & recommendation count */}
          <div className="lg:col-span-4 text-center lg:text-left lg:border-r lg:border-neutral-100 lg:pr-8 space-y-4">
            <h4 className="text-xs tracking-widest font-bold uppercase text-neutral-400">RƏY SNAPSHOT</h4>
            <div className="flex flex-col sm:flex-row lg:flex-col items-center lg:items-start sm:justify-center lg:justify-start gap-4">
              <div className="text-5xl font-extrabold text-neutral-900 leading-none">5.0</div>
              <div className="space-y-1 text-left">
                <div className="flex text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4.5 w-4.5 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-neutral-500 font-mono">
                  {reviews.length} Təsdiqlənmiş Müştəri Rəyi
                </p>
              </div>
            </div>

            <div className="bg-emerald-50/50 border border-emerald-100 p-4 flex items-center space-x-3 text-emerald-800 rounded-xl">
              <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />
              <p className="text-xs font-semibold leading-relaxed">
                Müştərilərimizin <span className="underline decoration-2">95%-i</span> TAPLA MARKETPLACE-i dostlarına tövsiyə edir.
              </p>
            </div>
          </div>

          {/* Center Column: Ratings Star Distribution Bars */}
          <div className="lg:col-span-5 space-y-2 lg:px-4">
            <div className="space-y-2.5">
              {[
                { stars: 5, pct: '92%', count: 19 },
                { stars: 4, pct: '8%', count: 1 },
                { stars: 3, pct: '0%', count: 0 },
                { stars: 2, pct: '0%', count: 0 },
                { stars: 1, pct: '0%', count: 0 },
              ].map((bar) => (
                <div key={bar.stars} className="flex items-center space-x-3 text-xs">
                  <span className="w-12 text-neutral-500 font-medium">{bar.stars} Ulduz</span>
                  <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden relative">
                    <div
                      className="absolute top-0 bottom-0 left-0 bg-neutral-950 transition-all duration-500"
                      style={{ width: bar.pct }}
                    />
                  </div>
                  <span className="w-8 text-neutral-400 font-mono text-right">{bar.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: CTA write review & customer upload showcase placeholder */}
          <div className="lg:col-span-3 text-center lg:pl-6 space-y-4">
            <p className="text-xs text-neutral-500 leading-relaxed max-w-xs mx-auto lg:mx-0">
              Şəxsi təcrübənizi bizimlə bölüşmək istərdiniz? Digər müştərilərimizə kömək edin.
            </p>
            <button
              onClick={() => setIsWriteReviewOpen(true)}
              className="w-full bg-neutral-950 text-white text-[10px] tracking-widest font-semibold uppercase py-3.5 border border-neutral-950 hover:bg-transparent hover:text-neutral-900 transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer"
            >
              <MessageSquarePlus className="h-4 w-4" />
              <span>RƏYİNİZİ YAZIN</span>
            </button>
          </div>

        </div>

        {/* REVIEW FILTERS / SEARCH TOOL BAR */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-y border-neutral-200 py-4 mb-8 gap-4 font-sans">
          <div className="flex flex-wrap items-center gap-4 text-xs w-full sm:w-auto">
            <div className="flex items-center space-x-2 text-neutral-500">
              <SlidersHorizontal className="h-4 w-4" />
              <span className="font-semibold uppercase tracking-wider text-[11px]">SÜZGƏCLƏR:</span>
            </div>
            
            {/* Category Filter dropdown */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-white border border-neutral-200 text-neutral-800 text-[11px] px-3 py-2 uppercase tracking-wider focus:outline-none cursor-pointer"
            >
              <option value="all">Bütün Kateqoriyalar</option>
              <option value="Notebook">Notebook</option>
              <option value="Smartfon">Smartfon</option>
              <option value="Planşet">Planşet</option>
              <option value="Aksesuar">Aksesuar</option>
            </select>
          </div>

          {/* Sort selector */}
          <div className="flex items-center space-x-2 text-xs w-full sm:w-auto justify-end">
            <span className="text-neutral-400">Siralama:</span>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="bg-white border border-neutral-200 text-neutral-800 text-[11px] px-3 py-2 uppercase tracking-wider focus:outline-none cursor-pointer"
            >
              <option value="highest">Ən yüksək qiymət</option>
              <option value="lowest">Ən aşağı qiymət</option>
            </select>
          </div>
        </div>

        {/* REVIEWS FEED LIST */}
        <div className="bg-white border border-neutral-100 p-6 sm:p-8 space-y-6 shadow-xs">
          {filteredReviews.length === 0 ? (
            <p className="text-center text-xs text-neutral-400 py-12">
              Seçilmiş süzgəclərə uyğun heç bir rəy tapılmadı.
            </p>
          ) : (
            filteredReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))
          )}
        </div>

        {/* WRITE A REVIEW MODAL FORM IN AZERBAIJANI */}
        <Modal
          isOpen={isWriteReviewOpen}
          onClose={() => setIsWriteReviewOpen(false)}
          title="YENİ RƏY YAZ"
        >
          <form onSubmit={handleWriteReviewSubmit} className="space-y-4 font-sans text-neutral-900">
            {/* Stars Selector */}
            <div>
              <label className="text-[10px] tracking-widest uppercase font-semibold text-neutral-500 block mb-2">
                MƏHSUL QİYMƏTLƏNDİRİLMƏSİ *
              </label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewRating(star)}
                    className="p-1 focus:outline-none transition-transform hover:scale-110 cursor-pointer"
                  >
                    <Star
                      className={clsx(
                        'h-6 w-6',
                        star <= newRating ? 'text-amber-400 fill-current' : 'text-neutral-200'
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Title input */}
            <Input
              label="RƏYİN QISA BAŞLIĞI *"
              placeholder="Məsələn: İnanılmaz liftinq effekti!"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />

            {/* Comment textarea */}
            <div className="space-y-1.5">
              <label className="text-[10px] tracking-widest uppercase font-semibold text-neutral-500">
                ƏTRAFLI ŞƏRHİNİZ *
              </label>
              <textarea
                required
                rows={4}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Məhsulla bağlı təcrübənizi ətraflı şəkildə qeyd edin."
                className="w-full bg-white border border-neutral-200 text-xs p-4 focus:outline-none focus:border-neutral-950 focus:ring-1 focus:ring-neutral-950"
              />
            </div>

            {/* Grid of properties (Name, Location, Age, Skin parameters) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="ADINIZ, SOYADINIZ *"
                placeholder="Məs: Fidan Əliyeva"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />

              <Input
                label="ŞƏHƏR / YAŞADIĞINIZ YER"
                placeholder="Məs: Bakı"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
              />
            </div>

            {/* Select options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] tracking-widest uppercase font-semibold text-neutral-500 block">
                  MƏHSUL KATEQORİYASI
                </label>
                <select
                  value={newProductCategory}
                  onChange={(e) => setNewProductCategory(e.target.value)}
                  className="w-full bg-white border border-neutral-200 text-xs px-3 py-3 focus:outline-none cursor-pointer"
                >
                  <option value="Notebook">Notebook</option>
                  <option value="Smartfon">Smartfon</option>
                  <option value="Planşet">Planşet</option>
                  <option value="Aksesuar">Aksesuar</option>
                  <option value="TV / Audio">TV / Audio</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] tracking-widest uppercase font-semibold text-neutral-500 block">
                  İSTİFADƏ MƏQSƏDİ
                </label>
                <select
                  value={newUsagePurpose}
                  onChange={(e) => setNewUsagePurpose(e.target.value)}
                  className="w-full bg-white border border-neutral-200 text-xs px-3 py-3 focus:outline-none cursor-pointer"
                >
                  <option value="İş / Təhsil">İş / Təhsil</option>
                  <option value="Oyun">Oyun</option>
                  <option value="Ev / Əyləncə">Ev / Əyləncə</option>
                  <option value="Hədiyyə">Hədiyyə</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-neutral-950 text-white text-xs font-semibold py-4 uppercase tracking-widest border border-neutral-950 hover:bg-transparent hover:text-neutral-950 transition-colors duration-300 cursor-pointer"
            >
              RƏYİ DƏRC ET
            </button>
          </form>
        </Modal>
      </Container>
    </Section>
  );
}
