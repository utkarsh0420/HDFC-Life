import { FiStar } from 'react-icons/fi'

const testimonials = [
  {
    id: 1,
    name: 'Priya Menon',
    city: 'Chennai',
    rating: 5,
    text: 'Getting a term insurance plan from HDFC Life was the best financial decision I made. The claim process was completely hassle-free when my father needed it. Truly grateful.',
    policy: 'Click 2 Protect Life',
    avatar: 'PM',
  },
  {
    id: 2,
    name: 'Arjun Kapoor',
    city: 'Mumbai',
    rating: 5,
    text: 'I invested in their ULIP plan and the returns have been excellent. The online portal makes it so easy to track my investments and manage my policy.',
    policy: 'ProGrowth Plus',
    avatar: 'AK',
  },
  {
    id: 3,
    name: 'Sunita Reddy',
    city: 'Hyderabad',
    rating: 5,
    text: 'HDFC Life has been transparent throughout. No hidden charges, clear communication, and their customer support team is incredibly responsive. Highly recommend!',
    policy: 'Sanchay Plus',
    avatar: 'SR',
  },
  {
    id: 4,
    name: 'Rajesh Kumar',
    city: 'Delhi',
    rating: 5,
    text: 'The pension plan helped me plan my retirement systematically. Their financial advisors provided excellent guidance and helped me understand all the options.',
    policy: 'Pension Super Plus',
    avatar: 'RK',
  },
  {
    id: 5,
    name: 'Meera Iyer',
    city: 'Bangalore',
    rating: 5,
    text: 'I bought a child education plan for my daughter. The maturity benefit perfectly aligns with her college admission timeline. Thank you HDFC Life!',
    policy: 'YoungStar Udaan',
    avatar: 'MI',
  },
]

const TestimonialsCarousel = () => {
  return (
    <section className="bg-gray-50 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="section-title">What Our Customers Say</h2>
          <p className="section-subtitle">
            Real stories from real people whose lives we've helped protect
          </p>
        </div>

        <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-10 hide-scrollbar">
          {testimonials.map((t) => (
            <div key={t.id} className="snap-center shrink-0 w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
              <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 h-full flex flex-col">
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <FiStar key={i} className="text-gold fill-gold w-4 h-4" style={{ fill: '#F5A623' }} />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-gray-600 text-sm leading-relaxed mb-6 italic grow">
                  "{t.text}"
                </p>

                {/* Customer info */}
                <div className="flex items-center gap-3 mt-auto">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {t.avatar}
                  </div>
                  <div className="min-w-0">
                    <p className="text-navy font-bold text-sm truncate">{t.name}</p>
                    <p className="text-gray-400 text-xs truncate">{t.city}</p>
                  </div>
                  <div className="ml-auto shrink-0 hidden sm:block">
                    <span className="bg-navy/5 text-navy text-xs px-2 py-1 rounded-full font-medium truncate max-w-[120px] inline-block">
                      {t.policy}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TestimonialsCarousel
