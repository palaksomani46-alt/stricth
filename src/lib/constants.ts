import { Course } from '../types';

export const FALLBACK_COURSES: Course[] = [
  {
    id: 'basic-stitching-001',
    title: 'Fundamental Stitching Mastery',
    description: 'Learn the essentials of machine handling, straight lines, and basic seam finishing.',
    price: 4999,
    thumbnail: 'https://picsum.photos/seed/sewing/800/600',
    category: 'Stitching',
    lessons: ['Machine Setup', 'Thread Selection', 'Practice'],
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'blouse-cutting-002',
    title: 'Professional Blouse Pattern Making',
    description: 'Perfect the art of blouse cutting with precise measurements and dart placement.',
    price: 3499,
    thumbnail: 'https://picsum.photos/seed/blouse/800/600',
    category: 'Pattern Making',
    lessons: ['Measurement Chart', 'Dart Manipulation'],
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'advanced-gown-003',
    title: 'Bridal Gown Construction',
    description: 'Master high-end fashion with complex silhouettes, corsetry, and detailed finishing.',
    price: 12999,
    thumbnail: 'https://picsum.photos/seed/fashion/800/600',
    category: 'Fashion Design',
    lessons: ['Structural Foundations', 'Bonning & Support'],
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'kids-wear-004',
    title: 'Creative Kids Wear Design',
    description: 'Design comfortable and stylish clothing for children of all ages.',
    price: 2999,
    thumbnail: 'https://picsum.photos/seed/kids/800/600',
    category: 'Specialty',
    lessons: ['Size Grading for Kids'],
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'industrial-tailoring-005',
    title: 'Commercial Tailoring Business',
    description: 'Learn how to scale your tailoring shop into a commercial production unit.',
    price: 15499,
    thumbnail: 'https://picsum.photos/seed/factory/800/600',
    category: 'Business',
    lessons: ['Workflow Management'],
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'embroidery-006',
    title: 'Machine Embroidery Arts',
    description: 'Transform plain fabrics into art with intricate machine embroidery techniques.',
    price: 5999,
    thumbnail: 'https://picsum.photos/seed/art/800/600',
    category: 'Decorative',
    lessons: ['Hooping Techniques', 'Thread Gradient'],
    createdAt: '2024-01-01T00:00:00Z'
  }
];
