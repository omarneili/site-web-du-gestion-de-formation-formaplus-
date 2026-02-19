-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : jeu. 19 fév. 2026 à 20:58
-- Version du serveur : 10.4.27-MariaDB
-- Version de PHP : 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `gestion_formation`
--

-- --------------------------------------------------------

--
-- Structure de la table `categorie`
--

CREATE TABLE `categorie` (
  `id` int(11) NOT NULL,
  `nom` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `categorie`
--

INSERT INTO `categorie` (`id`, `nom`, `created_at`) VALUES
(1, 'Développement Web', '2026-01-05 21:51:43'),
(2, 'Data Science', '2026-01-05 21:51:43'),
(3, 'Design', '2026-01-05 21:51:43'),
(4, 'Marketing Digital', '2026-01-05 21:51:43'),
(6, 'Intelligence Artificielle', '2026-01-18 12:56:02'),
(7, 'Cybersécurité', '2026-01-18 12:56:02'),
(8, 'Cloud Computing', '2026-01-18 12:56:02'),
(9, 'Développement Mobile', '2026-01-18 12:56:02'),
(10, 'Soft Skills', '2026-01-18 12:56:02'),
(11, 'gestion de projet', '2026-01-19 17:52:51'),
(12, 'IA AVANCE', '2026-01-19 17:53:25');

-- --------------------------------------------------------

--
-- Structure de la table `cours`
--

CREATE TABLE `cours` (
  `id` int(11) NOT NULL,
  `titre` varchar(255) NOT NULL,
  `type` varchar(50) DEFAULT NULL COMMENT 'PDF, Vidéo, Présentation',
  `contenu` text DEFAULT NULL,
  `fichier_url` varchar(500) DEFAULT NULL,
  `formation_id` int(11) NOT NULL,
  `ordre` int(11) DEFAULT 0 COMMENT 'Ordre d affichage',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `avis_formateur` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `cours`
--

INSERT INTO `cours` (`id`, `titre`, `type`, `contenu`, `fichier_url`, `formation_id`, `ordre`, `created_at`, `updated_at`, `avis_formateur`) VALUES
(1, 'Introduction à React', 'Présentation', 'Découverte de l\'écosystème React et du DOM virtuel.', 'https://example.com/react-intro.pdf', 1, 1, '2026-01-18 13:26:02', '2026-01-18 13:26:02', NULL),
(2, 'Les Composants et Props', 'Vidéo', 'Comment créer et utiliser des composants réutilisables.', 'https://example.com/react-components.mp4', 1, 2, '2026-01-18 13:26:02', '2026-01-18 13:26:02', NULL),
(3, 'Le State et les Hooks', 'Vidéo', 'Gérer l\'état local avec useState et useEffect.', 'https://example.com/react-hooks.mp4', 1, 3, '2026-01-18 13:26:02', '2026-01-18 13:26:02', NULL),
(4, 'Installation de l\'environnement', 'PDF', 'Installer Anaconda, Jupyter Notebook et les bibliothèques nécessaires.', 'https://example.com/python-setup.pdf', 3, 1, '2026-01-18 13:26:02', '2026-01-18 13:26:02', NULL),
(5, 'Bases de Numpy', 'Vidéo', 'Manipulation de tableaux multidimensionnels avec Numpy.', 'https://example.com/numpy-basics.mp4', 3, 2, '2026-01-18 13:26:02', '2026-01-18 13:26:02', NULL),
(6, 'Les bases de Figma', 'Vidéo', 'Prise en main de l\'outil Figma.', 'https://example.com/figma-basics.mp4', 5, 1, '2026-01-18 13:26:02', '2026-01-18 13:26:02', NULL),
(7, 'Théorie des couleurs', 'Présentation', 'Comprendre le cercle chromatique et les harmonies.', 'https://example.com/color-theory.pdf', 5, 2, '2026-01-18 13:26:02', '2026-01-18 13:26:02', NULL),
(8, 'cours 1-python', 'Vidéo', 'c un video explicative du notion python', 'https://www.youtube.com/watch?v=h3VCQjyaLws&list=PLuXY3ddo_8nzrO74UeZQVZOb5-wIS6krJ', 9, 0, '2026-01-19 21:56:05', '2026-01-19 21:56:05', 'c tres interessant !!'),
(9, 'cours 2 -python', 'Vidéo', 'presenter les differentes services de python', 'https://www.youtube.com/watch?v=t-bCLbmgesI&list=PLuXY3ddo_8nzrO74UeZQVZOb5-wIS6krJ&index=2', 9, 2, '2026-01-19 22:02:25', '2026-01-19 22:02:25', 'concentrez vous bien!'),
(10, 'gsgg', 'PDF', 'sgsgsg', 'http://localhost:5000/uploads/fichier-1769538482403-863327118.pdf', 1, 1, '2026-01-27 18:26:15', '2026-01-27 18:28:02', 'gsgg'),
(11, 'cours angular partie 1 ', 'PDF', 'installation de l\'environnement de angular (video descriptif)', 'https://www.youtube.com/watch?v=AOf0IYwDGyg&list=PLwSrRLfx1DYJgrYJEQocAee-KDDd-cs7L', 10, 1, '2026-01-28 13:22:42', '2026-01-28 13:22:42', 'vous devez regarder ce video pour installer angular correctement\n');

-- --------------------------------------------------------

--
-- Structure de la table `formation`
--

CREATE TABLE `formation` (
  `id` int(11) NOT NULL,
  `titre` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `duree` int(11) DEFAULT NULL COMMENT 'Durée en heures',
  `prix` decimal(10,2) DEFAULT 0.00,
  `niveau` varchar(50) DEFAULT NULL COMMENT 'débutant, intermédiaire, avancé',
  `formateur_id` int(11) DEFAULT NULL,
  `categorie_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `formation`
--

INSERT INTO `formation` (`id`, `titre`, `description`, `duree`, `prix`, `niveau`, `formateur_id`, `categorie_id`, `created_at`, `updated_at`) VALUES
(1, 'Apprendre React.js de A à Z', 'Maîtrisez React, les Hooks et Context API.', 40, '199.99', 'intermédiaire', 11, 1, '2026-01-18 12:56:43', '2026-01-19 18:31:51'),
(2, 'Introduction à Node.js', 'Développement backend avec Express et MongoDB.', 35, '149.50', 'débutant', 7, 1, '2026-01-18 12:56:43', '2026-01-18 13:03:21'),
(3, 'Python pour la Data Science', 'Apprenez Numpy, Pandas et Matplotlib.', 50, '250.00', 'débutant', 8, 2, '2026-01-18 12:56:43', '2026-01-18 13:03:34'),
(4, 'Deep Learning avec TensorFlow', 'Réseaux de neurones et vision par ordinateur.', 60, '399.00', 'avancé', 3, 6, '2026-01-18 12:56:43', '2026-01-18 13:03:45'),
(5, 'UI Design pour Débutants', 'Principes de base du design et Figma.', 25, '99.00', 'débutant', 7, 3, '2026-01-18 12:56:43', '2026-01-18 13:04:03'),
(6, 'Stratégie Social Media', 'Optimisez votre présence sur les réseaux sociaux.', 20, '75.00', 'intermédiaire', 9, 4, '2026-01-18 12:56:43', '2026-01-18 13:04:25'),
(7, 'Ethical Hacking Fundamentals', 'Sécurité des réseaux et tests d\'intrusion.', 45, '299.00', 'intermédiaire', 9, 7, '2026-01-18 12:56:43', '2026-01-18 13:04:46'),
(9, 'formation ia avancee', 'decouvrir tous les nouvelles notions d\'ia ', 17, '120.00', 'intermédiaire', 11, 12, '2026-01-19 18:10:42', '2026-01-19 18:10:42'),
(10, 'angular', 'angular version 2', 16, '85.00', 'débutant', 11, 1, '2026-01-23 20:48:21', '2026-01-23 20:48:21'),
(11, 'excel', 'apprendre excel de 0', 17, '75.00', 'débutant', 15, 1, '2026-01-28 19:29:39', '2026-01-28 19:29:39');

-- --------------------------------------------------------

--
-- Structure de la table `inscription`
--

CREATE TABLE `inscription` (
  `id` int(11) NOT NULL,
  `apprenant_id` int(11) NOT NULL,
  `formation_id` int(11) NOT NULL,
  `dateInscription` date NOT NULL,
  `statut` enum('en_attente','valide','refuse','termine') DEFAULT 'en_attente',
  `card_number` varchar(16) DEFAULT NULL,
  `card_expiry` varchar(5) DEFAULT NULL COMMENT 'Format MM/YY',
  `card_cvv` varchar(4) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `last_viewed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `inscription`
--

INSERT INTO `inscription` (`id`, `apprenant_id`, `formation_id`, `dateInscription`, `statut`, `card_number`, `card_expiry`, `card_cvv`, `created_at`, `last_viewed_at`) VALUES
(2, 10, 9, '2026-01-19', 'valide', '1234123698741236', '05/26', '236', '2026-01-19 19:08:23', '2026-01-23 20:10:34'),
(3, 10, 4, '2026-01-19', 'valide', '1236521478963214', '12/26', '555', '2026-01-19 19:27:48', '2026-01-27 18:54:39'),
(4, 10, 1, '2026-01-19', 'valide', '0123152478965412', '06/26', '010', '2026-01-19 22:10:34', '2026-02-15 19:15:26'),
(5, 12, 1, '2026-01-23', 'valide', '1234236547896523', '12/26', '236', '2026-01-23 20:21:57', '2026-01-23 20:41:59'),
(6, 13, 1, '2026-01-23', 'valide', '1236547896541236', '10/25', '220', '2026-01-23 20:45:35', '2026-01-23 20:46:24'),
(7, 14, 10, '2026-01-28', 'valide', '1236236512341256', '01/25', '999', '2026-01-28 13:19:09', '2026-01-28 13:22:54'),
(8, 14, 11, '2026-01-28', 'valide', '1234569820131236', '01/27', '010', '2026-01-28 19:30:14', '2026-01-28 19:30:38'),
(9, 10, 11, '2026-02-03', 'valide', '1234523658745123', '12/27', '974', '2026-02-03 12:38:10', '2026-02-03 12:38:10'),
(10, 16, 10, '2026-02-16', 'valide', '1236547896587412', '12/26', '154', '2026-02-16 15:23:58', '2026-02-16 15:23:58'),
(11, 16, 1, '2026-02-16', 'valide', '1254236521458965', '12/58', '258', '2026-02-16 15:27:44', '2026-02-16 15:27:44');

-- --------------------------------------------------------

--
-- Structure de la table `message`
--

CREATE TABLE `message` (
  `id` int(11) NOT NULL,
  `expediteur_id` int(11) NOT NULL,
  `destinataire_id` int(11) NOT NULL,
  `formation_id` int(11) DEFAULT NULL,
  `contenu` text NOT NULL,
  `lu` tinyint(1) DEFAULT 0,
  `date_envoi` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `message`
--

INSERT INTO `message` (`id`, `expediteur_id`, `destinataire_id`, `formation_id`, `contenu`, `lu`, `date_envoi`) VALUES
(1, 10, 11, NULL, 'bonjour mr ou est tu?', 1, '2026-01-27 18:52:12'),
(2, 11, 10, NULL, 'bnojuot', 1, '2026-01-27 18:52:58'),
(3, 10, 11, NULL, 'nbnbnb', 1, '2026-01-27 18:55:04'),
(4, 14, 11, NULL, 'bonjour mr est ce qu on a cours aujourduii?', 0, '2026-01-28 13:24:20'),
(5, 14, 15, NULL, 'bnjr mr', 1, '2026-01-28 19:30:35'),
(6, 10, 15, NULL, 'hey', 1, '2026-02-03 12:38:39');

-- --------------------------------------------------------

--
-- Structure de la table `progression_cours`
--

CREATE TABLE `progression_cours` (
  `id` int(11) NOT NULL,
  `apprenant_id` int(11) NOT NULL,
  `cours_id` int(11) NOT NULL,
  `pourcentage` decimal(5,2) DEFAULT 0.00 COMMENT 'Pourcentage de progression (0-100)',
  `dateMiseAJour` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `progression_cours`
--

INSERT INTO `progression_cours` (`id`, `apprenant_id`, `cours_id`, `pourcentage`, `dateMiseAJour`, `created_at`, `updated_at`) VALUES
(1, 10, 8, '100.00', '2026-01-19', '2026-01-19 22:08:13', '2026-01-19 22:08:13'),
(2, 10, 9, '0.00', '2026-01-19', '2026-01-19 22:08:16', '2026-01-19 22:08:26'),
(4, 10, 1, '100.00', '2026-01-19', '2026-01-19 22:10:59', '2026-01-19 22:10:59'),
(5, 10, 2, '0.00', '2026-01-19', '2026-01-19 22:13:13', '2026-01-19 22:13:37'),
(7, 13, 1, '100.00', '2026-01-23', '2026-01-23 20:45:56', '2026-01-23 20:45:56');

-- --------------------------------------------------------

--
-- Structure de la table `utilisateur`
--

CREATE TABLE `utilisateur` (
  `id` int(11) NOT NULL,
  `nom` varchar(100) NOT NULL,
  `prenom` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `motDePasse` varchar(255) NOT NULL,
  `role` enum('administrateur','formateur','apprenant') NOT NULL,
  `statut` enum('actif','bloque') DEFAULT 'actif',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `utilisateur`
--

INSERT INTO `utilisateur` (`id`, `nom`, `prenom`, `email`, `motDePasse`, `role`, `statut`, `created_at`, `updated_at`) VALUES
(1, 'neili', 'ahmed', 'neiliahmed123@gmail.com', '$2a$10$bLxFFKpTMULkhU3QvJIPcep/sAzJhOa8SLcbxdeYohrNZbuA.l3RO', 'apprenant', 'actif', '2026-01-05 22:01:25', '2026-01-05 22:01:25'),
(3, 'samir', 'samir', 'samirsamir@gmail.com', '$2a$10$SH60OAwBnyxTNeWzW2VKjelmF4SoM33X75aZU4wIPz3wu28TAi35y', 'formateur', 'actif', '2026-01-06 18:54:25', '2026-01-06 18:54:25'),
(4, 'neili', 'omar', 'omarneili308@gmail.com', '$2a$10$BY2iX.aoQmJZE9SfTC/Y0ug4l03lBFb.rWD4TKWzAEces9M0R2x7m', 'administrateur', 'actif', '2026-01-06 19:03:49', '2026-01-06 19:04:10'),
(5, 'karim', 'mohamed', 'mohamedkarim@gmail.com', '$2a$10$U23CZfpTkoCKGz4823lDPOugLInvRcJ.GtZkGdcfZcNPxMCXTjrjW', 'apprenant', 'actif', '2026-01-06 19:16:59', '2026-01-06 19:16:59'),
(6, 'test', 'test', 'test@gmail.com', '$2a$10$FQIh/bI0tNrFFeMuMD23Z.Huk2VJ4SAIdf23e1srGdVoF2Q/OjWMi', 'apprenant', 'actif', '2026-01-06 19:23:09', '2026-01-06 19:33:53'),
(7, 'ben ali', 'sami', 'samibenali@gmail.com', '$2a$10$QTp9m9fnngGcJlYo3hs/Ue0nLWA9xeXHVgp3jjK8VUQd6iFera7tW', 'formateur', 'actif', '2026-01-18 12:59:30', '2026-01-18 12:59:30'),
(8, 'abidi', 'wafa', 'wafaabidi123654@gmail.com', '$2a$10$7hIdz2SAETERKOKy8L0L8etVeru8RuKSr48g6oQ/T6sTIQVfRFQR2', 'formateur', 'actif', '2026-01-18 13:00:09', '2026-01-18 13:00:09'),
(9, 'gharbi', 'karima', 'karimagharbi@gmail.com', '$2a$10$ihSvmgAKiNs1.A0ErtEC1Ozm.bHe.UeLRxcRf4Zd43eHtYh045IZu', 'formateur', 'actif', '2026-01-18 13:00:43', '2026-01-18 13:00:43'),
(10, 'tito', 'tito', 'titotito@gmail.com', '$2a$10$IzO4w1liIjRAMUHPeB0neOaF7UQ8e4toCG5s2PqVicynwBCb5db2u', 'apprenant', 'actif', '2026-01-18 13:08:35', '2026-01-18 13:08:35'),
(11, 'gharbi', 'sami', 'gharbisami@gmail.com', '$2a$10$8JM0KMz.zKbJsc1yyY3l3./4QrBNUZ0vfNJk7BDen3uTuR3sfz7T2', 'formateur', 'actif', '2026-01-19 18:09:33', '2026-01-19 18:09:33'),
(12, 'aa', 'aa', 'aa@gmail.com', '$2a$10$iUrkZ/A9OS.KKQh493MOqO67bcZDcqdz2SQbq9T9jVfs.U5gxhhW.', 'apprenant', 'actif', '2026-01-23 20:21:07', '2026-01-23 20:21:07'),
(13, 'bb', 'bb', 'bb@gmail.com', '$2a$10$AXIhwH43NLOvYtgvt.OpRuCNrOln6KLljnxU/SIK7O3GcXL0kXiCC', 'apprenant', 'actif', '2026-01-23 20:45:12', '2026-01-23 20:45:12'),
(14, 'ben ali', 'ahmed', 'ahmedbenali@gmail.com', '$2a$10$/rPRUk48FOVJ1XYSNW1PheF9m8YKJKoSmaQ35OEpK7bzS8vGGlNsa', 'apprenant', 'actif', '2026-01-28 13:17:40', '2026-01-28 13:17:40'),
(15, 'ali', 'ali', 'aliali@gmail.com', '$2a$10$aNzTkvcIHVDiZSeVGPNF.eff0jc6B3m66crqOMRb0VtH1F2Lr6h1a', 'formateur', 'actif', '2026-01-28 19:28:21', '2026-01-28 19:28:21'),
(16, 'saidi', 'akrem', 'akremsaidi145@gmail.com', '$2a$10$e8LLc7zBXmWHKKuduvdbH.0xcRmVQlh3fs0jPLA0HARsF4ydlkZV6', 'apprenant', 'actif', '2026-02-16 15:18:25', '2026-02-16 15:18:25');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `categorie`
--
ALTER TABLE `categorie`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nom` (`nom`);

--
-- Index pour la table `cours`
--
ALTER TABLE `cours`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_formation` (`formation_id`);

--
-- Index pour la table `formation`
--
ALTER TABLE `formation`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_formateur` (`formateur_id`),
  ADD KEY `idx_categorie` (`categorie_id`);

--
-- Index pour la table `inscription`
--
ALTER TABLE `inscription`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_inscription` (`apprenant_id`,`formation_id`),
  ADD KEY `idx_apprenant` (`apprenant_id`),
  ADD KEY `idx_formation` (`formation_id`);

--
-- Index pour la table `message`
--
ALTER TABLE `message`
  ADD PRIMARY KEY (`id`),
  ADD KEY `expediteur_id` (`expediteur_id`),
  ADD KEY `destinataire_id` (`destinataire_id`),
  ADD KEY `formation_id` (`formation_id`);

--
-- Index pour la table `progression_cours`
--
ALTER TABLE `progression_cours`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_progression` (`apprenant_id`,`cours_id`),
  ADD KEY `idx_apprenant` (`apprenant_id`),
  ADD KEY `idx_cours` (`cours_id`);

--
-- Index pour la table `utilisateur`
--
ALTER TABLE `utilisateur`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_email` (`email`),
  ADD KEY `idx_role` (`role`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `categorie`
--
ALTER TABLE `categorie`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT pour la table `cours`
--
ALTER TABLE `cours`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT pour la table `formation`
--
ALTER TABLE `formation`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT pour la table `inscription`
--
ALTER TABLE `inscription`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT pour la table `message`
--
ALTER TABLE `message`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT pour la table `progression_cours`
--
ALTER TABLE `progression_cours`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT pour la table `utilisateur`
--
ALTER TABLE `utilisateur`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `cours`
--
ALTER TABLE `cours`
  ADD CONSTRAINT `cours_ibfk_1` FOREIGN KEY (`formation_id`) REFERENCES `formation` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `formation`
--
ALTER TABLE `formation`
  ADD CONSTRAINT `formation_ibfk_1` FOREIGN KEY (`formateur_id`) REFERENCES `utilisateur` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `formation_ibfk_2` FOREIGN KEY (`categorie_id`) REFERENCES `categorie` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `inscription`
--
ALTER TABLE `inscription`
  ADD CONSTRAINT `inscription_ibfk_1` FOREIGN KEY (`apprenant_id`) REFERENCES `utilisateur` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `inscription_ibfk_2` FOREIGN KEY (`formation_id`) REFERENCES `formation` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `message`
--
ALTER TABLE `message`
  ADD CONSTRAINT `message_ibfk_1` FOREIGN KEY (`expediteur_id`) REFERENCES `utilisateur` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `message_ibfk_2` FOREIGN KEY (`destinataire_id`) REFERENCES `utilisateur` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `message_ibfk_3` FOREIGN KEY (`formation_id`) REFERENCES `formation` (`id`) ON DELETE SET NULL;

--
-- Contraintes pour la table `progression_cours`
--
ALTER TABLE `progression_cours`
  ADD CONSTRAINT `progression_cours_ibfk_1` FOREIGN KEY (`apprenant_id`) REFERENCES `utilisateur` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `progression_cours_ibfk_2` FOREIGN KEY (`cours_id`) REFERENCES `cours` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
