-- Insert price categories
INSERT INTO price_categories (name, slug, description, sort_order) VALUES
  ('Hund', 'hund', 'Priser for hundebehandlinger', 1),
  ('Kat', 'kat', 'Priser for kattebehandlinger', 2),
  ('Kanin', 'kanin', 'Priser for kaninbehandlinger', 3),
  ('Fysiurgisk hundeterapi', 'fysiurgisk-hundeterapi', 'Priser for hundeterapi', 4),
  ('Laboratorie', 'laboratorie', 'Priser for laboratorietests', 5),
  ('Aflivninger', 'aflivninger', 'Priser for aflivninger og kremering', 6);

-- Insert price items for Hund
INSERT INTO price_items (category_id, name, description, price_from, price_note, sort_order)
SELECT id, 'Konsultation', 'Inkl. miljøtillæg', NULL, 'Kontakt os for pris', 1
FROM price_categories WHERE slug = 'hund';

INSERT INTO price_items (category_id, name, description, price_from, price_note, sort_order)
SELECT id, 'Vaccination hund', 'Ekskl. vaccine', NULL, 'Vaccine: Kontakt for pris', 2
FROM price_categories WHERE slug = 'hund';

INSERT INTO price_items (category_id, name, description, price_from, price_note, sort_order)
SELECT id, 'Rabies vaccination + pas', NULL, NULL, 'Kontakt os for pris', 3
FROM price_categories WHERE slug = 'hund';

INSERT INTO price_items (category_id, name, description, price_from, price_note, sort_order)
SELECT id, 'Kastration 1-10 kg', NULL, NULL, 'Kontakt os for pris', 4
FROM price_categories WHERE slug = 'hund';

INSERT INTO price_items (category_id, name, description, price_from, price_note, sort_order)
SELECT id, 'Kastration 10-25 kg', NULL, NULL, 'Kontakt os for pris', 5
FROM price_categories WHERE slug = 'hund';

INSERT INTO price_items (category_id, name, description, price_from, price_note, sort_order)
SELECT id, 'Kastration 25-50 kg', NULL, NULL, 'Kontakt os for pris', 6
FROM price_categories WHERE slug = 'hund';

INSERT INTO price_items (category_id, name, description, price_from, price_note, sort_order)
SELECT id, 'Sterilisation 1-10 kg', NULL, NULL, 'Kontakt os for pris', 7
FROM price_categories WHERE slug = 'hund';

INSERT INTO price_items (category_id, name, description, price_from, price_note, sort_order)
SELECT id, 'Sterilisation 10-25 kg', NULL, NULL, 'Kontakt os for pris', 8
FROM price_categories WHERE slug = 'hund';

INSERT INTO price_items (category_id, name, description, price_from, price_note, sort_order)
SELECT id, 'Sterilisation 25-50 kg', NULL, NULL, 'Kontakt os for pris', 9
FROM price_categories WHERE slug = 'hund';

INSERT INTO price_items (category_id, name, description, price_from, price_note, sort_order)
SELECT id, 'Tandrens inkl. røntgen af alle tænder', NULL, NULL, 'Kontakt os for pris', 10
FROM price_categories WHERE slug = 'hund';

INSERT INTO price_items (category_id, name, description, price_from, price_note, sort_order)
SELECT id, 'Negleklip', NULL, NULL, 'Kontakt os for pris', 11
FROM price_categories WHERE slug = 'hund';

-- Insert price items for Kat
INSERT INTO price_items (category_id, name, description, price_from, price_note, sort_order)
SELECT id, 'Konsultation', 'Inkl. miljøtillæg', NULL, 'Kontakt os for pris', 1
FROM price_categories WHERE slug = 'kat';

INSERT INTO price_items (category_id, name, description, price_from, price_note, sort_order)
SELECT id, 'Vaccination kat', 'Ekskl. vaccine', NULL, 'Vaccine: Kontakt for pris', 2
FROM price_categories WHERE slug = 'kat';

INSERT INTO price_items (category_id, name, description, price_from, price_note, sort_order)
SELECT id, 'Kastration', NULL, NULL, 'Kontakt os for pris', 3
FROM price_categories WHERE slug = 'kat';

INSERT INTO price_items (category_id, name, description, price_from, price_note, sort_order)
SELECT id, 'Sterilisation', NULL, NULL, 'Kontakt os for pris', 4
FROM price_categories WHERE slug = 'kat';

INSERT INTO price_items (category_id, name, description, price_from, price_note, sort_order)
SELECT id, 'Chip, øremærke og registrering ifm. neutralisation', NULL, NULL, 'Kontakt os for pris', 5
FROM price_categories WHERE slug = 'kat';

INSERT INTO price_items (category_id, name, description, price_from, price_note, sort_order)
SELECT id, 'Vaccination ifm. neutralisation', NULL, NULL, 'Kontakt os for pris', 6
FROM price_categories WHERE slug = 'kat';

INSERT INTO price_items (category_id, name, description, price_from, price_note, sort_order)
SELECT id, 'Tandrens inkl. røntgen af alle tænder', NULL, NULL, 'Kontakt os for pris', 7
FROM price_categories WHERE slug = 'kat';

INSERT INTO price_items (category_id, name, description, price_from, price_note, sort_order)
SELECT id, 'Negleklip', NULL, NULL, 'Kontakt os for pris', 8
FROM price_categories WHERE slug = 'kat';

-- Insert price items for Kanin
INSERT INTO price_items (category_id, name, description, price_from, price_note, sort_order)
SELECT id, 'Konsultation', NULL, NULL, 'Kontakt os for pris', 1
FROM price_categories WHERE slug = 'kanin';

INSERT INTO price_items (category_id, name, description, price_from, price_note, sort_order)
SELECT id, 'Vaccination', 'Ekskl. vaccine', NULL, 'Vaccine: Kontakt for pris', 2
FROM price_categories WHERE slug = 'kanin';

INSERT INTO price_items (category_id, name, description, price_from, price_note, sort_order)
SELECT id, 'Kastration', NULL, NULL, 'Kontakt os for pris', 3
FROM price_categories WHERE slug = 'kanin';

INSERT INTO price_items (category_id, name, description, price_from, price_note, sort_order)
SELECT id, 'Sterilisation', NULL, NULL, 'Kontakt os for pris', 4
FROM price_categories WHERE slug = 'kanin';

INSERT INTO price_items (category_id, name, description, price_from, price_note, sort_order)
SELECT id, 'Chip, øremærke og registrering ifm. neutralisation', NULL, NULL, 'Kontakt os for pris', 5
FROM price_categories WHERE slug = 'kanin';

INSERT INTO price_items (category_id, name, description, price_from, price_note, sort_order)
SELECT id, 'Tandslibning i narkose', NULL, NULL, 'Kontakt os for pris', 6
FROM price_categories WHERE slug = 'kanin';

INSERT INTO price_items (category_id, name, description, price_from, price_note, sort_order)
SELECT id, 'Negleklip', NULL, NULL, 'Kontakt os for pris', 7
FROM price_categories WHERE slug = 'kanin';

-- Insert price items for Fysiurgisk hundeterapi
INSERT INTO price_items (category_id, name, description, price_from, price_note, sort_order)
SELECT id, '1. besøg', NULL, NULL, 'Kontakt os for pris', 1
FROM price_categories WHERE slug = 'fysiurgisk-hundeterapi';

INSERT INTO price_items (category_id, name, description, price_from, price_note, sort_order)
SELECT id, 'Opfølgende besøg', NULL, NULL, 'Kontakt os for pris', 2
FROM price_categories WHERE slug = 'fysiurgisk-hundeterapi';

INSERT INTO price_items (category_id, name, description, price_from, price_note, sort_order)
SELECT id, 'Klippekort', 'På x klip', NULL, 'Kontakt os for pris', 3
FROM price_categories WHERE slug = 'fysiurgisk-hundeterapi';

-- Insert price items for Laboratorie
INSERT INTO price_items (category_id, name, description, price_from, price_note, sort_order)
SELECT id, 'Blodprøve inden operation', NULL, NULL, 'Kontakt os for pris', 1
FROM price_categories WHERE slug = 'laboratorie';

INSERT INTO price_items (category_id, name, description, price_from, price_note, sort_order)
SELECT id, 'Baermann og flotation', 'Test for hjerte- og lungeorm samt rundorm og bændelorm', NULL, 'Kontakt os for pris', 2
FROM price_categories WHERE slug = 'laboratorie';

-- Insert price items for Aflivninger
INSERT INTO price_items (category_id, name, description, price_from, price_note, sort_order)
SELECT id, 'Hund 0-10 kg', 'Ekskl. kremering', NULL, 'Kontakt os for pris', 1
FROM price_categories WHERE slug = 'aflivninger';

INSERT INTO price_items (category_id, name, description, price_from, price_note, sort_order)
SELECT id, 'Hund 0-10 kg', 'Inkl. kremering', NULL, 'Kontakt os for pris', 2
FROM price_categories WHERE slug = 'aflivninger';

INSERT INTO price_items (category_id, name, description, price_from, price_note, sort_order)
SELECT id, 'Hund 10-20 kg', 'Ekskl. kremering', NULL, 'Kontakt os for pris', 3
FROM price_categories WHERE slug = 'aflivninger';

INSERT INTO price_items (category_id, name, description, price_from, price_note, sort_order)
SELECT id, 'Hund 10-20 kg', 'Inkl. kremering', NULL, 'Kontakt os for pris', 4
FROM price_categories WHERE slug = 'aflivninger';

INSERT INTO price_items (category_id, name, description, price_from, price_note, sort_order)
SELECT id, 'Hund 20-40 kg', 'Ekskl. kremering', NULL, 'Kontakt os for pris', 5
FROM price_categories WHERE slug = 'aflivninger';

INSERT INTO price_items (category_id, name, description, price_from, price_note, sort_order)
SELECT id, 'Hund 20-40 kg', 'Inkl. kremering', NULL, 'Kontakt os for pris', 6
FROM price_categories WHERE slug = 'aflivninger';

INSERT INTO price_items (category_id, name, description, price_from, price_note, sort_order)
SELECT id, 'Hund 40-60 kg', 'Ekskl. kremering', NULL, 'Kontakt os for pris', 7
FROM price_categories WHERE slug = 'aflivninger';

INSERT INTO price_items (category_id, name, description, price_from, price_note, sort_order)
SELECT id, 'Hund 40-60 kg', 'Inkl. kremering', NULL, 'Kontakt os for pris', 8
FROM price_categories WHERE slug = 'aflivninger';

INSERT INTO price_items (category_id, name, description, price_from, price_note, sort_order)
SELECT id, 'Kat op til 5 kg', 'Ekskl. kremering', NULL, 'Kontakt os for pris', 9
FROM price_categories WHERE slug = 'aflivninger';

INSERT INTO price_items (category_id, name, description, price_from, price_note, sort_order)
SELECT id, 'Kat op til 5 kg', 'Inkl. kremering', NULL, 'Kontakt os for pris', 10
FROM price_categories WHERE slug = 'aflivninger';

INSERT INTO price_items (category_id, name, description, price_from, price_note, sort_order)
SELECT id, 'Kanin og gnavere', 'Ekskl. kremering', NULL, 'Kontakt os for pris', 11
FROM price_categories WHERE slug = 'aflivninger';

INSERT INTO price_items (category_id, name, description, price_from, price_note, sort_order)
SELECT id, 'Kanin og gnavere', 'Inkl. kremering', NULL, 'Kontakt os for pris', 12
FROM price_categories WHERE slug = 'aflivninger';
