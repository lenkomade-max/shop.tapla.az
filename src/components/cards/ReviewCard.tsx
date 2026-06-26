'use client';

import React, { useState } from 'react';
import { Star, ThumbsUp, ThumbsDown, CheckCircle } from 'lucide-react';
import type { Review } from '@/types';
import { clsx } from 'clsx';

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const [likes, setLikes] = useState(review.likes);
  const [dislikes, setDislikes] = useState(review.dislikes);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [hasDownvoted, setHasDownvoted] = useState(false);

  const handleUpvote = () => {
    if (hasUpvoted) {
      setLikes((prev) => prev - 1);
      setHasUpvoted(false);
    } else {
      setLikes((prev) => prev + 1);
      setHasUpvoted(true);
      if (hasDownvoted) {
        setDislikes((prev) => prev - 1);
        setHasDownvoted(false);
      }
    }
  };

  const handleDownvote = () => {
    if (hasDownvoted) {
      setDislikes((prev) => prev - 1);
      setHasDownvoted(false);
    } else {
      setDislikes((prev) => prev + 1);
      setHasDownvoted(true);
      if (hasUpvoted) {
        setLikes((prev) => prev - 1);
        setHasUpvoted(false);
      }
    }
  };

  return (
    <div className="border-b border-neutral-100 py-6 font-sans">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-1 text-xs">
          <div className="flex text-amber-400 mb-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={clsx(
                  'h-3.5 w-3.5 fill-current',
                  i < review.rating ? 'text-amber-400' : 'text-neutral-200'
                )}
              />
            ))}
          </div>

          <div className="font-semibold text-neutral-900 flex items-center space-x-1">
            <span>{review.reviewerName}</span>
            {review.verifiedBuyer && (
              <span title="Təsdiqlənmiş Alıcı" className="inline-flex items-center">
                <CheckCircle className="h-3 w-3 text-emerald-600 inline" />
              </span>
            )}
          </div>

          {review.location && (
            <div className="text-neutral-500">
              Şəhər: <span className="text-neutral-800 font-medium">{review.location}</span>
            </div>
          )}
          {review.ageRange && (
            <div className="text-neutral-500">
              Yaş: <span className="text-neutral-800 font-medium">{review.ageRange}</span>
            </div>
          )}
          {review.skinType && (
            <div className="text-neutral-500">
              Dəri Tipi: <span className="text-neutral-800 font-medium">{review.skinType}</span>
            </div>
          )}
          {review.skinTone && (
            <div className="text-neutral-500">
              Dəri Rəngi: <span className="text-neutral-800 font-medium">{review.skinTone}</span>
            </div>
          )}

          <div className="text-[10px] text-neutral-400 pt-2">{review.date}</div>
        </div>

        <div className="md:col-span-3 flex flex-col justify-between">
          <div className="space-y-2">
            <h5 className="text-xs sm:text-sm font-semibold tracking-wider text-neutral-900 uppercase">
              {review.title}
            </h5>

            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-sans">
              {review.comment}
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 mt-4 border-t border-dashed border-neutral-100 text-[11px] text-neutral-500">
            <div className="flex items-center space-x-4">
              <span className="font-medium">Bu rəy sizin üçün faydalı oldu?</span>

              <button
                onClick={handleUpvote}
                className={clsx(
                  'flex items-center space-x-1.5 transition-colors cursor-pointer',
                  hasUpvoted ? 'text-neutral-900 font-semibold' : 'hover:text-neutral-950'
                )}
              >
                <ThumbsUp className="h-3 w-3" />
                <span>{likes}</span>
              </button>

              <button
                onClick={handleDownvote}
                className={clsx(
                  'flex items-center space-x-1.5 transition-colors cursor-pointer',
                  hasDownvoted ? 'text-neutral-900 font-semibold' : 'hover:text-neutral-950'
                )}
              >
                <ThumbsDown className="h-3 w-3" />
                <span>{dislikes}</span>
              </button>
            </div>

            <button className="text-[10px] uppercase tracking-widest text-neutral-400 hover:text-neutral-900 transition-colors cursor-pointer">
              ŞİKAYƏT ET
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
