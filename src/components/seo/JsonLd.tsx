import React from 'react';
import { SALON_INFO } from '../../config/salon';

export const JsonLd: React.FC = () => {
  const localBusinessData = {
    '@context': 'https://schema.org',
    '@type': 'BarberShop',
    name: 'El Gemy Barber Lounge - صالون الجيمي للرجال',
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1',
    '@id': 'https://el-gemy.com/#barbershop',
    url: 'https://el-gemy.com',
    telephone: SALON_INFO.phone,
    priceRange: '100 - 1500 EGP',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Main Commercial Station St.',
      addressLocality: 'Mit El-Nasr (منية النصر)',
      addressRegion: 'Dakahlia Governorate (محافظة الدقهلية)',
      postalCode: '35661',
      addressCountry: 'EG',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 31.1278,
      longitude: 31.6432,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
        opens: '10:00',
        closes: '23:59',
      },
    ],
    sameAs: [
      'https://www.facebook.com/elgemybarber',
      'https://www.instagram.com/elgemybarber',
    ],
  };

  const faqData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'أين يقع صالون الجيمي El Gemy؟',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'يقع صالون الجيمي في محافظة الدقهلية، مركز منية النصر، بشارع المحطة الرئيسي التجاري. رقم التواصل والواتساب: 01096913209.',
        },
      },
      {
        '@type': 'Question',
        name: 'هل يجب الحجز مسبقاً قبل زيارة صالون الجيمي؟',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'نوفر نظام حجز أونلاين فوري عبر الموقع لضمان عدم الانتظار، كما نرحب بالعملاء المباشرين (Walk-in) بنظام تذاكر دور رقمي سريع.',
        },
      },
      {
        '@type': 'Question',
        name: 'ما هي مواعيد عمل صالون الجيمي؟',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'الصالون مفتوح يومياً طوال أيام الأسبوع من الساعة 10:00 صباحاً وحتى الساعة 12:00 منتصف الليل.',
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }}
      />
    </>
  );
};
