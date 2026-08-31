-- ============ ROLES ============
create type public.app_role as enum ('admin','moderator','user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "Users can read their own roles" on public.user_roles
  for select to authenticated using (auth.uid() = user_id);
create policy "Admins can read all roles" on public.user_roles
  for select to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "Admins can manage roles" on public.user_roles
  for all to authenticated using (public.has_role(auth.uid(),'admin'))
  with check (public.has_role(auth.uid(),'admin'));

create or replace function public.admin_exists()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where role = 'admin')
$$;
grant execute on function public.admin_exists() to anon, authenticated;

create or replace function public.claim_first_admin()
returns boolean language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid();
begin
  if uid is null then return false; end if;
  if exists (select 1 from public.user_roles where role = 'admin') then return false; end if;
  insert into public.user_roles (user_id, role) values (uid, 'admin')
    on conflict (user_id, role) do nothing;
  return true;
end;
$$;
grant execute on function public.claim_first_admin() to authenticated;

-- shared updated_at trigger fn
create or replace function public.update_updated_at_column()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end; $$;

-- ============ USER PROFILES ============
create table public.user_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique,
  full_name text,
  whatsapp text,
  email text,
  address text,
  locality text,
  pincode text,
  lat double precision,
  lng double precision,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update on public.user_profiles to authenticated;
grant all on public.user_profiles to service_role;
alter table public.user_profiles enable row level security;
create policy "Users manage their own profile" on public.user_profiles
  for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Admins can read all profiles" on public.user_profiles
  for select to authenticated using (public.has_role(auth.uid(),'admin'));
create trigger user_profiles_updated_at before update on public.user_profiles
  for each row execute function public.update_updated_at_column();

-- ============ VEHICLE CATALOGUE ============
create table public.vehicle_brands (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  vehicle_type text not null default 'car',
  logo_url text,
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.vehicle_brands to anon;
grant select, insert, update, delete on public.vehicle_brands to authenticated;
grant all on public.vehicle_brands to service_role;
alter table public.vehicle_brands enable row level security;
create policy "Anyone can read active brands" on public.vehicle_brands
  for select to anon, authenticated using (active or public.has_role(auth.uid(),'admin'));
create policy "Admins manage brands" on public.vehicle_brands
  for all to authenticated using (public.has_role(auth.uid(),'admin'))
  with check (public.has_role(auth.uid(),'admin'));
create trigger vehicle_brands_updated_at before update on public.vehicle_brands
  for each row execute function public.update_updated_at_column();

create table public.vehicle_models (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references public.vehicle_brands(id) on delete cascade,
  slug text not null,
  name text not null,
  body_type text,
  fuel_types text[] not null default '{}',
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (brand_id, slug)
);
create index vehicle_models_brand_idx on public.vehicle_models(brand_id);
grant select on public.vehicle_models to anon;
grant select, insert, update, delete on public.vehicle_models to authenticated;
grant all on public.vehicle_models to service_role;
alter table public.vehicle_models enable row level security;
create policy "Anyone can read active models" on public.vehicle_models
  for select to anon, authenticated using (active or public.has_role(auth.uid(),'admin'));
create policy "Admins manage models" on public.vehicle_models
  for all to authenticated using (public.has_role(auth.uid(),'admin'))
  with check (public.has_role(auth.uid(),'admin'));
create trigger vehicle_models_updated_at before update on public.vehicle_models
  for each row execute function public.update_updated_at_column();

create table public.vehicle_variants (
  id uuid primary key default gen_random_uuid(),
  model_id uuid not null references public.vehicle_models(id) on delete cascade,
  name text not null,
  fuel_type text,
  transmission text,
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index vehicle_variants_model_idx on public.vehicle_variants(model_id);
grant select on public.vehicle_variants to anon;
grant select, insert, update, delete on public.vehicle_variants to authenticated;
grant all on public.vehicle_variants to service_role;
alter table public.vehicle_variants enable row level security;
create policy "Anyone can read active variants" on public.vehicle_variants
  for select to anon, authenticated using (active or public.has_role(auth.uid(),'admin'));
create policy "Admins manage variants" on public.vehicle_variants
  for all to authenticated using (public.has_role(auth.uid(),'admin'))
  with check (public.has_role(auth.uid(),'admin'));
create trigger vehicle_variants_updated_at before update on public.vehicle_variants
  for each row execute function public.update_updated_at_column();

-- ============ LEADS (bookings + enquiries) ============
create table public.leads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  lead_type text not null default 'booking',
  vehicle_type text not null default 'car',
  items text[] not null default '{}',
  brand_id uuid references public.vehicle_brands(id) on delete set null,
  model_id uuid references public.vehicle_models(id) on delete set null,
  variant_id uuid references public.vehicle_variants(id) on delete set null,
  brand_name text,
  model_name text,
  variant_name text,
  manufacture_year integer,
  km_driven integer,
  fuel_type text,
  registration_number text,
  has_photo boolean not null default false,
  photo_url text,
  locality text,
  pincode text,
  address text,
  name text not null,
  email text,
  subject text,
  message text,
  phone text not null,
  preferred_date date,
  slot text,
  lat double precision,
  lng double precision,
  status text not null default 'new',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant insert on public.leads to anon;
grant select, insert, update, delete on public.leads to authenticated;
grant all on public.leads to service_role;
alter table public.leads enable row level security;
create policy "Anyone can submit a lead" on public.leads
  for insert to anon, authenticated with check (true);
create policy "Users can read their own leads" on public.leads
  for select to authenticated using (auth.uid() = user_id);
create policy "Admins can read all leads" on public.leads
  for select to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "Admins can update leads" on public.leads
  for update to authenticated using (public.has_role(auth.uid(),'admin'))
  with check (public.has_role(auth.uid(),'admin'));
create policy "Admins can delete leads" on public.leads
  for delete to authenticated using (public.has_role(auth.uid(),'admin'));
create trigger leads_updated_at before update on public.leads
  for each row execute function public.update_updated_at_column();

-- ============ SERVICE LOCATIONS ============
create table public.service_locations (
  id uuid primary key default gen_random_uuid(),
  location_type text not null default 'area',
  pincode text,
  area text,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.service_locations to anon;
grant select, insert, update, delete on public.service_locations to authenticated;
grant all on public.service_locations to service_role;
alter table public.service_locations enable row level security;
create policy "Anyone can read service locations" on public.service_locations
  for select to anon, authenticated using (true);
create policy "Admins manage service locations" on public.service_locations
  for all to authenticated using (public.has_role(auth.uid(),'admin'))
  with check (public.has_role(auth.uid(),'admin'));
create trigger service_locations_updated_at before update on public.service_locations
  for each row execute function public.update_updated_at_column();

insert into public.service_locations (location_type, area, pincode, sort_order) values
('area','HBR Layout','560043',1),('area','Nagawara','560045',2),('area','Koramangala','560034',3),
('area','Indiranagar','560038',4),('area','HSR Layout','560102',5),('area','Whitefield','560066',6),
('area','Marathahalli','560037',7),('area','BTM Layout','560076',8),('area','Jayanagar','560011',9),
('area','JP Nagar','560078',10),('area','Electronic City','560100',11),('area','Bellandur','560103',12),
('area','Sarjapur Road','560035',13),('area','Banashankari','560070',14),('area','Rajajinagar','560010',15),
('area','Malleshwaram','560003',16),('area','Hebbal','560024',17),('area','Yelahanka','560064',18),
('area','KR Puram','560036',19),('area','Bommanahalli','560068',20),('area','Kalyan Nagar','560043',21),
('area','Banaswadi','560043',22),('area','RT Nagar','560032',23),('area','Sahakar Nagar','560092',24),
('area','Jakkur','560064',25),('area','Kothanur','560077',26),('area','Thanisandra','560077',27),
('area','Horamavu','560043',28),('area','Ramamurthy Nagar','560016',29),('area','Mahadevapura','560048',30),
('area','Brookefield','560037',31),('area','Kundalahalli','560037',32),('area','Kadugodi','560067',33),
('area','Domlur','560071',34),('area','Cox Town','560005',35),('area','Frazer Town','560005',36),
('area','Basavanagudi','560004',37),('area','Vijayanagar','560040',38),('area','Yeshwanthpur','560022',39),
('area','Peenya','560058',40),('area','Hennur','560043',41),('area','Kammanahalli','560084',42),
('area','Manyata Tech Park','560045',43);

-- ============ SEED VEHICLE CATALOGUE ============
insert into public.vehicle_brands (slug, name, vehicle_type, sort_order) values
('maruti-suzuki','Maruti Suzuki','car',1),
('hyundai','Hyundai','car',2),
('tata','Tata','car',3),
('mahindra','Mahindra','car',4),
('honda','Honda','car',5),
('toyota','Toyota','car',6),
('kia','Kia','car',7),
('renault','Renault','car',8),
('volkswagen','Volkswagen','car',9),
('skoda','Skoda','car',10),
('ford','Ford','car',11),
('mg','MG','car',12),
('nissan','Nissan','car',13),
('bmw','BMW','car',14),
('mercedes-benz','Mercedes-Benz','car',15),
('audi','Audi','car',16),
('hero-motocorp','Hero MotoCorp','bike',20),
('honda-two-wheeler','Honda 2-Wheeler','bike',21),
('bajaj','Bajaj','bike',22),
('tvs','TVS','bike',23),
('royal-enfield','Royal Enfield','bike',24),
('yamaha','Yamaha','bike',25),
('suzuki-two-wheeler','Suzuki 2-Wheeler','bike',26),
('ktm','KTM','bike',27),
('ola-electric','Ola Electric','scooter',30),
('ather','Ather','scooter',31),
('tata-commercial','Tata Motors Commercial','commercial',40),
('ashok-leyland','Ashok Leyland','commercial',41),
('mahindra-commercial','Mahindra Commercial','commercial',42),
('piaggio','Piaggio','commercial',43);

insert into public.vehicle_models (brand_id, slug, name, body_type, sort_order)
select b.id, m.slug, m.name, m.body_type, m.sort_order
from public.vehicle_brands b
join (values
('maruti-suzuki','alto','Alto','Hatchback',1),
('maruti-suzuki','swift','Swift','Hatchback',2),
('maruti-suzuki','baleno','Baleno','Hatchback',3),
('maruti-suzuki','wagon-r','Wagon R','Hatchback',4),
('maruti-suzuki','dzire','Dzire','Sedan',5),
('maruti-suzuki','ciaz','Ciaz','Sedan',6),
('maruti-suzuki','brezza','Brezza','SUV',7),
('maruti-suzuki','ertiga','Ertiga','MUV',8),
('maruti-suzuki','celerio','Celerio','Hatchback',9),
('maruti-suzuki','ignis','Ignis','Hatchback',10),
('maruti-suzuki','s-presso','S-Presso','Hatchback',11),
('maruti-suzuki','fronx','Fronx','SUV',12),
('maruti-suzuki','grand-vitara','Grand Vitara','SUV',13),
('maruti-suzuki','xl6','XL6','MUV',14),
('hyundai','i10-nios','Grand i10 Nios','Hatchback',1),
('hyundai','i20','i20','Hatchback',2),
('hyundai','santro','Santro','Hatchback',3),
('hyundai','aura','Aura','Sedan',4),
('hyundai','verna','Verna','Sedan',5),
('hyundai','venue','Venue','SUV',6),
('hyundai','creta','Creta','SUV',7),
('hyundai','alcazar','Alcazar','SUV',8),
('hyundai','tucson','Tucson','SUV',9),
('hyundai','exter','Exter','SUV',10),
('tata','tiago','Tiago','Hatchback',1),
('tata','altroz','Altroz','Hatchback',2),
('tata','tigor','Tigor','Sedan',3),
('tata','punch','Punch','SUV',4),
('tata','nexon','Nexon','SUV',5),
('tata','harrier','Harrier','SUV',6),
('tata','safari','Safari','SUV',7),
('tata','curvv','Curvv','SUV',8),
('mahindra','bolero','Bolero','SUV',1),
('mahindra','scorpio','Scorpio','SUV',2),
('mahindra','scorpio-n','Scorpio N','SUV',3),
('mahindra','thar','Thar','SUV',4),
('mahindra','xuv300','XUV300','SUV',5),
('mahindra','xuv700','XUV700','SUV',6),
('mahindra','xuv400','XUV400 EV','SUV',7),
('mahindra','marazzo','Marazzo','MUV',8),
('honda','city','City','Sedan',1),
('honda','amaze','Amaze','Sedan',2),
('honda','jazz','Jazz','Hatchback',3),
('honda','wr-v','WR-V','SUV',4),
('honda','elevate','Elevate','SUV',5),
('honda','civic','Civic','Sedan',6),
('toyota','innova-crysta','Innova Crysta','MUV',1),
('toyota','innova-hycross','Innova Hycross','MUV',2),
('toyota','fortuner','Fortuner','SUV',3),
('toyota','glanza','Glanza','Hatchback',4),
('toyota','urban-cruiser','Urban Cruiser','SUV',5),
('toyota','etios','Etios','Sedan',6),
('toyota','camry','Camry','Sedan',7),
('kia','seltos','Seltos','SUV',1),
('kia','sonet','Sonet','SUV',2),
('kia','carens','Carens','MUV',3),
('kia','carnival','Carnival','MUV',4),
('kia','ev6','EV6','SUV',5),
('renault','kwid','Kwid','Hatchback',1),
('renault','triber','Triber','MUV',2),
('renault','kiger','Kiger','SUV',3),
('renault','duster','Duster','SUV',4),
('volkswagen','polo','Polo','Hatchback',1),
('volkswagen','vento','Vento','Sedan',2),
('volkswagen','virtus','Virtus','Sedan',3),
('volkswagen','taigun','Taigun','SUV',4),
('skoda','rapid','Rapid','Sedan',1),
('skoda','slavia','Slavia','Sedan',2),
('skoda','kushaq','Kushaq','SUV',3),
('skoda','octavia','Octavia','Sedan',4),
('ford','figo','Figo','Hatchback',1),
('ford','aspire','Aspire','Sedan',2),
('ford','ecosport','EcoSport','SUV',3),
('ford','endeavour','Endeavour','SUV',4),
('mg','hector','Hector','SUV',1),
('mg','astor','Astor','SUV',2),
('mg','zs-ev','ZS EV','SUV',3),
('mg','comet-ev','Comet EV','Hatchback',4),
('nissan','magnite','Magnite','SUV',1),
('nissan','kicks','Kicks','SUV',2),
('nissan','sunny','Sunny','Sedan',3),
('bmw','3-series','3 Series','Sedan',1),
('bmw','5-series','5 Series','Sedan',2),
('bmw','x1','X1','SUV',3),
('bmw','x3','X3','SUV',4),
('mercedes-benz','c-class','C-Class','Sedan',1),
('mercedes-benz','e-class','E-Class','Sedan',2),
('mercedes-benz','gla','GLA','SUV',3),
('mercedes-benz','glc','GLC','SUV',4),
('audi','a4','A4','Sedan',1),
('audi','a6','A6','Sedan',2),
('audi','q3','Q3','SUV',3),
('audi','q5','Q5','SUV',4),
('hero-motocorp','splendor-plus','Splendor Plus','Commuter',1),
('hero-motocorp','hf-deluxe','HF Deluxe','Commuter',2),
('hero-motocorp','passion-pro','Passion Pro','Commuter',3),
('hero-motocorp','glamour','Glamour','Commuter',4),
('hero-motocorp','xpulse-200','Xpulse 200','Adventure',5),
('hero-motocorp','destini-125','Destini 125','Scooter',6),
('honda-two-wheeler','activa','Activa','Scooter',1),
('honda-two-wheeler','dio','Dio','Scooter',2),
('honda-two-wheeler','shine','Shine','Commuter',3),
('honda-two-wheeler','unicorn','Unicorn','Commuter',4),
('honda-two-wheeler','sp-125','SP 125','Commuter',5),
('honda-two-wheeler','hness-cb350','H''ness CB350','Cruiser',6),
('bajaj','pulsar-150','Pulsar 150','Sports',1),
('bajaj','pulsar-125','Pulsar 125','Commuter',2),
('bajaj','pulsar-ns200','Pulsar NS200','Sports',3),
('bajaj','platina','Platina','Commuter',4),
('bajaj','ct-100','CT 100','Commuter',5),
('bajaj','dominar-400','Dominar 400','Tourer',6),
('bajaj','avenger','Avenger','Cruiser',7),
('bajaj','chetak','Chetak EV','Scooter',8),
('tvs','jupiter','Jupiter','Scooter',1),
('tvs','ntorq-125','NTorq 125','Scooter',2),
('tvs','apache-rtr-160','Apache RTR 160','Sports',3),
('tvs','apache-rtr-200','Apache RTR 200','Sports',4),
('tvs','raider-125','Raider 125','Commuter',5),
('tvs','sport','Sport','Commuter',6),
('tvs','iqube','iQube EV','Scooter',7),
('royal-enfield','classic-350','Classic 350','Cruiser',1),
('royal-enfield','bullet-350','Bullet 350','Cruiser',2),
('royal-enfield','hunter-350','Hunter 350','Roadster',3),
('royal-enfield','meteor-350','Meteor 350','Cruiser',4),
('royal-enfield','himalayan','Himalayan','Adventure',5),
('royal-enfield','interceptor-650','Interceptor 650','Roadster',6),
('yamaha','fz-s','FZ-S','Sports',1),
('yamaha','r15','R15','Sports',2),
('yamaha','mt-15','MT-15','Roadster',3),
('yamaha','fascino-125','Fascino 125','Scooter',4),
('yamaha','ray-zr','Ray ZR','Scooter',5),
('suzuki-two-wheeler','access-125','Access 125','Scooter',1),
('suzuki-two-wheeler','burgman-street','Burgman Street','Scooter',2),
('suzuki-two-wheeler','gixxer','Gixxer','Sports',3),
('suzuki-two-wheeler','gixxer-sf','Gixxer SF','Sports',4),
('ktm','duke-200','Duke 200','Sports',1),
('ktm','duke-250','Duke 250','Sports',2),
('ktm','duke-390','Duke 390','Sports',3),
('ktm','rc-390','RC 390','Sports',4),
('ola-electric','s1-pro','S1 Pro','Scooter',1),
('ola-electric','s1-air','S1 Air','Scooter',2),
('ola-electric','s1-x','S1 X','Scooter',3),
('ather','450x','450X','Scooter',1),
('ather','450s','450S','Scooter',2),
('ather','rizta','Rizta','Scooter',3),
('tata-commercial','ace','Ace','Mini truck',1),
('tata-commercial','intra','Intra','Pickup',2),
('tata-commercial','yodha','Yodha','Pickup',3),
('tata-commercial','winger','Winger','Van',4),
('ashok-leyland','dost','Dost','Pickup',1),
('ashok-leyland','bada-dost','Bada Dost','Pickup',2),
('ashok-leyland','partner','Partner','Truck',3),
('mahindra-commercial','bolero-pickup','Bolero Pickup','Pickup',1),
('mahindra-commercial','jeeto','Jeeto','Mini truck',2),
('mahindra-commercial','supro','Supro','Van',3),
('mahindra-commercial','alfa','Alfa','Auto rickshaw',4),
('piaggio','ape-xtra','Ape Xtra','Auto rickshaw',1),
('piaggio','ape-city','Ape City','Auto rickshaw',2)
) as m(brand_slug, slug, name, body_type, sort_order)
on b.slug = m.brand_slug;