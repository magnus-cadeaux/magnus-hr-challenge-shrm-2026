-- Optional seed: reward inventory rows for multi-iPad stock sharing

insert into public.reward_inventory (
  gift_key, name, description, image_src, tier, stock, reserved, distributed, low_stock_threshold
) values
  ('gift-eco-tote', 'Eco Felt Business Tote', 'Crafted using recycled materials.', '/images/placeholders/gift-eco-tote.svg', 'A', 40, 0, 0, 8),
  ('gift-notebook', 'Magnus Executive Notebook', 'A quiet essential for leaders who capture ideas with intent.', '/images/placeholders/gift-notebook.svg', 'A', 35, 0, 0, 8),
  ('gift-bottle', 'Brushed Steel Desk Bottle', 'Premium daily utility with understated presence.', '/images/placeholders/gift-bottle.svg', 'B', 28, 0, 0, 6),
  ('gift-desk-set', 'Minimal Desk Accent Set', 'Small details that refine a workspace without noise.', '/images/placeholders/gift-desk-set.svg', 'B', 22, 0, 0, 6),
  ('gift-badge', 'Enamel Leadership Pin', 'A discreet mark of participation and craft.', '/images/placeholders/gift-badge.svg', 'C', 50, 0, 0, 10),
  ('gift-premium-case', 'Premium Leather Card Sleeve', 'An elevated keepsake reserved for rare unlocks.', '/images/placeholders/gift-premium-case.svg', 'premium_upgrade', 8, 0, 0, 3)
on conflict (gift_key) do nothing;
