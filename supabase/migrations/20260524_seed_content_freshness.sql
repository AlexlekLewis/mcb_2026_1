-- =====================================================================
-- Seed content_freshness with MCB cornerstone pages.
-- ---------------------------------------------------------------------
-- Populates the refresh queue with real URLs from day one so the
-- /dashboard/content Refresh queue tab and Home action queue have
-- something to surface immediately.
--
-- Pages chosen: top-level category pages + the main product detail
-- pages. NOT the 693 suburb pages — those are templated and managed
-- via suburb_audit + the consolidation tooling in PR 4.
--
-- Idempotent — uses upsert on the (existing) `url` unique index.
-- =====================================================================

insert into public.content_freshness (url, title, first_published, last_refreshed, is_cornerstone)
values
  ('/',                                            'Home',                                       '2024-01-01', '2024-01-01', true),
  ('/curtains',                                    'Curtains',                                   '2024-01-01', '2024-01-01', true),
  ('/blinds',                                      'Blinds',                                     '2024-01-01', '2024-01-01', true),
  ('/shutters',                                    'Shutters',                                   '2024-01-01', '2024-01-01', true),
  ('/shutters/plantation-shutters',                'Plantation Shutters',                        '2024-01-01', '2024-01-01', true),
  ('/shutters/plantation-shutters/timber',         'Timber Plantation Shutters',                 '2024-01-01', '2024-01-01', true),
  ('/shutters/plantation-shutters/polymer',        'Polymer Plantation Shutters',                '2024-01-01', '2024-01-01', true),
  ('/shutters/plantation-shutters/aluminium',      'Aluminium Plantation Shutters',              '2024-01-01', '2024-01-01', true),
  ('/shutters/roller-shutters',                    'Roller Shutters',                            '2024-01-01', '2024-01-01', true),
  ('/security',                                    'Security Doors & Screens',                   '2024-01-01', '2024-01-01', true),
  ('/security/security-doors',                     'Security Doors',                             '2024-01-01', '2024-01-01', true),
  ('/security/fly-screens',                        'Fly Screens',                                '2024-01-01', '2024-01-01', true),
  ('/security/pet-mesh',                           'Pet Mesh',                                   '2024-01-01', '2024-01-01', true),
  ('/awnings',                                     'Awnings & Outdoor',                          '2024-01-01', '2024-01-01', true),
  ('/motorisation',                                'Motorisation',                               '2024-01-01', '2024-01-01', true),
  ('/curtains/s-fold-curtains',                    'S-Fold Curtains',                            '2024-01-01', '2024-01-01', true),
  ('/curtains/gathered-curtains',                  'Gathered Curtains',                          '2024-01-01', '2024-01-01', true),
  ('/curtains/translucent-curtains',               'Translucent Curtains',                       '2024-01-01', '2024-01-01', true),
  ('/curtains/velvet',                             'Velvet Curtains',                            '2024-01-01', '2024-01-01', true),
  ('/curtains/linen-look',                         'Linen-Look Curtains',                        '2024-01-01', '2024-01-01', true),
  ('/our-story',                                   'Our Story',                                  '2024-01-01', '2024-01-01', true),
  ('/projects',                                    'Projects',                                   '2024-01-01', '2024-01-01', true)
on conflict (url) do nothing;
