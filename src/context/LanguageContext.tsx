import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type Language = 'en' | 'fr' | 'ar';

export interface Translations {
  // Nav
  nav_home: string;
  nav_products: string;
  nav_order_status: string;
  nav_delivery: string;
  nav_contact: string;
  nav_shop_now: string;
  nav_login: string;
  nav_profile: string;
  nav_my_orders: string;
  nav_logout: string;
  nav_search_placeholder: string;
  nav_language: string;

  // Hero
  hero_explore: string;

  // Marquee (kept in English as product names, but separator is translatable)
  marquee_sep: string;

  // Categories
  cat_eyebrow: string;
  cat_heading: string;
  cat_view_all: string;
  cat_sneakers: string;
  cat_clothes: string;
  cat_accessories: string;
  cat_men: string;
  cat_women: string;
  cat_children: string;

  // Featured Product
  feat_eyebrow: string;
  feat_color: string;
  feat_size: string;
  feat_cta: string;
  feat_badge: string;
  feat_discount: string;

  // Product Grid
  grid_eyebrow: string;
  grid_heading: string;
  grid_view_all: string;
  grid_shop: string;
  grid_cat_all: string;
  grid_cat_running: string;
  grid_cat_lifestyle: string;
  grid_cat_training: string;
  grid_cat_basketball: string;

  // Brand Statement
  brand_eyebrow: string;
  brand_line1: string;
  brand_line2: string;
  brand_desc: string;
  brand_stat_reviews: string;
  brand_stat_wilaya: string;
  brand_stat_shipping: string;
  brand_stat_authentic: string;

  // Footer
  footer_tagline: string;
  footer_copyright: string;
  footer_built: string;
  footer_col_collections: string;
  footer_col_support: string;
  footer_col_company: string;
  footer_col_legal: string;

  // Product Card
  pc_sold_out: string;
  pc_featured: string;
  pc_off: string;
  pc_price: string;
  pc_sizes: string;
  pc_reviews: string;

  // Filter Bar
  fb_search_placeholder: string;
  fb_filters: string;
  fb_brand: string;
  fb_all_brands: string;
  fb_max_price: string;
  fb_size: string;
  fb_sort_featured: string;
  fb_sort_price_asc: string;
  fb_sort_price_desc: string;
  fb_sort_rating: string;
  fb_reset: string;
  fb_active_filters: string;
  fb_dept: string;
  fb_brand_label: string;
  fb_under: string;
  fb_size_label: string;
  fb_sorted: string;
  fb_category: string;
  fb_all_products: string;
  fb_showing: string;
  fb_product: string;
  fb_products: string;

  // Products Page
  pp_heading: string;
  pp_subheading: string;
  pp_free_shipping: string;
  pp_est_delivery: string;
  pp_bag: string;
  pp_loading: string;
  pp_error: string;
  pp_no_products: string;
  pp_no_products_sub: string;
  pp_clear_filters: string;
  pp_all: string;
  pp_men: string;
  pp_women: string;
  pp_children: string;

  // Product Detail View
  pdv_brand: string;
  pdv_for: string;
  pdv_share: string;
  pdv_copied: string;
  pdv_reviews: string;
  pdv_in_stock: string;
  pdv_out_of_stock: string;
  pdv_fit_summary: string;
  pdv_fit_no_feedback: string;
  pdv_true_to_size: string;
  pdv_runs_small: string;
  pdv_runs_large: string;
  pdv_select_size: string;
  pdv_standard_fit: string;
  pdv_add_to_bag: string;
  pdv_added: string;
  pdv_free_shipping: string;
  pdv_returns: string;
  pdv_secure_pay: string;
  pdv_write_review: string;
  pdv_login_to_review: string;
  pdv_login: string;
  pdv_verified_only: string;
  pdv_your_rating: string;
  pdv_how_fit: string;
  pdv_share_experience: string;
  pdv_post_review: string;
  pdv_posting: string;
  pdv_loading_reviews: string;
  pdv_no_reviews: string;
  pdv_reviews_for: string;
  pdv_verified_purchase: string;
  pdv_customer_reviews: string;
  pdv_share_look: string;
  pdv_upload_photos: string;
  pdv_upload_photos_sub: string;
  pdv_upload_btn: string;
  pdv_select_size_err: string;
  pdv_review_posted: string;
  pdv_review_error: string;
  pdv_save: string;
  pdv_prev_image: string;
  pdv_next_image: string;
  pdv_image: string;
  pdv_stars: string;
  pdv_to_review_suffix: string;

  // Product Details Page
  pdp_loading: string;
  pdp_not_found: string;
  pdp_back: string;
  pdp_share: string;
  pdp_copied: string;
  pdp_availability: string;
  pdp_in_stock: string;
  pdp_out_of_stock: string;

  // Admin Tracking
  admin_tracking_title: string;
  admin_tracking_placeholder: string;
  admin_tracking_search: string;
  admin_tracking_searching: string;
  admin_tracking_not_found: string;
  admin_tracking_order_details: string;
  admin_tracking_customer: string;
  admin_tracking_phone: string;
  admin_tracking_address: string;
  admin_tracking_total: string;
  admin_tracking_update_status: string;
  admin_tracking_updated: string;
  admin_tracking_update_failed: string;

  // Footer links
  footer_running: string;
  footer_training: string;
  footer_lifestyle: string;
  footer_basketball: string;
  footer_collaborations: string;
  footer_about: string;
  footer_sustainability: string;
  footer_careers: string;
  footer_press: string;
  footer_privacy: string;
  footer_terms: string;
  footer_cookies: string;

  // Cart
  cart_title: string;
  cart_start_shopping: string;
  cart_empty: string;
  cart_empty_sub: string;
  cart_subtotal: string;
  cart_shipping: string;
  cart_free: string;
  cart_tax: string;
  cart_total: string;
  cart_name_placeholder: string;
  cart_phone_placeholder: string;
  cart_address_placeholder: string;
  cart_checkout: string;
  cart_placing: string;
  cart_brand: string;
  cart_size: string;
  cart_order_received: string;
  cart_save_key: string;
  cart_copy_key: string;
  cart_copied: string;
  cart_purchased_items: string;
  cart_ship_to: string;
  cart_customer_details: string;
  cart_order_no: string;
  cart_receipt: string;
  cart_total_paid: string;
  cart_print: string;
  cart_close: string;

  // Auth - Login
  login_eyebrow: string;
  login_heading: string;
  login_no_account: string;
  login_register: string;
  login_email: string;
  login_password: string;
  login_submit: string;
  login_submitting: string;
  login_or: string;
  login_terms: string;
  login_privacy: string;
  login_agree: string;
  login_err_email_required: string;
  login_err_email_invalid: string;
  login_err_password_required: string;
  login_err_password_short: string;
  login_create_account: string;

  // Auth - Register
  reg_eyebrow: string;
  reg_heading: string;
  reg_have_account: string;
  reg_sign_in: string;
  reg_name: string;
  reg_email: string;
  reg_password: string;
  reg_confirm_password: string;
  reg_submit: string;
  reg_submitting: string;
  reg_or: string;
  reg_terms: string;
  reg_privacy: string;
  reg_agree: string;
  reg_err_name_required: string;
  reg_err_name_short: string;
  reg_err_email_required: string;
  reg_err_email_invalid: string;
  reg_err_password_required: string;
  reg_err_password_short: string;
  reg_err_confirm_required: string;
  reg_err_confirm_mismatch: string;
  reg_strength_weak: string;
  reg_strength_fair: string;
  reg_strength_good: string;
  reg_strength_strong: string;

  // Tracking
  track_eyebrow: string;
  track_heading: string;
  track_subheading: string;
  track_placeholder: string;
  track_btn: string;
  track_searching: string;
  track_status: string;
  track_unique_key: string;
  track_order_details: string;
  track_customer: string;
  track_phone: string;
  track_delivery_address: string;
  track_what_next: string;
  track_step1: string;
  track_step2: string;
  track_step3: string;
  track_need_help: string;
  track_live_chat: string;
  track_contact_support: string;
  track_empty: string;
  track_support_title: string;
  track_support_subtitle: string;
  track_support_subject: string;
  track_support_order_key: string;
  track_support_message: string;
  track_support_send: string;
  track_support_sent: string;
  track_support_sent_sub: string;
  track_support_close: string;
  track_status_received: string;
  track_status_received_desc: string;
  track_status_confirmed: string;
  track_status_confirmed_desc: string;
  track_status_contact: string;
  track_status_contact_desc: string;
  track_status_shipped: string;
  track_status_shipped_desc: string;

  // Shipping
  ship_eyebrow: string;
  ship_heading: string;
  ship_subheading: string;
  ship_search_placeholder: string;
  ship_clear: string;
  ship_table_title: string;
  ship_entries: string;
  ship_col_state: string;
  ship_col_home: string;
  ship_col_pickup: string;
  ship_col_time: string;
  ship_no_results: string;
  ship_faq_title: string;
  ship_support_title: string;
  ship_support_sub: string;
  ship_message_placeholder: string;
  ship_send: string;
  ship_toast_sent: string;

  // Contact
  contact_eyebrow: string;
  contact_heading: string;
  contact_subheading: string;
  contact_send_heading: string;
  contact_name: string;
  contact_email: string;
  contact_subject: string;
  contact_subject_placeholder: string;
  contact_message: string;
  contact_message_placeholder: string;
  contact_submit: string;
  contact_submitting: string;
  contact_success_title: string;
  contact_success_sub: string;
  contact_send_another: string;
  contact_faq_title: string;
  contact_how_help: string;
  contact_still_questions: string;
  contact_one_message_away: string;
  contact_concierge_desc: string;
  contact_email_support: string;
  contact_call_us: string;
  contact_follow_us: string;
  contact_open_maps: string;
  contact_quick_answers: string;
  contact_name_placeholder: string;
  contact_support_orders: string;
  contact_support_orders_desc: string;
  contact_support_orders_cta: string;
  contact_support_shipping: string;
  contact_support_shipping_desc: string;
  contact_support_shipping_cta: string;
  contact_support_returns: string;
  contact_support_returns_desc: string;
  contact_support_returns_cta: string;
  contact_support_payments: string;
  contact_support_payments_desc: string;
  contact_support_payments_cta: string;
  // Shipping page extra
  ship_methods_title: string;
  ship_methods_subtitle: string;
  ship_home_title: string;
  ship_home_desc: string;
  ship_home_feat1: string;
  ship_home_feat2: string;
  ship_home_feat3: string;
  ship_home_best: string;
  ship_home_best_val: string;
  ship_pickup_title: string;
  ship_pickup_desc: string;
  ship_pickup_feat1: string;
  ship_pickup_feat2: string;
  ship_pickup_feat3: string;
  ship_pickup_best: string;
  ship_pickup_best_val: string;
  ship_policy_title: string;
  ship_policy_subtitle: string;
  ship_policy_proc_title: string;
  ship_policy_proc_desc: string;
  ship_policy_del_title: string;
  ship_policy_del_desc: string;
  ship_policy_free_title: string;
  ship_policy_free_desc: string;
  ship_policy_ret_title: string;
  ship_policy_ret_desc: string;
  ship_custom_title: string;
  ship_custom_desc: string;
  ship_whatsapp: string;
  ship_email_support: string;
}

const en: Translations = {
  nav_home: 'Home', nav_products: 'Products', nav_order_status: 'Order Status',
  nav_delivery: 'Delivery Info', nav_contact: 'Contact Us', nav_shop_now: 'Shop Now',
  nav_login: 'Login', nav_profile: 'Profile', nav_my_orders: 'My Orders',
  nav_logout: 'Logout', nav_search_placeholder: 'Search...', nav_language: 'Language',

  hero_explore: 'Explore drop',

  marquee_sep: '★',

  cat_eyebrow: 'Find your style', cat_heading: 'Shop by\ncategory', cat_view_all: 'View all products',
  cat_sneakers: 'Sneakers', cat_clothes: 'Clothes', cat_accessories: 'Accessories',
  cat_men: 'Men', cat_women: 'Women', cat_children: 'Children',

  feat_eyebrow: 'Air Max Series — 2025', feat_color: 'Color', feat_size: 'Size',
  feat_cta: 'Shop This Style', feat_badge: 'Limited Edition', feat_discount: '−13%',

  grid_eyebrow: 'Collections', grid_heading: 'THE LINEUP', grid_view_all: 'View All Products',
  grid_shop: 'Shop →', grid_cat_all: 'All', grid_cat_running: 'Running',
  grid_cat_lifestyle: 'Lifestyle', grid_cat_training: 'Training', grid_cat_basketball: 'Basketball',

  brand_eyebrow: 'Our Mission', brand_line1: 'NOT JUST SNEAKERS.', brand_line2: 'A LIFESTYLE.',
  brand_desc: 'At Drippy, we believe sneakers are more than footwear. They represent confidence, creativity, and everyday comfort. We bring authentic collections from the brands you love.',
  brand_stat_reviews: 'Positive Reviews', brand_stat_wilaya: 'Wilaya', brand_stat_shipping: 'Fast Shipping', brand_stat_authentic: 'Authentic Products',

  footer_tagline: 'Engineered for the relentless pursuit of better. Since 2025.',
  footer_copyright: '© 2025 NK Inc. All rights reserved.',
  footer_built: 'Designed with precision. Built for speed.',
  footer_col_collections: 'Collections', footer_col_support: 'Support',
  footer_col_company: 'Company', footer_col_legal: 'Legal',

  pc_sold_out: 'Sold Out', pc_featured: 'Featured', pc_off: 'OFF',
  pc_price: 'Price', pc_sizes: 'Sizes', pc_reviews: 'reviews',

  fb_search_placeholder: 'Search products by title, description or details...',
  fb_filters: 'Filters', fb_brand: 'Brand', fb_all_brands: 'All Brands',
  fb_max_price: 'Max Price', fb_size: 'Size',
  fb_sort_featured: 'Sort: Featured', fb_sort_price_asc: 'Price: Low to High',
  fb_sort_price_desc: 'Price: High to Low', fb_sort_rating: 'Top Rated',
  fb_reset: 'Reset Filters', fb_active_filters: 'Active filters:',
  fb_dept: 'Dept:', fb_brand_label: 'Brand:', fb_under: 'Under $',
  fb_size_label: 'Size:', fb_sorted: 'Sorted',
  fb_category: 'Category:', fb_all_products: 'All Products',
  fb_showing: 'Showing', fb_product: 'Product', fb_products: 'Products',

  pp_heading: 'Our Collections', pp_subheading: 'Discover clean silhouettes, functional designs, and premium organic fabrics tailored for the modern closet.',
  pp_free_shipping: 'Free shipping above 15,000 DA', pp_est_delivery: 'Est. Delivery: 2–3 Days',
  pp_bag: 'Bag', pp_loading: 'Loading products…', pp_error: 'Could not load products. Is the backend running?',
  pp_no_products: 'No Products Found', pp_no_products_sub: 'Try adjusting your keyword search or resetting active filters.',
  pp_clear_filters: 'Clear All Filters', pp_all: 'All Products', pp_men: 'Men', pp_women: 'Women', pp_children: 'Children',

  pdv_review_posted: 'Thanks! Your review was posted.',
  pdv_review_error: 'Could not submit review. Please try again.',
  pdv_save: 'SAVE',
  pdv_prev_image: 'Previous image',
  pdv_next_image: 'Next image',
  pdv_image: 'Image',
  pdv_stars: 'stars',
  pdv_to_review_suffix: 'to leave a review.',

  pdp_loading: 'Loading product details...',
  pdp_not_found: 'Product not found',
  pdp_back: 'Back to Shop',
  pdp_share: 'Share Product',
  pdp_copied: 'Copied!',
  pdp_availability: 'Availability:',
  pdp_in_stock: 'in stock',
  pdp_out_of_stock: 'Out of Stock',

  admin_tracking_title: 'Admin Tracking Panel',
  admin_tracking_placeholder: 'Enter Order UUID...',
  admin_tracking_search: 'Search',
  admin_tracking_searching: 'Searching...',
  admin_tracking_not_found: 'No order found with this UUID.',
  admin_tracking_order_details: 'Order Details',
  admin_tracking_customer: 'Customer',
  admin_tracking_phone: 'Phone',
  admin_tracking_address: 'Address',
  admin_tracking_total: 'Total Price',
  admin_tracking_update_status: 'Update Order Status',
  admin_tracking_updated: 'Status updated successfully!',
  admin_tracking_update_failed: 'Failed to update status.',

  footer_running: 'Running', footer_training: 'Training', footer_lifestyle: 'Lifestyle',
  footer_basketball: 'Basketball', footer_collaborations: 'Collaborations',
  footer_about: 'About Us', footer_sustainability: 'Sustainability',
  footer_careers: 'Careers', footer_press: 'Press',
  footer_privacy: 'Privacy Policy', footer_terms: 'Terms of Service', footer_cookies: 'Cookie Settings',

  pdv_brand: 'Brand', pdv_for: 'for', pdv_share: 'SHARE', pdv_copied: 'COPIED!',
  pdv_reviews: 'reviews', pdv_in_stock: '✓ In Stock', pdv_out_of_stock: 'Out of Stock',
  pdv_fit_summary: 'Customer Fit Summary', pdv_fit_no_feedback: 'No fit feedback yet. Be the first to leave a review below.',
  pdv_true_to_size: 'True to Size', pdv_runs_small: 'Runs Small', pdv_runs_large: 'Runs Large',
  pdv_select_size: 'Select Size', pdv_standard_fit: 'Standard fit',
  pdv_add_to_bag: 'Add to Shopping Bag', pdv_added: 'Added to Bag!',
  pdv_free_shipping: 'Free Shipping', pdv_returns: '30-Day Returns', pdv_secure_pay: 'Secure Pay',
  pdv_write_review: 'Write a Review', pdv_login_to_review: 'Please', pdv_login: 'log in',
  pdv_verified_only: 'Only verified buyers can leave a review.',
  pdv_your_rating: 'Your Rating', pdv_how_fit: 'How did it fit?',
  pdv_share_experience: 'Share your experience with this product...',
  pdv_post_review: 'Post Review', pdv_posting: 'Posting...',
  pdv_loading_reviews: 'Loading reviews...', pdv_no_reviews: 'No reviews yet for this product. Be the first to share your experience!',
  pdv_reviews_for: 'reviews for this product', pdv_verified_purchase: 'Verified Purchase',
  pdv_customer_reviews: 'Customer Reviews', pdv_share_look: 'Share your look',
  pdv_upload_photos: 'Upload real photos of the product and help other shoppers!',
  pdv_upload_photos_sub: 'Upload real photos of the product and help other shoppers!',
  pdv_upload_btn: 'Upload Photos', pdv_select_size_err: 'Please select a size first',

  cart_title: 'Shopping Bag', cart_start_shopping: 'Start Shopping',
  cart_empty: 'Your bag is empty', cart_empty_sub: 'Explore our curation and find comfortable silhouettes designed to last.',
  cart_subtotal: 'Subtotal', cart_shipping: 'Est. Shipping', cart_free: 'FREE',
  cart_tax: 'Est. Tax (8%)', cart_total: 'Total Amount',
  cart_name_placeholder: 'Full Name', cart_phone_placeholder: 'Phone Number', cart_address_placeholder: 'Delivery Address',
  cart_checkout: 'Proceed to Secure Checkout', cart_placing: 'Placing Order...',
  cart_brand: 'Brand:', cart_size: 'Size:', cart_order_received: 'Order Received!',
  cart_save_key: 'Save your Order Key below to track this order later.',
  cart_copy_key: 'Copy Key', cart_copied: 'Copied!', cart_purchased_items: 'Purchased Items',
  cart_ship_to: 'Ship to', cart_customer_details: 'Customer Details',
  cart_order_no: 'Order N°:', cart_receipt: 'Order Receipt / Bon d\'achat',
  cart_total_paid: 'Total Paid:', cart_print: 'Print Receipt (Bon)', cart_close: 'Close Receipt',

  login_eyebrow: 'Welcome back', login_heading: 'Sign In', login_no_account: "Don't have an account?",
  login_register: 'Register', login_email: 'Email', login_password: 'Password',
  login_submit: 'Sign In', login_submitting: 'Signing in…', login_or: 'OR',
  login_terms: 'Terms of Service', login_privacy: 'Privacy Policy',
  login_agree: "By continuing, you agree to Drippy's", login_create_account: 'Create account →',
  login_err_email_required: 'Email is required.', login_err_email_invalid: 'Enter a valid email address.',
  login_err_password_required: 'Password is required.', login_err_password_short: 'Password must be at least 6 characters.',

  reg_eyebrow: 'Join Drippy', reg_heading: 'Create Account', reg_have_account: 'Already have an account?',
  reg_sign_in: 'Sign in', reg_name: 'Full Name', reg_email: 'Email',
  reg_password: 'Password', reg_confirm_password: 'Confirm Password',
  reg_submit: 'Create Account', reg_submitting: 'Creating account…', reg_or: 'OR',
  reg_terms: 'Terms of Service', reg_privacy: 'Privacy Policy',
  reg_agree: "By creating an account, you agree to Drippy's",
  reg_err_name_required: 'Full name is required.', reg_err_name_short: 'Name must be at least 2 characters.',
  reg_err_email_required: 'Email is required.', reg_err_email_invalid: 'Enter a valid email address.',
  reg_err_password_required: 'Password is required.', reg_err_password_short: 'Password must be at least 6 characters.',
  reg_err_confirm_required: 'Please confirm your password.', reg_err_confirm_mismatch: 'Passwords do not match.',
  reg_strength_weak: 'Weak', reg_strength_fair: 'Fair', reg_strength_good: 'Good', reg_strength_strong: 'Strong',

  track_eyebrow: 'Order Status', track_heading: 'Track Your Order',
  track_subheading: 'Enter your Unique Order Key (from your checkout confirmation) to check its current status.',
  track_placeholder: 'Enter your Unique Order UUID Key...',
  track_btn: 'Track', track_searching: 'Searching...',
  track_status: 'Current Status', track_unique_key: 'Unique Key',
  track_order_details: 'Order Details', track_customer: 'Customer',
  track_phone: 'Phone', track_delivery_address: 'Delivery Address',
  track_what_next: 'What Happens Next',
  track_step1: 'We confirm your order and contact you if needed',
  track_step2: 'Your items are prepared and packed for shipping',
  track_step3: 'Your order ships to the address on file',
  track_need_help: 'Need Assistance?', track_live_chat: 'Live Chat Assistance',
  track_contact_support: 'Contact Support', track_empty: 'Enter your Unique Order Key above to see your order\'s current status.',
  track_support_title: 'NK. Support', track_support_subtitle: "We're here to help",
  track_support_subject: 'Subject', track_support_order_key: 'Unique Order Key',
  track_support_message: 'Message', track_support_send: 'Send Message',
  track_support_sent: 'Message Sent', track_support_sent_sub: 'Thanks for reaching out. Our team will get back to you shortly.',
  track_support_close: 'Close Window',
  track_status_received: 'Order Received', track_status_received_desc: 'Your order has been received and is awaiting confirmation.',
  track_status_confirmed: 'Confirmed', track_status_confirmed_desc: 'Your order has been confirmed and is being prepared.',
  track_status_contact: 'Attempting Contact', track_status_contact_desc: "We tried to reach you to confirm your order but couldn't get through. Please check your phone or contact us.",
  track_status_shipped: 'Shipped', track_status_shipped_desc: 'Your order is on its way to you.',

  ship_eyebrow: 'Global Logistics', ship_heading: 'Shipping & Delivery',
  ship_subheading: 'Find delivery fees, shipping methods and estimated delivery times across all regions.',
  ship_search_placeholder: 'Search delivery tariff by state/province...', ship_clear: 'Clear',
  ship_table_title: 'Delivery Tariffs By Region', ship_entries: 'entries shown',
  ship_col_state: 'State / Province', ship_col_home: 'Home Delivery Price',
  ship_col_pickup: 'Pickup Point Price', ship_col_time: 'Est. Delivery Time',
  ship_no_results: 'No results for your search.',
  ship_faq_title: 'Frequently Asked Questions',
  ship_support_title: 'Need Help?', ship_support_sub: 'Send us a message and we\'ll get back to you.',
  ship_toast_sent: 'Message sent successfully. Our concierge will contact you.',

  contact_eyebrow: '24/7 Support', contact_heading: 'Get In\nTouch',
  contact_subheading: 'Have a question, a concern, or just want to say hello? Our team is here and happy to help — every time.',
  contact_send_heading: 'Send a Message', contact_name: 'Full Name *', contact_email: 'Email Address *',
  contact_subject: 'Subject', contact_subject_placeholder: 'Select a topic',
  contact_message: 'Message *', contact_message_placeholder: 'How can we help you?',
  contact_submit: 'Send Message', contact_submitting: 'Sending...',
  contact_success_title: 'Message Sent!', contact_success_sub: "We'll get back to you within 24 hours. Check your inbox.",
  contact_send_another: 'Send Another', contact_faq_title: 'Frequently Asked Questions',
  contact_how_help: 'How Can We Help?',
  contact_still_questions: 'Still have questions?',
  contact_one_message_away: "We're One Message Away",
  contact_concierge_desc: 'Our concierge team responds within 24 hours. For urgent matters, reach us by phone during working hours.',
  contact_email_support: 'Email Support',
  contact_call_us: 'Call Us',
  contact_follow_us: 'Follow Us',
  contact_open_maps: 'Open in Maps',
  contact_quick_answers: 'Quick Answers',
  contact_name_placeholder: 'Your name',
  contact_support_orders: 'Orders',
  contact_support_orders_desc: 'Track your package, check order status, or modify a recent purchase before it ships.',
  contact_support_orders_cta: 'Track Order',
  contact_support_shipping: 'Shipping',
  contact_support_shipping_desc: 'Explore delivery times, shipping rates, and available logistics options by region.',
  contact_support_shipping_cta: 'View Rates',
  contact_support_returns: 'Returns',
  contact_support_returns_desc: 'Free returns within 30 days. Start a return or exchange quickly through our portal.',
  contact_support_returns_cta: 'Start Return',
  contact_support_payments: 'Payments',
  contact_support_payments_desc: "Questions about billing, refunds, or payment methods? We've got you covered.",
  contact_support_payments_cta: 'Payment FAQ',
  ship_methods_title: 'Shipping Methods',
  ship_methods_subtitle: 'Tailored for convenience',
  ship_home_title: 'Home Delivery',
  ship_home_desc: 'Experience seamless home drop-offs with signature confirmation. Every package is packed in custom climate-sealed containers.',
  ship_home_feat1: 'Delivered directly to your door address',
  ship_home_feat2: 'Next-day express delivery in primary hubs',
  ship_home_feat3: 'Secured handling & signature confirmation',
  ship_home_best: 'BEST FOR:',
  ship_home_best_val: 'Premium convenience',
  ship_pickup_title: 'Pickup Point',
  ship_pickup_desc: 'Collect your items from one of our partner courier offices at your leisure. A budget-friendly, secured shipping alternative.',
  ship_pickup_feat1: 'Pick up from nearest delivery center',
  ship_pickup_feat2: 'Lower shipping costs across all regions',
  ship_pickup_feat3: 'Flexible pickup times (Held securely for 7 days)',
  ship_pickup_best: 'BEST FOR:',
  ship_pickup_best_val: 'Cost-efficiency',
  ship_policy_title: 'Shipping Policy',
  ship_policy_subtitle: 'Transparency is key',
  ship_policy_proc_title: 'Processing Time',
  ship_policy_proc_desc: 'Orders placed before 2:00 PM are packaged and dispatched same-day. Orders placed afterwards are processed next business morning.',
  ship_policy_del_title: 'Delivery Time',
  ship_policy_del_desc: 'Home delivery shipments arrive within 1 to 4 days depending on state proximity. Standard courier tracking begins upon handover.',
  ship_policy_free_title: 'Free Shipping Conditions',
  ship_policy_free_desc: 'Patrons receive complimentary standard shipping on orders exceeding 15,000 DA. Applied automatically during secure checkout.',
  ship_policy_ret_title: 'Easy Returns & Exchanges',
  ship_policy_ret_desc: 'We offer a complimentary 30-day return policy. Items must be unworn and returned in their original packaging sleeve.',
  ship_custom_title: 'Have Custom Shipping Needs?',
  ship_custom_desc: 'Our elite concierge team is ready to coordinate custom delivery terms, bulk shipments, and regional delivery routing.',
  ship_whatsapp: 'WhatsApp Concierge',
  ship_email_support: 'Email Support',
  ship_message_placeholder: 'Drop a quick message to our concierge...',
  ship_send: 'Send',
};

const fr: Translations = {
  nav_home: 'Accueil', nav_products: 'Produits', nav_order_status: 'Suivi Commande',
  nav_delivery: 'Livraison', nav_contact: 'Contact', nav_shop_now: 'Acheter',
  nav_login: 'Connexion', nav_profile: 'Profil', nav_my_orders: 'Mes Commandes',
  nav_logout: 'Déconnexion', nav_search_placeholder: 'Rechercher...', nav_language: 'Langue',

  hero_explore: 'Voir la collection',

  marquee_sep: '★',

  cat_eyebrow: 'Trouvez votre style', cat_heading: 'Acheter par\ncatégorie', cat_view_all: 'Voir tous les produits',
  cat_sneakers: 'Sneakers', cat_clothes: 'Vêtements', cat_accessories: 'Accessoires',
  cat_men: 'Hommes', cat_women: 'Femmes', cat_children: 'Enfants',

  feat_eyebrow: 'Série Air Max — 2025', feat_color: 'Couleur', feat_size: 'Taille',
  feat_cta: 'Acheter ce Style', feat_badge: 'Édition Limitée', feat_discount: '−13%',

  grid_eyebrow: 'Collections', grid_heading: 'LE LINEUP', grid_view_all: 'Voir Tous les Produits',
  grid_shop: 'Acheter →', grid_cat_all: 'Tous', grid_cat_running: 'Running',
  grid_cat_lifestyle: 'Lifestyle', grid_cat_training: 'Training', grid_cat_basketball: 'Basketball',

  brand_eyebrow: 'Notre Mission', brand_line1: 'PAS QUE DES SNEAKERS.', brand_line2: 'UN MODE DE VIE.',
  brand_desc: 'Chez Drippy, nous croyons que les sneakers sont plus que des chaussures. Elles représentent la confiance, la créativité et le confort quotidien. Nous proposons des collections authentiques des marques que vous aimez.',
  brand_stat_reviews: 'Avis Positifs', brand_stat_wilaya: 'Wilaya', brand_stat_shipping: 'Livraison Rapide', brand_stat_authentic: 'Produits Authentiques',

  footer_tagline: 'Conçu pour la poursuite incessante du meilleur. Depuis 2025.',
  footer_copyright: '© 2025 NK Inc. Tous droits réservés.',
  footer_built: 'Conçu avec précision. Optimisé pour la vitesse.',
  footer_col_collections: 'Collections', footer_col_support: 'Support',
  footer_col_company: 'Entreprise', footer_col_legal: 'Légal',

  pc_sold_out: 'Épuisé', pc_featured: 'Vedette', pc_off: 'RÉD.',
  pc_price: 'Prix', pc_sizes: 'Tailles', pc_reviews: 'avis',

  fb_search_placeholder: 'Rechercher par titre, description ou détails...',
  fb_filters: 'Filtres', fb_brand: 'Marque', fb_all_brands: 'Toutes Marques',
  fb_max_price: 'Prix Max', fb_size: 'Taille',
  fb_sort_featured: 'Trier: Vedettes', fb_sort_price_asc: 'Prix: Croissant',
  fb_sort_price_desc: 'Prix: Décroissant', fb_sort_rating: 'Mieux Noté',
  fb_reset: 'Réinitialiser', fb_active_filters: 'Filtres actifs:',
  fb_dept: 'Dépt:', fb_brand_label: 'Marque:', fb_under: 'Moins de $',
  fb_size_label: 'Taille:', fb_sorted: 'Trié',
  fb_category: 'Catégorie:', fb_all_products: 'Tous Produits',
  fb_showing: 'Affichage', fb_product: 'Produit', fb_products: 'Produits',

  pp_heading: 'Nos Collections', pp_subheading: 'Découvrez des silhouettes épurées, des designs fonctionnels et des tissus premium pour le dressing moderne.',
  pp_free_shipping: 'Livraison gratuite dès 15 000 DA', pp_est_delivery: 'Livraison estimée: 2–3 jours',
  pp_bag: 'Panier', pp_loading: 'Chargement des produits…', pp_error: 'Impossible de charger les produits.',
  pp_no_products: 'Aucun Produit Trouvé', pp_no_products_sub: 'Essayez de modifier vos filtres ou votre recherche.',
  pp_clear_filters: 'Effacer les Filtres', pp_all: 'Tous', pp_men: 'Hommes', pp_women: 'Femmes', pp_children: 'Enfants',

  pdv_review_posted: 'Merci! Votre avis a été publié.',
  pdv_review_error: 'Impossible de soumettre l\'avis. Réessayez.',
  pdv_save: 'ÉCON.',
  pdv_prev_image: 'Image précédente',
  pdv_next_image: 'Image suivante',
  pdv_image: 'Image',
  pdv_stars: 'étoiles',
  pdv_to_review_suffix: 'pour laisser un avis.',

  pdp_loading: 'Chargement du produit...',
  pdp_not_found: 'Produit introuvable',
  pdp_back: 'Retour à la boutique',
  pdp_share: 'Partager',
  pdp_copied: 'Copié!',
  pdp_availability: 'Disponibilité:',
  pdp_in_stock: 'en stock',
  pdp_out_of_stock: 'Rupture de stock',

  admin_tracking_title: 'Panneau Admin Suivi',
  admin_tracking_placeholder: 'Entrez l\'UUID de commande...',
  admin_tracking_search: 'Rechercher',
  admin_tracking_searching: 'Recherche...',
  admin_tracking_not_found: 'Aucune commande trouvée.',
  admin_tracking_order_details: 'Détails de la commande',
  admin_tracking_customer: 'Client',
  admin_tracking_phone: 'Téléphone',
  admin_tracking_address: 'Adresse',
  admin_tracking_total: 'Total',
  admin_tracking_update_status: 'Mettre à jour le statut',
  admin_tracking_updated: 'Statut mis à jour!',
  admin_tracking_update_failed: 'Échec de la mise à jour.',

  footer_running: 'Running', footer_training: 'Training', footer_lifestyle: 'Lifestyle',
  footer_basketball: 'Basketball', footer_collaborations: 'Collaborations',
  footer_about: 'À propos', footer_sustainability: 'Durabilité',
  footer_careers: 'Carrières', footer_press: 'Presse',
  footer_privacy: 'Politique de Confidentialité', footer_terms: 'CGU', footer_cookies: 'Cookies',

  pdv_brand: 'Marque', pdv_for: 'pour', pdv_share: 'PARTAGER', pdv_copied: 'COPIÉ!',
  pdv_reviews: 'avis', pdv_in_stock: '✓ En Stock', pdv_out_of_stock: 'Rupture de Stock',
  pdv_fit_summary: 'Résumé des Tailles', pdv_fit_no_feedback: 'Aucun avis de taille. Soyez le premier à laisser un avis.',
  pdv_true_to_size: 'Taille Fidèle', pdv_runs_small: 'Taille Petit', pdv_runs_large: 'Taille Grand',
  pdv_select_size: 'Choisir la Taille', pdv_standard_fit: 'Coupe standard',
  pdv_add_to_bag: 'Ajouter au Panier', pdv_added: 'Ajouté!',
  pdv_free_shipping: 'Livraison Gratuite', pdv_returns: 'Retours 30j', pdv_secure_pay: 'Paiement Sécurisé',
  pdv_write_review: 'Écrire un Avis', pdv_login_to_review: 'Veuillez', pdv_login: 'vous connecter',
  pdv_verified_only: 'Seuls les acheteurs vérifiés peuvent laisser un avis.',
  pdv_your_rating: 'Votre Note', pdv_how_fit: 'Comment ça taille?',
  pdv_share_experience: 'Partagez votre expérience avec ce produit...',
  pdv_post_review: 'Publier', pdv_posting: 'Publication...',
  pdv_loading_reviews: 'Chargement des avis...', pdv_no_reviews: 'Aucun avis pour ce produit. Soyez le premier!',
  pdv_reviews_for: 'avis pour ce produit', pdv_verified_purchase: 'Achat Vérifié',
  pdv_customer_reviews: 'Avis Clients', pdv_share_look: 'Partagez votre look',
  pdv_upload_photos: 'Téléchargez vos photos du produit et aidez les autres acheteurs!',
  pdv_upload_photos_sub: 'Téléchargez vos photos du produit et aidez les autres acheteurs!',
  pdv_upload_btn: 'Télécharger', pdv_select_size_err: 'Veuillez d\'abord sélectionner une taille',

  cart_title: 'Panier', cart_start_shopping: 'Continuer',
  cart_empty: 'Votre panier est vide', cart_empty_sub: 'Explorez notre sélection et trouvez des silhouettes confortables.',
  cart_subtotal: 'Sous-total', cart_shipping: 'Livraison estimée', cart_free: 'GRATUIT',
  cart_tax: 'TVA estimée (8%)', cart_total: 'Total',
  cart_name_placeholder: 'Nom Complet', cart_phone_placeholder: 'Numéro de Téléphone', cart_address_placeholder: 'Adresse de Livraison',
  cart_checkout: 'Passer à la Caisse', cart_placing: 'Commande en cours...',
  cart_brand: 'Marque:', cart_size: 'Taille:', cart_order_received: 'Commande Reçue!',
  cart_save_key: 'Notez votre clé de commande pour suivre cette commande.',
  cart_copy_key: 'Copier', cart_copied: 'Copié!', cart_purchased_items: 'Articles Achetés',
  cart_ship_to: 'Livrer à', cart_customer_details: 'Coordonnées',
  cart_order_no: 'Commande N°:', cart_receipt: 'Reçu de Commande',
  cart_total_paid: 'Total Payé:', cart_print: 'Imprimer le Reçu', cart_close: 'Fermer',

  login_eyebrow: 'Bon retour', login_heading: 'Connexion', login_no_account: 'Pas encore de compte?',
  login_register: 'S\'inscrire', login_email: 'Email', login_password: 'Mot de passe',
  login_submit: 'Se Connecter', login_submitting: 'Connexion…', login_or: 'OU',
  login_terms: 'CGU', login_privacy: 'Politique de Confidentialité',
  login_agree: 'En continuant, vous acceptez les', login_create_account: 'Créer un compte →',
  login_err_email_required: 'Email requis.', login_err_email_invalid: 'Email invalide.',
  login_err_password_required: 'Mot de passe requis.', login_err_password_short: 'Au moins 6 caractères.',

  reg_eyebrow: 'Rejoindre Drippy', reg_heading: 'Créer un Compte', reg_have_account: 'Vous avez déjà un compte?',
  reg_sign_in: 'Se connecter', reg_name: 'Nom Complet', reg_email: 'Email',
  reg_password: 'Mot de passe', reg_confirm_password: 'Confirmer le mot de passe',
  reg_submit: 'Créer un Compte', reg_submitting: 'Création en cours…', reg_or: 'OU',
  reg_terms: 'CGU', reg_privacy: 'Politique de Confidentialité',
  reg_agree: 'En créant un compte, vous acceptez les',
  reg_err_name_required: 'Nom complet requis.', reg_err_name_short: 'Au moins 2 caractères.',
  reg_err_email_required: 'Email requis.', reg_err_email_invalid: 'Email invalide.',
  reg_err_password_required: 'Mot de passe requis.', reg_err_password_short: 'Au moins 6 caractères.',
  reg_err_confirm_required: 'Confirmez votre mot de passe.', reg_err_confirm_mismatch: 'Les mots de passe ne correspondent pas.',
  reg_strength_weak: 'Faible', reg_strength_fair: 'Passable', reg_strength_good: 'Bon', reg_strength_strong: 'Fort',

  track_eyebrow: 'Suivi Commande', track_heading: 'Suivre ma Commande',
  track_subheading: 'Entrez votre clé de commande unique (reçue lors de la confirmation) pour vérifier son statut.',
  track_placeholder: 'Entrez votre clé UUID unique...', track_btn: 'Suivre', track_searching: 'Recherche...',
  track_status: 'Statut Actuel', track_unique_key: 'Clé Unique',
  track_order_details: 'Détails de la Commande', track_customer: 'Client',
  track_phone: 'Téléphone', track_delivery_address: 'Adresse de Livraison',
  track_what_next: 'La suite', track_step1: 'Nous confirmons votre commande et vous contactons si besoin',
  track_step2: 'Vos articles sont préparés et emballés pour l\'expédition',
  track_step3: 'Votre commande est expédiée à l\'adresse indiquée',
  track_need_help: 'Besoin d\'aide?', track_live_chat: 'Chat en Direct',
  track_contact_support: 'Contacter le Support', track_empty: 'Entrez votre clé de commande ci-dessus.',
  track_support_title: 'NK. Support', track_support_subtitle: 'Nous sommes là pour vous aider',
  track_support_subject: 'Sujet', track_support_order_key: 'Clé de Commande',
  track_support_message: 'Message', track_support_send: 'Envoyer',
  track_support_sent: 'Message Envoyé', track_support_sent_sub: 'Merci. Notre équipe vous répondra rapidement.',
  track_support_close: 'Fermer',
  track_status_received: 'Commande Reçue', track_status_received_desc: 'Votre commande a été reçue et attend confirmation.',
  track_status_confirmed: 'Confirmée', track_status_confirmed_desc: 'Votre commande est confirmée et en préparation.',
  track_status_contact: 'Tentative de Contact', track_status_contact_desc: 'Nous avons essayé de vous joindre. Veuillez vérifier votre téléphone.',
  track_status_shipped: 'Expédiée', track_status_shipped_desc: 'Votre commande est en route.',

  ship_eyebrow: 'Logistique Mondiale', ship_heading: 'Livraison & Expédition',
  ship_subheading: 'Trouvez les frais de livraison, les méthodes et les délais estimés dans toutes les régions.',
  ship_search_placeholder: 'Rechercher par wilaya...', ship_clear: 'Effacer',
  ship_table_title: 'Tarifs de Livraison par Région', ship_entries: 'résultats',
  ship_col_state: 'Wilaya', ship_col_home: 'Livraison à Domicile', ship_col_pickup: 'Point Relais', ship_col_time: 'Délai Estimé',
  ship_no_results: 'Aucun résultat.',
  ship_faq_title: 'Questions Fréquentes',
  ship_support_title: 'Besoin d\'aide?', ship_support_sub: 'Envoyez-nous un message.',
  ship_toast_sent: 'Message envoyé. Notre équipe vous contactera.',

  contact_eyebrow: 'Support 24/7', contact_heading: 'Nous\nContacter',
  contact_subheading: 'Vous avez une question? Notre équipe est disponible et prête à vous aider.',
  contact_send_heading: 'Envoyer un Message', contact_name: 'Nom Complet *', contact_email: 'Adresse Email *',
  contact_subject: 'Sujet', contact_subject_placeholder: 'Choisir un sujet',
  contact_message: 'Message *', contact_message_placeholder: 'Comment pouvons-nous vous aider?',
  contact_submit: 'Envoyer', contact_submitting: 'Envoi...',
  contact_success_title: 'Message Envoyé!', contact_success_sub: 'Nous vous répondrons dans les 24 heures.',
  contact_send_another: 'Envoyer un autre', contact_faq_title: 'Questions Fréquentes',
  contact_how_help: 'Comment Pouvons-Nous Aider?',
  contact_still_questions: 'Des questions?',
  contact_one_message_away: 'Un Message Suffit',
  contact_concierge_desc: 'Notre équipe répond en 24h. Pour les urgences, appelez-nous pendant les heures ouvrables.',
  contact_email_support: 'Email Support',
  contact_call_us: 'Nous Appeler',
  contact_follow_us: 'Suivez-Nous',
  contact_open_maps: 'Ouvrir sur Maps',
  contact_quick_answers: 'Réponses Rapides',
  contact_name_placeholder: 'Votre nom',
  contact_support_orders: 'Commandes',
  contact_support_orders_desc: 'Suivez votre colis, vérifiez le statut ou modifiez une commande récente.',
  contact_support_orders_cta: 'Suivre',
  contact_support_shipping: 'Livraison',
  contact_support_shipping_desc: 'Consultez les délais, tarifs et options logistiques par région.',
  contact_support_shipping_cta: 'Voir Tarifs',
  contact_support_returns: 'Retours',
  contact_support_returns_desc: 'Retours gratuits sous 30 jours. Lancez un retour ou échange rapidement.',
  contact_support_returns_cta: 'Retour',
  contact_support_payments: 'Paiements',
  contact_support_payments_desc: 'Questions sur la facturation, les remboursements ou les moyens de paiement?',
  contact_support_payments_cta: 'FAQ Paiements',
  ship_methods_title: 'Méthodes de Livraison',
  ship_methods_subtitle: 'Adaptées pour votre confort',
  ship_home_title: 'Livraison à Domicile',
  ship_home_desc: 'Livraison sans effort avec confirmation de signature. Chaque colis est emballé dans des contenants hermétiques.',
  ship_home_feat1: 'Livré directement à votre porte',
  ship_home_feat2: 'Livraison express J+1 dans les grandes villes',
  ship_home_feat3: 'Manutention sécurisée et confirmation de signature',
  ship_home_best: 'IDÉAL POUR:',
  ship_home_best_val: 'Confort premium',
  ship_pickup_title: 'Point Relais',
  ship_pickup_desc: 'Récupérez vos articles dans un de nos bureaux partenaires. Une alternative sécurisée et économique.',
  ship_pickup_feat1: 'Retrait au centre de livraison le plus proche',
  ship_pickup_feat2: 'Frais réduits dans toutes les régions',
  ship_pickup_feat3: 'Horaires flexibles (Gardé 7 jours)',
  ship_pickup_best: 'IDÉAL POUR:',
  ship_pickup_best_val: 'Économies',
  ship_policy_title: 'Politique de Livraison',
  ship_policy_subtitle: 'La transparence avant tout',
  ship_policy_proc_title: 'Temps de Traitement',
  ship_policy_proc_desc: 'Les commandes passées avant 14h sont expédiées le jour même. Les autres sont traitées le lendemain matin.',
  ship_policy_del_title: 'Délai de Livraison',
  ship_policy_del_desc: 'Les livraisons arrivent en 1 à 4 jours selon la proximité. Le suivi commence à la remise au transporteur.',
  ship_policy_free_title: 'Livraison Gratuite',
  ship_policy_free_desc: 'Livraison standard offerte pour les commandes dépassant 15 000 DA. Appliquée automatiquement.',
  ship_policy_ret_title: 'Retours & Échanges Faciles',
  ship_policy_ret_desc: 'Politique de retour gratuite sous 30 jours. Les articles doivent être non portés dans leur emballage d\'origine.',
  ship_custom_title: 'Besoins Spéciaux de Livraison?',
  ship_custom_desc: 'Notre équipe est prête à coordonner des conditions de livraison personnalisées, des envois en gros et du routage régional.',
  ship_whatsapp: 'Concierge WhatsApp',
  ship_email_support: 'Email Support',
  ship_message_placeholder: 'Laissez un message rapide à notre concierge...',
  ship_send: 'Envoyer',
};

const ar: Translations = {
  nav_home: 'الرئيسية', nav_products: 'المنتجات', nav_order_status: 'تتبع الطلب',
  nav_delivery: 'معلومات التوصيل', nav_contact: 'اتصل بنا', nav_shop_now: 'تسوق الآن',
  nav_login: 'تسجيل الدخول', nav_profile: 'الملف الشخصي', nav_my_orders: 'طلباتي',
  nav_logout: 'تسجيل الخروج', nav_search_placeholder: 'بحث...', nav_language: 'اللغة',

  hero_explore: 'استكشف المجموعة',

  marquee_sep: '★',

  cat_eyebrow: 'اعثر على أسلوبك', cat_heading: 'تسوق حسب\nالفئة', cat_view_all: 'عرض جميع المنتجات',
  cat_sneakers: 'أحذية رياضية', cat_clothes: 'ملابس', cat_accessories: 'إكسسوارات',
  cat_men: 'رجال', cat_women: 'نساء', cat_children: 'أطفال',

  feat_eyebrow: 'سلسلة Air Max — 2025', feat_color: 'اللون', feat_size: 'المقاس',
  feat_cta: 'تسوق هذا الطراز', feat_badge: 'إصدار محدود', feat_discount: '−13%',

  grid_eyebrow: 'المجموعات', grid_heading: 'التشكيلة', grid_view_all: 'عرض جميع المنتجات',
  grid_shop: 'تسوق ←', grid_cat_all: 'الكل', grid_cat_running: 'جري',
  grid_cat_lifestyle: 'لايف ستايل', grid_cat_training: 'تدريب', grid_cat_basketball: 'كرة سلة',

  brand_eyebrow: 'مهمتنا', brand_line1: 'ليست مجرد أحذية.', brand_line2: 'إنها أسلوب حياة.',
  brand_desc: 'في Drippy، نؤمن بأن الأحذية الرياضية أكثر من مجرد حذاء. إنها تجسّد الثقة والإبداع والراحة اليومية. نقدّم مجموعات أصيلة من العلامات التي تحبها.',
  brand_stat_reviews: 'آراء إيجابية', brand_stat_wilaya: 'ولاية', brand_stat_shipping: 'شحن سريع', brand_stat_authentic: 'منتجات أصيلة',

  footer_tagline: 'مصمم لمواصلة التميز. منذ 2025.',
  footer_copyright: '© 2025 NK Inc. جميع الحقوق محفوظة.',
  footer_built: 'صُمّم بدقة. بُني للسرعة.',
  footer_col_collections: 'المجموعات', footer_col_support: 'الدعم',
  footer_col_company: 'الشركة', footer_col_legal: 'قانوني',

  pc_sold_out: 'نفذ المخزون', pc_featured: 'مميز', pc_off: 'خصم',
  pc_price: 'السعر', pc_sizes: 'المقاسات', pc_reviews: 'تقييم',

  fb_search_placeholder: 'ابحث عن منتجات بالعنوان أو الوصف...',
  fb_filters: 'الفلاتر', fb_brand: 'الماركة', fb_all_brands: 'جميع الماركات',
  fb_max_price: 'الحد الأقصى للسعر', fb_size: 'المقاس',
  fb_sort_featured: 'الترتيب: المميزة', fb_sort_price_asc: 'السعر: من الأقل',
  fb_sort_price_desc: 'السعر: من الأعلى', fb_sort_rating: 'الأعلى تقييماً',
  fb_reset: 'إعادة ضبط', fb_active_filters: 'الفلاتر النشطة:',
  fb_dept: 'القسم:', fb_brand_label: 'الماركة:', fb_under: 'أقل من $',
  fb_size_label: 'المقاس:', fb_sorted: 'مرتّب',
  fb_category: 'الفئة:', fb_all_products: 'جميع المنتجات',
  fb_showing: 'عرض', fb_product: 'منتج', fb_products: 'منتجات',

  pp_heading: 'مجموعاتنا', pp_subheading: 'اكتشف تصاميم نظيفة وأقمشة فاخرة للخزانة العصرية.',
  pp_free_shipping: 'شحن مجاني فوق 15,000 دج', pp_est_delivery: 'التسليم المتوقع: 2–3 أيام',
  pp_bag: 'الحقيبة', pp_loading: 'جارٍ تحميل المنتجات…', pp_error: 'تعذر تحميل المنتجات.',
  pp_no_products: 'لا توجد منتجات', pp_no_products_sub: 'حاول تعديل بحثك أو إعادة ضبط الفلاتر.',
  pp_clear_filters: 'مسح الفلاتر', pp_all: 'الكل', pp_men: 'رجال', pp_women: 'نساء', pp_children: 'أطفال',

  pdv_review_posted: 'شكراً! تم نشر تقييمك.',
  pdv_review_error: 'تعذر إرسال التقييم. حاول مجدداً.',
  pdv_save: 'وفّر',
  pdv_prev_image: 'الصورة السابقة',
  pdv_next_image: 'الصورة التالية',
  pdv_image: 'صورة',
  pdv_stars: 'نجوم',
  pdv_to_review_suffix: 'لترك تقييم.',

  pdp_loading: 'جارٍ تحميل تفاصيل المنتج...',
  pdp_not_found: 'المنتج غير موجود',
  pdp_back: 'العودة للمتجر',
  pdp_share: 'مشاركة المنتج',
  pdp_copied: 'تم النسخ!',
  pdp_availability: 'التوفر:',
  pdp_in_stock: 'في المخزون',
  pdp_out_of_stock: 'نفذ المخزون',

  admin_tracking_title: 'لوحة تتبع المسؤول',
  admin_tracking_placeholder: 'أدخل UUID الطلب...',
  admin_tracking_search: 'بحث',
  admin_tracking_searching: 'جارٍ البحث...',
  admin_tracking_not_found: 'لم يتم العثور على طلب بهذا UUID.',
  admin_tracking_customer: 'العميل',
  admin_tracking_phone: 'الهاتف',
  admin_tracking_address: 'العنوان',
  admin_tracking_total: 'الإجمالي',
  admin_tracking_update_status: 'تحديث حالة الطلب',
  admin_tracking_updated: 'تم تحديث الحالة!',
  admin_tracking_update_failed: 'فشل تحديث الحالة.',
  admin_tracking_order_details: 'تفاصيل الطلب',

  footer_running: 'جري', footer_training: 'تدريب', footer_lifestyle: 'لايف ستايل',
  footer_basketball: 'كرة سلة', footer_collaborations: 'تعاونات',
  footer_about: 'من نحن', footer_sustainability: 'الاستدامة',
  footer_careers: 'وظائف', footer_press: 'الصحافة',
  footer_privacy: 'سياسة الخصوصية', footer_terms: 'الشروط والأحكام', footer_cookies: 'إعدادات الكوكيز',

  pdv_brand: 'الماركة', pdv_for: 'لـ', pdv_share: 'مشاركة', pdv_copied: 'تم النسخ!',
  pdv_reviews: 'تقييم', pdv_in_stock: '✓ متوفر', pdv_out_of_stock: 'نفذ المخزون',
  pdv_fit_summary: 'ملخص المقاسات', pdv_fit_no_feedback: 'لا توجد ملاحظات عن المقاس بعد.',
  pdv_true_to_size: 'مقاس صحيح', pdv_runs_small: 'يجري صغيراً', pdv_runs_large: 'يجري كبيراً',
  pdv_select_size: 'اختر المقاس', pdv_standard_fit: 'قياس عادي',
  pdv_add_to_bag: 'أضف إلى الحقيبة', pdv_added: 'أضيف!',
  pdv_free_shipping: 'شحن مجاني', pdv_returns: 'إرجاع 30 يوم', pdv_secure_pay: 'دفع آمن',
  pdv_write_review: 'اكتب تقييماً', pdv_login_to_review: 'يرجى', pdv_login: 'تسجيل الدخول',
  pdv_verified_only: 'يمكن للمشترين الموثقين فقط ترك تقييم.',
  pdv_your_rating: 'تقييمك', pdv_how_fit: 'كيف كان المقاس؟',
  pdv_share_experience: 'شارك تجربتك مع هذا المنتج...',
  pdv_post_review: 'نشر التقييم', pdv_posting: 'جارٍ النشر...',
  pdv_loading_reviews: 'تحميل التقييمات...', pdv_no_reviews: 'لا توجد تقييمات بعد. كن أول من يشارك تجربته!',
  pdv_reviews_for: 'تقييم لهذا المنتج', pdv_verified_purchase: 'شراء موثق',
  pdv_customer_reviews: 'تقييمات العملاء', pdv_share_look: 'شارك مظهرك',
  pdv_upload_photos: 'ارفع صوراً حقيقية للمنتج وساعد المتسوقين الآخرين!',
  pdv_upload_photos_sub: 'ارفع صوراً حقيقية للمنتج وساعد المتسوقين الآخرين!',
  pdv_upload_btn: 'رفع الصور', pdv_select_size_err: 'يرجى اختيار مقاس أولاً',

  cart_title: 'حقيبة التسوق', cart_start_shopping: 'تسوق الآن',
  cart_empty: 'حقيبتك فارغة', cart_empty_sub: 'استكشف مجموعتنا وجد ما يناسبك.',
  cart_subtotal: 'المجموع الفرعي', cart_shipping: 'الشحن المتوقع', cart_free: 'مجاني',
  cart_tax: 'ضريبة متوقعة (8%)', cart_total: 'المجموع الكلي',
  cart_name_placeholder: 'الاسم الكامل', cart_phone_placeholder: 'رقم الهاتف', cart_address_placeholder: 'عنوان التسليم',
  cart_checkout: 'إتمام الشراء', cart_placing: 'جارٍ الطلب...',
  cart_brand: 'الماركة:', cart_size: 'المقاس:', cart_order_received: 'تم استلام الطلب!',
  cart_save_key: 'احفظ مفتاح طلبك لتتبعه لاحقاً.',
  cart_copy_key: 'نسخ', cart_copied: 'تم النسخ!', cart_purchased_items: 'المنتجات المشتراة',
  cart_ship_to: 'الشحن إلى', cart_customer_details: 'بيانات العميل',
  cart_order_no: 'طلب رقم:', cart_receipt: 'إيصال الطلب',
  cart_total_paid: 'المجموع المدفوع:', cart_print: 'طباعة الإيصال', cart_close: 'إغلاق',

  login_eyebrow: 'مرحباً بعودتك', login_heading: 'تسجيل الدخول', login_no_account: 'ليس لديك حساب؟',
  login_register: 'سجّل الآن', login_email: 'البريد الإلكتروني', login_password: 'كلمة المرور',
  login_submit: 'دخول', login_submitting: 'جارٍ الدخول…', login_or: 'أو',
  login_terms: 'الشروط والأحكام', login_privacy: 'سياسة الخصوصية',
  login_agree: 'بالاستمرار، أنت توافق على', login_create_account: 'إنشاء حساب →',
  login_err_email_required: 'البريد الإلكتروني مطلوب.', login_err_email_invalid: 'بريد إلكتروني غير صالح.',
  login_err_password_required: 'كلمة المرور مطلوبة.', login_err_password_short: 'يجب أن تكون 6 أحرف على الأقل.',

  reg_eyebrow: 'انضم إلى Drippy', reg_heading: 'إنشاء حساب', reg_have_account: 'لديك حساب بالفعل؟',
  reg_sign_in: 'تسجيل الدخول', reg_name: 'الاسم الكامل', reg_email: 'البريد الإلكتروني',
  reg_password: 'كلمة المرور', reg_confirm_password: 'تأكيد كلمة المرور',
  reg_submit: 'إنشاء الحساب', reg_submitting: 'جارٍ الإنشاء…', reg_or: 'أو',
  reg_terms: 'الشروط والأحكام', reg_privacy: 'سياسة الخصوصية',
  reg_agree: 'بإنشاء حساب، أنت توافق على',
  reg_err_name_required: 'الاسم الكامل مطلوب.', reg_err_name_short: 'حرفان على الأقل.',
  reg_err_email_required: 'البريد الإلكتروني مطلوب.', reg_err_email_invalid: 'بريد إلكتروني غير صالح.',
  reg_err_password_required: 'كلمة المرور مطلوبة.', reg_err_password_short: 'يجب أن تكون 6 أحرف على الأقل.',
  reg_err_confirm_required: 'يرجى تأكيد كلمة المرور.', reg_err_confirm_mismatch: 'كلمتا المرور غير متطابقتين.',
  reg_strength_weak: 'ضعيفة', reg_strength_fair: 'مقبولة', reg_strength_good: 'جيدة', reg_strength_strong: 'قوية',

  track_eyebrow: 'حالة الطلب', track_heading: 'تتبع طلبك',
  track_subheading: 'أدخل مفتاح طلبك الفريد (من تأكيد الطلب) للتحقق من حالته.',
  track_placeholder: 'أدخل مفتاح UUID الخاص بطلبك...', track_btn: 'تتبع', track_searching: 'جارٍ البحث...',
  track_status: 'الحالة الحالية', track_unique_key: 'المفتاح الفريد',
  track_order_details: 'تفاصيل الطلب', track_customer: 'العميل',
  track_phone: 'الهاتف', track_delivery_address: 'عنوان التسليم',
  track_what_next: 'ماذا يحدث بعد ذلك',
  track_step1: 'نؤكد طلبك ونتواصل معك إذا لزم الأمر',
  track_step2: 'يتم تجهيز وتعبئة مقتنياتك للشحن',
  track_step3: 'يتم شحن طلبك إلى عنوانك',
  track_need_help: 'تحتاج مساعدة؟', track_live_chat: 'الدردشة المباشرة',
  track_contact_support: 'التواصل مع الدعم', track_empty: 'أدخل مفتاح طلبك أعلاه لمعرفة الحالة.',
  track_support_title: 'NK. الدعم', track_support_subtitle: 'نحن هنا لمساعدتك',
  track_support_subject: 'الموضوع', track_support_order_key: 'مفتاح الطلب',
  track_support_message: 'الرسالة', track_support_send: 'إرسال',
  track_support_sent: 'تم إرسال الرسالة', track_support_sent_sub: 'شكراً. سيرد فريقنا في أقرب وقت.',
  track_support_close: 'إغلاق',
  track_status_received: 'تم استلام الطلب', track_status_received_desc: 'تم استلام طلبك وينتظر التأكيد.',
  track_status_confirmed: 'مؤكد', track_status_confirmed_desc: 'تم تأكيد طلبك وهو قيد التحضير.',
  track_status_contact: 'محاولة التواصل', track_status_contact_desc: 'حاولنا الاتصال بك. يرجى التحقق من هاتفك.',
  track_status_shipped: 'تم الشحن', track_status_shipped_desc: 'طلبك في الطريق إليك.',

  ship_eyebrow: 'اللوجستيات العالمية', ship_heading: 'الشحن والتسليم',
  ship_subheading: 'ابحث عن رسوم التوصيل والطرق والمواعيد المتوقعة في جميع المناطق.',
  ship_search_placeholder: 'البحث حسب الولاية...', ship_clear: 'مسح',
  ship_table_title: 'تعريفات التوصيل حسب المنطقة', ship_entries: 'نتيجة معروضة',
  ship_col_state: 'الولاية', ship_col_home: 'سعر التوصيل للمنزل', ship_col_pickup: 'سعر نقطة الاستلام', ship_col_time: 'الوقت المتوقع',
  ship_no_results: 'لا توجد نتائج.',
  ship_faq_title: 'الأسئلة الشائعة',
  ship_support_title: 'تحتاج مساعدة؟', ship_support_sub: 'أرسل لنا رسالة وسنرد عليك.',
  ship_toast_sent: 'تم إرسال الرسالة. سيتواصل معك فريقنا.',

  contact_eyebrow: 'دعم 24/7', contact_heading: 'تواصل\nمعنا',
  contact_subheading: 'هل لديك سؤال أو استفسار؟ فريقنا هنا لمساعدتك في أي وقت.',
  contact_send_heading: 'إرسال رسالة', contact_name: 'الاسم الكامل *', contact_email: 'البريد الإلكتروني *',
  contact_subject: 'الموضوع', contact_subject_placeholder: 'اختر موضوعاً',
  contact_message: 'الرسالة *', contact_message_placeholder: 'كيف يمكننا مساعدتك؟',
  contact_submit: 'إرسال', contact_submitting: 'جارٍ الإرسال...',
  contact_success_title: 'تم إرسال الرسالة!', contact_success_sub: 'سنرد عليك خلال 24 ساعة.',
  contact_send_another: 'إرسال رسالة أخرى', contact_faq_title: 'الأسئلة الشائعة',
  contact_how_help: 'كيف يمكننا المساعدة؟',
  contact_still_questions: 'لا تزال لديك أسئلة؟',
  contact_one_message_away: 'رسالة واحدة تكفي',
  contact_concierge_desc: 'يرد فريقنا خلال 24 ساعة. للأمور العاجلة، اتصل بنا خلال ساعات العمل.',
  contact_email_support: 'البريد الإلكتروني',
  contact_call_us: 'اتصل بنا',
  contact_follow_us: 'تابعنا',
  contact_open_maps: 'فتح على الخريطة',
  contact_quick_answers: 'إجابات سريعة',
  contact_name_placeholder: 'اسمك',
  contact_support_orders: 'الطلبات',
  contact_support_orders_desc: 'تتبع طردك، تحقق من حالة الطلب، أو عدّل طلباً حديثاً.',
  contact_support_orders_cta: 'تتبع الطلب',
  contact_support_shipping: 'الشحن',
  contact_support_shipping_desc: 'استعرض مواعيد التسليم وأسعار الشحن والخيارات اللوجستية.',
  contact_support_shipping_cta: 'عرض الأسعار',
  contact_support_returns: 'الإرجاع',
  contact_support_returns_desc: 'إرجاع مجاني خلال 30 يوماً. ابدأ عملية الإرجاع أو الاستبدال بسهولة.',
  contact_support_returns_cta: 'بدء الإرجاع',
  contact_support_payments: 'المدفوعات',
  contact_support_payments_desc: 'أسئلة حول الفواتير أو استرداد المبالغ أو طرق الدفع؟',
  contact_support_payments_cta: 'أسئلة الدفع',
  ship_methods_title: 'طرق الشحن',
  ship_methods_subtitle: 'مصممة لراحتك',
  ship_home_title: 'التوصيل للمنزل',
  ship_home_desc: 'تجربة توصيل سلسة مع تأكيد التوقيع. كل طرد معبأ في حاويات محكمة الإغلاق.',
  ship_home_feat1: 'توصيل مباشر إلى بابك',
  ship_home_feat2: 'توصيل سريع في اليوم التالي في المدن الكبرى',
  ship_home_feat3: 'معالجة آمنة وتأكيد توقيع',
  ship_home_best: 'الأنسب لـ:',
  ship_home_best_val: 'الراحة المميزة',
  ship_pickup_title: 'نقطة الاستلام',
  ship_pickup_desc: 'استلم أغراضك من أحد مكاتب شركاء التوصيل في وقتك. بديل شحن آمن واقتصادي.',
  ship_pickup_feat1: 'الاستلام من أقرب مركز توصيل',
  ship_pickup_feat2: 'تكاليف شحن أقل في جميع المناطق',
  ship_pickup_feat3: 'أوقات استلام مرنة (محفوظ بأمان 7 أيام)',
  ship_pickup_best: 'الأنسب لـ:',
  ship_pickup_best_val: 'التوفير في التكاليف',
  ship_policy_title: 'سياسة الشحن',
  ship_policy_subtitle: 'الشفافية أولاً',
  ship_policy_proc_title: 'وقت المعالجة',
  ship_policy_proc_desc: 'الطلبات المقدمة قبل الساعة 2 ظهراً تُشحن في نفس اليوم. الطلبات اللاحقة تُعالج صباح اليوم التالي.',
  ship_policy_del_title: 'وقت التسليم',
  ship_policy_del_desc: 'تصل الشحنات المنزلية خلال 1 إلى 4 أيام حسب قرب الولاية. يبدأ التتبع عند التسليم.',
  ship_policy_free_title: 'شروط الشحن المجاني',
  ship_policy_free_desc: 'شحن عادي مجاني للطلبات التي تتجاوز 15,000 دج. يُطبق تلقائياً عند الدفع.',
  ship_policy_ret_title: 'إرجاع واستبدال سهل',
  ship_policy_ret_desc: 'نوفر سياسة إرجاع مجانية لمدة 30 يوماً. يجب أن تكون المنتجات غير مرتداة في عبوتها الأصلية.',
  ship_custom_title: 'هل لديك احتياجات شحن خاصة؟',
  ship_custom_desc: 'فريق خدماتنا المميز مستعد لتنسيق شروط التسليم المخصصة والشحن بالجملة.',
  ship_whatsapp: 'واتساب',
  ship_email_support: 'البريد الإلكتروني',
  ship_message_placeholder: 'اترك رسالة سريعة لفريق الخدمة...',
  ship_send: 'إرسال',
};

const TRANSLATIONS: Record<Language, Translations> = { en, fr, ar };

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: Translations;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANG_KEY = 'drippy_lang';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem(LANG_KEY) as Language | null;
    return saved && ['en', 'fr', 'ar'].includes(saved) ? saved : 'en';
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem(LANG_KEY, newLang);
  };

  const isRTL = lang === 'ar';

  useEffect(() => {
    document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', lang);
  }, [lang, isRTL]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: TRANSLATIONS[lang], isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang must be used within LanguageProvider');
  return ctx;
}
