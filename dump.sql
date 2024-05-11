--
-- PostgreSQL database dump
--

-- Dumped from database version 14.1
-- Dumped by pg_dump version 14.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Billet; Type: TABLE; Schema: public; Owner: odm_user
--

CREATE TABLE public."Billet" (
    "idBillet" integer NOT NULL,
    type character varying NOT NULL,
    prix integer NOT NULL,
    utilisation integer NOT NULL,
    "idSpectateur" integer NOT NULL
);


ALTER TABLE public."Billet" OWNER TO odm_user;

--
-- Name: Billet_idBillet_seq; Type: SEQUENCE; Schema: public; Owner: odm_user
--

CREATE SEQUENCE public."Billet_idBillet_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Billet_idBillet_seq" OWNER TO odm_user;

--
-- Name: Billet_idBillet_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: odm_user
--

ALTER SEQUENCE public."Billet_idBillet_seq" OWNED BY public."Billet"."idBillet";


--
-- Name: Employe; Type: TABLE; Schema: public; Owner: odm_user
--

CREATE TABLE public."Employe" (
    "idEmploye" integer NOT NULL,
    nom character varying NOT NULL,
    email character varying NOT NULL,
    mdp character varying NOT NULL,
    role character varying NOT NULL,
    poste character varying NOT NULL
);


ALTER TABLE public."Employe" OWNER TO odm_user;

--
-- Name: Employe_idEmploye_seq; Type: SEQUENCE; Schema: public; Owner: odm_user
--

CREATE SEQUENCE public."Employe_idEmploye_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Employe_idEmploye_seq" OWNER TO odm_user;

--
-- Name: Employe_idEmploye_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: odm_user
--

ALTER SEQUENCE public."Employe_idEmploye_seq" OWNED BY public."Employe"."idEmploye";


--
-- Name: Film; Type: TABLE; Schema: public; Owner: odm_user
--

CREATE TABLE public."Film" (
    "idFilm" integer NOT NULL,
    nom character varying NOT NULL,
    description character varying NOT NULL,
    type character varying NOT NULL,
    duree integer NOT NULL
);


ALTER TABLE public."Film" OWNER TO odm_user;

--
-- Name: Film_idFilm_seq; Type: SEQUENCE; Schema: public; Owner: odm_user
--

CREATE SEQUENCE public."Film_idFilm_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Film_idFilm_seq" OWNER TO odm_user;

--
-- Name: Film_idFilm_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: odm_user
--

ALTER SEQUENCE public."Film_idFilm_seq" OWNED BY public."Film"."idFilm";


--
-- Name: Image; Type: TABLE; Schema: public; Owner: odm_user
--

CREATE TABLE public."Image" (
    "idImage" integer NOT NULL,
    nom character varying NOT NULL,
    "idSalleIdSalle" integer
);


ALTER TABLE public."Image" OWNER TO odm_user;

--
-- Name: Image_idImage_seq; Type: SEQUENCE; Schema: public; Owner: odm_user
--

CREATE SEQUENCE public."Image_idImage_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Image_idImage_seq" OWNER TO odm_user;

--
-- Name: Image_idImage_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: odm_user
--

ALTER SEQUENCE public."Image_idImage_seq" OWNED BY public."Image"."idImage";


--
-- Name: Place; Type: TABLE; Schema: public; Owner: odm_user
--

CREATE TABLE public."Place" (
    "idPlace" integer NOT NULL,
    "idSeance" integer NOT NULL,
    "idBillet" integer NOT NULL
);


ALTER TABLE public."Place" OWNER TO odm_user;

--
-- Name: Place_idPlace_seq; Type: SEQUENCE; Schema: public; Owner: odm_user
--

CREATE SEQUENCE public."Place_idPlace_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Place_idPlace_seq" OWNER TO odm_user;

--
-- Name: Place_idPlace_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: odm_user
--

ALTER SEQUENCE public."Place_idPlace_seq" OWNED BY public."Place"."idPlace";


--
-- Name: Salle; Type: TABLE; Schema: public; Owner: odm_user
--

CREATE TABLE public."Salle" (
    "idSalle" integer NOT NULL,
    nom character varying NOT NULL,
    description character varying NOT NULL,
    images character varying NOT NULL,
    capacite integer NOT NULL,
    "accesHandicap" boolean DEFAULT false NOT NULL,
    etat character varying NOT NULL
);


ALTER TABLE public."Salle" OWNER TO odm_user;

--
-- Name: Salle_idSalle_seq; Type: SEQUENCE; Schema: public; Owner: odm_user
--

CREATE SEQUENCE public."Salle_idSalle_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Salle_idSalle_seq" OWNER TO odm_user;

--
-- Name: Salle_idSalle_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: odm_user
--

ALTER SEQUENCE public."Salle_idSalle_seq" OWNED BY public."Salle"."idSalle";


--
-- Name: Spectateur; Type: TABLE; Schema: public; Owner: odm_user
--

CREATE TABLE public."Spectateur" (
    "idSpectateur" integer NOT NULL,
    nom character varying NOT NULL,
    email character varying NOT NULL,
    mdp character varying NOT NULL,
    prenom character varying NOT NULL,
    sexe character varying NOT NULL,
    date_naissance date NOT NULL,
    solde integer NOT NULL
);


ALTER TABLE public."Spectateur" OWNER TO odm_user;

--
-- Name: Spectateur_idSpectateur_seq; Type: SEQUENCE; Schema: public; Owner: odm_user
--

CREATE SEQUENCE public."Spectateur_idSpectateur_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Spectateur_idSpectateur_seq" OWNER TO odm_user;

--
-- Name: Spectateur_idSpectateur_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: odm_user
--

ALTER SEQUENCE public."Spectateur_idSpectateur_seq" OWNED BY public."Spectateur"."idSpectateur";


--
-- Name: Tache; Type: TABLE; Schema: public; Owner: odm_user
--

CREATE TABLE public."Tache" (
    "idTache" integer NOT NULL,
    nom character varying NOT NULL,
    type character varying NOT NULL,
    "dateDebut" timestamp without time zone NOT NULL,
    "dateFin" timestamp without time zone NOT NULL,
    "idFilm" integer NOT NULL,
    "idSalle" integer NOT NULL
);


ALTER TABLE public."Tache" OWNER TO odm_user;

--
-- Name: Tache_idTache_seq; Type: SEQUENCE; Schema: public; Owner: odm_user
--

CREATE SEQUENCE public."Tache_idTache_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Tache_idTache_seq" OWNER TO odm_user;

--
-- Name: Tache_idTache_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: odm_user
--

ALTER SEQUENCE public."Tache_idTache_seq" OWNED BY public."Tache"."idTache";


--
-- Name: Transaction; Type: TABLE; Schema: public; Owner: odm_user
--

CREATE TABLE public."Transaction" (
    "idTransaction" integer NOT NULL,
    montant integer NOT NULL,
    date timestamp without time zone NOT NULL,
    type character varying NOT NULL,
    "idSpectateur" integer NOT NULL
);


ALTER TABLE public."Transaction" OWNER TO odm_user;

--
-- Name: Transaction_idTransaction_seq; Type: SEQUENCE; Schema: public; Owner: odm_user
--

CREATE SEQUENCE public."Transaction_idTransaction_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Transaction_idTransaction_seq" OWNER TO odm_user;

--
-- Name: Transaction_idTransaction_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: odm_user
--

ALTER SEQUENCE public."Transaction_idTransaction_seq" OWNED BY public."Transaction"."idTransaction";


--
-- Name: Billet idBillet; Type: DEFAULT; Schema: public; Owner: odm_user
--

ALTER TABLE ONLY public."Billet" ALTER COLUMN "idBillet" SET DEFAULT nextval('public."Billet_idBillet_seq"'::regclass);


--
-- Name: Employe idEmploye; Type: DEFAULT; Schema: public; Owner: odm_user
--

ALTER TABLE ONLY public."Employe" ALTER COLUMN "idEmploye" SET DEFAULT nextval('public."Employe_idEmploye_seq"'::regclass);


--
-- Name: Film idFilm; Type: DEFAULT; Schema: public; Owner: odm_user
--

ALTER TABLE ONLY public."Film" ALTER COLUMN "idFilm" SET DEFAULT nextval('public."Film_idFilm_seq"'::regclass);


--
-- Name: Image idImage; Type: DEFAULT; Schema: public; Owner: odm_user
--

ALTER TABLE ONLY public."Image" ALTER COLUMN "idImage" SET DEFAULT nextval('public."Image_idImage_seq"'::regclass);


--
-- Name: Place idPlace; Type: DEFAULT; Schema: public; Owner: odm_user
--

ALTER TABLE ONLY public."Place" ALTER COLUMN "idPlace" SET DEFAULT nextval('public."Place_idPlace_seq"'::regclass);


--
-- Name: Salle idSalle; Type: DEFAULT; Schema: public; Owner: odm_user
--

ALTER TABLE ONLY public."Salle" ALTER COLUMN "idSalle" SET DEFAULT nextval('public."Salle_idSalle_seq"'::regclass);


--
-- Name: Spectateur idSpectateur; Type: DEFAULT; Schema: public; Owner: odm_user
--

ALTER TABLE ONLY public."Spectateur" ALTER COLUMN "idSpectateur" SET DEFAULT nextval('public."Spectateur_idSpectateur_seq"'::regclass);


--
-- Name: Tache idTache; Type: DEFAULT; Schema: public; Owner: odm_user
--

ALTER TABLE ONLY public."Tache" ALTER COLUMN "idTache" SET DEFAULT nextval('public."Tache_idTache_seq"'::regclass);


--
-- Name: Transaction idTransaction; Type: DEFAULT; Schema: public; Owner: odm_user
--

ALTER TABLE ONLY public."Transaction" ALTER COLUMN "idTransaction" SET DEFAULT nextval('public."Transaction_idTransaction_seq"'::regclass);


--
-- Data for Name: Billet; Type: TABLE DATA; Schema: public; Owner: odm_user
--

COPY public."Billet" ("idBillet", type, prix, utilisation, "idSpectateur") FROM stdin;
1	Super	10	10	1
2	Super	10	10	1
5	Classic	1	1	2
6	Classic	1	1	2
7	Classic	1	1	2
8	Classic	1	1	2
9	Classic	1	1	2
10	Classic	1	1	2
4	Super	10	3	2
\.


--
-- Data for Name: Employe; Type: TABLE DATA; Schema: public; Owner: odm_user
--

COPY public."Employe" ("idEmploye", nom, email, mdp, role, poste) FROM stdin;
1	Vanande	vanande@admin.fr	$2b$10$6zsk58m/uTKpl9p.Ta3Opuem4UI1.sYHG0K7NXgIVBjONh5DggwmO	employe	employe
2	Ava Wilson	ava.wilson@example.com	$2b$10$6XEUjDLszRaP5QbrAf/LReyac7fIBwYNpRSLmG.lfdM8/hd0tYF06	client	participant
3	William Anderson	william.anderson@example.com	$2b$10$GkyMLfqxra/PZTOchfnXjOgNJ8O.TMetbav9t1yj/GGvzLGL5Eh96	employe	consultant
4	Olivia Martinez	olivia.martinez@example.com	$2b$10$HeWatpKZmkkMa8emMsYZVuKtz9hMKCuyjp1Yk1Iwhfqf7TtppFrfm	client	member
5	David Taylor	david.taylor@example.com	$2b$10$LL/tp.DCIlaeqNxJY9nBQ.rzTHjlFr.cmqolKoHaTRBbcah.X81XS	employe	support
6	Sophia Miller	sophia.miller@example.com	$2b$10$mIsZ3rgJlV34vyQjximky.Kc9vFKeeUTIy6v3M0n1/Wm.ntXf.7Cm	client	user
\.


--
-- Data for Name: Film; Type: TABLE DATA; Schema: public; Owner: odm_user
--

COPY public."Film" ("idFilm", nom, description, type, duree) FROM stdin;
1	deadpool	test	acrion	125
2	Spider-Man: No Way Home	Peter Parker's world has changed. As he struggles with the consequences of revealing his identity, a new threat emerges.	action	148
3	Black Widow	Natasha Romanoff confronts the darker parts of her ledger when a dangerous conspiracy with ties to her past arises.	action	134
4	Shang-Chi and the Legend of the Ten Rings	Shang-Chi must confront the past he thought he left behind when he is drawn into the web of the mysterious Ten Rings organization.	action	132
5	The Matrix Resurrections	Neo awakens in a world where anything is possible, but soon discovers that the truth is far more complex than he ever imagined.	action	148
6	Dune	A young nobleman must protect his planet from an intergalactic power struggle.	action	155
7	Venom: Let There Be Carnage	Eddie Brock attempts to reignite his career by interviewing serial killer Cletus Kasady, who becomes the host of the symbiote Carnage.	action	97
8	Godzilla vs. Kong	Kong and his protectors undertake a perilous journey to find his true home, but they unexpectedly find themselves in the path of Godzilla.	action	113
9	The Suicide Squad	A team of supervillains is sent on a dangerous mission to destroy a Nazi-era laboratory and encounter the deadly threat of the monstrous Starro.	action	132
10	Mortal Kombat	Earthrealm's champions must battle against the forces of Outworld in a high-stakes tournament to determine the fate of the universe.	action	110
11	Army of the Dead	A group of mercenaries ventures into a quarantine zone in Las Vegas to pull off the greatest heist ever attempted amidst a zombie apocalypse.	action	148
12	Jungle Cruise	A riverboat captain takes a scientist and her brother on a mission into the jungle to find the Tree of Life and uncover its magical secrets.	action	127
13	No Time to Die	James Bond comes out of retirement to track down a dangerous new villain armed with dangerous technology.	action	163
14	The King's Man	In the early years of the 20th century, the Kingsman agency is formed to combat a group plotting a war that could wipe out millions.	action	131
15	The Man of C	This movie describe the adventure of Mr.Sananes, a mysterious man that teach the C magic to any pure soul	mystery	333
\.


--
-- Data for Name: Image; Type: TABLE DATA; Schema: public; Owner: odm_user
--

COPY public."Image" ("idImage", nom, "idSalleIdSalle") FROM stdin;
\.


--
-- Data for Name: Place; Type: TABLE DATA; Schema: public; Owner: odm_user
--

COPY public."Place" ("idPlace", "idSeance", "idBillet") FROM stdin;
1	1	1
2	1	1
3	1	1
4	1	1
5	1	1
6	1	1
7	37	3
8	37	3
9	38	3
10	38	3
11	38	3
12	38	3
13	38	3
14	38	3
15	38	3
16	38	3
17	38	3
18	38	3
19	38	3
20	38	3
21	38	3
22	38	3
23	38	3
24	38	3
25	38	3
26	38	3
27	38	3
28	38	3
29	38	3
30	38	3
31	38	3
32	38	3
33	38	3
34	38	3
35	38	6
36	38	4
37	38	4
38	38	4
39	38	4
40	38	4
41	38	4
42	38	4
\.


--
-- Data for Name: Salle; Type: TABLE DATA; Schema: public; Owner: odm_user
--

COPY public."Salle" ("idSalle", nom, description, images, capacite, "accesHandicap", etat) FROM stdin;
11	Salle Action	Pour les amateurs d'adrénaline et d'explosions à l'écran.	image-action	20	f	Prêt
12	Salle Aventure	Partez à l'aventure dans des contrées lointaines et des mondes fantastiques.	image-adventure	25	f	Prêt
13	Salle Sci-Fi	Explorez les frontières de l'univers et découvrez les technologies du futur.	image-scifi	30	t	Prêt
14	Salle Horreur	Frémissez devant des histoires effrayantes et des monstres terrifiants.	image-horror	20	f	Prêt
15	Salle Comédie	Riez aux éclats avec des comédies hilarantes et des personnages loufoques.	image-comedy	25	t	Prêt
16	Salle 1 - Action	Pour les amateurs d'adrénaline et d'explosions à l'écran.	image-action	20	f	Prêt
17	Salle 2 - Aventure	Partez à l'aventure dans des contrées lointaines et des mondes fantastiques.	image-adventure	25	f	Prêt
18	Salle 3 - Sci-Fi	Explorez les frontières de l'univers et découvrez les technologies du futur.	image-scifi	30	t	Prêt
19	Salle 4 - Horreur	Frémissez devant des histoires effrayantes et des monstres terrifiants.	image-horror	20	f	Prêt
20	Salle 5 - Comédie	Riez aux éclats avec des comédies hilarantes et des personnages loufoques.	image-comedy	25	t	Prêt
\.


--
-- Data for Name: Spectateur; Type: TABLE DATA; Schema: public; Owner: odm_user
--

COPY public."Spectateur" ("idSpectateur", nom, email, mdp, prenom, sexe, date_naissance, solde) FROM stdin;
1	Khatchatrian	api@example.com	$2b$10$8cfKPj8loTo/Rt9U5ozVuOT5BHqwe1d7BL5NliaVVxLjNGyODvaEe	Vanande	homme	2003-12-12	30
2	Khatchatrian	aapi@example.com	$2b$10$4VZvpTAR0DOHUL24u6mk1ePLE/TLRG9.30TRLeY2QVrPmw3XknyAK	Vanande	homme	2003-12-12	24
3	Dupont	alice.dupont@example.com	$2b$10$fDnlF2LetU98RFTC1W.uU.6QCNyrOZY3Z5RoYq8C/V1gCv3Sbqrd2	Alice	femme	1995-08-25	0
4	Leroy	nicolas.leroy@example.com	$2b$10$SzJuegGGTHMeb.HcBHqHBO2pbYrMXwVcXVDF9zcYAViXX50aKn3RG	Nicolas	homme	1985-12-07	0
5	Sananes	f.sananes@example.com	$2b$10$6qv31csHnWSLDaYkxRogsON/Rv52P7fBEWPCk.WTPSEY25KVmp92.	Fred	homme	1885-12-07	0
6	Petit	thomas.petit@example.com	$2b$10$7qRIYyh9xdW098iSRursruuWkqs5vHqXauk6ZDlN0FPMqewzcW96q	Thomas	homme	1996-04-23	0
7	Moreau	charlotte.moreau@example.com	$2b$10$F1sigqju0phpicCiiN7IOu.gtsv8EdBDJC4vA7xQHdHkQZPzw.YtC	Charlotte	femme	1990-07-07	0
8	Dubois	david.dubois@example.com	$2b$10$.ItdT7/W8ckyj98ToAGqHOYWX2tFiU3lpe6dNHtaDSibNYZ74AVr.	David	homme	1998-02-18	0
9	Lefevre	william.lefevre@example.com	$2b$10$rb2dY16xYZ1xf1S5aKW4l.etSxUFlkm5EjO8NjyY6QiIzpDD503om	William	homme	1992-06-12	0
10	Garcia	emma.garcia@example.com	$2b$10$TN77SREt8qcezpKOYtETme2qjJeaf0BDV8cVYs6o2C4WTwxUR.6Jm	Emma	femme	2000-11-03	0
\.


--
-- Data for Name: Tache; Type: TABLE DATA; Schema: public; Owner: odm_user
--

COPY public."Tache" ("idTache", nom, type, "dateDebut", "dateFin", "idFilm", "idSalle") FROM stdin;
22	Film	Seance	2024-10-02 02:00:00	2024-10-02 04:35:00	1	1
23	Seance num81	Seance	2024-10-02 02:00:00	2024-10-02 04:35:00	1	1
24	Seance de deadpool	Seance	2024-10-02 02:00:00	2024-10-02 04:35:00	1	1
25	Seance de deadpool	Seance	2024-10-02 02:00:00	2024-10-02 04:35:00	1	1
26	Seance de deadpool	Seance	2024-11-05 01:00:00	2024-11-05 03:35:00	1	1
27	Seance de deadpool	Seance	2024-05-11 02:00:00	2024-05-11 04:35:00	1	1
28	Seance de deadpool	Seance	2024-05-11 02:00:00	2024-05-11 04:35:00	1	1
29	Seance de deadpool	Seance	2024-05-11 02:00:00	2024-05-11 04:35:00	1	1
30	Seance de deadpool	Seance	2024-05-11 02:00:00	2024-05-11 04:35:00	1	1
32	Seance de deadpool	Seance	2024-05-10 14:00:00	2024-05-10 16:35:00	1	1
35	Seance de Deadpool	Seance	2024-05-10 18:00:00	2024-05-10 20:35:00	1	1
36	Seance de Deadpool	Seance	2024-05-10 18:00:00	2024-05-10 20:35:00	1	1
37	Seance de deadpool	Seance	2024-05-09 16:00:00	2024-05-09 18:35:00	1	1
38	Seance de deadpool	Seance	2024-05-14 16:00:00	2024-05-14 18:35:00	1	1
\.


--
-- Data for Name: Transaction; Type: TABLE DATA; Schema: public; Owner: odm_user
--

COPY public."Transaction" ("idTransaction", montant, date, type, "idSpectateur") FROM stdin;
1	50	2024-05-11 19:37:47.477	credit	1
2	20	2024-05-11 19:37:53.22	achat	1
3	50	2024-05-11 19:39:19.083	credit	2
4	20	2024-05-11 19:39:22.709	achat	2
5	1	2024-05-11 20:01:54.85	achat	2
6	1	2024-05-11 20:02:26.419	achat	2
7	1	2024-05-11 20:33:47.379	achat	2
8	1	2024-05-11 20:35:30.778	achat	2
9	1	2024-05-11 21:00:03.151	achat	2
10	1	2024-05-11 21:00:30.091	achat	2
\.


--
-- Name: Billet_idBillet_seq; Type: SEQUENCE SET; Schema: public; Owner: odm_user
--

SELECT pg_catalog.setval('public."Billet_idBillet_seq"', 10, true);


--
-- Name: Employe_idEmploye_seq; Type: SEQUENCE SET; Schema: public; Owner: odm_user
--

SELECT pg_catalog.setval('public."Employe_idEmploye_seq"', 6, true);


--
-- Name: Film_idFilm_seq; Type: SEQUENCE SET; Schema: public; Owner: odm_user
--

SELECT pg_catalog.setval('public."Film_idFilm_seq"', 15, true);


--
-- Name: Image_idImage_seq; Type: SEQUENCE SET; Schema: public; Owner: odm_user
--

SELECT pg_catalog.setval('public."Image_idImage_seq"', 1, false);


--
-- Name: Place_idPlace_seq; Type: SEQUENCE SET; Schema: public; Owner: odm_user
--

SELECT pg_catalog.setval('public."Place_idPlace_seq"', 42, true);


--
-- Name: Salle_idSalle_seq; Type: SEQUENCE SET; Schema: public; Owner: odm_user
--

SELECT pg_catalog.setval('public."Salle_idSalle_seq"', 20, true);


--
-- Name: Spectateur_idSpectateur_seq; Type: SEQUENCE SET; Schema: public; Owner: odm_user
--

SELECT pg_catalog.setval('public."Spectateur_idSpectateur_seq"', 10, true);


--
-- Name: Tache_idTache_seq; Type: SEQUENCE SET; Schema: public; Owner: odm_user
--

SELECT pg_catalog.setval('public."Tache_idTache_seq"', 38, true);


--
-- Name: Transaction_idTransaction_seq; Type: SEQUENCE SET; Schema: public; Owner: odm_user
--

SELECT pg_catalog.setval('public."Transaction_idTransaction_seq"', 10, true);


--
-- Name: Place PK_2dd51e6334a5afd462deea8dbe6; Type: CONSTRAINT; Schema: public; Owner: odm_user
--

ALTER TABLE ONLY public."Place"
    ADD CONSTRAINT "PK_2dd51e6334a5afd462deea8dbe6" PRIMARY KEY ("idPlace");


--
-- Name: Salle PK_40da4ff66d1b68a3019f7320b9d; Type: CONSTRAINT; Schema: public; Owner: odm_user
--

ALTER TABLE ONLY public."Salle"
    ADD CONSTRAINT "PK_40da4ff66d1b68a3019f7320b9d" PRIMARY KEY ("idSalle");


--
-- Name: Spectateur PK_85b80e0582d1f28055941308456; Type: CONSTRAINT; Schema: public; Owner: odm_user
--

ALTER TABLE ONLY public."Spectateur"
    ADD CONSTRAINT "PK_85b80e0582d1f28055941308456" PRIMARY KEY ("idSpectateur");


--
-- Name: Image PK_8d19b5bc315eefe147f1eb11531; Type: CONSTRAINT; Schema: public; Owner: odm_user
--

ALTER TABLE ONLY public."Image"
    ADD CONSTRAINT "PK_8d19b5bc315eefe147f1eb11531" PRIMARY KEY ("idImage");


--
-- Name: Tache PK_ad4a1eaf5170d2307f02ce09995; Type: CONSTRAINT; Schema: public; Owner: odm_user
--

ALTER TABLE ONLY public."Tache"
    ADD CONSTRAINT "PK_ad4a1eaf5170d2307f02ce09995" PRIMARY KEY ("idTache");


--
-- Name: Transaction PK_aefe57d10fec43de2d176e78ea0; Type: CONSTRAINT; Schema: public; Owner: odm_user
--

ALTER TABLE ONLY public."Transaction"
    ADD CONSTRAINT "PK_aefe57d10fec43de2d176e78ea0" PRIMARY KEY ("idTransaction");


--
-- Name: Billet PK_bd77718216545ddf33dffbc2a43; Type: CONSTRAINT; Schema: public; Owner: odm_user
--

ALTER TABLE ONLY public."Billet"
    ADD CONSTRAINT "PK_bd77718216545ddf33dffbc2a43" PRIMARY KEY ("idBillet");


--
-- Name: Film PK_e35059439b3c18682ee5bbed7f7; Type: CONSTRAINT; Schema: public; Owner: odm_user
--

ALTER TABLE ONLY public."Film"
    ADD CONSTRAINT "PK_e35059439b3c18682ee5bbed7f7" PRIMARY KEY ("idFilm");


--
-- Name: Employe PK_e9dadfd0c4164fa928c3dfb9206; Type: CONSTRAINT; Schema: public; Owner: odm_user
--

ALTER TABLE ONLY public."Employe"
    ADD CONSTRAINT "PK_e9dadfd0c4164fa928c3dfb9206" PRIMARY KEY ("idEmploye");


--
-- Name: Image FK_5628501ae8e75353db5fd791e86; Type: FK CONSTRAINT; Schema: public; Owner: odm_user
--

ALTER TABLE ONLY public."Image"
    ADD CONSTRAINT "FK_5628501ae8e75353db5fd791e86" FOREIGN KEY ("idSalleIdSalle") REFERENCES public."Salle"("idSalle");


--
-- PostgreSQL database dump complete
--

