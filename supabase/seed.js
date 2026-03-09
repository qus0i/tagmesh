import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://rwljtyocybcarctadkdx.supabase.co';
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3bGp0eW9jeWJjYXJjdGFka2R4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzAyOTA5NywiZXhwIjoyMDg4NjA1MDk3fQ.8pfJcNzdizW5MRs7IRKqLP8u-wfh9Shlh1xCuqAVMpA';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// We will use real unsplash fashion/streetwear images for the seed data
const products = [
  {
    name_ar: 'هودي طقمش شتوي أصلي',
    name: 'TagMesh Original Winter Hoodie',
    description_ar: 'هودي شتوي ثقيل من طقمش، خامة فخمة وبتدفي بالبرد. تصميم عصري ومريح للطلعات اليومية.',
    price: 35.00,
    discount_price: 29.99,
    category: 'tops',
    images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800'],
    variants: [
      { color: 'black', color_name_ar: 'أسود', color_hex: '#000000', size: 'M', stock_quantity: 10 },
      { color: 'black', color_name_ar: 'أسود', color_hex: '#000000', size: 'L', stock_quantity: 15 },
      { color: 'gray', color_name_ar: 'رمادي', color_hex: '#808080', size: 'L', stock_quantity: 5 }
    ]
  },
  {
    name_ar: 'تيشيرت أوفر سايز صيفي',
    name: 'Oversize Summer T-Shirt',
    description_ar: 'تيشيرت صيفي قطن 100%، قصة أوفر سايز مريحة جداً. خليك مطقمش ومريح بالصيف.',
    price: 18.00,
    discount_price: null,
    category: 'tops',
    images: ['https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=800'],
    variants: [
      { color: 'white', color_name_ar: 'أبيض', color_hex: '#ffffff', size: 'L', stock_quantity: 20 },
      { color: 'white', color_name_ar: 'أبيض', color_hex: '#ffffff', size: 'XL', stock_quantity: 12 }
    ]
  },
  {
    name_ar: 'بنطلون كارغو جيوب',
    name: 'Cargo Pocket Pants',
    description_ar: 'بنطلون كارغو عملي جداً مع جيوب جانبية، قصة عريضة (وايد ليغ) مناسب لكل الطلعات.',
    price: 25.00,
    discount_price: 22.50,
    category: 'bottoms',
    images: ['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=800'],
    variants: [
      { color: 'olive', color_name_ar: 'زيتي', color_hex: '#556b2f', size: 'M', stock_quantity: 8 },
      { color: 'olive', color_name_ar: 'زيتي', color_hex: '#556b2f', size: 'L', stock_quantity: 15 },
      { color: 'black', color_name_ar: 'أسود', color_hex: '#000000', size: 'L', stock_quantity: 0 } // out of stock
    ]
  },
  {
    name_ar: 'جاكيت بومبر خريفي',
    name: 'Autumn Bomber Jacket',
    description_ar: 'جاكيت بومبر خفيف مناسب للجو الخريفي والشتوي الخفيف. ستايل ستريت وير أصلي.',
    price: 45.00,
    discount_price: 39.00,
    category: 'outerwear',
    images: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caeA?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=800'],
    variants: [
      { color: 'navy', color_name_ar: 'كحلي', color_hex: '#000080', size: 'M', stock_quantity: 5 },
      { color: 'navy', color_name_ar: 'كحلي', color_hex: '#000080', size: 'L', stock_quantity: 2 }
    ]
  }
];

async function seedDatabase() {
  console.log('Starting to seed database...');
  
  for (const prod of products) {
    console.log(`Adding product: ${prod.name_ar}`);
    
    // Insert product
    const { data: productData, error: productError } = await supabase
      .from('products')
      .insert({
        name: prod.name,
        name_ar: prod.name_ar,
        description: null,
        description_ar: prod.description_ar,
        price: prod.price,
        discount_price: prod.discount_price,
        category: prod.category,
        images: prod.images
      })
      .select()
      .single();

    if (productError) {
      console.error(`Error adding product ${prod.name_ar}:`, productError);
      continue;
    }

    // Insert variants
    const variantsToInsert = prod.variants.map(v => ({
      product_id: productData.id,
      color: v.color,
      color_name_ar: v.color_name_ar,
      color_hex: v.color_hex,
      size: v.size,
      stock_quantity: v.stock_quantity
    }));

    const { error: variantError } = await supabase
      .from('product_variants')
      .insert(variantsToInsert);

    if (variantError) {
      console.error(`Error adding variants for ${prod.name_ar}:`, variantError);
    } else {
      console.log(`Added ${variantsToInsert.length} variants for ${prod.name_ar}`);
    }
  }
  
  console.log('Seeding finished!');
}

seedDatabase().catch(console.error);
