import { Meal, Week } from '@/types/menu';

export const MOCK_WEEKS: Week[] = [
    {
        id: 'w-1',
        label: { tr: '14 - 20 Ara', en: 'Dec 14 - 20' },
        deliveryDate: '2025-12-20',
        cutoffDate: '2025-12-15T23:59:00Z', // Past
        isLocked: true // Simulated past week
    },
    {
        id: 'w0',
        label: { tr: '21 - 27 Ara', en: 'Dec 21 - 27' },
        deliveryDate: '2025-12-27',
        cutoffDate: '2025-12-22T23:59:00Z', // Coming soon
        isLocked: false
    },
    {
        id: 'w1',
        label: { tr: '28 Ara - 3 Oca', en: 'Dec 28 - Jan 3' },
        deliveryDate: '2026-01-03',
        cutoffDate: '2025-12-29T23:59:00Z',
        isLocked: false
    },
    {
        id: 'w2',
        label: { tr: '4 - 10 Oca', en: 'Jan 4 - 10' },
        deliveryDate: '2026-01-10',
        cutoffDate: '2026-01-05T23:59:00Z',
        isLocked: false
    }
];

export const MOCK_MEALS: Meal[] = [
    {
        id: 'm1',
        slug: 'kofteli-makarna',
        title: { tr: 'İtalyan Usulü Köfteli Makarna', en: 'Italian Meatball Pasta' },
        subtitle: { tr: 'Fesleğenli domates sos ile', en: 'With basil tomato sauce' },
        image: 'https://images.unsplash.com/photo-1626844131082-256783844137?auto=format&fit=crop&q=80&w=800',
        tags: { prepTime: 25, kcal: 650, protein: 28, category: 'Aile' },
        allergens: ['Gluten', 'Yumurta'],
        ingredients: [{ name: 'Spagetti', amount: '500g' }, { name: 'Kıyma', amount: '300g' }]
    },
    {
        id: 'm2',
        slug: 'tavuk-sis',
        title: { tr: 'Sebzeli Tavuk Şiş', en: 'Chicken Skewers with Veggies' },
        subtitle: { tr: 'Bulgur pilavı eşliğinde', en: 'Side of bulgur pilaf' },
        image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&q=80&w=800',
        tags: { prepTime: 30, kcal: 450, protein: 42, category: 'Fit' },
        allergens: [],
        ingredients: [{ name: 'Tavuk Göğsü', amount: '400g' }, { name: 'Biber', amount: '2 adet' }]
    },
    {
        id: 'm3',
        slug: 'mercimek-corbasi',
        title: { tr: 'Anadolu Mercimek Çorbası', en: 'Anatolian Lentil Soup' },
        subtitle: { tr: 'Kıtır ekmekler ile', en: 'With croutons' },
        image: 'https://images.unsplash.com/photo-1547592166-23acbe32227d?auto=format&fit=crop&q=80&w=800',
        tags: { prepTime: 15, kcal: 320, protein: 12, category: 'Hızlı' },
        allergens: ['Gluten'],
        ingredients: [{ name: 'Kırmızı Mercimek', amount: '200g' }]
    },
    {
        id: 'm4',
        slug: 'izgara-somon',
        title: { tr: 'Izgara Somon', en: 'Grilled Salmon' },
        subtitle: { tr: 'Kuşkonmaz ve patates ile', en: 'With asparagus and potatoes' },
        image: 'https://images.unsplash.com/photo-1467003909585-2f8a7270028d?auto=format&fit=crop&q=80&w=800',
        tags: { prepTime: 25, kcal: 580, protein: 35, category: 'Premium' },
        isPro: true,
        allergens: ['Balık'],
        ingredients: [{ name: 'Somon Fileto', amount: '2 adet' }]
    },
    {
        id: 'm5',
        slug: 'sebzeli-wook',
        title: { tr: 'Sebzeli Wok Noodle', en: 'Veggie Wok Noodles' },
        subtitle: { tr: 'Soya soslu ve susamlı', en: 'Soy sauce and sesame' },
        image: 'https://images.unsplash.com/photo-1585032226651-759b368d7206?auto=format&fit=crop&q=80&w=800',
        tags: { prepTime: 20, kcal: 410, protein: 14, category: 'Vejetaryen' },
        allergens: ['Soya', 'Gluten', 'Susam'],
        ingredients: [{ name: 'Noodle', amount: '300g' }]
    },
    {
        id: 'm6',
        slug: 'karniyarik',
        title: { tr: 'Karnıyarık', en: 'Stuffed Eggplant' },
        subtitle: { tr: 'Geleneksel lezzet', en: 'Traditional taste' },
        image: 'https://images.unsplash.com/photo-1529312266912-b33cf6227e2f?auto=format&fit=crop&q=80&w=800',
        tags: { prepTime: 45, kcal: 520, protein: 18, category: 'Klasik' },
        allergens: [],
        ingredients: [{ name: 'Patlıcan', amount: '4 adet' }, { name: 'Kıyma', amount: '200g' }]
    },
    {
        id: 'm7',
        slug: 'mexican-bowl',
        title: { tr: 'Meksika Kasesi', en: 'Mexican Bowl' },
        subtitle: { tr: 'Avokado, fasulye ve mısır', en: 'Avocado, beans and corn' },
        image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&q=80&w=800',
        tags: { prepTime: 15, kcal: 480, protein: 16, category: 'Fit' },
        allergens: [],
        ingredients: [{ name: 'Fasulye', amount: '100g' }, { name: 'Mısır', amount: '50g' }]
    },
    {
        id: 'm8',
        slug: 'mantar-risotto',
        title: { tr: 'Kremalı Mantar Risotto', en: 'Creamy Mushroom Risotto' },
        subtitle: { tr: 'Parmesan peyniri ile', en: 'With parmesan cheese' },
        image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&q=80&w=800',
        tags: { prepTime: 35, kcal: 600, protein: 14, category: 'Gurme' },
        allergens: ['Süt'],
        ingredients: [{ name: 'Arborio Pirinci', amount: '300g' }, { name: 'Mantar', amount: '200g' }]
    },
    {
        id: 'm9',
        slug: 'hamburger',
        title: { tr: 'Ev Yapımı Burger', en: 'Homemade Burger' },
        subtitle: { tr: 'Karamelize soğanlı', en: 'With caramelized onions' },
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800',
        tags: { prepTime: 25, kcal: 750, protein: 35, category: 'Aile' },
        allergens: ['Gluten', 'Süt'],
        ingredients: [{ name: 'Burger Köftesi', amount: '2 adet' }, { name: 'Burger Ekmeği', amount: '2 adet' }]
    },
    {
        id: 'm10',
        slug: 'firin-tavuk',
        title: { tr: 'Fırında Bütün Tavuk', en: 'Roasted Whole Chicken' },
        subtitle: { tr: 'Kök sebzelerle', en: 'With root vegetables' },
        image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&q=80&w=800',
        tags: { prepTime: 60, kcal: 550, protein: 50, category: 'Ziyafet' },
        allergens: [],
        ingredients: [{ name: 'Bütün Tavuk', amount: '1 adet' }]
    },
    {
        id: 'm11',
        slug: 'falafel-wrap',
        title: { tr: 'Falafel Dürüm', en: 'Falafel Wrap' },
        subtitle: { tr: 'Tahini soslu', en: 'With tahini sauce' },
        image: 'https://images.unsplash.com/photo-1563861020739-16d7a4cb2022?auto=format&fit=crop&q=80&w=800',
        tags: { prepTime: 20, kcal: 420, protein: 15, category: 'Vejetaryen' },
        allergens: ['Gluten', 'Susam'],
        ingredients: [{ name: 'Falafel', amount: '6 adet' }, { name: 'Lavaş', amount: '2 adet' }]
    },
    {
        id: 'm12',
        slug: 'brownie',
        title: { tr: 'Belçika Çikolatalı Brownie', en: 'Belgian Chocolate Brownie' },
        subtitle: { tr: 'Tatlı bitiş', en: 'Sweet finish' },
        image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476d?auto=format&fit=crop&q=80&w=800',
        tags: { prepTime: 40, kcal: 450, protein: 6, category: 'Tatlı' },
        allergens: ['Yumurta', 'Süt', 'Gluten'],
        ingredients: [{ name: 'Bitter Çikolata', amount: '200g' }]
    }
];
